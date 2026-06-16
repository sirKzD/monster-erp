import {
  describe,
  expect,
  it
} from "vitest";

import {
  calculateAccumulatedDepreciation,
  calculateBookValue,
  generateDepreciationSchedule,
  getDepreciationAtMonth
} from "../services/assetDepreciationService";

import type {
  FixedAsset
} from "../types/finance.types";

const asset: FixedAsset = {
  id: "asset-1",
  name: "Laptop",
  acquisitionCost: 12000000,
  residualValue: 2000000,
  usefulLifeMonths: 10,
  status: "active",
  acquiredAt: "2026-01-01"
};

describe("assetDepreciationService", () => {
  it("calculates accumulated depreciation", () => {
    expect(
      calculateAccumulatedDepreciation(
        asset,
        3
      )
    ).toBe(3000000);
  });

  it("returns zero accumulated depreciation for zero month", () => {
    expect(
      calculateAccumulatedDepreciation(
        asset,
        0
      )
    ).toBe(0);
  });

  it("limits accumulated depreciation to depreciable amount", () => {
    expect(
      calculateAccumulatedDepreciation(
        asset,
        20
      )
    ).toBe(10000000);
  });

  it("calculates book value", () => {
    expect(
      calculateBookValue(
        asset,
        3
      )
    ).toBe(9000000);
  });

  it("does not reduce book value below residual value", () => {
    expect(
      calculateBookValue(
        asset,
        20
      )
    ).toBe(2000000);
  });

  it("generates depreciation schedule", () => {
    const schedule =
      generateDepreciationSchedule(asset);

    expect(schedule).toHaveLength(10);

    expect(schedule[0]).toEqual({
      assetId: "asset-1",
      month: 1,
      depreciationAmount: 1000000,
      accumulatedDepreciation: 1000000,
      bookValue: 11000000
    });

    expect(schedule[9]).toEqual({
      assetId: "asset-1",
      month: 10,
      depreciationAmount: 1000000,
      accumulatedDepreciation: 10000000,
      bookValue: 2000000
    });
  });

  it("gets depreciation at month", () => {
    expect(
      getDepreciationAtMonth(
        asset,
        5
      )
    ).toEqual({
      assetId: "asset-1",
      month: 5,
      depreciationAmount: 1000000,
      accumulatedDepreciation: 5000000,
      bookValue: 7000000
    });
  });

  it("returns null for invalid depreciation month", () => {
    expect(
      getDepreciationAtMonth(
        asset,
        0
      )
    ).toBeNull();

    expect(
      getDepreciationAtMonth(
        asset,
        11
      )
    ).toBeNull();
  });
});