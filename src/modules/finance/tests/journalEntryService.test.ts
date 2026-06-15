import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculateTotalDebit,
  calculateTotalCredit,
  isJournalBalanced,
  validateJournalEntryLines,
  createJournalEntry,
  postJournalEntry,
  cancelJournalEntry
} from "../services/journalEntryService";

import type {
  Account,
  JournalEntryLine
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
    isActive: false,
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];

const balancedLines: JournalEntryLine[] = [
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
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "journal-1"
  });
});

describe("journalEntryService", () => {
  it("calculates total debit", () => {
    expect(
      calculateTotalDebit(balancedLines)
    ).toBe(1000000);
  });

  it("calculates total credit", () => {
    expect(
      calculateTotalCredit(balancedLines)
    ).toBe(1000000);
  });

  it("checks balanced journal", () => {
    expect(
      isJournalBalanced(balancedLines)
    ).toBe(true);
  });

  it("rejects unbalanced journal", () => {
    expect(
      isJournalBalanced([
        {
          accountCode: "1000",
          debit: 1000000,
          credit: 0
        },
        {
          accountCode: "4000",
          debit: 0,
          credit: 500000
        }
      ])
    ).toBe(false);
  });

  it("validates journal entry lines", () => {
    expect(
      validateJournalEntryLines(
        accounts,
        balancedLines
      )
    ).toBe(true);
  });

  it("rejects invalid journal lines", () => {
    expect(
      validateJournalEntryLines(
        accounts,
        [
          {
            accountCode: "1000",
            debit: 1000000,
            credit: 1000000
          }
        ]
      )
    ).toBe(false);

    expect(
      validateJournalEntryLines(
        accounts,
        [
          {
            accountCode: "9999",
            debit: 1000000,
            credit: 0
          },
          {
            accountCode: "4000",
            debit: 0,
            credit: 1000000
          }
        ]
      )
    ).toBe(false);

    expect(
      validateJournalEntryLines(
        accounts,
        [
          {
            accountCode: "5000",
            debit: 1000000,
            credit: 0
          },
          {
            accountCode: "4000",
            debit: 0,
            credit: 1000000
          }
        ]
      )
    ).toBe(false);
  });

  it("creates journal entry", () => {
    const entry = createJournalEntry(
      accounts,
      " INV-001 ",
      " Sales transaction ",
      balancedLines
    );

    expect(entry).toMatchObject({
      id: "journal-1",
      reference: "INV-001",
      description: "Sales transaction",
      status: "draft",
      lines: balancedLines
    });

    expect(entry?.createdAt).toBeTruthy();
  });

  it("blocks unbalanced journal entry creation", () => {
    const entry = createJournalEntry(
      accounts,
      "INV-002",
      "Invalid transaction",
      [
        {
          accountCode: "1000",
          debit: 1000000,
          credit: 0
        },
        {
          accountCode: "4000",
          debit: 0,
          credit: 500000
        }
      ]
    );

    expect(entry).toBeNull();
  });

  it("posts draft journal entry", () => {
    const entry = createJournalEntry(
      accounts,
      "INV-001",
      "Sales transaction",
      balancedLines
    )!;

    const posted = postJournalEntry(entry);

    expect(posted?.status).toBe("posted");
    expect(posted?.postedAt).toBeTruthy();
  });

  it("blocks posting non-draft journal entry", () => {
    const entry = createJournalEntry(
      accounts,
      "INV-001",
      "Sales transaction",
      balancedLines
    )!;

    const posted = postJournalEntry(entry)!;
    const again = postJournalEntry(posted);

    expect(again).toBeNull();
  });

  it("cancels draft journal entry", () => {
    const entry = createJournalEntry(
      accounts,
      "INV-001",
      "Sales transaction",
      balancedLines
    )!;

    const cancelled = cancelJournalEntry(entry);

    expect(cancelled?.status).toBe("cancelled");
  });
});