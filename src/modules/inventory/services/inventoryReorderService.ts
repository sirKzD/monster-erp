import type {
  Product,
  StockMovement
} from "../types/inventory.types";

import {
  calculateCurrentStock
} from "./inventoryStockService";

export interface ReorderSuggestion {
  productId: string;
  warehouseId: string;
  currentStock: number;
  minimumStock: number;
  reorderQuantity: number;
  status: "reorder_needed" | "no_reorder";
}

export function createReorderSuggestion(
  product: Product,
  movements: StockMovement[],
  warehouseId: string,
  minimumStock: number,
  targetStock: number
): ReorderSuggestion {
  const currentStock = calculateCurrentStock(
    movements,
    product.id,
    warehouseId
  );

  const reorderQuantity =
    currentStock <= minimumStock
      ? Math.max(targetStock - currentStock, 0)
      : 0;

  return {
    productId: product.id,
    warehouseId,
    currentStock,
    minimumStock,
    reorderQuantity,
    status: reorderQuantity > 0
      ? "reorder_needed"
      : "no_reorder"
  };
}

export function filterReorderSuggestions(
  suggestions: ReorderSuggestion[]
): ReorderSuggestion[] {
  return suggestions.filter(
    suggestion => suggestion.status === "reorder_needed"
  );
}