import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";

import {
  createBreakEvenAnalysis,
  getBreakEvenAnalysisById,
  getAllBreakEvenAnalyses,
  updateBreakEvenAnalysis,
  deleteBreakEvenAnalysis,
  calculateContributionMargin,
  calculateContributionMarginRatio,
  calculateBreakEvenUnits,
  calculateBreakEvenRevenue,
  calculateMarginOfSafety,
  calculateTargetProfitUnits,
  calculateTargetProfitRevenue,
  calculateBreakEvenResult,
  generateBreakEvenSummary,
  clearBreakEvenAnalyses,
} from "../services/breakEvenAnalysisService";

describe("breakEvenAnalysisService", () => {
  beforeEach(() => {
    clearBreakEvenAnalyses();
  });

  const analysis = {
    id: "BE-001",
    name: "Product A",
    fixedCosts: 10000,
    variableCostPerUnit: 20,
    sellingPricePerUnit: 50,
    targetProfit: 5000,
    status: "DRAFT" as const,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };

  it("creates analysis", () => {
    expect(
      createBreakEvenAnalysis(analysis).id,
    ).toBe("BE-001");
  });

  it("gets analysis by id", () => {
    createBreakEvenAnalysis(analysis);

    expect(
      getBreakEvenAnalysisById("BE-001"),
    ).toBeDefined();
  });

  it("gets all analyses", () => {
    createBreakEvenAnalysis(analysis);

    expect(
      getAllBreakEvenAnalyses(),
    ).toHaveLength(1);
  });

  it("updates analysis", () => {
    createBreakEvenAnalysis(analysis);

    const updated =
      updateBreakEvenAnalysis(
        "BE-001",
        {
          name: "Updated",
        },
      );

    expect(updated.name).toBe(
      "Updated",
    );
  });

  it("throws when analysis missing", () => {
    expect(() =>
      updateBreakEvenAnalysis(
        "X",
        {},
      ),
    ).toThrow();
  });

  it("deletes analysis", () => {
    createBreakEvenAnalysis(analysis);

    expect(
      deleteBreakEvenAnalysis(
        "BE-001",
      ),
    ).toBe(true);
  });

  it("calculates contribution margin", () => {
    expect(
      calculateContributionMargin(
        50,
        20,
      ),
    ).toBe(30);
  });

  it("calculates contribution margin ratio", () => {
    expect(
      calculateContributionMarginRatio(
        50,
        20,
      ),
    ).toBe(0.6);
  });

  it("calculates break even units", () => {
    expect(
      calculateBreakEvenUnits(
        10000,
        50,
        20,
      ),
    ).toBeCloseTo(
      333.33,
      2,
    );
  });

  it("calculates break even revenue", () => {
    expect(
      calculateBreakEvenRevenue(
        10000,
        50,
        20,
      ),
    ).toBeCloseTo(
      16666.67,
      2,
    );
  });

  it("calculates margin of safety", () => {
    const result =
      calculateMarginOfSafety(
        30000,
        20000,
      );

    expect(result.revenue).toBe(
      10000,
    );
  });

  it("calculates target profit units", () => {
    expect(
      calculateTargetProfitUnits(
        10000,
        5000,
        50,
        20,
      ),
    ).toBe(500);
  });

  it("calculates target profit revenue", () => {
    expect(
      calculateTargetProfitRevenue(
        10000,
        5000,
        50,
        20,
      ),
    ).toBe(25000);
  });

  it("calculates full result", () => {
    const result =
      calculateBreakEvenResult(
        analysis,
        30000,
      );

    expect(
      result.breakEvenUnits,
    ).toBeGreaterThan(0);
  });

  it("generates summary", () => {
    const summary =
      generateBreakEvenSummary([
        analysis,
      ]);

    expect(
      summary.totalAnalyses,
    ).toBe(1);
  });

  it("returns empty summary", () => {
    const summary =
      generateBreakEvenSummary(
        [],
      );

    expect(
      summary.totalAnalyses,
    ).toBe(0);
  });

  it("returns zero when contribution margin invalid", () => {
    expect(
      calculateBreakEvenUnits(
        10000,
        20,
        20,
      ),
    ).toBe(0);
  });
});