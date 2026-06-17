import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildDividendSummary,
  calculateAverageDividend,
  calculateTotalDividend,
  createDividendPayment,
  getDividendPaymentsByInvestment,
  getLatestDividendPayment
} from "../services/dividendManagementService";

import type {
  DividendPayment
} from "../types/finance.types";

const payments: DividendPayment[] = [
  {
    id: "dividend-1",
    investmentId: "investment-1",
    paymentDate: "2026-03-01",
    amount: 2000000
  },
  {
    id: "dividend-2",
    investmentId: "investment-1",
    paymentDate: "2026-06-01",
    amount: 2500000
  },
  {
    id: "dividend-3",
    investmentId: "investment-2",
    paymentDate: "2026-04-01",
    amount: 1500000
  }
];

describe("dividendManagementService", () => {
  it("creates dividend payment", () => {
    expect(
      createDividendPayment(
        payments[0]
      )
    ).toEqual(payments[0]);
  });

  it("calculates total dividend", () => {
    expect(
      calculateTotalDividend(
        payments
      )
    ).toBe(6000000);
  });

  it("calculates average dividend", () => {
    expect(
      calculateAverageDividend(
        payments
      )
    ).toBe(2000000);
  });

  it("returns zero average dividend when empty", () => {
    expect(
      calculateAverageDividend([])
    ).toBe(0);
  });

  it("gets dividend payments by investment", () => {
    expect(
      getDividendPaymentsByInvestment(
        "investment-1",
        payments
      )
    ).toHaveLength(2);
  });

  it("returns empty investment dividends", () => {
    expect(
      getDividendPaymentsByInvestment(
        "investment-999",
        payments
      )
    ).toHaveLength(0);
  });

  it("gets latest dividend payment", () => {
    expect(
      getLatestDividendPayment(
        payments
      )?.id
    ).toBe("dividend-2");
  });

  it("returns null latest dividend when empty", () => {
    expect(
      getLatestDividendPayment([])
    ).toBeNull();
  });

  it("builds dividend summary", () => {
    expect(
      buildDividendSummary(
        payments
      )
    ).toEqual({
      totalDividend: 6000000,
      paymentCount: 3,
      averageDividend: 2000000
    });
  });

  it("builds empty dividend summary", () => {
    expect(
      buildDividendSummary([])
    ).toEqual({
      totalDividend: 0,
      paymentCount: 0,
      averageDividend: 0
    });
  });
});