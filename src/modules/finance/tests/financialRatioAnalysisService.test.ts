import {
  describe,
  expect,
  it
} from "vitest";

import {
  calculateCurrentRatio,
  calculateFinancialDebtRatio,
  calculateFinancialRatioGrade,
  calculateNetProfitMargin,
  calculateReturnOnAssets,
  calculateReturnOnEquity,
  createFinancialRatioAnalysis
} from "../services/financialRatioAnalysisService";

describe("financialRatioAnalysisService", () => {
  it("calculates current ratio", () => {
    expect(
      calculateCurrentRatio(
        20000000,
        10000000
      )
    ).toBe(2);
  });

  it("returns zero current ratio when liabilities are zero", () => {
    expect(
      calculateCurrentRatio(
        20000000,
        0
      )
    ).toBe(0);
  });

  it("calculates debt ratio", () => {
    expect(
      calculateFinancialDebtRatio(
        30000000,
        100000000
      )
    ).toBe(0.3);
  });

  it("returns zero debt ratio when assets are zero", () => {
    expect(
      calculateFinancialDebtRatio(
        30000000,
        0
      )
    ).toBe(0);
  });

  it("calculates net profit margin", () => {
    expect(
      calculateNetProfitMargin(
        25000000,
        100000000
      )
    ).toBe(0.25);
  });

  it("calculates return on assets", () => {
    expect(
      calculateReturnOnAssets(
        12000000,
        100000000
      )
    ).toBe(0.12);
  });

  it("calculates return on equity", () => {
    expect(
      calculateReturnOnEquity(
        15000000,
        60000000
      )
    ).toBe(0.25);
  });

  it("calculates excellent financial ratio grade", () => {
    expect(
      calculateFinancialRatioGrade({
        currentRatio: 2,
        debtRatio: 0.3,
        netProfitMargin: 0.25,
        returnOnAssets: 0.12,
        returnOnEquity: 0.25
      })
    ).toBe("excellent");
  });

  it("calculates healthy financial ratio grade", () => {
    expect(
      calculateFinancialRatioGrade({
        currentRatio: 2,
        debtRatio: 0.5,
        netProfitMargin: 0.15,
        returnOnAssets: 0.08,
        returnOnEquity: 0.12
      })
    ).toBe("healthy");
  });

  it("calculates warning financial ratio grade", () => {
    expect(
      calculateFinancialRatioGrade({
        currentRatio: 1,
        debtRatio: 0.8,
        netProfitMargin: 0.1,
        returnOnAssets: 0.05,
        returnOnEquity: 0.03
      })
    ).toBe("warning");
  });

  it("calculates critical financial ratio grade", () => {
    expect(
      calculateFinancialRatioGrade({
        currentRatio: 0.5,
        debtRatio: 0.9,
        netProfitMargin: -0.1,
        returnOnAssets: -0.05,
        returnOnEquity: -0.1
      })
    ).toBe("critical");
  });

  it("creates financial ratio analysis", () => {
    const analysis =
      createFinancialRatioAnalysis(
        20000000,
        10000000,
        30000000,
        100000000,
        25000000,
        100000000,
        60000000
      );

    expect(analysis).toEqual({
      currentRatio: 2,
      debtRatio: 0.3,
      netProfitMargin: 0.25,
      returnOnAssets: 0.25,
      returnOnEquity: 0.42,
      grade: "excellent"
    });
  });
});