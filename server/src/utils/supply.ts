import type { Prescription } from "../types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getDaysRemaining(prescription: Prescription, today: Date = new Date()): number {
  const daysSupply = Math.floor(prescription.quantity / prescription.timesPerDay);
  const daysSinceFill = Math.floor(
    (today.getTime() - prescription.lastFilledDate.getTime()) / MS_PER_DAY
  );
  return Math.max(daysSupply - daysSinceFill, 0);
}

export function isRunningLow(prescription: Prescription, thresholdDays = 7): boolean {
  return getDaysRemaining(prescription) <= thresholdDays;
}
export function withSupplyInfo<T extends Prescription>(prescription: T) {
  return {
    ...prescription,
    daysRemaining: getDaysRemaining(prescription),
    runningLow: isRunningLow(prescription),
  };
}