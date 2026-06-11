export interface InventoryKpi {
  stockAccuracy: number;
  fulfillmentReadiness: number;
  inventoryHealth: number;
  inventoryGrade: "A" | "B" | "C";
}

export function calculateStockAccuracy(
  totalAudits: number,
  accurateAudits: number
): number {
  if (totalAudits === 0) return 0;

  return Math.round(
    (accurateAudits / totalAudits) * 100
  );
}

export function calculateFulfillmentReadiness(
  availableOrders: number,
  totalOrders: number
): number {
  if (totalOrders === 0) return 0;

  return Math.round(
    (availableOrders / totalOrders) * 100
  );
}

export function calculateInventoryHealth(
  stockAccuracy: number,
  fulfillmentReadiness: number
): number {
  return Math.round(
    (stockAccuracy + fulfillmentReadiness) / 2
  );
}

export function calculateInventoryGrade(
  health: number
): "A" | "B" | "C" {
  if (health >= 90) return "A";
  if (health >= 75) return "B";

  return "C";
}

export function createInventoryKpi(
  stockAccuracy: number,
  fulfillmentReadiness: number
): InventoryKpi {
  const inventoryHealth =
    calculateInventoryHealth(
      stockAccuracy,
      fulfillmentReadiness
    );

  return {
    stockAccuracy,
    fulfillmentReadiness,
    inventoryHealth,
    inventoryGrade:
      calculateInventoryGrade(
        inventoryHealth
      )
  };
}