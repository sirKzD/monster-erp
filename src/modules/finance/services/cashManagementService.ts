import type {
  CashManagementSummary,
  CashPosition,
  CashTransaction,
  DailyCashSummary
} from "../types/finance.types";

export function calculateCashInflow(
  transactions: CashTransaction[]
): number {
  return transactions
    .filter(
      transaction =>
        transaction.type === "inflow"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );
}

export function calculateCashOutflow(
  transactions: CashTransaction[]
): number {
  return transactions
    .filter(
      transaction =>
        transaction.type === "outflow"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );
}

export function calculateCashPosition(
  openingBalance: number,
  transactions: CashTransaction[]
): CashPosition {
  const totalInflow =
    calculateCashInflow(transactions);

  const totalOutflow =
    calculateCashOutflow(transactions);

  return {
    openingBalance,
    totalInflow,
    totalOutflow,
    closingBalance:
      openingBalance +
      totalInflow -
      totalOutflow
  };
}

export function createCashManagementSummary(
  openingBalance: number,
  transactions: CashTransaction[]
): CashManagementSummary {
  const position =
    calculateCashPosition(
      openingBalance,
      transactions
    );

  return {
    totalTransactions:
      transactions.length,
    totalInflow:
      position.totalInflow,
    totalOutflow:
      position.totalOutflow,
    endingCashBalance:
      position.closingBalance
  };
}

export function createDailyCashSummary(
  date: string,
  transactions: CashTransaction[]
): DailyCashSummary {
  const dailyTransactions =
    transactions.filter(
      transaction =>
        transaction.transactionDate ===
        date
    );

  const inflow =
    calculateCashInflow(
      dailyTransactions
    );

  const outflow =
    calculateCashOutflow(
      dailyTransactions
    );

  return {
    date,
    inflow,
    outflow,
    netCashFlow:
      inflow - outflow
  };
}