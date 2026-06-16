import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  buildFinancialClosingSummary,
  canCloseFinancialPeriod,
  closeFinancialPeriod,
  createFinancialClosing,
  filterClosedFinancialClosings,
  reopenFinancialClosing
} from "../services/financialClosingService";

import type {
  AccountingPeriod,
  FinancialClosing,
  TrialBalanceReport
} from "../types/finance.types";

const period: AccountingPeriod = {
  id: "period-1",
  name: "January 2026",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  status: "open",
  createdAt: "2026-01-01"
};

const balancedTrialBalance: TrialBalanceReport = {
  lines: [],
  totalDebit: 10000000,
  totalCredit: 10000000,
  isBalanced: true
};

const unbalancedTrialBalance: TrialBalanceReport = {
  lines: [],
  totalDebit: 10000000,
  totalCredit: 9000000,
  isBalanced: false
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "closing-1"
  });
});

describe("financialClosingService", () => {
  it("creates financial closing draft", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    );

    expect(closing).toMatchObject({
      id: "closing-1",
      periodId: "period-1",
      trialBalanceTotalDebit: 10000000,
      trialBalanceTotalCredit: 10000000,
      status: "draft"
    });

    expect(closing?.createdAt).toBeTruthy();
  });

  it("blocks creating closing for non open period", () => {
    const closing = createFinancialClosing(
      {
        ...period,
        status: "closed"
      },
      balancedTrialBalance
    );

    expect(closing).toBeNull();
  });

  it("allows closing balanced draft", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    expect(
      canCloseFinancialPeriod(closing)
    ).toBe(true);
  });

  it("blocks closing unbalanced draft", () => {
    const closing = createFinancialClosing(
      period,
      unbalancedTrialBalance
    )!;

    expect(
      canCloseFinancialPeriod(closing)
    ).toBe(false);
  });

  it("closes financial period", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    const closed =
      closeFinancialPeriod(closing);

    expect(closed?.status).toBe("closed");
    expect(closed?.closedAt).toBeTruthy();
  });

  it("blocks closing already closed period", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    const closed =
      closeFinancialPeriod(closing)!;

    expect(
      closeFinancialPeriod(closed)
    ).toBeNull();
  });

  it("reopens closed financial closing", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    const closed =
      closeFinancialPeriod(closing)!;

    const reopened =
      reopenFinancialClosing(closed);

    expect(reopened?.status).toBe(
      "reopened"
    );

    expect(reopened?.reopenedAt).toBeTruthy();
  });

  it("blocks reopening non closed financial closing", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    expect(
      reopenFinancialClosing(closing)
    ).toBeNull();
  });

  it("builds financial closing summary", () => {
    const closing = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    expect(
      buildFinancialClosingSummary(closing)
    ).toEqual({
      periodId: "period-1",
      isTrialBalanceBalanced: true,
      totalDebit: 10000000,
      totalCredit: 10000000,
      status: "draft"
    });
  });

  it("filters closed financial closings", () => {
    const draft = createFinancialClosing(
      period,
      balancedTrialBalance
    )!;

    const closed = closeFinancialPeriod(
      createFinancialClosing(
        period,
        balancedTrialBalance
      )!
    )!;

    const closings: FinancialClosing[] = [
      draft,
      closed
    ];

    const result =
      filterClosedFinancialClosings(
        closings
      );

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("closed");
  });
});