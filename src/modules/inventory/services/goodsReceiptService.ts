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

export interface PartialReceiptResult {
  receipt: GoodsReceipt;
  updatedOrder: PurchaseOrder;
  remainingItems: PurchaseOrderItem[];
  isFullyReceived: boolean;
}

export function isPurchaseOrderReceivable(
  order: PurchaseOrder
): boolean {
  return (
    order.status === "approved" ||
    order.status === "partial_received"
  );
}

export function createGoodsReceipt(
  order: PurchaseOrder
): GoodsReceipt | null {
  if (!isPurchaseOrderReceivable(order)) return null;

  return {
    id: crypto.randomUUID(),
    purchaseOrderId: order.id,
    items: order.items,
    receivedAt: new Date().toISOString()
  };
}

export function createPartialGoodsReceipt(
  order: PurchaseOrder,
  receivedItems: PurchaseOrderItem[]
): PartialReceiptResult | null {
  if (!isPurchaseOrderReceivable(order)) return null;

  for (const received of receivedItems) {
    const original = order.items.find(
      item => item.productId === received.productId
    );

    if (!original) return null;
    if (received.quantity > original.quantity) return null;
  }

  const remainingItems: PurchaseOrderItem[] = order.items
    .map(original => {
      const received = receivedItems.find(
        item => item.productId === original.productId
      );

      const receivedQuantity = received?.quantity ?? 0;
      const remainingQuantity = original.quantity - receivedQuantity;

      return {
        ...original,
        quantity: remainingQuantity
      };
    })
    .filter(item => item.quantity > 0);

  const isFullyReceived = remainingItems.length === 0;

  const updatedOrder = updatePurchaseOrderStatus(
    order,
    isFullyReceived ? "received" : "partial_received"
  );

  if (!updatedOrder) return null;

  const receipt: GoodsReceipt = {
    id: crypto.randomUUID(),
    purchaseOrderId: order.id,
    items: receivedItems,
    receivedAt: new Date().toISOString()
  };

  return {
    receipt,
    updatedOrder,
    remainingItems,
    isFullyReceived
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
  return updatePurchaseOrderStatus(order, "received");
}