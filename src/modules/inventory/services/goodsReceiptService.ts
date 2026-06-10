import type {
  PurchaseOrder,
  PurchaseOrderItem
} from "../types/purchaseOrder.types";

import type {
  StockMovement
} from "../types/inventory.types";

import {
  updatePurchaseOrderStatus
} from "./purchaseOrderApprovalService";

export interface GoodsReceipt {
  id: string;
  purchaseOrderId: string;
  items: PurchaseOrderItem[];
  receivedAt: string;
}

export function isPurchaseOrderReceivable(
  order: PurchaseOrder
): boolean {
  return order.status === "approved";
}

export function createGoodsReceipt(
  order: PurchaseOrder
): GoodsReceipt | null {
  if (!isPurchaseOrderReceivable(order)) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    purchaseOrderId: order.id,
    items: order.items,
    receivedAt: new Date().toISOString()
  };
}

export function createStockMovementsFromReceipt(
  receipt: GoodsReceipt,
  warehouseId: string
): StockMovement[] {
  return receipt.items.map(item => ({
    id: crypto.randomUUID(),
    productId: item.productId,
    warehouseId,
    type: "in",
    quantity: item.quantity,
    createdAt: receipt.receivedAt
  }));
}

export function receivePurchaseOrder(
  order: PurchaseOrder
): PurchaseOrder | null {
  return updatePurchaseOrderStatus(
    order,
    "received"
  );
}