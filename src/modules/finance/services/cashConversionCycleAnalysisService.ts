import {
  CashConversionCycleAnalysis,
  CashConversionCycleAnalysisSummary,
} from "../types/finance.types";

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

function calculateEfficiencyScore(
  cashConversionCycle: number,
): number {
  if (cashConversionCycle <= 0) {
    return 100;
  }

  if (cashConversionCycle >= 180) {
    return 0;
  }

  return Math.max(
    0,
    Math.round(((180 - cashConversionCycle) / 180) * 100),
  );
}

function determineCycleStatus(
  cashConversionCycle: number,
): "EXCELLENT" | "GOOD" | "FAIR" | "POOR" {
  if (cashConversionCycle <= 30) {
    return "EXCELLENT";
  }

  if (cashConversionCycle <= 60) {
    return "GOOD";
  }

  if (cashConversionCycle <= 90) {
    return "FAIR";
  }

  return "POOR";
}

function generateCashConversionCycleSummary(
  analysis: CashConversionCycleAnalysis,
): CashConversionCycleAnalysisSummary {
  return {
    inventoryDays: analysis.inventoryDays,
    receivableDays: analysis.receivableDays,
    payableDays: analysis.payableDays,
    cashConversionCycle: analysis.cashConversionCycle,
    efficiencyScore: analysis.efficiencyScore,
    cycleStatus: determineCycleStatus(
      analysis.cashConversionCycle,
    ),
  };
}

export const cashConversionCycleAnalysisService = {
  calculateInventoryDays,
  calculateReceivableDays,
  calculatePayableDays,
  calculateCashConversionCycle,
  calculateEfficiencyScore,
  generateCashConversionCycleSummary,
};