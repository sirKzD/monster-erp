import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateFinanceHealthScore,
  createFinanceDashboardSummary
} from "../services/financeDashboardService";

import type {
  BalanceSheetReport,
  CashFlowReport,
  ProfitAndLossReport
} from "../types/finance.types";

const profitAndLoss: ProfitAndLossReport = {
  totalRevenue: 10000000,
  totalExpense: 3000000,
  netIncome: 7000000,
  status: "profit"
};

const balanceSheet: BalanceSheetReport = {
  totalAssets: 15000000,
  totalLiabilities: 5000000,
  totalEquity: 10000000,
  totalLiabilitiesAndEquity: 15000000,
  isBalanced: true
};

const cashFlow: CashFlowReport = {
  operatingCashFlow: 7000000,
  investingCashFlow: -2000000,
  financingCashFlow: 5000000,
  netCashFlow: 10000000,
  openingCashBalance: 2000000,
  endingCashBalance: 12000000
};

describe("financeDashboardService", () => {
  it("calculates finance health score", () => {
    expect(
      calculateFinanceHealthScore(
        7000000,
        15000000,
        5000000,
        10000000
      )
    ).toBe(100);
  });

  it("penalizes high liability ratio", () => {
    expect(
      calculateFinanceHealthScore(
        -1000000,
        10000000,
        9000000,
        -500000
      )
    ).toBe(40);
  });

  it("creates finance dashboard summary", () => {
    const summary = createFinanceDashboardSummary(
      profitAndLoss,
      balanceSheet,
      cashFlow
    );

    expect(summary).toEqual({
      totalRevenue: 10000000,
      totalExpense: 3000000,
      netIncome: 7000000,
      totalAssets: 15000000,
      totalLiabilities: 5000000,
      totalEquity: 10000000,
      netCashFlow: 10000000,
      financeHealthScore: 100
    });
  });
});