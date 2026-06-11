import type {
  StockPicking
} from "./stockPickingService";

export type PickingRoute =
  | "standard"
  | "express"
  | "cold_chain"
  | "fragile";

export interface RoutedStockPicking extends StockPicking {
  route: PickingRoute;
}

export function isValidPickingRoute(
  route: string
): route is PickingRoute {
  return [
    "standard",
    "express",
    "cold_chain",
    "fragile"
  ].includes(route);
}

export function assignPickingRoute(
  picking: StockPicking,
  route: PickingRoute
): RoutedStockPicking | null {
  if (picking.status !== "pending") {
    return null;
  }

  return {
    ...picking,
    route
  };
}

export function filterPickingsByRoute(
  pickings: RoutedStockPicking[],
  route: PickingRoute
): RoutedStockPicking[] {
  return pickings.filter(
    picking => picking.route === route
  );
}

export function getDefaultRouteForPriority(
  priority: "normal" | "urgent" | "fragile" | "temperature_sensitive"
): PickingRoute {
  if (priority === "urgent") return "express";
  if (priority === "fragile") return "fragile";
  if (priority === "temperature_sensitive") return "cold_chain";

  return "standard";
}