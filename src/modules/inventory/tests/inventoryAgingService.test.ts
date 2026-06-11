import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateAgeDays,
  classifyInventoryAge,
  createInventoryAgingItem,
  createInventoryAgingReport,
  filterAgingItemsByStatus
} from "../services/inventoryAgingService";

import type {
  ProductLot
} from "../types/inventory.types";

const lots: ProductLot[] = [
  {
    id: "lot-1",
    productId: "product-1",
    lotNumber: "LOT-001",
    quantity: 100,
    receivedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "lot-2",
    productId: "product-1",
    lotNumber: "LOT-002",
    quantity: 50,
    receivedAt: "2026-02-15T00:00:00.000Z"
  },
  {
    id: "lot-3",
    productId: "product-1",
    lotNumber: "LOT-003",
    quantity: 25,
    receivedAt: "2026-03-25T00:00:00.000Z"
  }
];

describe("inventoryAgingService", () => {
  it("calculates age days", () => {
    expect(
      calculateAgeDays(
        "2026-01-01T00:00:00.000Z",
        "2026-01-11T00:00:00.000Z"
      )
    ).toBe(10);
  });

  it("classifies fresh inventory", () => {
    expect(classifyInventoryAge(10)).toBe("fresh");
  });

  it("classifies aging inventory", () => {
    expect(classifyInventoryAge(45)).toBe("aging");
  });

  it("classifies old inventory", () => {
    expect(classifyInventoryAge(100)).toBe("old");
  });

  it("creates inventory aging item", () => {
    const item = createInventoryAgingItem(
      lots[0],
      "2026-04-01T00:00:00.000Z"
    );

    expect(item).toEqual({
      lotId: "lot-1",
      productId: "product-1",
      lotNumber: "LOT-001",
      quantity: 100,
      ageDays: 90,
      status: "old"
    });
  });

  it("creates inventory aging report", () => {
    const report = createInventoryAgingReport(
      lots,
      "2026-04-01T00:00:00.000Z"
    );

    expect(report).toHaveLength(3);
    expect(report[0].status).toBe("old");
    expect(report[1].status).toBe("aging");
    expect(report[2].status).toBe("fresh");
  });

  it("filters aging items by status", () => {
    const report = createInventoryAgingReport(
      lots,
      "2026-04-01T00:00:00.000Z"
    );

    const oldItems = filterAgingItemsByStatus(
      report,
      "old"
    );

    expect(oldItems).toHaveLength(1);
    expect(oldItems[0].status).toBe("old");
  });
});