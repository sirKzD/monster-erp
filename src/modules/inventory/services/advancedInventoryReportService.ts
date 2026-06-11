import type {
  InventoryDashboardV2
} from "./inventoryDashboardService";

import type {
  InventoryAgingItem
} from "./inventoryAgingService";

import type {
  LowStockAlert
} from "./inventoryLowStockService";

import type {
  InventoryAuditResult
} from "./inventoryAuditService";

export interface AdvancedInventoryReport {
  healthScore: number;
  totalInventoryValue: number;
  lowStockCount: number;
  expiredLotCount: number;
  nearExpiryLotCount: number;
  oldInventoryCount: number;
  agingInventoryCount: number;
  auditVarianceCount: number;
  riskLevel: "low" | "medium" | "high";
}

export function calculateInventoryRiskLevel(
  lowStockCount: number,
  expiredLotCount: number,
  oldInventoryCount: number,
  auditVarianceCount: number
): "low" | "medium" | "high" {
  const riskScore =
    lowStockCount * 2 +
    expiredLotCount * 3 +
    oldInventoryCount * 2 +
    auditVarianceCount * 2;

  if (riskScore >= 10) return "high";
  if (riskScore >= 5) return "medium";

  return "low";
}

export function createAdvancedInventoryReport(
  dashboard: InventoryDashboardV2,
  agingItems: InventoryAgingItem[],
  lowStockAlerts: LowStockAlert[],
  audits: InventoryAuditResult[]
): AdvancedInventoryReport {
  const oldInventoryCount = agingItems.filter(
    item => item.status === "old"
  ).length;

  const agingInventoryCount = agingItems.filter(
    item => item.status === "aging"
  ).length;

  const lowStockCount = lowStockAlerts.filter(
    alert => alert.status === "low_stock"
  ).length;

  const auditVarianceCount = audits.filter(
    audit => audit.variance !== 0
  ).length;

  return {
    healthScore: dashboard.healthScore,
    totalInventoryValue: dashboard.totalInventoryValue,
    lowStockCount,
    expiredLotCount: dashboard.expiredLotCount,
    nearExpiryLotCount: dashboard.nearExpiryLotCount,
    oldInventoryCount,
    agingInventoryCount,
    auditVarianceCount,
    riskLevel: calculateInventoryRiskLevel(
      lowStockCount,
      dashboard.expiredLotCount,
      oldInventoryCount,
      auditVarianceCount
    )
  };
}