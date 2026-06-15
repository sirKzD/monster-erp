import type {
  Account,
  LedgerEntry,
  ProfitAndLossReport
} from "../types/finance.types";

import {
  findAccountByCode
} from "./chartOfAccountService";

export function filterLedgerEntriesByAccountType(
  entries: LedgerEntry[],
  accounts: Account[],
  type: "revenue" | "expense"
): LedgerEntry[] {
  return entries.filter(entry => {
    const account = findAccountByCode(
      accounts,
      entry.accountCode
    );

    return account?.type === type;
  });
}

export function calculateRevenueTotal(
  entries: LedgerEntry[],
  accounts: Account[]
): number {
  return filterLedgerEntriesByAccountType(
    entries,
    accounts,
    "revenue"
  ).reduce(
    (total, entry) => total + entry.credit - entry.debit,
    0
  );
}

export function calculateExpenseTotal(
  entries: LedgerEntry[],
  accounts: Account[]
): number {
  return filterLedgerEntriesByAccountType(
    entries,
    accounts,
    "expense"
  ).reduce(
    (total, entry) => total + entry.debit - entry.credit,
    0
  );
}

export function getProfitAndLossStatus(
  netIncome: number
): "profit" | "loss" | "break_even" {
  if (netIncome > 0) return "profit";
  if (netIncome < 0) return "loss";

  return "break_even";
}

export function generateProfitAndLossReport(
  entries: LedgerEntry[],
  accounts: Account[]
): ProfitAndLossReport {
  const totalRevenue = calculateRevenueTotal(
    entries,
    accounts
  );

  const totalExpense = calculateExpenseTotal(
    entries,
    accounts
  );

  const netIncome = totalRevenue - totalExpense;

  return {
    totalRevenue,
    totalExpense,
    netIncome,
    status: getProfitAndLossStatus(netIncome)
  };
}