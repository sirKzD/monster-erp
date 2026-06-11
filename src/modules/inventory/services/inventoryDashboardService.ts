import type {
  InventoryReportSummary
} from "./inventoryReportingService";

import type {
  LowStockAlert
} from "./inventoryLowStockService";

import type {
  ProductLot
} from "../types/inventory.types";

import type {
  StockPicking
} from "./stockPickingService";

import type {
  DeliveryOrder
} from "./deliveryOrderService";

import {
  filterExpiredLots,
  filterNearExpiryLots
} from "./expiryTrackingService";

export interface InventoryDashboardV2 {
  healthScore: number;
  totalInventoryValue: number;
  lowStockCount: number;
  expiredLotCount: number;
  nearExpiryLotCount: number;
  activeReservationCount: number;
  pendingPickingCount: number;
  pendingDeliveryCount: number;
}

export function calculateInventoryHealthScore(
  lowStockCount: number,
  expiredLotCount: number,
  pendingPickingCount: number
): number {
  const penalty =
    lowStockCount * 10 +
    expiredLotCount * 15 +
    pendingPickingCount * 5;

  return Math.max(100 - penalty, 0);
}

export function createInventoryDashboardV2(
  summary: InventoryReportSummary,
  lowStockAlerts: LowStockAlert[],
  lots: ProductLot[],
  pickings: StockPicking[],
  deliveries: DeliveryOrder[],
  today: string
): InventoryDashboardV2 {
  const expiredLots = filterExpiredLots(
    lots,
    today
  );

  const nearExpiryLots = filterNearExpiryLots(
    lots,
    today,
    7
  );

  const pendingPickingCount = pickings.filter(
    picking => picking.status === "pending"
  ).length;

  const pendingDeliveryCount = deliveries.filter(
    delivery => delivery.status === "pending"
  ).length;

  const lowStockCount = lowStockAlerts.filter(
    alert => alert.status === "low_stock"
  ).length;

  return {
    healthScore: calculateInventoryHealthScore(
      lowStockCount,
      expiredLots.length,
      pendingPickingCount
    ),
    totalInventoryValue: summary.totalInventoryValue,
    lowStockCount,
    expiredLotCount: expiredLots.length,
    nearExpiryLotCount: nearExpiryLots.length,
    activeReservationCount: summary.activeReservationCount,
    pendingPickingCount,
    pendingDeliveryCount
  };
}