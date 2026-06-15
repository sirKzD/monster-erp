import type {
  Account,
  AccountType,
  BalanceSheetReport,
  LedgerEntry
} from "../types/finance.types";

import {
  findAccountByCode
} from "./chartOfAccountService";

export function filterLedgerEntriesByBalanceSheetType(
  entries: LedgerEntry[],
  accounts: Account[],
  type: Extract<
    AccountType,
    "asset" | "liability" | "equity"
  >
): LedgerEntry[] {
  return entries.filter(entry => {
    const account = findAccountByCode(
      accounts,
      entry.accountCode
    );

    return account?.type === type;
  });
}

export function calculateAssetTotal(
  entries: LedgerEntry[],
  accounts: Account[]
): number {
  return filterLedgerEntriesByBalanceSheetType(
    entries,
    accounts,
    "asset"
  ).reduce(
    (total, entry) => total + entry.debit - entry.credit,
    0
  );
}

export function calculateLiabilityTotal(
  entries: LedgerEntry[],
  accounts: Account[]
): number {
  return filterLedgerEntriesByBalanceSheetType(
    entries,
    accounts,
    "liability"
  ).reduce(
    (total, entry) => total + entry.credit - entry.debit,
    0
  );
}

export function calculateEquityTotal(
  entries: LedgerEntry[],
  accounts: Account[]
): number {
  return filterLedgerEntriesByBalanceSheetType(
    entries,
    accounts,
    "equity"
  ).reduce(
    (total, entry) => total + entry.credit - entry.debit,
    0
  );
}

export function isBalanceSheetBalanced(
  totalAssets: number,
  totalLiabilities: number,
  totalEquity: number
): boolean {
  return totalAssets === totalLiabilities + totalEquity;
}

export function generateBalanceSheetReport(
  entries: LedgerEntry[],
  accounts: Account[]
): BalanceSheetReport {
  const totalAssets = calculateAssetTotal(
    entries,
    accounts
  );

  const totalLiabilities = calculateLiabilityTotal(
    entries,
    accounts
  );

  const totalEquity = calculateEquityTotal(
    entries,
    accounts
  );

  const totalLiabilitiesAndEquity =
    totalLiabilities + totalEquity;

  return {
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalLiabilitiesAndEquity,
    isBalanced: isBalanceSheetBalanced(
      totalAssets,
      totalLiabilities,
      totalEquity
    )
  };
}