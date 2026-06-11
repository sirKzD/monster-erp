import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createInventoryAuditResult,
  createAuditAdjustmentMovement
} from "../services/inventoryAuditService";

import type {
  StockMovement
} from "../types/inventory.types";

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 100,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "move-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "out",
    quantity: 20,
    createdAt: "2026-01-02T00:00:00.000Z"
  }
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "audit-adjustment-1"
  });
});

describe("inventoryAuditService", () => {
  it("creates matched audit result", () => {
    const audit = createInventoryAuditResult(
      movements,
      "product-1",
      "warehouse-1",
      80
    );

    expect(audit).toEqual({
      productId: "product-1",
      warehouseId: "warehouse-1",
      systemStock: 80,
      physicalStock: 80,
      variance: 0,
      status: "matched"
    });
  });

  it("creates shortage audit result", () => {
    const audit = createInventoryAuditResult(
      movements,
      "product-1",
      "warehouse-1",
      75
    );

    expect(audit.variance).toBe(-5);
    expect(audit.status).toBe("shortage");
  });

  it("creates overage audit result", () => {
    const audit = createInventoryAuditResult(
      movements,
      "product-1",
      "warehouse-1",
      90
    );

    expect(audit.variance).toBe(10);
    expect(audit.status).toBe("overage");
  });

  it("creates adjustment movement for shortage", () => {
    const audit = createInventoryAuditResult(
      movements,
      "product-1",
      "warehouse-1",
      75
    );

    const movement = createAuditAdjustmentMovement(audit);

    expect(movement).toMatchObject({
      id: "audit-adjustment-1",
      productId: "product-1",
      warehouseId: "warehouse-1",
      type: "out",
      quantity: 5
    });

    expect(movement?.createdAt).toBeTruthy();
  });

  it("creates adjustment movement for overage", () => {
    const audit = createInventoryAuditResult(
      movements,
      "product-1",
      "warehouse-1",
      90
    );

    const movement = createAuditAdjustmentMovement(audit);

    expect(movement).toMatchObject({
      type: "in",
      quantity: 10
    });
  });

  it("does not create adjustment movement when matched", () => {
    const audit = createInventoryAuditResult(
      movements,
      "product-1",
      "warehouse-1",
      80
    );

    const movement = createAuditAdjustmentMovement(audit);

    expect(movement).toBeNull();
  });
});