import type {
  Warehouse,
  WarehouseLocation,
  WarehouseStatus
} from "../types/inventory.types";

export function updateWarehouseStatus(
  warehouse: Warehouse,
  status: WarehouseStatus
): Warehouse {
  return {
    ...warehouse,
    status
  };
}

export function createWarehouseLocation(
  warehouseId: string,
  name: string,
  code: string
): WarehouseLocation {
  return {
    id: crypto.randomUUID(),
    warehouseId,
    name: name.trim(),
    code: code.trim().toUpperCase(),
    status: "active",
    createdAt: new Date().toISOString()
  };
}

export function updateWarehouseLocationStatus(
  location: WarehouseLocation,
  status: WarehouseStatus
): WarehouseLocation {
  return {
    ...location,
    status
  };
}

export function filterActiveWarehouses(
  warehouses: Warehouse[]
): Warehouse[] {
  return warehouses.filter(
    warehouse => warehouse.status === "active"
  );
}

export function filterActiveWarehouseLocations(
  locations: WarehouseLocation[]
): WarehouseLocation[] {
  return locations.filter(
    location => location.status === "active"
  );
}