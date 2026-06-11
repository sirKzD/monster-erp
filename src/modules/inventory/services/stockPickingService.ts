import type {
  StockReservation
} from "./stockReservationService";

export type StockPickingStatus =
  | "pending"
  | "picked"
  | "cancelled";

export interface StockPicking {
  id: string;
  reservationId: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  status: StockPickingStatus;
  createdAt: string;
  pickedAt?: string;
}

export function createStockPicking(
  reservation: StockReservation
): StockPicking | null {
  if (reservation.status !== "active") {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    reservationId: reservation.id,
    productId: reservation.productId,
    warehouseId: reservation.warehouseId,
    quantity: reservation.quantity,
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

export function markPickingAsPicked(
  picking: StockPicking
): StockPicking | null {
  if (picking.status !== "pending") {
    return null;
  }

  return {
    ...picking,
    status: "picked",
    pickedAt: new Date().toISOString()
  };
}

export function cancelPicking(
  picking: StockPicking
): StockPicking | null {
  if (picking.status !== "pending") {
    return null;
  }

  return {
    ...picking,
    status: "cancelled"
  };
}

export function filterPendingPickings(
  pickings: StockPicking[]
): StockPicking[] {
  return pickings.filter(
    picking => picking.status === "pending"
  );
}