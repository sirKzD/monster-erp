import {
  describe,
  expect,
  it
} from "vitest";

import type {
  ProfitabilityAnalysis
} from "../types/finance.types";

import {
  buildProfitabilityAnalysisSummary,
  calculateAverageProfitabilityMetric,
  calculateGrossProfit,
  calculateNetProfit,
  calculateOperatingProfit,
  calculateProfitabilityPercentage,
  calculateProfitabilityScore,
  createProfitabilityAnalysis,
  determineProfitabilityGrade,
  getProfitabilityAnalysesByGrade,
  updateProfitabilityAnalysis
} from "../services/profitabilityAnalysisService";

const analyses: ProfitabilityAnalysis[] = [
  {
    id: "profit-1",
    period: "2026-Q1",
    revenue: 100000000,
    costOfGoodsSold: 40000000,
    operatingExpenses: 20000000,
    totalAssets: 200000000,
    totalEquity: 100000000,
    grossProfit: 60000000,
    operatingProfit: 40000000,
    netProfit: 40000000,
    grossProfitMargin: 60,
    operatingProfitMargin: 40,
    netProfitMargin: 40,
    returnOnAssets: 20,
    returnOnEquity: 40,
    profitabilityScore: 41,
    grade: "MODERATE",
    analysisDate: "2026-03-31",
    createdAt: "2026-03-31",
    updatedAt: "2026-03-31"
  },
  {
    id: "profit-2",
    period: "2026-Q2",
    revenue: 200000000,
    costOfGoodsSold: 50000000,
    operatingExpenses: 20000000,
    totalAssets: 200000000,
    totalEquity: 100000000,
    grossProfit: 150000000,
    operatingProfit: 130000000,
    netProfit: 130000000,
    grossProfitMargin: 75,
    operatingProfitMargin: 65,
    netProfitMargin: 65,
    returnOnAssets: 65,
    returnOnEquity: 130,
    profitabilityScore: 80,
    grade: "EXCELLENT",
    analysisDate: "2026-06-30",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30"
  },
  {
    id: "profit-3",
    period: "2026-Q3",
    revenue: 100000000,
    costOfGoodsSold: 70000000,
    operatingExpenses: 20000000,
    totalAssets: 200000000,
    totalEquity: 100000000,
    grossProfit: 30000000,
    operatingProfit: 10000000,
    netProfit: 10000000,
    grossProfitMargin: 30,
    operatingProfitMargin: 10,
    netProfitMargin: 10,
    returnOnAssets: 5,
    returnOnEquity: 10,
    profitabilityScore: 13.25,
    grade: "LOW",
    analysisDate: "2026-09-30",
    createdAt: "2026-09-30",
    updatedAt: "2026-09-30"
  }
];

describe("profitabilityAnalysisService", () => {
  it("calculates gross profit", () => {
    expect(
      calculateGrossProfit(
        100000000,
        40000000
      )
    ).toBe(60000000);
  });

  it("calculates operating profit", () => {
    expect(
      calculateOperatingProfit(
        60000000,
        20000000
      )
    ).toBe(40000000);
  });

  it("calculates net profit", () => {
    expect(
      calculateNetProfit(
        100000000,
        40000000,
        20000000
      )
    ).toBe(40000000);
  });

  it("calculates profitability percentage", () => {
    expect(
      calculateProfitabilityPercentage(
        40000000,
        100000000
      )
    ).toBe(40);
  });

  it("returns zero percentage when base is zero", () => {
    expect(
      calculateProfitabilityPercentage(
        40000000,
        0
      )
    ).toBe(0);
  });

  it("calculates profitability score", () => {
    expect(
      calculateProfitabilityScore(
        60,
        40,
        40,
        20,
        40
      )
    ).toBe(41);
  });

  it("determines excellent grade", () => {
    expect(
      determineProfitabilityGrade(85)
    ).toBe("EXCELLENT");
  });

  it("determines good grade", () => {
    expect(
      determineProfitabilityGrade(65)
    ).toBe("GOOD");
  });

  it("determines moderate grade", () => {
    expect(
      determineProfitabilityGrade(45)
    ).toBe("MODERATE");
  });

  it("determines low grade", () => {
    expect(
      determineProfitabilityGrade(20)
    ).toBe("LOW");
  });

  it("creates profitability analysis", () => {
    const result =
      createProfitabilityAnalysis({
        id: "profit-new",
        period: "2026-Q4",
        revenue: 100000000,
        costOfGoodsSold: 40000000,
        operatingExpenses: 20000000,
        totalAssets: 200000000,
        totalEquity: 100000000,
        analysisDate: "2026-12-31",
        createdAt: "2026-12-31",
        updatedAt: "2026-12-31"
      });

    expect(result.grossProfit).toBe(
      60000000
    );
    expect(result.netProfitMargin).toBe(
      40
    );
    expect(result.grade).toBe(
      "MODERATE"
    );
  });

  it("updates profitability analysis", () => {
    const updated =
      updateProfitabilityAnalysis(
        analyses[2],
        {
          revenue: 200000000,
          costOfGoodsSold: 50000000,
          operatingExpenses: 20000000,
          updatedAt: "2026-10-01"
        }
      );

    expect(updated.netProfit).toBe(
      130000000
    );

    expect(updated.profitabilityScore).toBe(
        80
    );
    
    expect(updated.grade).toBe(
      "EXCELLENT"
    );
  });

  it("gets profitability analyses by grade", () => {
    expect(
      getProfitabilityAnalysesByGrade(
        analyses,
        "EXCELLENT"
      )
    ).toHaveLength(1);
  });

  it("calculates average profitability metric", () => {
    expect(
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.netProfitMargin
      )
    ).toBe(38.33);
  });

  it("returns zero average metric when empty", () => {
    expect(
      calculateAverageProfitabilityMetric(
        [],
        analysis =>
          analysis.netProfitMargin
      )
    ).toBe(0);
  });

  it("builds profitability analysis summary", () => {
    expect(
      buildProfitabilityAnalysisSummary(
        analyses
      )
    ).toEqual({
      totalAnalyses: 3,
      averageGrossProfitMargin: 55,
      averageOperatingProfitMargin: 38.33,
      averageNetProfitMargin: 38.33,
      averageReturnOnAssets: 30,
      averageReturnOnEquity: 60,
      averageProfitabilityScore: 44.75,
      lowCount: 1,
      moderateCount: 1,
      goodCount: 0,
      excellentCount: 1
    });
  });

  it("builds empty profitability analysis summary", () => {
    expect(
      buildProfitabilityAnalysisSummary([])
    ).toEqual({
      totalAnalyses: 0,
      averageGrossProfitMargin: 0,
      averageOperatingProfitMargin: 0,
      averageNetProfitMargin: 0,
      averageReturnOnAssets: 0,
      averageReturnOnEquity: 0,
      averageProfitabilityScore: 0,
      lowCount: 0,
      moderateCount: 0,
      goodCount: 0,
      excellentCount: 0
    });
  });
});