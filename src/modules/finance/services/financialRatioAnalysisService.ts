import type {
  FinancialRatioAnalysis,
  FinancialRatioGrade
} from "../types/finance.types";

export function calculateCurrentRatio(
  currentAssets: number,
  currentLiabilities: number
): number {
  if (currentLiabilities <= 0) return 0;

  return Number(
    (currentAssets / currentLiabilities).toFixed(2)
  );
}

export function calculateFinancialDebtRatio(
  totalLiabilities: number,
  totalAssets: number
): number {
  if (totalAssets <= 0) return 0;

  return Number(
    (totalLiabilities / totalAssets).toFixed(2)
  );
}

export function calculateNetProfitMargin(
  netIncome: number,
  totalRevenue: number
): number {
  if (totalRevenue <= 0) return 0;

  return Number(
    (netIncome / totalRevenue).toFixed(2)
  );
}

export function calculateReturnOnAssets(
  netIncome: number,
  totalAssets: number
): number {
  if (totalAssets <= 0) return 0;

  return Number(
    (netIncome / totalAssets).toFixed(2)
  );
}

export function calculateReturnOnEquity(
  netIncome: number,
  totalEquity: number
): number {
  if (totalEquity <= 0) return 0;

  return Number(
    (netIncome / totalEquity).toFixed(2)
  );
}

export function calculateFinancialRatioGrade(
  analysis: Omit<
    FinancialRatioAnalysis,
    "grade"
  >
): FinancialRatioGrade {
  let score = 0;

  if (analysis.currentRatio >= 2) score += 25;
  else if (analysis.currentRatio >= 1) score += 15;

  if (analysis.debtRatio <= 0.4) score += 25;
  else if (analysis.debtRatio <= 0.7) score += 15;

  if (analysis.netProfitMargin >= 0.2) score += 20;
  else if (analysis.netProfitMargin > 0) score += 10;

  if (analysis.returnOnAssets >= 0.1) score += 15;
  else if (analysis.returnOnAssets > 0) score += 8;

  if (analysis.returnOnEquity >= 0.15) score += 15;
  else if (analysis.returnOnEquity > 0) score += 8;

  if (score >= 85) return "excellent";
  if (score >= 55) return "healthy";
  if (score >= 40) return "warning";

  return "critical";
}

export function createFinancialRatioAnalysis(
  currentAssets: number,
  currentLiabilities: number,
  totalLiabilities: number,
  totalAssets: number,
  netIncome: number,
  totalRevenue: number,
  totalEquity: number
): FinancialRatioAnalysis {
  const analysis = {
    currentRatio: calculateCurrentRatio(
      currentAssets,
      currentLiabilities
    ),
    debtRatio: calculateFinancialDebtRatio(
      totalLiabilities,
      totalAssets
    ),
    netProfitMargin: calculateNetProfitMargin(
      netIncome,
      totalRevenue
    ),
    returnOnAssets: calculateReturnOnAssets(
      netIncome,
      totalAssets
    ),
    returnOnEquity: calculateReturnOnEquity(
      netIncome,
      totalEquity
    )
  };

  return {
    ...analysis,
    grade: calculateFinancialRatioGrade(analysis)
  };
}