import {
  BreakEvenAnalysis,
  BreakEvenResult,
  BreakEvenSummary,
} from "../types/finance.types";

const analyses = new Map<string, BreakEvenAnalysis>();

export function createBreakEvenAnalysis(
  analysis: BreakEvenAnalysis,
): BreakEvenAnalysis {
  analyses.set(analysis.id, analysis);
  return analysis;
}

export function getBreakEvenAnalysisById(
  id: string,
): BreakEvenAnalysis | undefined {
  return analyses.get(id);
}

export function getAllBreakEvenAnalyses(): BreakEvenAnalysis[] {
  return Array.from(analyses.values());
}

export function updateBreakEvenAnalysis(
  id: string,
  updates: Partial<BreakEvenAnalysis>,
): BreakEvenAnalysis {
  const existing = analyses.get(id);

  if (!existing) {
    throw new Error("Break-even analysis not found");
  }

  const updated: BreakEvenAnalysis = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  analyses.set(id, updated);

  return updated;
}

export function deleteBreakEvenAnalysis(
  id: string,
): boolean {
  return analyses.delete(id);
}

export function calculateContributionMargin(
  sellingPricePerUnit: number,
  variableCostPerUnit: number,
): number {
  return sellingPricePerUnit - variableCostPerUnit;
}

export function calculateContributionMarginRatio(
  sellingPricePerUnit: number,
  variableCostPerUnit: number,
): number {
  if (sellingPricePerUnit === 0) {
    return 0;
  }

  return (
    calculateContributionMargin(
      sellingPricePerUnit,
      variableCostPerUnit,
    ) / sellingPricePerUnit
  );
}

export function calculateBreakEvenUnits(
  fixedCosts: number,
  sellingPricePerUnit: number,
  variableCostPerUnit: number,
): number {
  const contributionMargin =
    calculateContributionMargin(
      sellingPricePerUnit,
      variableCostPerUnit,
    );

  if (contributionMargin <= 0) {
    return 0;
  }

  return fixedCosts / contributionMargin;
}

export function calculateBreakEvenRevenue(
  fixedCosts: number,
  sellingPricePerUnit: number,
  variableCostPerUnit: number,
): number {
  return (
    calculateBreakEvenUnits(
      fixedCosts,
      sellingPricePerUnit,
      variableCostPerUnit,
    ) * sellingPricePerUnit
  );
}

export function calculateMarginOfSafety(
  actualRevenue: number,
  breakEvenRevenue: number,
): {
  revenue: number;
  percentage: number;
} {
  const revenue =
    actualRevenue - breakEvenRevenue;

  return {
    revenue,
    percentage:
      actualRevenue === 0
        ? 0
        : (revenue / actualRevenue) * 100,
  };
}

export function calculateTargetProfitUnits(
  fixedCosts: number,
  targetProfit: number,
  sellingPricePerUnit: number,
  variableCostPerUnit: number,
): number {
  const contributionMargin =
    calculateContributionMargin(
      sellingPricePerUnit,
      variableCostPerUnit,
    );

  if (contributionMargin <= 0) {
    return 0;
  }

  return (
    (fixedCosts + targetProfit) /
    contributionMargin
  );
}

export function calculateTargetProfitRevenue(
  fixedCosts: number,
  targetProfit: number,
  sellingPricePerUnit: number,
  variableCostPerUnit: number,
): number {
  return (
    calculateTargetProfitUnits(
      fixedCosts,
      targetProfit,
      sellingPricePerUnit,
      variableCostPerUnit,
    ) * sellingPricePerUnit
  );
}

export function calculateBreakEvenResult(
  analysis: BreakEvenAnalysis,
  actualRevenue = 0,
): BreakEvenResult {
  const contributionMarginPerUnit =
    calculateContributionMargin(
      analysis.sellingPricePerUnit,
      analysis.variableCostPerUnit,
    );

  const contributionMarginRatio =
    calculateContributionMarginRatio(
      analysis.sellingPricePerUnit,
      analysis.variableCostPerUnit,
    );

  const breakEvenUnits =
    calculateBreakEvenUnits(
      analysis.fixedCosts,
      analysis.sellingPricePerUnit,
      analysis.variableCostPerUnit,
    );

  const breakEvenRevenue =
    calculateBreakEvenRevenue(
      analysis.fixedCosts,
      analysis.sellingPricePerUnit,
      analysis.variableCostPerUnit,
    );

  const marginOfSafety =
    calculateMarginOfSafety(
      actualRevenue,
      breakEvenRevenue,
    );

  const targetProfit =
    analysis.targetProfit ?? 0;

  return {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMarginPerUnit,
    contributionMarginRatio,
    marginOfSafetyRevenue:
      marginOfSafety.revenue,
    marginOfSafetyPercentage:
      marginOfSafety.percentage,
    targetProfitUnits:
      calculateTargetProfitUnits(
        analysis.fixedCosts,
        targetProfit,
        analysis.sellingPricePerUnit,
        analysis.variableCostPerUnit,
      ),
    targetProfitRevenue:
      calculateTargetProfitRevenue(
        analysis.fixedCosts,
        targetProfit,
        analysis.sellingPricePerUnit,
        analysis.variableCostPerUnit,
      ),
  };
}

export function generateBreakEvenSummary(
  items: BreakEvenAnalysis[],
): BreakEvenSummary {
  if (items.length === 0) {
    return {
      totalAnalyses: 0,
      averageBreakEvenUnits: 0,
      averageContributionMarginRatio: 0,
      averageMarginOfSafetyPercentage: 0,
    };
  }

  const results = items.map((item) =>
    calculateBreakEvenResult(item),
  );

  return {
    totalAnalyses: items.length,
    averageBreakEvenUnits:
      results.reduce(
        (sum, item) =>
          sum + item.breakEvenUnits,
        0,
      ) / results.length,
    averageContributionMarginRatio:
      results.reduce(
        (sum, item) =>
          sum + item.contributionMarginRatio,
        0,
      ) / results.length,
    averageMarginOfSafetyPercentage:
      results.reduce(
        (sum, item) =>
          sum + item.marginOfSafetyPercentage,
        0,
      ) / results.length,
  };
}

export function clearBreakEvenAnalyses(): void {
  analyses.clear();
}