import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateStockAccuracy,
  calculateFulfillmentReadiness,
  calculateInventoryHealth,
  calculateInventoryGrade,
  createInventoryKpi
} from "../services/inventoryKpiService";

describe("inventoryKpiService", () => {

  it("calculates stock accuracy", () => {
    expect(
      calculateStockAccuracy(
        100,
        95
      )
    ).toBe(95);
  });

  it("calculates fulfillment readiness", () => {
    expect(
      calculateFulfillmentReadiness(
        45,
        50
      )
    ).toBe(90);
  });

  it("calculates inventory health", () => {
    expect(
      calculateInventoryHealth(
        95,
        90
      )
    ).toBe(93);
  });

  it("assigns grade A", () => {
    expect(
      calculateInventoryGrade(95)
    ).toBe("A");
  });

  it("assigns grade B", () => {
    expect(
      calculateInventoryGrade(80)
    ).toBe("B");
  });

  it("assigns grade C", () => {
    expect(
      calculateInventoryGrade(60)
    ).toBe("C");
  });

  it("creates inventory KPI", () => {
    expect(
      createInventoryKpi(
        95,
        90
      )
    ).toEqual({
      stockAccuracy: 95,
      fulfillmentReadiness: 90,
      inventoryHealth: 93,
      inventoryGrade: "A"
    });
  });
});