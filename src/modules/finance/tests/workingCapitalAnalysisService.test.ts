import { describe, expect, it } from "vitest";
import { workingCapitalAnalysisService } from "../services/workingCapitalAnalysisService";
import { WorkingCapitalAnalysis } from "../types/finance.types";

describe("workingCapitalAnalysisService", () => {
  it("calculates working capital", () => {
    expect(
      workingCapitalAnalysisService.calculateWorkingCapital(
        500000,
        300000,
      ),
    ).toBe(200000);
  });

  it("calculates current ratio", () => {
    expect(
      workingCapitalAnalysisService.calculateCurrentRatio(
        500000,
        250000,
      ),
    ).toBe(2);
  });

  it("returns zero current ratio when liabilities are zero", () => {
    expect(
      workingCapitalAnalysisService.calculateCurrentRatio(
        100000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates working capital turnover", () => {
    expect(
      workingCapitalAnalysisService.calculateWorkingCapitalTurnover(
        1000000,
        200000,
      ),
    ).toBe(5);
  });

  it("returns zero turnover when working capital is zero", () => {
    expect(
      workingCapitalAnalysisService.calculateWorkingCapitalTurnover(
        1000000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates inventory days", () => {
    expect(
      Math.round(
        workingCapitalAnalysisService.calculateInventoryDays(
          100000,
          500000,
        ),
      ),
    ).toBe(73);
  });

  it("calculates receivable days", () => {
    expect(
      Math.round(
        workingCapitalAnalysisService.calculateReceivableDays(
          100000,
          1000000,
        ),
      ),
    ).toBe(37);
  });

  it("calculates payable days", () => {
    expect(
      Math.round(
        workingCapitalAnalysisService.calculatePayableDays(
          50000,
          500000,
        ),
      ),
    ).toBe(37);
  });

  it("calculates cash conversion cycle", () => {
    expect(
      workingCapitalAnalysisService.calculateCashConversionCycle(
        70,
        40,
        30,
      ),
    ).toBe(80);
  });

  it("generates weak liquidity summary", () => {
    const analysis: WorkingCapitalAnalysis = {
      id: "WC-001",
      analysisDate: "2026-01-01",

      currentAssets: 500000,
      currentLiabilities: 600000,

      inventory: 100000,
      accountsReceivable: 80000,
      accountsPayable: 70000,

      annualRevenue: 1000000,
      annualCostOfGoodsSold: 500000,

      workingCapital: -100000,
      currentRatio: 0.83,
      workingCapitalTurnover: 0,

      inventoryDays: 73,
      receivableDays: 29,
      payableDays: 51,

      cashConversionCycle: 51,

      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    expect(
      workingCapitalAnalysisService.generateWorkingCapitalSummary(
        analysis,
      ).liquidityStatus,
    ).toBe("WEAK");
  });

  it("generates stable liquidity summary", () => {
    const analysis = {
      workingCapital: 100000,
      currentRatio: 1.5,
      workingCapitalTurnover: 5,
      cashConversionCycle: 60,
    } as WorkingCapitalAnalysis;

    expect(
      workingCapitalAnalysisService.generateWorkingCapitalSummary(
        analysis,
      ).liquidityStatus,
    ).toBe("STABLE");
  });

  it("generates strong liquidity summary", () => {
    const analysis = {
      workingCapital: 200000,
      currentRatio: 2.5,
      workingCapitalTurnover: 6,
      cashConversionCycle: 40,
    } as WorkingCapitalAnalysis;

    expect(
      workingCapitalAnalysisService.generateWorkingCapitalSummary(
        analysis,
      ).liquidityStatus,
    ).toBe("STRONG");
  });
});