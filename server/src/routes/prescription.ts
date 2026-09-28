import { Router } from "express";
import { prisma } from "../lib/prisma";
import { parseId } from "../utils/parseId";
import { withSupplyInfo } from "../utils/supply";
import { createPrescriptionSchema, updatePrescriptionSchema } from "../schemas";

const router = Router();

// Find a prescription only if it belongs to this user
function findOwnPrescription(id: number, userId: number) {
  return prisma.prescription.findFirst({ where: { id, userId } });
}

// List my prescriptions
router.get("/", async (req, res) => {
  const prescriptions = await prisma.prescription.findMany({
    where: { userId: req.user!.id },
    orderBy: { id: "asc" },
  });
  res.json(prescriptions.map(withSupplyInfo));
});

// Get one prescription
router.get("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const prescription = await findOwnPrescription(id, req.user!.id);
  if (!prescription) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  res.json(withSupplyInfo(prescription));
});

// Create a prescription
router.post("/", async (req, res) => {
  const result = createPrescriptionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid data", details: result.error.issues });
    return;
  }

  const prescription = await prisma.prescription.create({
    data: { ...result.data, userId: req.user!.id },
  });
  res.status(201).json(withSupplyInfo(prescription));
});

// Update a prescription
router.patch("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const result = updatePrescriptionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid data", details: result.error.issues });
    return;
  }

  const existing = await findOwnPrescription(id, req.user!.id);
  if (!existing) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  const prescription = await prisma.prescription.update({
    where: { id },
    data: result.data,
  });
  res.json(withSupplyInfo(prescription));
});

// Delete a prescription
router.delete("/:id", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const existing = await findOwnPrescription(id, req.user!.id);
  if (!existing) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  await prisma.prescription.delete({ where: { id } });
  res.status(204).end();
});

// Request a refill
router.post("/:id/refills", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const prescription = await findOwnPrescription(id, req.user!.id);
  if (!prescription) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  if (prescription.refillsRemaining <= 0) {
    res.status(400).json({ error: "No refills remaining. Please contact your prescriber." });
    return;
  }

  const openRequest = await prisma.refillRequest.findFirst({
    where: { prescriptionId: id, status: { not: "delivered" } },
  });
  if (openRequest) {
    res.status(409).json({ error: "A refill request is already in progress" });
    return;
  }

  const userId = req.user!.id;
  const refill = await prisma.$transaction(async (tx) => {
    const created = await tx.refillRequest.create({ data: { prescriptionId: id } });
    await tx.statusHistory.create({
      data: { refillRequestId: created.id, fromStatus: null, toStatus: "requested", changedByUserId: userId },
    });
    return created;
  });

  res.status(201).json(refill);
});

export default router;