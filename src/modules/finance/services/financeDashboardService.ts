import type {
  BalanceSheetReport,
  CashFlowReport,
  FinanceDashboardSummary,
  ProfitAndLossReport
} from "../types/finance.types";

export function calculateFinanceHealthScore(
  netIncome: number,
  totalAssets: number,
  totalLiabilities: number,
  netCashFlow: number
): number {
  let score = 50;

  if (netIncome > 0) score += 20;
  if (netCashFlow > 0) score += 20;

  if (totalAssets > 0) {
    const liabilityRatio =
      totalLiabilities / totalAssets;

    if (liabilityRatio <= 0.5) {
      score += 10;
    } else if (liabilityRatio > 0.8) {
      score -= 10;
    }
  }

  return Math.max(
    Math.min(score, 100),
    0
  );
}

export function createFinanceDashboardSummary(
  profitAndLoss: ProfitAndLossReport,
  balanceSheet: BalanceSheetReport,
  cashFlow: CashFlowReport
): FinanceDashboardSummary {
  return {
    totalRevenue: profitAndLoss.totalRevenue,
    totalExpense: profitAndLoss.totalExpense,
    netIncome: profitAndLoss.netIncome,
    totalAssets: balanceSheet.totalAssets,
    totalLiabilities: balanceSheet.totalLiabilities,
    totalEquity: balanceSheet.totalEquity,
    netCashFlow: cashFlow.netCashFlow,
    financeHealthScore: calculateFinanceHealthScore(
      profitAndLoss.netIncome,
      balanceSheet.totalAssets,
      balanceSheet.totalLiabilities,
      cashFlow.netCashFlow
    )
  };
}