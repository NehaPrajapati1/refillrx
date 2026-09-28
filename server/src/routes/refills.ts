import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireStaff } from "../middleware/auth";
import { parseId } from "../utils/parseId";
import { canMoveTo } from "../utils/refillWorkflow";
import { refillStatuses, updateStatusSchema } from "../schemas";
import { z } from "zod";

const router = Router();

// List refills: staff see all (optionally filtered by status), patients see their own
router.get("/", async (req, res) => {
  const statusResult = z.enum(refillStatuses).optional().safeParse(req.query.status);
  if (!statusResult.success) {
    res.status(400).json({ error: "Invalid status filter" });
    return;
  }
  const status = statusResult.data;
  const isStaff = req.user!.role === "staff";

  const refills = await prisma.refillRequest.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(isStaff ? {} : { prescription: { userId: req.user!.id } }),
    },
    include: {
      prescription: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
    orderBy: { requestedAt: "asc" },
  });

  res.json(refills);
});

// Move a refill to the next status (staff only)
router.patch("/:id/status", requireStaff, async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const result = updateStatusSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid data", details: result.error.issues });
    return;
  }
  const newStatus = result.data.status;

  const refill = await prisma.refillRequest.findUnique({ where: { id } });
  if (!refill) {
    res.status(404).json({ error: "Refill request not found" });
    return;
  }

  if (!canMoveTo(refill.status, newStatus)) {
    res.status(400).json({ error: `Cannot move from ${refill.status} to ${newStatus}` });
    return;
  }

  const staffId = req.user!.id;
  const updated = await prisma.$transaction(async (tx) => {
    const changed = await tx.refillRequest.update({
      where: { id },
      data: { status: newStatus },
    });

    await tx.statusHistory.create({
      data: { refillRequestId: id, fromStatus: refill.status, toStatus: newStatus, changedByUserId: staffId },
    });

    // When delivered, use up one refill and reset the supply date
    if (newStatus === "delivered") {
      await tx.prescription.update({
        where: { id: refill.prescriptionId },
        data: { refillsRemaining: { decrement: 1 }, lastFilledDate: new Date() },
      });
    }

    return changed;
  });

  res.json(updated);
});

// View a refill's status history
router.get("/:id/history", async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const refill = await prisma.refillRequest.findUnique({
    where: { id },
    include: { prescription: true },
  });

  const isOwner = refill?.prescription.userId === req.user!.id;
  if (!refill || (!isOwner && req.user!.role !== "staff")) {
    res.status(404).json({ error: "Refill request not found" });
    return;
  }

  const history = await prisma.statusHistory.findMany({
    where: { refillRequestId: id },
    include: { changedBy: { select: { name: true, role: true } } },
    orderBy: { changedAt: "asc" },
  });

  res.json(history);
});

export default router;