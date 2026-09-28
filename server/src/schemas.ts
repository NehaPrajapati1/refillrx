import { z } from "zod";

export const refillStatuses = ["requested", "approved", "packed", "shipped", "delivered"] as const;

export const createPrescriptionSchema = z.object({
  medicationName: z.string().trim().min(1).max(100),
  dosage: z.string().trim().min(1).max(50),
  timesPerDay: z.number().int().min(1).max(12),
  quantity: z.number().int().min(1).max(1000),
  refillsRemaining: z.number().int().min(0).max(20),
  pharmacyName: z.string().trim().min(1).max(100),
  lastFilledDate: z.coerce.date(),
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(refillStatuses),
});