import { describe, it, expect } from "vitest";

import {
  calculateCurrentStock,
  hasEnoughStock,
  preventNegativeStock
} from "../services/inventoryStockService";

import type {
  StockMovement
} from "../types/inventory.types";

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 100,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "move-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "out",
    quantity: 30,
    createdAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "move-3",
    productId: "product-2",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 50,
    createdAt: "2026-01-03T00:00:00.000Z"
  }
];

describe("inventoryStockService", () => {
  it("calculates current stock", () => {
    const stock = calculateCurrentStock(
      movements,
      "product-1",
      "warehouse-1"
    );

    expect(stock).toBe(70);
  });

  it("returns zero when no movement exists", () => {
    const stock = calculateCurrentStock(
      movements,
      "missing-product",
      "warehouse-1"
    );

    expect(stock).toBe(0);
  });

  it("checks enough stock", () => {
    expect(
      hasEnoughStock(
        movements,
        "product-1",
        "warehouse-1",
        70
      )
    ).toBe(true);

    expect(
      hasEnoughStock(
        movements,
        "product-1",
        "warehouse-1",
        71
      )
    ).toBe(false);
  });

  it("prevents negative stock for out movement", () => {
    const movement: StockMovement = {
      id: "move-4",
      productId: "product-1",
      warehouseId: "warehouse-1",
      type: "out",
      quantity: 100,
      createdAt: "2026-01-04T00:00:00.000Z"
    };

    expect(
      preventNegativeStock(
        movements,
        movement
      )
    ).toBe(false);
  });

  it("allows in movement without stock check", () => {
    const movement: StockMovement = {
      id: "move-5",
      productId: "product-1",
      warehouseId: "warehouse-1",
      type: "in",
      quantity: 1000,
      createdAt: "2026-01-04T00:00:00.000Z"
    };

    expect(
      preventNegativeStock(
        movements,
        movement
      )
    ).toBe(true);
  });
});