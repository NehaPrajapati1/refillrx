import type { RefillStatus } from "../types";

const nextStatus: Record<RefillStatus, RefillStatus | null> = {
  requested: "approved",
  approved: "packed",
  packed: "shipped",
  shipped: "delivered",
  delivered: null,
};

export function canMoveTo(current: RefillStatus, next: RefillStatus): boolean {
  return nextStatus[current] === next;
}