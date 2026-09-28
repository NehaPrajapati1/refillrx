export type Role = "patient" | "staff";

export type RefillStatus = "requested" | "approved" | "packed" | "shipped" | "delivered";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Prescription {
  id: number;
  userId: number;
  medicationName: string;
  dosage: string;
  timesPerDay: number;
  quantity: number;
  refillsRemaining: number;
  pharmacyName: string;
  lastFilledDate: Date;
}

export interface RefillRequest {
  id: number;
  prescriptionId: number;
  status: RefillStatus;
  requestedAt: Date;
}

export interface StatusHistory {
  id: number;
  refillRequestId: number;
  fromStatus: RefillStatus | null;
  toStatus: RefillStatus;
  changedByUserId: number;
  changedAt: Date;
}