import type {
  ProductLot
} from "../types/inventory.types";

export function isLotExpired(
  lot: ProductLot,
  today: string
): boolean {
  if (!lot.expiryDate) return false;

  return new Date(lot.expiryDate) < new Date(today);
}

export function isLotNearExpiry(
  lot: ProductLot,
  today: string,
  thresholdDays: number
): boolean {
  if (!lot.expiryDate) return false;
  if (isLotExpired(lot, today)) return false;

  const todayTime = new Date(today).getTime();
  const expiryTime = new Date(lot.expiryDate).getTime();

  const diffDays = Math.ceil(
    (expiryTime - todayTime) / (1000 * 60 * 60 * 24)
  );

  return diffDays <= thresholdDays;
}

export function filterExpiredLots(
  lots: ProductLot[],
  today: string
): ProductLot[] {
  return lots.filter(
    lot => isLotExpired(lot, today)
  );
}

export function filterNearExpiryLots(
  lots: ProductLot[],
  today: string,
  thresholdDays: number
): ProductLot[] {
  return lots.filter(
    lot => isLotNearExpiry(lot, today, thresholdDays)
  );
}