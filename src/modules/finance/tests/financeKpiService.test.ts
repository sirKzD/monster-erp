import {
  describe,
  it,
  expect
} from "vitest";

import {
  calculateProfitMargin,
  calculateDebtRatio,
  calculateCashFlowRatio,
  calculateFinanceGrade,
  createFinanceKpi
} from "../services/financeKpiService";

describe("financeKpiService", () => {
  it("calculates profit margin", () => {
    expect(
      calculateProfitMargin(
        7000000,
        10000000
      )
    ).toBe(70);
  });

  it("returns zero profit margin if revenue is zero", () => {
    expect(
      calculateProfitMargin(
        7000000,
        0
      )
    ).toBe(0);
  });

  it("calculates debt ratio", () => {
    expect(
      calculateDebtRatio(
        5000000,
        15000000
      )
    ).toBe(33);
  });

  it("returns zero debt ratio if assets are zero", () => {
    expect(
      calculateDebtRatio(
        5000000,
        0
      )
    ).toBe(0);
  });

  it("calculates cash flow ratio", () => {
    expect(
      calculateCashFlowRatio(
        10000000,
        10000000
      )
    ).toBe(100);
  });

  it("returns zero cash flow ratio if revenue is zero", () => {
    expect(
      calculateCashFlowRatio(
        10000000,
        0
      )
    ).toBe(0);
  });

  it("calculates finance grade A", () => {
    expect(
      calculateFinanceGrade(
        70,
        30,
        100
      )
    ).toBe("A");
  });

  it("calculates finance grade B", () => {
    expect(
      calculateFinanceGrade(
        40,
        30,
        40
      )
    ).toBe("B");
  });

  it("calculates finance grade C", () => {
    expect(
      calculateFinanceGrade(
        10,
        60,
        20
      )
    ).toBe("C");
  });

  it("creates finance KPI", () => {
    const kpi = createFinanceKpi(
      7000000,
      10000000,
      5000000,
      15000000,
      10000000
    );

    expect(kpi).toEqual({
      profitMargin: 70,
      debtRatio: 33,
      cashFlowRatio: 100,
      grade: "A"
    });
  });
});