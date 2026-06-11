import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createCycleCount,
  hasVariance,
  filterVarianceCounts
} from "../services/cycleCountService";

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
    randomUUID: () => "cycle-1"
  });
});

describe("cycleCountService", () => {
  it("creates matched cycle count", () => {
    const count = createCycleCount(
      movements,
      "product-1",
      "warehouse-1",
      80
    );

    expect(count).toMatchObject({
      id: "cycle-1",
      systemStock: 80,
      countedStock: 80,
      variance: 0,
      status: "matched"
    });

    expect(count.countedAt).toBeTruthy();
  });

  it("creates variance cycle count", () => {
    const count = createCycleCount(
      movements,
      "product-1",
      "warehouse-1",
      75
    );

    expect(count.variance).toBe(-5);
    expect(count.status).toBe("variance");
  });

  it("detects variance", () => {
    const count = createCycleCount(
      movements,
      "product-1",
      "warehouse-1",
      75
    );

    expect(
      hasVariance(count)
    ).toBe(true);
  });

  it("filters variance counts", () => {
    const matched = createCycleCount(
      movements,
      "product-1",
      "warehouse-1",
      80
    );

    const variance = createCycleCount(
      movements,
      "product-1",
      "warehouse-1",
      75
    );

    const result =
      filterVarianceCounts([
        matched,
        variance
      ]);

    expect(result).toHaveLength(1);
    expect(result[0].variance).toBe(-5);
  });
});