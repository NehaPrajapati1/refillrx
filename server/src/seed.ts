import { prisma } from "./lib/prisma";

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  // Clear existing data (children first, because of foreign keys)
  await prisma.statusHistory.deleteMany();
  await prisma.refillRequest.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.user.deleteMany();

  const patient = await prisma.user.create({
    data: { name: "Alex Patient", email: "alex@example.com", role: "patient" },
  });

  const staff = await prisma.user.create({
    data: { name: "Sam Pharmacist", email: "sam@example.com", role: "staff" },
  });

  const atorvastatin = await prisma.prescription.create({
    data: {
      userId: patient.id,
      medicationName: "Atorvastatin",
      dosage: "20 mg",
      timesPerDay: 1,
      quantity: 30,
      refillsRemaining: 3,
      pharmacyName: "Maple Pharmacy",
      lastFilledDate: daysAgo(26),
    },
  });

  await prisma.prescription.createMany({
    data: [
      {
        userId: patient.id,
        medicationName: "Metformin",
        dosage: "500 mg",
        timesPerDay: 2,
        quantity: 120,
        refillsRemaining: 5,
        pharmacyName: "Maple Pharmacy",
        lastFilledDate: daysAgo(10),
      },
      {
        userId: patient.id,
        medicationName: "Lisinopril",
        dosage: "10 mg",
        timesPerDay: 1,
        quantity: 90,
        refillsRemaining: 0,
        pharmacyName: "Prairie Drugs",
        lastFilledDate: daysAgo(85),
      },
    ],
  });

  // One refill request that staff has already approved, with its history
  const refill = await prisma.refillRequest.create({
    data: { prescriptionId: atorvastatin.id, status: "approved" },
  });

  await prisma.statusHistory.createMany({
    data: [
      { refillRequestId: refill.id, fromStatus: null, toStatus: "requested", changedByUserId: patient.id },
      { refillRequestId: refill.id, fromStatus: "requested", toStatus: "approved", changedByUserId: staff.id },
    ],
  });

  console.log("Seed data created ✅");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());