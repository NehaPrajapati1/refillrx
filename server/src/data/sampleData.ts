import type { Prescription } from "../types";

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export const samplePrescriptions: Prescription[] = [
  {
    id: 1,
    userId: 1,
    medicationName: "Atorvastatin",
    dosage: "20 mg",
    timesPerDay: 1,
    quantity: 30,
    refillsRemaining: 3,
    pharmacyName: "Maple Pharmacy",
    lastFilledDate: daysAgo(26),
  },
  {
    id: 2,
    userId: 1,
    medicationName: "Metformin",
    dosage: "500 mg",
    timesPerDay: 2,
    quantity: 120,
    refillsRemaining: 5,
    pharmacyName: "Maple Pharmacy",
    lastFilledDate: daysAgo(10),
  },
  {
    id: 3,
    userId: 1,
    medicationName: "Lisinopril",
    dosage: "10 mg",
    timesPerDay: 1,
    quantity: 90,
    refillsRemaining: 0,
    pharmacyName: "Prairie Drugs",
    lastFilledDate: daysAgo(85),
  },
];