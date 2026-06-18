import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildFinancialHealthScoreSummary,
  calculateAverageFinancialHealthScore,
  calculateOverallFinancialHealthScore,
  createFinancialHealthScore,
  determineFinancialHealthGrade,
  getFinancialHealthScoresByGrade,
  getHighestFinancialHealthScore,
  getLowestFinancialHealthScore,
  updateFinancialHealthScore
} from "../services/financialHealthScoreService";

import type {
  FinancialHealthScore
} from "../types/finance.types";

const assessments: FinancialHealthScore[] = [
  {
    id: "health-1",
    companyName: "Monster ERP Alpha",
    liquidityScore: 90,
    profitabilityScore: 88,
    solvencyScore: 86,
    efficiencyScore: 84,
    cashFlowScore: 92,
    overallScore: 88,
    grade: "EXCELLENT",
    assessmentDate: "2026-01-01",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "health-2",
    companyName: "Monster ERP Beta",
    liquidityScore: 75,
    profitabilityScore: 70,
    solvencyScore: 72,
    efficiencyScore: 68,
    cashFlowScore: 75,
    overallScore: 72,
    grade: "GOOD",
    assessmentDate: "2026-02-01",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01"
  },
  {
    id: "health-3",
    companyName: "Monster ERP Gamma",
    liquidityScore: 55,
    profitabilityScore: 50,
    solvencyScore: 52,
    efficiencyScore: 48,
    cashFlowScore: 55,
    overallScore: 52,
    grade: "FAIR",
    assessmentDate: "2026-03-01",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01"
  },
  {
    id: "health-4",
    companyName: "Monster ERP Delta",
    liquidityScore: 40,
    profitabilityScore: 35,
    solvencyScore: 45,
    efficiencyScore: 30,
    cashFlowScore: 25,
    overallScore: 35,
    grade: "POOR",
    assessmentDate: "2026-04-01",
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01"
  }
];

describe("financialHealthScoreService", () => {
  it("calculates overall financial health score", () => {
    expect(
      calculateOverallFinancialHealthScore(
        90,
        80,
        70,
        60,
        50
      )
    ).toBe(70);
  });

  it("determines excellent grade", () => {
    expect(
      determineFinancialHealthGrade(90)
    ).toBe("EXCELLENT");
  });

  it("determines good grade", () => {
    expect(
      determineFinancialHealthGrade(75)
    ).toBe("GOOD");
  });

  it("determines fair grade", () => {
    expect(
      determineFinancialHealthGrade(55)
    ).toBe("FAIR");
  });

  it("determines poor grade", () => {
    expect(
      determineFinancialHealthGrade(40)
    ).toBe("POOR");
  });

  it("creates financial health score", () => {
    const result =
      createFinancialHealthScore({
        id: "health-new",
        companyName: "Monster ERP New",
        liquidityScore: 90,
        profitabilityScore: 80,
        solvencyScore: 70,
        efficiencyScore: 60,
        cashFlowScore: 50,
        assessmentDate: "2026-05-01",
        createdAt: "2026-05-01",
        updatedAt: "2026-05-01"
      });

    expect(result).toEqual({
      id: "health-new",
      companyName: "Monster ERP New",
      liquidityScore: 90,
      profitabilityScore: 80,
      solvencyScore: 70,
      efficiencyScore: 60,
      cashFlowScore: 50,
      overallScore: 70,
      grade: "GOOD",
      assessmentDate: "2026-05-01",
      createdAt: "2026-05-01",
      updatedAt: "2026-05-01"
    });
  });

  it("updates financial health score", () => {
    const updated =
      updateFinancialHealthScore(
        assessments[3],
        {
          liquidityScore: 80,
          profitabilityScore: 80,
          solvencyScore: 80,
          efficiencyScore: 80,
          cashFlowScore: 80,
          updatedAt: "2026-06-01"
        }
      );

    expect(updated.overallScore).toBe(80);
    expect(updated.grade).toBe("GOOD");
  });

  it("gets financial health scores by grade", () => {
    expect(
      getFinancialHealthScoresByGrade(
        assessments,
        "EXCELLENT"
      )
    ).toHaveLength(1);
  });

  it("gets highest financial health score", () => {
    expect(
      getHighestFinancialHealthScore(
        assessments
      )?.id
    ).toBe("health-1");
  });

  it("gets lowest financial health score", () => {
    expect(
      getLowestFinancialHealthScore(
        assessments
      )?.id
    ).toBe("health-4");
  });

  it("calculates average financial health score", () => {
    expect(
      calculateAverageFinancialHealthScore(
        assessments
      )
    ).toBe(61.75);
  });

  it("returns zero average financial health score when empty", () => {
    expect(
      calculateAverageFinancialHealthScore([])
    ).toBe(0);
  });

  it("builds financial health score summary", () => {
    expect(
      buildFinancialHealthScoreSummary(
        assessments
      )
    ).toEqual({
      totalAssessments: 4,
      averageScore: 61.75,
      highestScore: 88,
      lowestScore: 35,
      poorCount: 1,
      fairCount: 1,
      goodCount: 1,
      excellentCount: 1
    });
  });

  it("builds empty financial health score summary", () => {
    expect(
      buildFinancialHealthScoreSummary([])
    ).toEqual({
      totalAssessments: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      poorCount: 0,
      fairCount: 0,
      goodCount: 0,
      excellentCount: 0
    });
  });
});