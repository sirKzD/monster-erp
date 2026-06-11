import type {
  DeliveryOrder
} from "./deliveryOrderService";

import type {
  StockMovement
} from "../types/inventory.types";

export type ReturnOrderStatus =
  | "pending"
  | "accepted"
  | "rejected";

export interface ReturnOrder {
  id: string;
  deliveryOrderId: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reason: string;
  status: ReturnOrderStatus;
  createdAt: string;
  resolvedAt?: string;
}

export function createReturnOrder(
  delivery: DeliveryOrder,
  quantity: number,
  reason: string
): ReturnOrder | null {
  if (delivery.status !== "delivered") {
    return null;
  }

  if (quantity <= 0 || quantity > delivery.quantity) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    deliveryOrderId: delivery.id,
    productId: delivery.productId,
    warehouseId: delivery.warehouseId,
    quantity,
    reason: reason.trim(),
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

export function acceptReturnOrder(
  returnOrder: ReturnOrder
): ReturnOrder | null {
  if (returnOrder.status !== "pending") {
    return null;
  }

  return {
    ...returnOrder,
    status: "accepted",
    resolvedAt: new Date().toISOString()
  };
}

export function rejectReturnOrder(
  returnOrder: ReturnOrder
): ReturnOrder | null {
  if (returnOrder.status !== "pending") {
    return null;
  }

  return {
    ...returnOrder,
    status: "rejected",
    resolvedAt: new Date().toISOString()
  };
}

export function createReturnStockMovement(
  returnOrder: ReturnOrder
): StockMovement | null {
  if (returnOrder.status !== "accepted") {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    productId: returnOrder.productId,
    warehouseId: returnOrder.warehouseId,
    type: "in",
    quantity: returnOrder.quantity,
    createdAt: returnOrder.resolvedAt ?? new Date().toISOString()
  };
}