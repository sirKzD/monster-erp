import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildCapitalGainSummary,
  calculateCapitalGain,
  calculateCapitalGainPercentage,
  calculateTotalCapitalGain,
  createCapitalGainRecord,
  getBestCapitalGainRecord,
  getRealizedCapitalGains,
  getUnrealizedCapitalGains,
  getWorstCapitalGainRecord,
  updateCapitalGainCurrentValue
} from "../services/capitalGainAnalysisService";

import type {
  CapitalGainRecord
} from "../types/finance.types";

const records: CapitalGainRecord[] = [
  {
    id: "gain-1",
    investmentId: "investment-1",
    purchaseAmount: 100000000,
    currentValue: 120000000,
    realized: true
  },
  {
    id: "gain-2",
    investmentId: "investment-2",
    purchaseAmount: 50000000,
    currentValue: 45000000,
    realized: false
  },
  {
    id: "gain-3",
    investmentId: "investment-3",
    purchaseAmount: 30000000,
    currentValue: 39000000,
    realized: false
  }
];

describe("capitalGainAnalysisService", () => {
  it("creates capital gain record", () => {
    expect(
      createCapitalGainRecord(
        records[0]
      )
    ).toEqual(records[0]);
  });

  it("updates current value", () => {
    const record =
      updateCapitalGainCurrentValue(
        records[0],
        125000000
      );

    expect(
      record.currentValue
    ).toBe(125000000);
  });

  it("calculates positive capital gain", () => {
    expect(
      calculateCapitalGain(
        records[0]
      )
    ).toBe(20000000);
  });

  it("calculates capital loss", () => {
    expect(
      calculateCapitalGain(
        records[1]
      )
    ).toBe(-5000000);
  });

  it("calculates capital gain percentage", () => {
    expect(
      calculateCapitalGainPercentage(
        records[0]
      )
    ).toBe(20);
  });

  it("returns zero percentage when purchase amount is zero", () => {
    expect(
      calculateCapitalGainPercentage({
        ...records[0],
        purchaseAmount: 0
      })
    ).toBe(0);
  });

  it("gets realized capital gains", () => {
    expect(
      getRealizedCapitalGains(
        records
      )
    ).toHaveLength(1);
  });

  it("gets unrealized capital gains", () => {
    expect(
      getUnrealizedCapitalGains(
        records
      )
    ).toHaveLength(2);
  });

  it("calculates total capital gain", () => {
    expect(
      calculateTotalCapitalGain(
        records
      )
    ).toBe(24000000);
  });

  it("gets best capital gain record", () => {
    expect(
      getBestCapitalGainRecord(
        records
      )?.id
    ).toBe("gain-3");
  });

  it("gets worst capital gain record", () => {
    expect(
      getWorstCapitalGainRecord(
        records
      )?.id
    ).toBe("gain-2");
  });

  it("builds capital gain summary", () => {
    expect(
      buildCapitalGainSummary(
        records
      )
    ).toEqual({
      totalCost: 180000000,
      totalMarketValue: 204000000,
      totalGain: 24000000,
      gainPercentage: 13.33
    });
  });

  it("handles empty records", () => {
    expect(
      buildCapitalGainSummary([])
    ).toEqual({
      totalCost: 0,
      totalMarketValue: 0,
      totalGain: 0,
      gainPercentage: 0
    });
  });
});