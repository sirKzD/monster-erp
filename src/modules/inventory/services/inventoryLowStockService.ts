import type {
  StockMovement
} from "../types/inventory.types";

import {
  calculateCurrentStock
} from "./inventoryStockService";

export interface LowStockAlert {
  productId: string;
  warehouseId: string;
  currentStock: number;
  minimumStock: number;
  status: "low_stock" | "safe";
}

export function createLowStockAlert(
  movements: StockMovement[],
  productId: string,
  warehouseId: string,
  minimumStock: number
): LowStockAlert {
  const currentStock = calculateCurrentStock(
    movements,
    productId,
    warehouseId
  );

  return {
    productId,
    warehouseId,
    currentStock,
    minimumStock,
    status: currentStock <= minimumStock
      ? "low_stock"
      : "safe"
  };
}

export function filterLowStockAlerts(
  alerts: LowStockAlert[]
): LowStockAlert[] {
  return alerts.filter(
    alert => alert.status === "low_stock"
  );
}