import type {
  StockMovement
} from "../types/inventory.types";

import {
  calculateCurrentStock
} from "./inventoryStockService";

export interface CycleCount {
  id: string;
  productId: string;
  warehouseId: string;
  systemStock: number;
  countedStock: number;
  variance: number;
  status: "matched" | "variance";
  countedAt: string;
}

export function createCycleCount(
  movements: StockMovement[],
  productId: string,
  warehouseId: string,
  countedStock: number
): CycleCount {
  const systemStock = calculateCurrentStock(
    movements,
    productId,
    warehouseId
  );

  const variance = countedStock - systemStock;

  return {
    id: crypto.randomUUID(),
    productId,
    warehouseId,
    systemStock,
    countedStock,
    variance,
    status:
      variance === 0
        ? "matched"
        : "variance",
    countedAt: new Date().toISOString()
  };
}

export function hasVariance(
  cycleCount: CycleCount
): boolean {
  return cycleCount.variance !== 0;
}

export function filterVarianceCounts(
  counts: CycleCount[]
): CycleCount[] {
  return counts.filter(
    count => count.variance !== 0
  );
}