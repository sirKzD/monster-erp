import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildInvestmentSummary,
  calculateInvestmentGainLoss,
  calculateInvestmentReturnPercentage,
  calculateTotalInvestmentCurrentValue,
  calculateTotalInvestmentInitialAmount,
  countActiveInvestments,
  countSoldInvestments,
  createInvestment,
  sellInvestment,
  updateInvestmentValue
} from "../services/investmentPortfolioService";

import type {
  Investment
} from "../types/finance.types";

const investments: Investment[] = [
  {
    id: "investment-1",
    name: "Government Bond",
    type: "bond",
    initialAmount: 100000000,
    currentValue: 110000000,
    acquiredAt: "2026-01-01",
    status: "active"
  },
  {
    id: "investment-2",
    name: "Blue Chip Stock",
    type: "stock",
    initialAmount: 50000000,
    currentValue: 45000000,
    acquiredAt: "2026-02-01",
    status: "active"
  },
  {
    id: "investment-3",
    name: "Money Market Fund",
    type: "mutual_fund",
    initialAmount: 30000000,
    currentValue: 33000000,
    acquiredAt: "2026-03-01",
    status: "sold"
  }
];

describe("investmentPortfolioService", () => {
  it("creates investment", () => {
    const investment =
      createInvestment(
        investments[0]
      );

    expect(
      investment.id
    ).toBe("investment-1");
  });

  it("sells investment", () => {
    const investment =
      sellInvestment(
        investments[0]
      );

    expect(
      investment.status
    ).toBe("sold");
  });

  it("updates investment value", () => {
    const investment =
      updateInvestmentValue(
        investments[0],
        120000000
      );

    expect(
      investment.currentValue
    ).toBe(120000000);
  });

  it("calculates investment gain loss", () => {
    expect(
      calculateInvestmentGainLoss(
        investments[0]
      )
    ).toBe(10000000);
  });

  it("calculates investment return percentage", () => {
    expect(
      calculateInvestmentReturnPercentage(
        investments[0]
      )
    ).toBe(10);
  });

  it("returns zero return percentage when initial amount is zero", () => {
    expect(
      calculateInvestmentReturnPercentage({
        ...investments[0],
        initialAmount: 0
      })
    ).toBe(0);
  });

  it("calculates total initial amount", () => {
    expect(
      calculateTotalInvestmentInitialAmount(
        investments
      )
    ).toBe(180000000);
  });

  it("calculates total current value", () => {
    expect(
      calculateTotalInvestmentCurrentValue(
        investments
      )
    ).toBe(188000000);
  });

  it("counts active investments", () => {
    expect(
      countActiveInvestments(
        investments
      )
    ).toBe(2);
  });

  it("counts sold investments", () => {
    expect(
      countSoldInvestments(
        investments
      )
    ).toBe(1);
  });

  it("builds investment summary", () => {
    expect(
      buildInvestmentSummary(
        investments
      )
    ).toEqual({
      totalInitialAmount: 180000000,
      totalCurrentValue: 188000000,
      totalGainLoss: 8000000,
      returnPercentage: 4.44,
      activeInvestmentCount: 2,
      soldInvestmentCount: 1
    });
  });

  it("handles empty investments", () => {
    expect(
      buildInvestmentSummary(
        []
      )
    ).toEqual({
      totalInitialAmount: 0,
      totalCurrentValue: 0,
      totalGainLoss: 0,
      returnPercentage: 0,
      activeInvestmentCount: 0,
      soldInvestmentCount: 0
    });
  });
});