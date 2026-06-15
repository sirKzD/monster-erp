import {
  describe,
  it,
  expect
} from "vitest";

import {
  filterLedgerEntriesByBalanceSheetType,
  calculateAssetTotal,
  calculateLiabilityTotal,
  calculateEquityTotal,
  isBalanceSheetBalanced,
  generateBalanceSheetReport
} from "../services/balanceSheetService";

import type {
  Account,
  LedgerEntry
} from "../types/finance.types";

const accounts: Account[] = [
  {
    id: "account-1",
    code: "1000",
    name: "Cash",
    type: "asset",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "account-2",
    code: "2000",
    name: "Accounts Payable",
    type: "liability",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "account-3",
    code: "3000",
    name: "Owner Equity",
    type: "equity",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "account-4",
    code: "4000",
    name: "Sales Revenue",
    type: "revenue",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

const ledgerEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    journalEntryId: "journal-1",
    accountCode: "1000",
    debit: 10000000,
    credit: 0,
    balance: 10000000,
    reference: "CAP-001",
    description: "Capital received",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-1",
    accountCode: "3000",
    debit: 0,
    credit: 10000000,
    balance: -10000000,
    reference: "CAP-001",
    description: "Owner capital",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-3",
    journalEntryId: "journal-2",
    accountCode: "1000",
    debit: 5000000,
    credit: 0,
    balance: 15000000,
    reference: "LOAN-001",
    description: "Loan received",
    postedAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "ledger-4",
    journalEntryId: "journal-2",
    accountCode: "2000",
    debit: 0,
    credit: 5000000,
    balance: -5000000,
    reference: "LOAN-001",
    description: "Loan payable",
    postedAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "ledger-5",
    journalEntryId: "journal-3",
    accountCode: "4000",
    debit: 0,
    credit: 2000000,
    balance: -2000000,
    reference: "REV-001",
    description: "Sales revenue",
    postedAt: "2026-01-03T00:00:00.000Z"
  }
];

const unbalancedLedgerEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    journalEntryId: "journal-1",
    accountCode: "1000",
    debit: 10000000,
    credit: 0,
    balance: 10000000,
    reference: "CAP-001",
    description: "Capital received",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-1",
    accountCode: "3000",
    debit: 0,
    credit: 8000000,
    balance: -8000000,
    reference: "CAP-001",
    description: "Owner capital",
    postedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("balanceSheetService", () => {
  it("filters asset ledger entries", () => {
    const result = filterLedgerEntriesByBalanceSheetType(
      ledgerEntries,
      accounts,
      "asset"
    );

    expect(result).toHaveLength(2);
    expect(result[0].accountCode).toBe("1000");
  });

  it("filters liability ledger entries", () => {
    const result = filterLedgerEntriesByBalanceSheetType(
      ledgerEntries,
      accounts,
      "liability"
    );

    expect(result).toHaveLength(1);
    expect(result[0].accountCode).toBe("2000");
  });

  it("filters equity ledger entries", () => {
    const result = filterLedgerEntriesByBalanceSheetType(
      ledgerEntries,
      accounts,
      "equity"
    );

    expect(result).toHaveLength(1);
    expect(result[0].accountCode).toBe("3000");
  });

  it("calculates asset total", () => {
    expect(
      calculateAssetTotal(
        ledgerEntries,
        accounts
      )
    ).toBe(15000000);
  });

  it("calculates liability total", () => {
    expect(
      calculateLiabilityTotal(
        ledgerEntries,
        accounts
      )
    ).toBe(5000000);
  });

  it("calculates equity total", () => {
    expect(
      calculateEquityTotal(
        ledgerEntries,
        accounts
      )
    ).toBe(10000000);
  });

  it("checks balanced balance sheet", () => {
    expect(
      isBalanceSheetBalanced(
        15000000,
        5000000,
        10000000
      )
    ).toBe(true);
  });

  it("checks unbalanced balance sheet", () => {
    expect(
      isBalanceSheetBalanced(
        10000000,
        0,
        8000000
      )
    ).toBe(false);
  });

  it("generates balance sheet report", () => {
    const report = generateBalanceSheetReport(
      ledgerEntries,
      accounts
    );

    expect(report).toEqual({
      totalAssets: 15000000,
      totalLiabilities: 5000000,
      totalEquity: 10000000,
      totalLiabilitiesAndEquity: 15000000,
      isBalanced: true
    });
  });

  it("generates unbalanced balance sheet report", () => {
    const report = generateBalanceSheetReport(
      unbalancedLedgerEntries,
      accounts
    );

    expect(report).toEqual({
      totalAssets: 10000000,
      totalLiabilities: 0,
      totalEquity: 8000000,
      totalLiabilitiesAndEquity: 8000000,
      isBalanced: false
    });
  });
});