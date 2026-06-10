import type {
  Product,
  StockMovement
} from "../types/inventory.types";

import {
  calculateCurrentStock
} from "./inventoryStockService";

export interface InventoryValuation {
  productId: string;
  warehouseId: string;
  stock: number;
  price: number;
  value: number;
}

export function calculateInventoryValue(
  product: Product,
  movements: StockMovement[],
  warehouseId: string
): InventoryValuation {
  const stock = calculateCurrentStock(
    movements,
    product.id,
    warehouseId
  );

  return {
    productId: product.id,
    warehouseId,
    stock,
    price: product.price,
    value: stock * product.price
  };
}

export function calculateTotalInventoryValue(
  valuations: InventoryValuation[]
): number {
  return valuations.reduce(
    (total, item) => total + item.value,
    0
  );
}