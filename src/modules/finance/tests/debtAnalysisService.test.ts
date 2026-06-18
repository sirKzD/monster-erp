import { describe, expect, it } from "vitest";
import { debtAnalysisService } from "../services/debtAnalysisService";
import { DebtAnalysis } from "../types/finance.types";

describe("debtAnalysisService", () => {
  it("calculates debt ratio", () => {
    expect(
      debtAnalysisService.calculateDebtRatio(
        400000,
        1000000,
      ),
    ).toBe(0.4);
  });

  it("returns zero debt ratio when assets are zero", () => {
    expect(
      debtAnalysisService.calculateDebtRatio(
        400000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates debt to equity ratio", () => {
    expect(
      debtAnalysisService.calculateDebtToEquityRatio(
        400000,
        800000,
      ),
    ).toBe(0.5);
  });

  it("returns zero debt to equity ratio when equity is zero", () => {
    expect(
      debtAnalysisService.calculateDebtToEquityRatio(
        400000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates debt to asset ratio", () => {
    expect(
      debtAnalysisService.calculateDebtToAssetRatio(
        250000,
        1000000,
      ),
    ).toBe(0.25);
  });

  it("calculates interest coverage ratio", () => {
    expect(
      debtAnalysisService.calculateInterestCoverageRatio(
        500000,
        100000,
      ),
    ).toBe(5);
  });

  it("returns zero interest coverage when interest expense is zero", () => {
    expect(
      debtAnalysisService.calculateInterestCoverageRatio(
        500000,
        0,
      ),
    ).toBe(0);
  });

  it("classifies low debt risk", () => {
    expect(
      debtAnalysisService.determineDebtRiskLevel(0.3),
    ).toBe("LOW");
  });

  it("classifies moderate debt risk", () => {
    expect(
      debtAnalysisService.determineDebtRiskLevel(0.8),
    ).toBe("MODERATE");
  });

  it("classifies high debt risk", () => {
    expect(
      debtAnalysisService.determineDebtRiskLevel(1.5),
    ).toBe("HIGH");
  });

  it("classifies critical debt risk", () => {
    expect(
      debtAnalysisService.determineDebtRiskLevel(2.5),
    ).toBe("CRITICAL");
  });

  it("generates debt analysis summary", () => {
    const analysis: DebtAnalysis = {
      id: "DA-001",
      analysisDate: "2026-01-01",

      totalDebt: 400000,
      totalAssets: 1000000,
      totalEquity: 600000,

      ebit: 500000,
      interestExpense: 100000,

      debtRatio: 0.4,
      debtToEquityRatio: 0.67,
      debtToAssetRatio: 0.4,
      interestCoverageRatio: 5,

      riskLevel: "MODERATE",

      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const summary =
      debtAnalysisService.generateDebtAnalysisSummary(
        analysis,
      );

    expect(summary.riskLevel).toBe("MODERATE");
    expect(summary.totalDebt).toBe(400000);
  });
});