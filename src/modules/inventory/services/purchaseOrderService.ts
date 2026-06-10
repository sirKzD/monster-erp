import type {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus
} from "../types/purchaseOrder.types";

export function calculatePurchaseOrderTotal(
  items: PurchaseOrderItem[]
): number {
  return items.reduce(
    (total, item) =>
      total + item.quantity * item.unitPrice,
    0
  );
}

export function createPurchaseOrder(
  supplierId: string,
  items: PurchaseOrderItem[]
): PurchaseOrder {

  return {
    id: crypto.randomUUID(),
    supplierId,
    items,
    totalAmount:
      calculatePurchaseOrderTotal(items),
    status: "draft",
    createdAt: new Date().toISOString()
  };
}

export function changePurchaseOrderStatus(
  order: PurchaseOrder,
  status: PurchaseOrderStatus
): PurchaseOrder {
  return {
    ...order,
    status
  };
}