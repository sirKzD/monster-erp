import { describe, it, expect } from "vitest";

import {
  createLowStockAlert,
  filterLowStockAlerts
} from "../services/inventoryLowStockService";

import type {
  StockMovement
} from "../types/inventory.types";

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 50,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "move-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "out",
    quantity: 40,
    createdAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "move-3",
    productId: "product-2",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 100,
    createdAt: "2026-01-03T00:00:00.000Z"
  }
];

describe("inventoryLowStockService", () => {
  it("creates low stock alert", () => {
    const alert = createLowStockAlert(
      movements,
      "product-1",
      "warehouse-1",
      10
    );

    expect(alert).toEqual({
      productId: "product-1",
      warehouseId: "warehouse-1",
      currentStock: 10,
      minimumStock: 10,
      status: "low_stock"
    });
  });

  it("creates safe stock alert", () => {
    const alert = createLowStockAlert(
      movements,
      "product-2",
      "warehouse-1",
      10
    );

    expect(alert.status).toBe("safe");
    expect(alert.currentStock).toBe(100);
  });

  it("filters low stock alerts", () => {
    const alerts = [
      createLowStockAlert(
        movements,
        "product-1",
        "warehouse-1",
        10
      ),
      createLowStockAlert(
        movements,
        "product-2",
        "warehouse-1",
        10
      )
    ];

    const result = filterLowStockAlerts(alerts);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("low_stock");
  });
});