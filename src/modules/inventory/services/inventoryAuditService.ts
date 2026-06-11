import type {
  StockMovement
} from "../types/inventory.types";

import {
  calculateCurrentStock
} from "./inventoryStockService";

export interface InventoryAuditResult {
  productId: string;
  warehouseId: string;
  systemStock: number;
  physicalStock: number;
  variance: number;
  status: "matched" | "shortage" | "overage";
}

export function createInventoryAuditResult(
  movements: StockMovement[],
  productId: string,
  warehouseId: string,
  physicalStock: number
): InventoryAuditResult {
  const systemStock = calculateCurrentStock(
    movements,
    productId,
    warehouseId
  );

  const variance = physicalStock - systemStock;

  return {
    productId,
    warehouseId,
    systemStock,
    physicalStock,
    variance,
    status:
      variance === 0
        ? "matched"
        : variance < 0
          ? "shortage"
          : "overage"
  };
}

export function createAuditAdjustmentMovement(
  audit: InventoryAuditResult
): StockMovement | null {
  if (audit.variance === 0) return null;

  return {
    id: crypto.randomUUID(),
    productId: audit.productId,
    warehouseId: audit.warehouseId,
    type: audit.variance > 0 ? "in" : "out",
    quantity: Math.abs(audit.variance),
    createdAt: new Date().toISOString()
  };
}