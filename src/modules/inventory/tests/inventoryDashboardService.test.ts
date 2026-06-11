import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateInventoryHealthScore,
  createInventoryDashboardV2
} from "../services/inventoryDashboardService";

import type {
  InventoryReportSummary
} from "../services/inventoryReportingService";

import type {
  LowStockAlert
} from "../services/inventoryLowStockService";

import type {
  ProductLot
} from "../types/inventory.types";

import type {
  StockPicking
} from "../services/stockPickingService";

import type {
  DeliveryOrder
} from "../services/deliveryOrderService";

const summary: InventoryReportSummary = {
  totalProducts: 10,
  totalWarehouses: 2,
  totalStockMovements: 20,
  totalInventoryValue: 150000000,
  lowStockCount: 1,
  activeReservationCount: 2,
  auditVarianceCount: 1
};

const lowStockAlerts: LowStockAlert[] = [
  {
    productId: "product-1",
    warehouseId: "warehouse-1",
    currentStock: 2,
    minimumStock: 5,
    status: "low_stock"
  }
];

const lots: ProductLot[] = [
  {
    id: "lot-1",
    productId: "product-1",
    lotNumber: "LOT-001",
    quantity: 100,
    receivedAt: "2026-01-01T00:00:00.000Z",
    expiryDate: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "lot-2",
    productId: "product-1",
    lotNumber: "LOT-002",
    quantity: 50,
    receivedAt: "2026-01-01T00:00:00.000Z",
    expiryDate: "2026-01-10T00:00:00.000Z"
  }
];

const pickings: StockPicking[] = [
  {
    id: "picking-1",
    reservationId: "reservation-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    quantity: 10,
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

const deliveries: DeliveryOrder[] = [
  {
    id: "delivery-1",
    pickingId: "picking-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    quantity: 10,
    status: "pending",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("inventoryDashboardService", () => {
  it("calculates inventory health score", () => {
    const score = calculateInventoryHealthScore(
      1,
      1,
      1
    );

    expect(score).toBe(70);
  });

  it("does not allow health score below zero", () => {
    const score = calculateInventoryHealthScore(
      20,
      20,
      20
    );

    expect(score).toBe(0);
  });

  it("creates inventory dashboard v2", () => {
    const dashboard = createInventoryDashboardV2(
      summary,
      lowStockAlerts,
      lots,
      pickings,
      deliveries,
      "2026-01-05T00:00:00.000Z"
    );

    expect(dashboard).toEqual({
      healthScore: 70,
      totalInventoryValue: 150000000,
      lowStockCount: 1,
      expiredLotCount: 1,
      nearExpiryLotCount: 1,
      activeReservationCount: 2,
      pendingPickingCount: 1,
      pendingDeliveryCount: 1
    });
  });
});