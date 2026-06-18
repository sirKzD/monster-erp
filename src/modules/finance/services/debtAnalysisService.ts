import {
  DebtAnalysis,
  DebtAnalysisSummary,
  DebtRiskLevel,
} from "../types/finance.types";

function calculateDebtRatio(
  totalDebt: number,
  totalAssets: number,
): number {
  if (totalAssets <= 0) {
    return 0;
  }

  return totalDebt / totalAssets;
}

function calculateDebtToEquityRatio(
  totalDebt: number,
  totalEquity: number,
): number {
  if (totalEquity <= 0) {
    return 0;
  }

  return totalDebt / totalEquity;
}

function calculateDebtToAssetRatio(
  totalDebt: number,
  totalAssets: number,
): number {
  if (totalAssets <= 0) {
    return 0;
  }

  return totalDebt / totalAssets;
}

function calculateInterestCoverageRatio(
  ebit: number,
  interestExpense: number,
): number {
  if (interestExpense <= 0) {
    return 0;
  }

  return ebit / interestExpense;
}

function determineDebtRiskLevel(
  debtToEquityRatio: number,
): DebtRiskLevel {
  if (debtToEquityRatio < 0.5) {
    return "LOW";
  }

  if (debtToEquityRatio < 1) {
    return "MODERATE";
  }

  if (debtToEquityRatio < 2) {
    return "HIGH";
  }

  return "CRITICAL";
}

function generateDebtAnalysisSummary(
  analysis: DebtAnalysis,
): DebtAnalysisSummary {
  return {
    totalDebt: analysis.totalDebt,
    debtRatio: analysis.debtRatio,
    debtToEquityRatio: analysis.debtToEquityRatio,
    debtToAssetRatio: analysis.debtToAssetRatio,
    interestCoverageRatio: analysis.interestCoverageRatio,
    riskLevel: analysis.riskLevel,
  };
}

export const debtAnalysisService = {
  calculateDebtRatio,
  calculateDebtToEquityRatio,
  calculateDebtToAssetRatio,
  calculateInterestCoverageRatio,
  determineDebtRiskLevel,
  generateDebtAnalysisSummary,
};