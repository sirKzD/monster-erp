import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createWarehouse
} from "../services/inventoryService";

import {
  updateWarehouseStatus,
  createWarehouseLocation,
  updateWarehouseLocationStatus,
  filterActiveWarehouses,
  filterActiveWarehouseLocations
} from "../services/warehouseService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "warehouse-1"
  });
});

describe("warehouseService", () => {
  it("updates warehouse status", () => {
    const warehouse = createWarehouse(
      "Main Warehouse",
      "Batam"
    );

    const updated = updateWarehouseStatus(
      warehouse,
      "inactive"
    );

    expect(updated.status).toBe("inactive");
  });

  it("creates warehouse location", () => {
    const location = createWarehouseLocation(
      "warehouse-1",
      " Rack A1 ",
      " a1 "
    );

    expect(location).toMatchObject({
      id: "warehouse-1",
      warehouseId: "warehouse-1",
      name: "Rack A1",
      code: "A1",
      status: "active"
    });

    expect(location.createdAt).toBeTruthy();
  });

  it("updates warehouse location status", () => {
    const location = createWarehouseLocation(
      "warehouse-1",
      "Rack A1",
      "A1"
    );

    const updated = updateWarehouseLocationStatus(
      location,
      "inactive"
    );

    expect(updated.status).toBe("inactive");
  });

  it("filters active warehouses", () => {
    const active = createWarehouse(
      "Active Warehouse",
      "Batam"
    );

    const inactive = updateWarehouseStatus(
      createWarehouse(
        "Inactive Warehouse",
        "Jakarta"
      ),
      "inactive"
    );

    const result = filterActiveWarehouses([
      active,
      inactive
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });

  it("filters active warehouse locations", () => {
    const active = createWarehouseLocation(
      "warehouse-1",
      "Rack A1",
      "A1"
    );

    const inactive = updateWarehouseLocationStatus(
      createWarehouseLocation(
        "warehouse-1",
        "Rack A2",
        "A2"
      ),
      "inactive"
    );

    const result = filterActiveWarehouseLocations([
      active,
      inactive
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });
});