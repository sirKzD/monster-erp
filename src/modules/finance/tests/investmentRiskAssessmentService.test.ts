import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildInvestmentRiskSummary,
  calculateAverageRiskScore,
  calculateInvestmentRiskScore,
  createInvestmentRiskAssessment,
  determineInvestmentRiskLevel,
  getAssessmentsByPortfolio,
  getHighRiskAssessments,
  updateInvestmentRiskAssessment
} from "../services/investmentRiskAssessmentService";

import type {
  InvestmentRiskAssessment
} from "../types/finance.types";

const assessments: InvestmentRiskAssessment[] = [
  {
    id: "risk-1",
    portfolioId: "portfolio-1",
    riskScore: 22,
    riskLevel: "low",
    volatilityPercentage: 20,
    maxDrawdownPercentage: 20,
    concentrationRiskPercentage: 28,
    liquidityRiskLevel: "low",
    evaluationDate: "2026-01-01",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01"
  },
  {
    id: "risk-2",
    portfolioId: "portfolio-1",
    riskScore: 50,
    riskLevel: "medium",
    volatilityPercentage: 50,
    maxDrawdownPercentage: 50,
    concentrationRiskPercentage: 50,
    liquidityRiskLevel: "medium",
    evaluationDate: "2026-02-01",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01"
  },
  {
    id: "risk-3",
    portfolioId: "portfolio-2",
    riskScore: 80,
    riskLevel: "high",
    volatilityPercentage: 80,
    maxDrawdownPercentage: 80,
    concentrationRiskPercentage: 80,
    liquidityRiskLevel: "high",
    evaluationDate: "2026-03-01",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01"
  }
];

describe("investmentRiskAssessmentService", () => {
  it("determines low risk level", () => {
    expect(
      determineInvestmentRiskLevel(20)
    ).toBe("low");
  });

  it("determines medium risk level", () => {
    expect(
      determineInvestmentRiskLevel(50)
    ).toBe("medium");
  });

  it("determines high risk level", () => {
    expect(
      determineInvestmentRiskLevel(80)
    ).toBe("high");
  });

  it("calculates investment risk score", () => {
    expect(
      calculateInvestmentRiskScore(
        50,
        40,
        30
      )
    ).toBe(41.5);
  });

  it("creates investment risk assessment", () => {
    const assessment =
      createInvestmentRiskAssessment({
        id: "risk-new",
        portfolioId: "portfolio-new",
        volatilityPercentage: 50,
        maxDrawdownPercentage: 40,
        concentrationRiskPercentage: 30,
        liquidityRiskLevel: "medium",
        evaluationDate: "2026-04-01",
        createdAt: "2026-04-01",
        updatedAt: "2026-04-01"
      });

    expect(assessment).toEqual({
      id: "risk-new",
      portfolioId: "portfolio-new",
      riskScore: 41.5,
      riskLevel: "medium",
      volatilityPercentage: 50,
      maxDrawdownPercentage: 40,
      concentrationRiskPercentage: 30,
      liquidityRiskLevel: "medium",
      evaluationDate: "2026-04-01",
      createdAt: "2026-04-01",
      updatedAt: "2026-04-01"
    });
  });

  it("updates investment risk assessment", () => {
    const updated =
      updateInvestmentRiskAssessment(
        assessments[0],
        {
          volatilityPercentage: 90,
          maxDrawdownPercentage: 90,
          concentrationRiskPercentage: 90,
          updatedAt: "2026-05-01"
        }
      );

    expect(
      updated.riskLevel
    ).toBe("high");

    expect(
      updated.riskScore
    ).toBe(90);
  });

  it("gets high risk assessments", () => {
    expect(
      getHighRiskAssessments(
        assessments
      )
    ).toHaveLength(1);
  });

  it("gets assessments by portfolio", () => {
    expect(
      getAssessmentsByPortfolio(
        "portfolio-1",
        assessments
      )
    ).toHaveLength(2);
  });

  it("calculates average risk score", () => {
    expect(
      calculateAverageRiskScore(
        assessments
      )
    ).toBe(50.67);
  });

  it("returns zero average risk score when empty", () => {
    expect(
      calculateAverageRiskScore([])
    ).toBe(0);
  });

  it("builds investment risk summary", () => {
    expect(
      buildInvestmentRiskSummary(
        assessments
      )
    ).toEqual({
      totalAssessments: 3,
      averageRiskScore: 50.67,
      lowRiskCount: 1,
      mediumRiskCount: 1,
      highRiskCount: 1
    });
  });

  it("builds empty investment risk summary", () => {
    expect(
      buildInvestmentRiskSummary([])
    ).toEqual({
      totalAssessments: 0,
      averageRiskScore: 0,
      lowRiskCount: 0,
      mediumRiskCount: 0,
      highRiskCount: 0
    });
  });
});