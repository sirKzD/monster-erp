import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildLiquiditySummary,
  calculateLiquidityAnalysisRatio,
  calculateNetLiquidityPosition,
  calculateTotalLiquidAssets,
  calculateTotalShortTermObligations,
  createLiquidityAnalysis,
  determineLiquidityStatus
} from "../services/liquidityAnalysisService";

import type {
  LiquidityAnalysis
} from "../types/finance.types";

const analyses: LiquidityAnalysis[] = [
  {
    id: "liquidity-1",
    period: "2026-Q1",
    cashBalance: 10000000,
    bankBalance: 40000000,
    receivablesDueSoon: 20000000,
    payablesDueSoon: 15000000,
    shortTermDebt: 10000000,
    operatingCashOutflow: 5000000,
    liquidityRatio: 2.33,
    netLiquidityPosition: 40000000,
    status: "strong",
    analyzedAt: "2026-03-31"
  },
  {
    id: "liquidity-2",
    period: "2026-Q2",
    cashBalance: 5000000,
    bankBalance: 15000000,
    receivablesDueSoon: 10000000,
    payablesDueSoon: 12000000,
    shortTermDebt: 8000000,
    operatingCashOutflow: 5000000,
    liquidityRatio: 1.2,
    netLiquidityPosition: 5000000,
    status: "stable",
    analyzedAt: "2026-06-30"
  },
  {
    id: "liquidity-3",
    period: "2026-Q3",
    cashBalance: 2000000,
    bankBalance: 8000000,
    receivablesDueSoon: 5000000,
    payablesDueSoon: 10000000,
    shortTermDebt: 8000000,
    operatingCashOutflow: 4000000,
    liquidityRatio: 0.68,
    netLiquidityPosition: -7000000,
    status: "critical",
    analyzedAt: "2026-09-30"
  }
];

describe("liquidityAnalysisService", () => {
  it("calculates total liquid assets", () => {
    expect(
      calculateTotalLiquidAssets(
        10000000,
        40000000,
        20000000
      )
    ).toBe(70000000);
  });

  it("calculates total short term obligations", () => {
    expect(
      calculateTotalShortTermObligations(
        15000000,
        10000000,
        5000000
      )
    ).toBe(30000000);
  });

  it("calculates net liquidity position", () => {
    expect(
      calculateNetLiquidityPosition(
        70000000,
        30000000
      )
    ).toBe(40000000);
  });

  it("calculates liquidity ratio", () => {
    expect(
      calculateLiquidityAnalysisRatio(
        70000000,
        30000000
      )
    ).toBe(2.33);
  });

  it("returns zero liquidity ratio when obligations are zero", () => {
    expect(
      calculateLiquidityAnalysisRatio(
        70000000,
        0
      )
    ).toBe(0);
  });

  it("determines strong liquidity status", () => {
    expect(
      determineLiquidityStatus(2.1)
    ).toBe("strong");
  });

  it("determines stable liquidity status", () => {
    expect(
      determineLiquidityStatus(1.5)
    ).toBe("stable");
  });

  it("determines tight liquidity status", () => {
    expect(
      determineLiquidityStatus(0.9)
    ).toBe("tight");
  });

  it("determines critical liquidity status", () => {
    expect(
      determineLiquidityStatus(0.5)
    ).toBe("critical");
  });

  it("creates liquidity analysis", () => {
    expect(
      createLiquidityAnalysis({
        id: "liquidity-new",
        period: "2026-Q4",
        cashBalance: 10000000,
        bankBalance: 20000000,
        receivablesDueSoon: 15000000,
        payablesDueSoon: 10000000,
        shortTermDebt: 10000000,
        operatingCashOutflow: 5000000,
        analyzedAt: "2026-12-31"
      })
    ).toEqual({
      id: "liquidity-new",
      period: "2026-Q4",
      cashBalance: 10000000,
      bankBalance: 20000000,
      receivablesDueSoon: 15000000,
      payablesDueSoon: 10000000,
      shortTermDebt: 10000000,
      operatingCashOutflow: 5000000,
      liquidityRatio: 1.8,
      netLiquidityPosition: 20000000,
      status: "stable",
      analyzedAt: "2026-12-31"
    });
  });

  it("builds liquidity summary", () => {
    expect(
      buildLiquiditySummary(
        analyses
      )
    ).toEqual({
      totalLiquidAssets: 115000000,
      totalShortTermObligations: 77000000,
      netLiquidityPosition: 38000000,
      liquidityRatio: 1.49,
      status: "stable"
    });
  });

  it("builds empty liquidity summary", () => {
    expect(
      buildLiquiditySummary([])
    ).toEqual({
      totalLiquidAssets: 0,
      totalShortTermObligations: 0,
      netLiquidityPosition: 0,
      liquidityRatio: 0,
      status: "critical"
    });
  });
});