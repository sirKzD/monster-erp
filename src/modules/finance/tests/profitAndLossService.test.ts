import {
  describe,
  it,
  expect
} from "vitest";

import {
  filterLedgerEntriesByAccountType,
  calculateRevenueTotal,
  calculateExpenseTotal,
  getProfitAndLossStatus,
  generateProfitAndLossReport
} from "../services/profitAndLossService";

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
    code: "4000",
    name: "Sales Revenue",
    type: "revenue",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "account-3",
    code: "5000",
    name: "Salary Expense",
    type: "expense",
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
    reference: "INV-001",
    description: "Cash received",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-1",
    accountCode: "4000",
    debit: 0,
    credit: 10000000,
    balance: -10000000,
    reference: "INV-001",
    description: "Sales revenue",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-3",
    journalEntryId: "journal-2",
    accountCode: "5000",
    debit: 3000000,
    credit: 0,
    balance: 3000000,
    reference: "PAYROLL-001",
    description: "Salary expense",
    postedAt: "2026-01-02T00:00:00.000Z"
  }
];

describe("profitAndLossService", () => {
  it("filters revenue ledger entries", () => {
    const result = filterLedgerEntriesByAccountType(
      ledgerEntries,
      accounts,
      "revenue"
    );

    expect(result).toHaveLength(1);
    expect(result[0].accountCode).toBe("4000");
  });

  it("filters expense ledger entries", () => {
    const result = filterLedgerEntriesByAccountType(
      ledgerEntries,
      accounts,
      "expense"
    );

    expect(result).toHaveLength(1);
    expect(result[0].accountCode).toBe("5000");
  });

  it("calculates revenue total", () => {
    expect(
      calculateRevenueTotal(
        ledgerEntries,
        accounts
      )
    ).toBe(10000000);
  });

  it("calculates expense total", () => {
    expect(
      calculateExpenseTotal(
        ledgerEntries,
        accounts
      )
    ).toBe(3000000);
  });

  it("gets profit status", () => {
    expect(
      getProfitAndLossStatus(1000000)
    ).toBe("profit");
  });

  it("gets loss status", () => {
    expect(
      getProfitAndLossStatus(-1000000)
    ).toBe("loss");
  });

  it("gets break even status", () => {
    expect(
      getProfitAndLossStatus(0)
    ).toBe("break_even");
  });

  it("generates profit and loss report", () => {
    const report = generateProfitAndLossReport(
      ledgerEntries,
      accounts
    );

    expect(report).toEqual({
      totalRevenue: 10000000,
      totalExpense: 3000000,
      netIncome: 7000000,
      status: "profit"
    });
  });
});