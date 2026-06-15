import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  postJournalToLedger,
  getLedgerByAccount,
  calculateRunningBalance,
  getAccountBalance,
  getLedgerByPeriod,
  generateLedgerSummary
} from "../services/generalLedgerService";

import type {
  JournalEntry,
  LedgerEntry
} from "../types/finance.types";

const postedJournal: JournalEntry = {
  id: "journal-1",
  reference: "INV-001",
  description: "Sales transaction",
  status: "posted",
  createdAt: "2026-01-01T00:00:00.000Z",
  postedAt: "2026-01-01T01:00:00.000Z",
  lines: [
    {
      accountCode: "1000",
      debit: 1000000,
      credit: 0
    },
    {
      accountCode: "4000",
      debit: 0,
      credit: 1000000
    }
  ]
};

const ledgerEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    journalEntryId: "journal-1",
    accountCode: "1000",
    debit: 5000000,
    credit: 0,
    balance: 5000000,
    reference: "INV-001",
    description: "Sales",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-2",
    accountCode: "1000",
    debit: 0,
    credit: 1000000,
    balance: -1000000,
    reference: "PAY-001",
    description: "Payment",
    postedAt: "2026-01-03T00:00:00.000Z"
  },
  {
    id: "ledger-3",
    journalEntryId: "journal-3",
    accountCode: "1000",
    debit: 2000000,
    credit: 0,
    balance: 2000000,
    reference: "INV-002",
    description: "Sales",
    postedAt: "2026-01-05T00:00:00.000Z"
  },
  {
    id: "ledger-4",
    journalEntryId: "journal-4",
    accountCode: "4000",
    debit: 0,
    credit: 6000000,
    balance: -6000000,
    reference: "REV-001",
    description: "Revenue",
    postedAt: "2026-01-05T00:00:00.000Z"
  }
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "ledger-1"
  });
});

describe("generalLedgerService", () => {
  it("posts journal to ledger", () => {
    const entries = postJournalToLedger(
      postedJournal
    );

    expect(entries).toHaveLength(2);

    expect(entries?.[0]).toMatchObject({
      id: "ledger-1",
      journalEntryId: "journal-1",
      accountCode: "1000",
      debit: 1000000,
      credit: 0,
      balance: 1000000,
      reference: "INV-001",
      description: "Sales transaction"
    });

    expect(entries?.[0].postedAt).toBeTruthy();
  });

  it("blocks non-posted journal from ledger", () => {
    const entries = postJournalToLedger({
      ...postedJournal,
      status: "draft"
    });

    expect(entries).toBeNull();
  });

  it("gets ledger by account", () => {
    const result = getLedgerByAccount(
      ledgerEntries,
      "1000"
    );

    expect(result).toHaveLength(3);
    expect(result[0].accountCode).toBe("1000");
  });

  it("calculates running balance", () => {
    const result = calculateRunningBalance(
      getLedgerByAccount(
        ledgerEntries,
        "1000"
      )
    );

    expect(
      result.map(entry => entry.balance)
    ).toEqual([
      5000000,
      4000000,
      6000000
    ]);
  });

  it("gets account balance", () => {
    const balance = getAccountBalance(
      ledgerEntries,
      "1000"
    );

    expect(balance).toBe(6000000);
  });

  it("filters ledger by period", () => {
    const result = getLedgerByPeriod(
      ledgerEntries,
      "2026-01-02T00:00:00.000Z",
      "2026-01-05T00:00:00.000Z"
    );

    expect(result).toHaveLength(3);
  });

  it("generates ledger summary", () => {
    const summary = generateLedgerSummary(
      ledgerEntries
    );

    expect(summary).toEqual({
      totalDebit: 7000000,
      totalCredit: 7000000,
      transactionCount: 4
    });
  });
});