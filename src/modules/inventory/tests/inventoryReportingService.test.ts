import { describe, it, expect } from "vitest";

import {
  createInventoryReportSummary
} from "../services/inventoryReportingService";

describe("inventoryReportingService", () => {
  it("creates inventory report summary", () => {
    const report = createInventoryReportSummary(
      [
        {
          id: "product-1",
          name: "Laptop",
          sku: "LAP-001",
          categoryId: "category-1",
          price: 15000000,
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          id: "warehouse-1",
          name: "Main Warehouse",
          location: "Batam",
          status: "active",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          id: "move-1",
          productId: "product-1",
          warehouseId: "warehouse-1",
          type: "in",
          quantity: 10,
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          productId: "product-1",
          warehouseId: "warehouse-1",
          stock: 10,
          price: 15000000,
          value: 150000000
        }
      ],
      [
        {
          productId: "product-1",
          warehouseId: "warehouse-1",
          currentStock: 2,
          minimumStock: 5,
          status: "low_stock"
        }
      ],
      [
        {
          id: "reservation-1",
          productId: "product-1",
          warehouseId: "warehouse-1",
          quantity: 2,
          status: "active",
          createdAt: "2026-01-01T00:00:00.000Z"
        }
      ],
      [
        {
          productId: "product-1",
          warehouseId: "warehouse-1",
          systemStock: 10,
          physicalStock: 8,
          variance: -2,
          status: "shortage"
        }
      ]
    );

    expect(report).toEqual({
      totalProducts: 1,
      totalWarehouses: 1,
      totalStockMovements: 1,
      totalInventoryValue: 150000000,
      lowStockCount: 1,
      activeReservationCount: 1,
      auditVarianceCount: 1
    });
  });
});