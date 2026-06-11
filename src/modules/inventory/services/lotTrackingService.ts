import type {
  ProductLot
} from "../types/inventory.types";

export function createProductLot(
  productId: string,
  lotNumber: string,
  quantity: number
): ProductLot {
  return {
    id: crypto.randomUUID(),
    productId,
    lotNumber: lotNumber.trim().toUpperCase(),
    quantity,
    receivedAt: new Date().toISOString()
  };
}

export function findLotByNumber(
  lots: ProductLot[],
  lotNumber: string
): ProductLot | undefined {
  return lots.find(
    lot =>
      lot.lotNumber.toLowerCase() ===
      lotNumber.trim().toLowerCase()
  );
}

export function calculateLotQuantity(
  lots: ProductLot[],
  productId: string
): number {
  return lots
    .filter(
      lot => lot.productId === productId
    )
    .reduce(
      (total, lot) => total + lot.quantity,
      0
    );
}

export function consumeLotQuantity(
  lot: ProductLot,
  quantity: number
): ProductLot | null {
  if (quantity <= 0) return null;

  if (quantity > lot.quantity) {
    return null;
  }

  return {
    ...lot,
    quantity: lot.quantity - quantity
  };
}