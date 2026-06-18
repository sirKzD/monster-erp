import { describe, expect, it } from "vitest";
import { cashConversionCycleAnalysisService } from "../services/cashConversionCycleAnalysisService";
import { CashConversionCycleAnalysis } from "../types/finance.types";

describe("cashConversionCycleAnalysisService", () => {
  it("calculates inventory days", () => {
    expect(
      Math.round(
        cashConversionCycleAnalysisService.calculateInventoryDays(
          100000,
          500000,
        ),
      ),
    ).toBe(73);
  });

  it("returns zero inventory days when COGS is zero", () => {
    expect(
      cashConversionCycleAnalysisService.calculateInventoryDays(
        100000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates receivable days", () => {
    expect(
      Math.round(
        cashConversionCycleAnalysisService.calculateReceivableDays(
          100000,
          1000000,
        ),
      ),
    ).toBe(37);
  });

  it("returns zero receivable days when revenue is zero", () => {
    expect(
      cashConversionCycleAnalysisService.calculateReceivableDays(
        100000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates payable days", () => {
    expect(
      Math.round(
        cashConversionCycleAnalysisService.calculatePayableDays(
          50000,
          500000,
        ),
      ),
    ).toBe(37);
  });

  it("returns zero payable days when COGS is zero", () => {
    expect(
      cashConversionCycleAnalysisService.calculatePayableDays(
        50000,
        0,
      ),
    ).toBe(0);
  });

  it("calculates cash conversion cycle", () => {
    expect(
      cashConversionCycleAnalysisService.calculateCashConversionCycle(
        70,
        40,
        30,
      ),
    ).toBe(80);
  });

  it("calculates efficiency score", () => {
    expect(
      cashConversionCycleAnalysisService.calculateEfficiencyScore(
        30,
      ),
    ).toBe(83);
  });

  it("returns 100 score for negative cycle", () => {
    expect(
      cashConversionCycleAnalysisService.calculateEfficiencyScore(
        -10,
      ),
    ).toBe(100);
  });

  it("generates excellent status", () => {
    const analysis = {
      inventoryDays: 10,
      receivableDays: 10,
      payableDays: 10,
      cashConversionCycle: 10,
      efficiencyScore: 94,
    } as CashConversionCycleAnalysis;

    expect(
      cashConversionCycleAnalysisService.generateCashConversionCycleSummary(
        analysis,
      ).cycleStatus,
    ).toBe("EXCELLENT");
  });

  it("generates good status", () => {
    const analysis = {
      inventoryDays: 20,
      receivableDays: 30,
      payableDays: 10,
      cashConversionCycle: 40,
      efficiencyScore: 78,
    } as CashConversionCycleAnalysis;

    expect(
      cashConversionCycleAnalysisService.generateCashConversionCycleSummary(
        analysis,
      ).cycleStatus,
    ).toBe("GOOD");
  });

  it("generates fair status", () => {
    const analysis = {
      inventoryDays: 40,
      receivableDays: 50,
      payableDays: 20,
      cashConversionCycle: 70,
      efficiencyScore: 61,
    } as CashConversionCycleAnalysis;

    expect(
      cashConversionCycleAnalysisService.generateCashConversionCycleSummary(
        analysis,
      ).cycleStatus,
    ).toBe("FAIR");
  });

  it("generates poor status", () => {
    const analysis = {
      inventoryDays: 80,
      receivableDays: 80,
      payableDays: 20,
      cashConversionCycle: 140,
      efficiencyScore: 22,
    } as CashConversionCycleAnalysis;

    expect(
      cashConversionCycleAnalysisService.generateCashConversionCycleSummary(
        analysis,
      ).cycleStatus,
    ).toBe("POOR");
  });
});