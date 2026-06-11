import type {
  PurchaseOrder,
  PurchaseOrderStatus
} from "../types/purchaseOrder.types";

const VALID_TRANSITIONS: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
  draft: ["approved", "cancelled"],
  approved: ["partial_received", "received", "cancelled"],
  partial_received: ["received", "cancelled"],
  received: [],
  cancelled: []
}


export function canChangePurchaseOrderStatus(
  currentStatus: PurchaseOrderStatus, 
  nextStatus: PurchaseOrderStatus
): boolean {
    if (currentStatus === nextStatus) return true;

    return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

export function updatePurchaseOrderStatus(
  order: PurchaseOrder,
  nextStatus: PurchaseOrderStatus
): PurchaseOrder | null {
  if (!canChangePurchaseOrderStatus(order.status, nextStatus)) {
    return null;
  }

  return {
    ...order,
    status: nextStatus
  };
}