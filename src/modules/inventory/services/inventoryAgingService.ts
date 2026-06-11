import type {
  ProductLot
} from "../types/inventory.types";

export type InventoryAgeStatus =
  | "fresh"
  | "aging"
  | "old";

export interface InventoryAgingItem {
  lotId: string;
  productId: string;
  lotNumber: string;
  quantity: number;
  ageDays: number;
  status: InventoryAgeStatus;
}

export function calculateAgeDays(
  receivedAt: string,
  today: string
): number {
  const receivedTime = new Date(receivedAt).getTime();
  const todayTime = new Date(today).getTime();

  return Math.floor(
    (todayTime - receivedTime) / (1000 * 60 * 60 * 24)
  );
}

export function classifyInventoryAge(
  ageDays: number
): InventoryAgeStatus {
  if (ageDays >= 90) return "old";
  if (ageDays >= 30) return "aging";

  return "fresh";
}

export function createInventoryAgingItem(
  lot: ProductLot,
  today: string
): InventoryAgingItem {
  const ageDays = calculateAgeDays(
    lot.receivedAt,
    today
  );

  return {
    lotId: lot.id,
    productId: lot.productId,
    lotNumber: lot.lotNumber,
    quantity: lot.quantity,
    ageDays,
    status: classifyInventoryAge(ageDays)
  };
}

export function createInventoryAgingReport(
  lots: ProductLot[],
  today: string
): InventoryAgingItem[] {
  return lots.map(
    lot => createInventoryAgingItem(
      lot,
      today
    )
  );
}

export function filterAgingItemsByStatus(
  items: InventoryAgingItem[],
  status: InventoryAgeStatus
): InventoryAgingItem[] {
  return items.filter(
    item => item.status === status
  );
}