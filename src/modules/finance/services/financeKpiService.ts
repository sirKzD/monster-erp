import type {
  FinanceGrade,
  FinanceKpi
} from "../types/finance.types";

export function calculateProfitMargin(
  netIncome: number,
  totalRevenue: number
): number {
  if (totalRevenue <= 0) {
    return 0;
  }

  return Math.round(
    (netIncome / totalRevenue) * 100
  );
}

export function calculateDebtRatio(
  totalLiabilities: number,
  totalAssets: number
): number {
  if (totalAssets <= 0) {
    return 0;
  }

  return Math.round(
    (totalLiabilities / totalAssets) * 100
  );
}

export function calculateCashFlowRatio(
  netCashFlow: number,
  totalRevenue: number
): number {
  if (totalRevenue <= 0) {
    return 0;
  }

  return Math.round(
    (netCashFlow / totalRevenue) * 100
  );
}

export function calculateFinanceGrade(
  profitMargin: number,
  debtRatio: number,
  cashFlowRatio: number
): FinanceGrade {
  const score = Math.round(
    profitMargin +
    cashFlowRatio -
    debtRatio
  );

  if (score >= 70) return "A";
  if (score >= 40) return "B";

  return "C";
}

export function createFinanceKpi(
  netIncome: number,
  totalRevenue: number,
  totalLiabilities: number,
  totalAssets: number,
  netCashFlow: number
): FinanceKpi {
  const profitMargin = calculateProfitMargin(
    netIncome,
    totalRevenue
  );

  const debtRatio = calculateDebtRatio(
    totalLiabilities,
    totalAssets
  );

  const cashFlowRatio = calculateCashFlowRatio(
    netCashFlow,
    totalRevenue
  );

  return {
    profitMargin,
    debtRatio,
    cashFlowRatio,
    grade: calculateFinanceGrade(
      profitMargin,
      debtRatio,
      cashFlowRatio
    )
  };
}