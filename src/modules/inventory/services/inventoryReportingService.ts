import type {
  Product,
  Warehouse,
  StockMovement
} from "../types/inventory.types";

import type {
  LowStockAlert
} from "./inventoryLowStockService";

import type {
  InventoryAuditResult
} from "./inventoryAuditService";

import type {
  StockReservation
} from "./stockReservationService";

import type {
  InventoryValuation
} from "./inventoryValuationService";

export interface InventoryReportSummary {
  totalProducts: number;
  totalWarehouses: number;
  totalStockMovements: number;
  totalInventoryValue: number;
  lowStockCount: number;
  activeReservationCount: number;
  auditVarianceCount: number;
}

export function createInventoryReportSummary(
  products: Product[],
  warehouses: Warehouse[],
  movements: StockMovement[],
  valuations: InventoryValuation[],
  lowStockAlerts: LowStockAlert[],
  reservations: StockReservation[],
  audits: InventoryAuditResult[]
): InventoryReportSummary {
  return {
    totalProducts: products.length,
    totalWarehouses: warehouses.length,
    totalStockMovements: movements.length,
    totalInventoryValue: valuations.reduce(
      (total, valuation) => total + valuation.value,
      0
    ),
    lowStockCount: lowStockAlerts.filter(
      alert => alert.status === "low_stock"
    ).length,
    activeReservationCount: reservations.filter(
      reservation => reservation.status === "active"
    ).length,
    auditVarianceCount: audits.filter(
      audit => audit.variance !== 0
    ).length
  };
}