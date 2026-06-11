import type {
  StockPicking
} from "./stockPickingService";

import type {
  StockMovement
} from "../types/inventory.types";

export type DeliveryOrderStatus =
  | "pending"
  | "delivered"
  | "cancelled";

export interface DeliveryOrder {
  id: string;
  pickingId: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  status: DeliveryOrderStatus;
  createdAt: string;
  deliveredAt?: string;
}

export function createDeliveryOrder(
  picking: StockPicking
): DeliveryOrder | null {
  if (picking.status !== "picked") {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    pickingId: picking.id,
    productId: picking.productId,
    warehouseId: picking.warehouseId,
    quantity: picking.quantity,
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

export function markDeliveryAsDelivered(
  delivery: DeliveryOrder
): DeliveryOrder | null {
  if (delivery.status !== "pending") {
    return null;
  }

  return {
    ...delivery,
    status: "delivered",
    deliveredAt: new Date().toISOString()
  };
}

export function cancelDelivery(
  delivery: DeliveryOrder
): DeliveryOrder | null {
  if (delivery.status !== "pending") {
    return null;
  }

  return {
    ...delivery,
    status: "cancelled"
  };
}

export function createStockOutMovement(
  delivery: DeliveryOrder
): StockMovement | null {
  if (delivery.status !== "delivered") {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    productId: delivery.productId,
    warehouseId: delivery.warehouseId,
    type: "out",
    quantity: delivery.quantity,
    createdAt: delivery.deliveredAt ?? new Date().toISOString()
  };
}