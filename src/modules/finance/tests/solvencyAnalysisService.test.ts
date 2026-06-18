import { describe, expect, it } from "vitest";
import { solvencyAnalysisService } from "../services/solvencyAnalysisService";

describe("solvencyAnalysisService", () => {
  it("calculates debt to asset ratio", () => {
    expect(
      solvencyAnalysisService.calculateDebtToAssetRatio(
        100000,
        40000,
      ),
    ).toBe(40);
  });

  it("calculates debt to equity ratio", () => {
    expect(
      solvencyAnalysisService.calculateDebtToEquityRatio(
        60000,
        30000,
      ),
    ).toBe(50);
  });

  it("calculates equity ratio", () => {
    expect(
      solvencyAnalysisService.calculateEquityRatio(
        100000,
        60000,
      ),
    ).toBe(60);
  });

  it("calculates solvency ratio", () => {
    expect(
      solvencyAnalysisService.calculateSolvencyRatio(
        60000,
        30000,
      ),
    ).toBe(200);
  });

  it("returns EXCELLENT", () => {
    expect(
      solvencyAnalysisService.determineSolvencyLevel(120),
    ).toBe("EXCELLENT");
  });

  it("returns GOOD", () => {
    expect(
      solvencyAnalysisService.determineSolvencyLevel(80),
    ).toBe("GOOD");
  });

  it("returns MODERATE", () => {
    expect(
      solvencyAnalysisService.determineSolvencyLevel(55),
    ).toBe("MODERATE");
  });

  it("returns WEAK", () => {
    expect(
      solvencyAnalysisService.determineSolvencyLevel(30),
    ).toBe("WEAK");
  });

  it("returns CRITICAL", () => {
    expect(
      solvencyAnalysisService.determineSolvencyLevel(10),
    ).toBe("CRITICAL");
  });

  it("creates analysis", () => {
    const analysis =
      solvencyAnalysisService.createAnalysis({
        id: "SOL-001",
        companyName: "Monster ERP",
        totalAssets: 100000,
        totalLiabilities: 40000,
        totalEquity: 60000,
        debtToAssetRatio: 40,
        debtToEquityRatio: 66.67,
        equityRatio: 60,
        solvencyRatio: 150,
        solvencyLevel: "EXCELLENT",
        analysisDate: "2026-01-01",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      });

    expect(analysis.id).toBe("SOL-001");
  });

  it("gets analysis by id", () => {
    const result =
      solvencyAnalysisService.getAnalysisById(
        "SOL-001",
      );

    expect(result).toBeDefined();
  });

  it("updates analysis", () => {
    const updated =
      solvencyAnalysisService.updateAnalysis(
        "SOL-001",
        {
          notes: "Updated",
        },
      );

    expect(updated.notes).toBe("Updated");
  });

  it("generates summary", () => {
    const summary =
      solvencyAnalysisService.generateSummary();

    expect(summary.analysisCount).toBeGreaterThan(0);
  });
});