import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateInventoryRiskLevel,
  createAdvancedInventoryReport
} from "../services/advancedInventoryReportService";

import type {
  InventoryDashboardV2
} from "../services/inventoryDashboardService";

import type {
  InventoryAgingItem
} from "../services/inventoryAgingService";

import type {
  LowStockAlert
} from "../services/inventoryLowStockService";

import type {
  InventoryAuditResult
} from "../services/inventoryAuditService";

const dashboard: InventoryDashboardV2 = {
  healthScore: 70,
  totalInventoryValue: 150000000,
  lowStockCount: 1,
  expiredLotCount: 1,
  nearExpiryLotCount: 1,
  activeReservationCount: 2,
  pendingPickingCount: 1,
  pendingDeliveryCount: 1
};

const agingItems: InventoryAgingItem[] = [
  {
    lotId: "lot-1",
    productId: "product-1",
    lotNumber: "LOT-001",
    quantity: 100,
    ageDays: 100,
    status: "old"
  },
  {
    lotId: "lot-2",
    productId: "product-1",
    lotNumber: "LOT-002",
    quantity: 50,
    ageDays: 45,
    status: "aging"
  }
];

const lowStockAlerts: LowStockAlert[] = [
  {
    productId: "product-1",
    warehouseId: "warehouse-1",
    currentStock: 2,
    minimumStock: 5,
    status: "low_stock"
  }
];

const audits: InventoryAuditResult[] = [
  {
    productId: "product-1",
    warehouseId: "warehouse-1",
    systemStock: 100,
    physicalStock: 90,
    variance: -10,
    status: "shortage"
  }
];

describe("advancedInventoryReportService", () => {
  it("calculates low risk level", () => {
    expect(
      calculateInventoryRiskLevel(
        0,
        0,
        0,
        0
      )
    ).toBe("low");
  });

  it("calculates medium risk level", () => {
    expect(
      calculateInventoryRiskLevel(
        1,
        1,
        0,
        0
      )
    ).toBe("medium");
  });

  it("calculates high risk level", () => {
    expect(
      calculateInventoryRiskLevel(
        2,
        2,
        1,
        1
      )
    ).toBe("high");
  });

  it("creates advanced inventory report", () => {
    const report = createAdvancedInventoryReport(
      dashboard,
      agingItems,
      lowStockAlerts,
      audits
    );

    expect(report).toEqual({
      healthScore: 70,
      totalInventoryValue: 150000000,
      lowStockCount: 1,
      expiredLotCount: 1,
      nearExpiryLotCount: 1,
      oldInventoryCount: 1,
      agingInventoryCount: 1,
      auditVarianceCount: 1,
      riskLevel: "medium"
    });
  });
});