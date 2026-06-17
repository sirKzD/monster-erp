import type {
  PettyCashExpense,
  PettyCashFund,
  PettyCashReplenishment,
  PettyCashSummary
} from "../types/finance.types";

export function createPettyCashFund(
  fund: PettyCashFund
): PettyCashFund {
  if (fund.openingBalance < 0) {
    throw new Error(
      "Opening balance cannot be negative"
    );
  }

  return fund;
}

export function addPettyCashExpense(
  fund: PettyCashFund,
  expense: PettyCashExpense
): PettyCashFund {
  if (
    expense.amount >
    fund.currentBalance
  ) {
    throw new Error(
      "Insufficient petty cash balance"
    );
  }

  return {
    ...fund,
    currentBalance:
      fund.currentBalance -
      expense.amount
  };
}

export function replenishPettyCash(
  fund: PettyCashFund,
  replenishment: PettyCashReplenishment
): PettyCashFund {
  return {
    ...fund,
    currentBalance:
      fund.currentBalance +
      replenishment.amount
  };
}

export function calculatePettyCashBalance(
  fund: PettyCashFund
): number {
  return fund.currentBalance;
}

export function calculateTotalPettyCashExpenses(
  expenses: PettyCashExpense[]
): number {
  return expenses.reduce(
    (total, expense) =>
      total + expense.amount,
    0
  );
}

export function calculateTotalReplenishments(
  replenishments: PettyCashReplenishment[]
): number {
  return replenishments.reduce(
    (total, replenishment) =>
      total +
      replenishment.amount,
    0
  );
}

export function createPettyCashSummary(
  fund: PettyCashFund,
  expenses: PettyCashExpense[],
  replenishments: PettyCashReplenishment[]
): PettyCashSummary {
  return {
    fundId: fund.id,
    openingBalance:
      fund.openingBalance,
    currentBalance:
      fund.currentBalance,
    totalExpenses:
      calculateTotalPettyCashExpenses(
        expenses
      ),
    totalReplenishments:
      calculateTotalReplenishments(
        replenishments
      )
  };
}