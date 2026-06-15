import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from "vitest";

import {
  calculateActualAmountForBudget,
  calculateBudgetVariance,
  closeBudget,
  createBudget,
  createBudgetVariance,
  filterActiveBudgets,
  getBudgetVarianceStatus
} from "../services/budgetService";

import type {
  Budget,
  LedgerEntry
} from "../types/finance.types";

const ledgerEntries: LedgerEntry[] = [
  {
    id: "ledger-1",
    journalEntryId: "journal-1",
    accountCode: "5000",
    debit: 3000,
    credit: 0,
    balance: 3000,
    reference: "EXP-001",
    description: "Salary expense",
    postedAt: "2026-01-10"
  },
  {
    id: "ledger-2",
    journalEntryId: "journal-2",
    accountCode: "5000",
    debit: 2000,
    credit: 0,
    balance: 5000,
    reference: "EXP-002",
    description: "Office expense",
    postedAt: "2026-01-20"
  },
  {
    id: "ledger-3",
    journalEntryId: "journal-3",
    accountCode: "5000",
    debit: 1000,
    credit: 0,
    balance: 6000,
    reference: "EXP-003",
    description: "February expense",
    postedAt: "2026-02-01"
  }
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "budget-1"
  });
});

describe("budgetService", () => {
  it("creates budget", () => {
    const budget = createBudget(
      " 5000 ",
      " 2026-01 ",
      6000
    );

    expect(budget).toMatchObject({
      id: "budget-1",
      accountCode: "5000",
      period: "2026-01",
      plannedAmount: 6000,
      status: "active"
    });

    expect(budget?.createdAt).toBeTruthy();
  });

  it("blocks negative planned amount", () => {
    expect(
      createBudget(
        "5000",
        "2026-01",
        -1
      )
    ).toBeNull();
  });

  it("closes active budget", () => {
    const budget = createBudget(
      "5000",
      "2026-01",
      6000
    )!;

    const closed = closeBudget(budget);

    expect(closed?.status).toBe("closed");
  });

  it("blocks closing already closed budget", () => {
    const budget = createBudget(
      "5000",
      "2026-01",
      6000
    )!;

    const closed = closeBudget(budget)!;
    const again = closeBudget(closed);

    expect(again).toBeNull();
  });

  it("calculates actual amount for budget period", () => {
    const budget = createBudget(
      "5000",
      "2026-01",
      6000
    )!;

    expect(
      calculateActualAmountForBudget(
        budget,
        ledgerEntries
      )
    ).toBe(5000);
  });

  it("calculates budget variance", () => {
    expect(
      calculateBudgetVariance(
        6000,
        5000
      )
    ).toBe(1000);
  });

  it("gets under budget status", () => {
    expect(
      getBudgetVarianceStatus(1000)
    ).toBe("under_budget");
  });

  it("gets on budget status", () => {
    expect(
      getBudgetVarianceStatus(0)
    ).toBe("on_budget");
  });

  it("gets over budget status", () => {
    expect(
      getBudgetVarianceStatus(-1000)
    ).toBe("over_budget");
  });

  it("creates budget variance", () => {
    const budget = createBudget(
      "5000",
      "2026-01",
      6000
    )!;

    expect(
      createBudgetVariance(
        budget,
        ledgerEntries
      )
    ).toEqual({
      accountCode: "5000",
      period: "2026-01",
      plannedAmount: 6000,
      actualAmount: 5000,
      variance: 1000,
      status: "under_budget"
    });
  });

  it("filters active budgets", () => {
    const active = createBudget(
      "5000",
      "2026-01",
      6000
    )!;

    const closed = closeBudget(
      createBudget(
        "6000",
        "2026-01",
        3000
      )!
    )!;

    const result = filterActiveBudgets([
      active,
      closed
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });
});