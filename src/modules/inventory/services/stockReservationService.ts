import type {
  StockMovement
} from "../types/inventory.types";

import {
  calculateCurrentStock
} from "./inventoryStockService";

export interface StockReservation {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  status: "active" | "released";
  createdAt: string;
}

export function calculateReservedStock(
  reservations: StockReservation[],
  productId: string,
  warehouseId: string
): number {
  return reservations
    .filter(reservation =>
      reservation.productId === productId &&
      reservation.warehouseId === warehouseId &&
      reservation.status === "active"
    )
    .reduce(
      (total, reservation) => total + reservation.quantity,
      0
    );
}

export function calculateAvailableStock(
  movements: StockMovement[],
  reservations: StockReservation[],
  productId: string,
  warehouseId: string
): number {
  const currentStock = calculateCurrentStock(
    movements,
    productId,
    warehouseId
  );

  const reservedStock = calculateReservedStock(
    reservations,
    productId,
    warehouseId
  );

  return currentStock - reservedStock;
}

export function canReserveStock(
  movements: StockMovement[],
  reservations: StockReservation[],
  productId: string,
  warehouseId: string,
  quantity: number
): boolean {
  if (quantity <= 0) return false;

  return calculateAvailableStock(
    movements,
    reservations,
    productId,
    warehouseId
  ) >= quantity;
}

export function createStockReservation(
  movements: StockMovement[],
  reservations: StockReservation[],
  productId: string,
  warehouseId: string,
  quantity: number
): StockReservation | null {
  if (!canReserveStock(
    movements,
    reservations,
    productId,
    warehouseId,
    quantity
  )) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    productId,
    warehouseId,
    quantity,
    status: "active",
    createdAt: new Date().toISOString()
  };
}

export function releaseStockReservation(
  reservation: StockReservation
): StockReservation {
  return {
    ...reservation,
    status: "released"
  };
}