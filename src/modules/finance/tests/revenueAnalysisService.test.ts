import {
  describe,
  expect,
  it
} from "vitest";

import type {
  RevenueAnalysis
} from "../types/finance.types";

import {
  buildRevenueAnalysisSummary,
  calculateAverageRevenue,
  calculateRevenueGrowthPercentage,
  calculateRevenueVolatilityPercentage,
  createRevenueAnalysis,
  determineRevenueTrend,
  updateRevenueAnalysis
} from "../services/revenueAnalysisService";

const analyses: RevenueAnalysis[] = [
  {
    id: "revenue-1",
    period: "2026-Q1",
    currentRevenue: 100000000,
    previousRevenue: 80000000,
    revenueGrowthPercentage: 25,
    monthlyAverageRevenue: 33333333.33,
    highestRevenue: 40000000,
    lowestRevenue: 25000000,
    revenueVolatilityPercentage: 18.71,
    trend: "STRONG_GROWTH",
    notes: "Strong start",
    createdAt: "2026-03-31",
    updatedAt: "2026-03-31"
  },
  {
    id: "revenue-2",
    period: "2026-Q2",
    currentRevenue: 120000000,
    previousRevenue: 100000000,
    revenueGrowthPercentage: 20,
    monthlyAverageRevenue: 40000000,
    highestRevenue: 45000000,
    lowestRevenue: 35000000,
    revenueVolatilityPercentage: 10.21,
    trend: "STRONG_GROWTH",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30"
  },
  {
    id: "revenue-3",
    period: "2026-Q3",
    currentRevenue: 90000000,
    previousRevenue: 120000000,
    revenueGrowthPercentage: -25,
    monthlyAverageRevenue: 30000000,
    highestRevenue: 35000000,
    lowestRevenue: 25000000,
    revenueVolatilityPercentage: 13.61,
    trend: "STRONG_DECLINE",
    createdAt: "2026-09-30",
    updatedAt: "2026-09-30"
  }
];

describe("revenueAnalysisService", () => {
  it("calculates positive revenue growth", () => {
    expect(
      calculateRevenueGrowthPercentage(
        120000000,
        100000000
      )
    ).toBe(20);
  });

  it("calculates negative revenue growth", () => {
    expect(
      calculateRevenueGrowthPercentage(
        90000000,
        120000000
      )
    ).toBe(-25);
  });

  it("returns zero growth when previous revenue is zero", () => {
    expect(
      calculateRevenueGrowthPercentage(
        100000000,
        0
      )
    ).toBe(0);
  });

  it("calculates average revenue", () => {
    expect(
      calculateAverageRevenue([
        100000000,
        120000000,
        90000000
      ])
    ).toBe(103333333.33);
  });

  it("returns zero average revenue when empty", () => {
    expect(
      calculateAverageRevenue([])
    ).toBe(0);
  });

  it("calculates revenue volatility", () => {
    expect(
      calculateRevenueVolatilityPercentage([
        25000000,
        35000000,
        40000000
      ])
    ).toBe(18.71);
  });

  it("returns zero volatility for one value", () => {
    expect(
      calculateRevenueVolatilityPercentage([
        100000000
      ])
    ).toBe(0);
  });

  it("determines strong growth trend", () => {
    expect(
      determineRevenueTrend(25)
    ).toBe("STRONG_GROWTH");
  });

  it("determines growth trend", () => {
    expect(
      determineRevenueTrend(10)
    ).toBe("GROWTH");
  });

  it("determines stable trend", () => {
    expect(
      determineRevenueTrend(0)
    ).toBe("STABLE");
  });

  it("determines decline trend", () => {
    expect(
      determineRevenueTrend(-10)
    ).toBe("DECLINE");
  });

  it("determines strong decline trend", () => {
    expect(
      determineRevenueTrend(-25)
    ).toBe("STRONG_DECLINE");
  });

  it("creates revenue analysis", () => {
    const result =
      createRevenueAnalysis({
        id: "revenue-new",
        period: "2026-Q4",
        currentRevenue: 150000000,
        previousRevenue: 120000000,
        revenues: [
          45000000,
          50000000,
          55000000
        ],
        notes: "Q4 growth",
        createdAt: "2026-12-31",
        updatedAt: "2026-12-31"
      });

    expect(result).toEqual({
      id: "revenue-new",
      period: "2026-Q4",
      currentRevenue: 150000000,
      previousRevenue: 120000000,
      revenueGrowthPercentage: 25,
      monthlyAverageRevenue: 50000000,
      highestRevenue: 55000000,
      lowestRevenue: 45000000,
      revenueVolatilityPercentage: 8.16,
      trend: "STRONG_GROWTH",
      notes: "Q4 growth",
      createdAt: "2026-12-31",
      updatedAt: "2026-12-31"
    });
  });

  it("updates revenue analysis", () => {
    const updated =
      updateRevenueAnalysis(
        analyses[2],
        {
          currentRevenue: 130000000,
          previousRevenue: 90000000,
          revenues: [
            40000000,
            45000000,
            45000000
          ],
          updatedAt: "2026-10-01"
        }
      );

    expect(
      updated.revenueGrowthPercentage
    ).toBe(44.44);

    expect(updated.trend).toBe(
      "STRONG_GROWTH"
    );
  });

  it("builds revenue analysis summary", () => {
    expect(
      buildRevenueAnalysisSummary(
        analyses
      )
    ).toEqual({
      totalRevenue: 310000000,
      averageRevenue: 103333333.33,
      revenueGrowthPercentage: -10,
      highestRevenue: 120000000,
      lowestRevenue: 90000000,
      revenueVolatilityPercentage: 12.07,
      trend: "DECLINE"
    });
  });

  it("builds empty revenue analysis summary", () => {
    expect(
      buildRevenueAnalysisSummary([])
    ).toEqual({
      totalRevenue: 0,
      averageRevenue: 0,
      revenueGrowthPercentage: 0,
      highestRevenue: 0,
      lowestRevenue: 0,
      revenueVolatilityPercentage: 0,
      trend: "STABLE"
    });
  });
});