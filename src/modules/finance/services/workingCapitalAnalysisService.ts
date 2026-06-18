import {
  WorkingCapitalAnalysis,
  WorkingCapitalAnalysisSummary,
} from "../types/finance.types";

function calculateWorkingCapital(
  currentAssets: number,
  currentLiabilities: number,
): number {
  return currentAssets - currentLiabilities;
}

function calculateCurrentRatio(
  currentAssets: number,
  currentLiabilities: number,
): number {
  if (currentLiabilities <= 0) {
    return 0;
  }

  return currentAssets / currentLiabilities;
}

function calculateWorkingCapitalTurnover(
  annualRevenue: number,
  workingCapital: number,
): number {
  if (workingCapital <= 0) {
    return 0;
  }

  return annualRevenue / workingCapital;
}

function calculateInventoryDays(
  inventory: number,
  annualCostOfGoodsSold: number,
): number {
  if (annualCostOfGoodsSold <= 0) {
    return 0;
  }

  return (inventory / annualCostOfGoodsSold) * 365;
}

function calculateReceivableDays(
  accountsReceivable: number,
  annualRevenue: number,
): number {
  if (annualRevenue <= 0) {
    return 0;
  }

  return (accountsReceivable / annualRevenue) * 365;
}

function calculatePayableDays(
  accountsPayable: number,
  annualCostOfGoodsSold: number,
): number {
  if (annualCostOfGoodsSold <= 0) {
    return 0;
  }

  return (accountsPayable / annualCostOfGoodsSold) * 365;
}

function calculateCashConversionCycle(
  inventoryDays: number,
  receivableDays: number,
  payableDays: number,
): number {
  return inventoryDays + receivableDays - payableDays;
}

function determineLiquidityStatus(
  currentRatio: number,
): "WEAK" | "STABLE" | "STRONG" {
  if (currentRatio < 1) {
    return "WEAK";
  }

  if (currentRatio < 2) {
    return "STABLE";
  }

  return "STRONG";
}

function generateWorkingCapitalSummary(
  analysis: WorkingCapitalAnalysis,
): WorkingCapitalAnalysisSummary {
  return {
    totalWorkingCapital: analysis.workingCapital,
    currentRatio: analysis.currentRatio,
    workingCapitalTurnover: analysis.workingCapitalTurnover,
    cashConversionCycle: analysis.cashConversionCycle,
    liquidityStatus: determineLiquidityStatus(
      analysis.currentRatio,
    ),
  };
}

export const workingCapitalAnalysisService = {
  calculateWorkingCapital,
  calculateCurrentRatio,
  calculateWorkingCapitalTurnover,
  calculateInventoryDays,
  calculateReceivableDays,
  calculatePayableDays,
  calculateCashConversionCycle,
  generateWorkingCapitalSummary,
};