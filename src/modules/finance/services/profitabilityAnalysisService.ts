import type {
  ProfitabilityAnalysis,
  ProfitabilityAnalysisSummary,
  ProfitabilityGrade
} from "../types/finance.types";

export function calculateGrossProfit(
  revenue: number,
  costOfGoodsSold: number
): number {
  return revenue - costOfGoodsSold;
}

export function calculateOperatingProfit(
  grossProfit: number,
  operatingExpenses: number
): number {
  return grossProfit - operatingExpenses;
}

export function calculateNetProfit(
  revenue: number,
  costOfGoodsSold: number,
  operatingExpenses: number
): number {
  return revenue - costOfGoodsSold - operatingExpenses;
}

export function calculateProfitabilityPercentage(
  value: number,
  base: number
): number {
  if (base <= 0) {
    return 0;
  }

  return Number(((value / base) * 100).toFixed(2));
}

export function calculateProfitabilityScore(
  grossProfitMargin: number,
  operatingProfitMargin: number,
  netProfitMargin: number,
  returnOnAssets: number,
  returnOnEquity: number
): number {
  const score =
    grossProfitMargin * 0.2 +
    operatingProfitMargin * 0.2 +
    netProfitMargin * 0.25 +
    returnOnAssets * 0.15 +
    returnOnEquity * 0.2;

  return Number(Math.max(0, Math.min(score, 100)).toFixed(2));
}

export function determineProfitabilityGrade(
  score: number
): ProfitabilityGrade {
  if (score >= 80) {
    return "EXCELLENT";
  }

  if (score >= 60) {
    return "GOOD";
  }

  if (score >= 40) {
    return "MODERATE";
  }

  return "LOW";
}

export function createProfitabilityAnalysis(
  analysis: Omit<
    ProfitabilityAnalysis,
    | "grossProfit"
    | "operatingProfit"
    | "netProfit"
    | "grossProfitMargin"
    | "operatingProfitMargin"
    | "netProfitMargin"
    | "returnOnAssets"
    | "returnOnEquity"
    | "profitabilityScore"
    | "grade"
  >
): ProfitabilityAnalysis {
  const grossProfit = calculateGrossProfit(
    analysis.revenue,
    analysis.costOfGoodsSold
  );

  const operatingProfit = calculateOperatingProfit(
    grossProfit,
    analysis.operatingExpenses
  );

  const netProfit = calculateNetProfit(
    analysis.revenue,
    analysis.costOfGoodsSold,
    analysis.operatingExpenses
  );

  const grossProfitMargin =
    calculateProfitabilityPercentage(
      grossProfit,
      analysis.revenue
    );

  const operatingProfitMargin =
    calculateProfitabilityPercentage(
      operatingProfit,
      analysis.revenue
    );

  const netProfitMargin =
    calculateProfitabilityPercentage(
      netProfit,
      analysis.revenue
    );

  const returnOnAssets =
    calculateProfitabilityPercentage(
      netProfit,
      analysis.totalAssets
    );

  const returnOnEquity =
    calculateProfitabilityPercentage(
      netProfit,
      analysis.totalEquity
    );

  const profitabilityScore =
    calculateProfitabilityScore(
      grossProfitMargin,
      operatingProfitMargin,
      netProfitMargin,
      returnOnAssets,
      returnOnEquity
    );

  return {
    ...analysis,
    grossProfit,
    operatingProfit,
    netProfit,
    grossProfitMargin,
    operatingProfitMargin,
    netProfitMargin,
    returnOnAssets,
    returnOnEquity,
    profitabilityScore,
    grade:
      determineProfitabilityGrade(
        profitabilityScore
      )
  };
}

export function updateProfitabilityAnalysis(
  analysis: ProfitabilityAnalysis,
  updates: Partial<
    Omit<
      ProfitabilityAnalysis,
      "id" | "period"
    >
  >
): ProfitabilityAnalysis {
  return createProfitabilityAnalysis({
    ...analysis,
    ...updates
  });
}

export function getProfitabilityAnalysesByGrade(
  analyses: ProfitabilityAnalysis[],
  grade: ProfitabilityGrade
): ProfitabilityAnalysis[] {
  return analyses.filter(
    analysis => analysis.grade === grade
  );
}

export function calculateAverageProfitabilityMetric(
  analyses: ProfitabilityAnalysis[],
  selector: (
    analysis: ProfitabilityAnalysis
  ) => number
): number {
  if (analyses.length === 0) {
    return 0;
  }

  const total = analyses.reduce(
    (sum, analysis) =>
      sum + selector(analysis),
    0
  );

  return Number(
    (total / analyses.length).toFixed(2)
  );
}

export function buildProfitabilityAnalysisSummary(
  analyses: ProfitabilityAnalysis[]
): ProfitabilityAnalysisSummary {
  return {
    totalAnalyses: analyses.length,
    averageGrossProfitMargin:
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.grossProfitMargin
      ),
    averageOperatingProfitMargin:
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.operatingProfitMargin
      ),
    averageNetProfitMargin:
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.netProfitMargin
      ),
    averageReturnOnAssets:
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.returnOnAssets
      ),
    averageReturnOnEquity:
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.returnOnEquity
      ),
    averageProfitabilityScore:
      calculateAverageProfitabilityMetric(
        analyses,
        analysis =>
          analysis.profitabilityScore
      ),
    lowCount:
      getProfitabilityAnalysesByGrade(
        analyses,
        "LOW"
      ).length,
    moderateCount:
      getProfitabilityAnalysesByGrade(
        analyses,
        "MODERATE"
      ).length,
    goodCount:
      getProfitabilityAnalysesByGrade(
        analyses,
        "GOOD"
      ).length,
    excellentCount:
      getProfitabilityAnalysesByGrade(
        analyses,
        "EXCELLENT"
      ).length
  };
}