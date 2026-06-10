import type {
  PurchaseOrder,
  PurchaseOrderStatus
} from "../types/purchaseOrder.types";

export function canChangePurchaseOrderStatus(
  currentStatus: PurchaseOrderStatus,
  nextStatus: PurchaseOrderStatus
): boolean {
  if (currentStatus === nextStatus) return true;

  if (currentStatus === "draft") {
    return nextStatus === "approved" || nextStatus === "cancelled";
  }

  if (currentStatus === "approved") {
    return nextStatus === "received" || nextStatus === "cancelled";
  }

  if (currentStatus === "received") {
    return false;
  }

  if (currentStatus === "cancelled") {
    return false;
  }

  return false;
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