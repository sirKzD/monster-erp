import { describe, it, expect } from "vitest";

import {
  calculateInventoryValue,
  calculateTotalInventoryValue
} from "../services/inventoryValuationService";

import type {
  Product,
  StockMovement
} from "../types/inventory.types";

const product: Product = {
  id: "product-1",
  name: "Laptop",
  sku: "LAP-001",
  categoryId: "category-1",
  price: 15000000,
  createdAt: "2026-01-01T00:00:00.000Z"
};

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 10,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "move-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "out",
    quantity: 2,
    createdAt: "2026-01-02T00:00:00.000Z"
  }
];

describe("inventoryValuationService", () => {
  it("calculates inventory value", () => {
    const valuation = calculateInventoryValue(
      product,
      movements,
      "warehouse-1"
    );

    expect(valuation).toEqual({
      productId: "product-1",
      warehouseId: "warehouse-1",
      stock: 8,
      price: 15000000,
      value: 120000000
    });
  });

  it("calculates total inventory value", () => {
    const total = calculateTotalInventoryValue([
      {
        productId: "product-1",
        warehouseId: "warehouse-1",
        stock: 8,
        price: 15000000,
        value: 120000000
      },
      {
        productId: "product-2",
        warehouseId: "warehouse-1",
        stock: 5,
        price: 2000000,
        value: 10000000
      }
    ]);

    expect(total).toBe(130000000);
  });
});