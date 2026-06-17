import { describe, expect, test, beforeEach } from "vitest";
import { investmentPerformanceService } from "../services/investmentPerformanceService";

describe("investmentPerformanceService", () => {
  beforeEach(() => {
    investmentPerformanceService.clearInvestmentPerformanceData();
  });

  const performance = {
    id: "PERF-001",
    portfolioId: "PORT-001",
    evaluationDate: "2026-01-01",
    totalInvestedAmount: 100000,
    currentMarketValue: 125000,
    realizedGain: 10000,
    unrealizedGain: 12000,
    dividendIncome: 3000,
    totalReturn: 25000,
    totalReturnPercentage: 25,
    annualizedReturnPercentage: 12,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  };

  test("create performance", () => {
    const result =
      investmentPerformanceService.createPerformance(
        performance,
      );

    expect(result.id).toBe("PERF-001");
  });

  test("prevent duplicate id", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    expect(() =>
      investmentPerformanceService.createPerformance(
        performance,
      ),
    ).toThrow();
  });

  test("update performance", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    const updated =
      investmentPerformanceService.updatePerformance(
        performance.id,
        {
          totalReturnPercentage: 30,
        },
      );

    expect(updated.totalReturnPercentage).toBe(30);
  });

  test("delete performance", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    investmentPerformanceService.deletePerformance(
      performance.id,
    );

    expect(
      investmentPerformanceService.getAllPerformances(),
    ).toHaveLength(0);
  });

  test("get by id", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    expect(
      investmentPerformanceService.getPerformanceById(
        performance.id,
      ),
    ).toBeDefined();
  });

  test("get all", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    expect(
      investmentPerformanceService.getAllPerformances(),
    ).toHaveLength(1);
  });

  test("calculate total return", () => {
    expect(
      investmentPerformanceService.calculateTotalReturn(
        1000,
        2000,
        500,
      ),
    ).toBe(3500);
  });

  test("calculate return percentage", () => {
    expect(
      investmentPerformanceService.calculateReturnPercentage(
        25000,
        100000,
      ),
    ).toBe(25);
  });

  test("calculate annualized return", () => {
    const result =
      investmentPerformanceService.calculateAnnualizedReturn(
        100000,
        121000,
        2,
      );

    expect(result).toBeGreaterThan(0);
  });

  test("top performing investment", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    const top =
      investmentPerformanceService.getTopPerformingInvestments();

    expect(top[0].id).toBe("PERF-001");
  });

  test("performance summary", () => {
    investmentPerformanceService.createPerformance(
      performance,
    );

    const summary =
      investmentPerformanceService.getPortfolioPerformanceSummary();

    expect(summary.totalPortfolios).toBe(1);
    expect(summary.totalReturn).toBe(25000);
  });

  test("update missing performance", () => {
    expect(() =>
      investmentPerformanceService.updatePerformance(
        "UNKNOWN",
        {},
      ),
    ).toThrow();
  });

  test("delete missing performance", () => {
    expect(() =>
      investmentPerformanceService.deletePerformance(
        "UNKNOWN",
      ),
    ).toThrow();
  });
});