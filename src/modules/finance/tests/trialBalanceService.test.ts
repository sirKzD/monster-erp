import {
  describe,
  it,
  expect
} from "vitest";

import {
  groupLedgerEntriesByAccount,
  createTrialBalanceLine,
  calculateTrialBalanceTotalDebit,
  calculateTrialBalanceTotalCredit,
  isTrialBalanceBalanced,
  generateTrialBalance
} from "../services/trialBalanceService";

import type {
  LedgerEntry,
  TrialBalanceLine
} from "../types/finance.types";

const ledgerEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    journalEntryId: "journal-1",
    accountCode: "1000",
    debit: 5000000,
    credit: 0,
    balance: 5000000,
    reference: "INV-001",
    description: "Cash received",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-2",
    accountCode: "1000",
    debit: 2000000,
    credit: 0,
    balance: 7000000,
    reference: "INV-002",
    description: "Cash received",
    postedAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "ledger-3",
    journalEntryId: "journal-3",
    accountCode: "4000",
    debit: 0,
    credit: 7000000,
    balance: -7000000,
    reference: "REV-001",
    description: "Sales revenue",
    postedAt: "2026-01-02T00:00:00.000Z"
  }
];

const unbalancedEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    journalEntryId: "journal-1",
    accountCode: "1000",
    debit: 5000000,
    credit: 0,
    balance: 5000000,
    reference: "INV-001",
    description: "Cash received",
    postedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-2",
    accountCode: "4000",
    debit: 0,
    credit: 3000000,
    balance: -3000000,
    reference: "REV-001",
    description: "Sales revenue",
    postedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("trialBalanceService", () => {
  it("groups ledger entries by account", () => {
    const grouped = groupLedgerEntriesByAccount(
      ledgerEntries
    );

    expect(grouped["1000"]).toHaveLength(2);
    expect(grouped["4000"]).toHaveLength(1);
  });

  it("creates trial balance line", () => {
    const line = createTrialBalanceLine(
      "1000",
      [
        ledgerEntries[0],
        ledgerEntries[1]
      ]
    );

    expect(line).toEqual({
      accountCode: "1000",
      debit: 7000000,
      credit: 0
    });
  });

  it("calculates trial balance total debit", () => {
    const lines: TrialBalanceLine[] = [
      {
        accountCode: "1000",
        debit: 7000000,
        credit: 0
      },
      {
        accountCode: "4000",
        debit: 0,
        credit: 7000000
      }
    ];

    expect(
      calculateTrialBalanceTotalDebit(lines)
    ).toBe(7000000);
  });

  it("calculates trial balance total credit", () => {
    const lines: TrialBalanceLine[] = [
      {
        accountCode: "1000",
        debit: 7000000,
        credit: 0
      },
      {
        accountCode: "4000",
        debit: 0,
        credit: 7000000
      }
    ];

    expect(
      calculateTrialBalanceTotalCredit(lines)
    ).toBe(7000000);
  });

  it("checks balanced trial balance", () => {
    const lines: TrialBalanceLine[] = [
      {
        accountCode: "1000",
        debit: 7000000,
        credit: 0
      },
      {
        accountCode: "4000",
        debit: 0,
        credit: 7000000
      }
    ];

    expect(
      isTrialBalanceBalanced(lines)
    ).toBe(true);
  });

  it("checks unbalanced trial balance", () => {
    const lines: TrialBalanceLine[] = [
      {
        accountCode: "1000",
        debit: 5000000,
        credit: 0
      },
      {
        accountCode: "4000",
        debit: 0,
        credit: 3000000
      }
    ];

    expect(
      isTrialBalanceBalanced(lines)
    ).toBe(false);
  });

  it("generates trial balance report", () => {
    const report = generateTrialBalance(
      ledgerEntries
    );

    expect(report).toEqual({
      lines: [
        {
          accountCode: "1000",
          debit: 7000000,
          credit: 0
        },
        {
          accountCode: "4000",
          debit: 0,
          credit: 7000000
        }
      ],
      totalDebit: 7000000,
      totalCredit: 7000000,
      isBalanced: true
    });
  });

  it("generates unbalanced trial balance report", () => {
    const report = generateTrialBalance(
      unbalancedEntries
    );

    expect(report).toEqual({
      lines: [
        {
          accountCode: "1000",
          debit: 5000000,
          credit: 0
        },
        {
          accountCode: "4000",
          debit: 0,
          credit: 3000000
        }
      ],
      totalDebit: 5000000,
      totalCredit: 3000000,
      isBalanced: false
    });
  });

  it("generates empty trial balance report", () => {
    const report = generateTrialBalance([]);

    expect(report).toEqual({
      lines: [],
      totalDebit: 0,
      totalCredit: 0,
      isBalanced: true
    });
  });
});