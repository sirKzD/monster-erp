import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createTransferMovements
} from "../services/inventoryTransferService";

import type {
  StockMovement
} from "../types/inventory.types";

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-a",
    type: "in",
    quantity: 100,
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

let idCounter = 0;

beforeEach(() => {
  idCounter = 0;

  vi.stubGlobal("crypto", {
    randomUUID: () => {
      idCounter += 1;
      return `transfer-${idCounter}`;
    }
  });
});

describe("inventoryTransferService", () => {
  it("creates out and in movements for transfer", () => {
    const result = createTransferMovements(
      movements,
      "product-1",
      "warehouse-a",
      "warehouse-b",
      30
    );

    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);

    expect(result?.[0]).toMatchObject({
      id: "transfer-1",
      productId: "product-1",
      warehouseId: "warehouse-a",
      type: "out",
      quantity: 30
    });

    expect(result?.[1]).toMatchObject({
      id: "transfer-2",
      productId: "product-1",
      warehouseId: "warehouse-b",
      type: "in",
      quantity: 30
    });
  });

  it("blocks transfer when stock is not enough", () => {
    const result = createTransferMovements(
      movements,
      "product-1",
      "warehouse-a",
      "warehouse-b",
      101
    );

    expect(result).toBeNull();
  });

  it("blocks transfer to same warehouse", () => {
    const result = createTransferMovements(
      movements,
      "product-1",
      "warehouse-a",
      "warehouse-a",
      10
    );

    expect(result).toBeNull();
  });

  it("blocks zero or negative quantity", () => {
    expect(
      createTransferMovements(
        movements,
        "product-1",
        "warehouse-a",
        "warehouse-b",
        0
      )
    ).toBeNull();

    expect(
      createTransferMovements(
        movements,
        "product-1",
        "warehouse-a",
        "warehouse-b",
        -5
      )
    ).toBeNull();
  });
});