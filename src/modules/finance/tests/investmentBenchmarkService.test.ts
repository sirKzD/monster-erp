import {
  describe,
  expect,
  it
} from "vitest";

import type {
  InvestmentBenchmark
} from "../types/finance.types";

import {
  buildInvestmentBenchmarkSummary,
  calculateAverageBenchmarkReturn,
  calculateAverageExcessReturn,
  calculateAveragePortfolioReturn,
  calculateExcessReturn,
  calculateTrackingError,
  createInvestmentBenchmark,
  getBenchmarksByPortfolio,
  getOutperformingBenchmarks,
  getUnderperformingBenchmarks,
  isOutperformingBenchmark,
  updateInvestmentBenchmark
} from "../services/investmentBenchmarkService";

const benchmarks: InvestmentBenchmark[] =
  [
    {
      id: "bm-1",
      portfolioId: "portfolio-1",
      benchmarkName: "IHSG",
      portfolioReturnPercentage: 15,
      benchmarkReturnPercentage: 10,
      excessReturnPercentage: 5,
      trackingErrorPercentage: 5,
      evaluationDate: "2026-01-01",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01"
    },
    {
      id: "bm-2",
      portfolioId: "portfolio-1",
      benchmarkName: "LQ45",
      portfolioReturnPercentage: 8,
      benchmarkReturnPercentage: 10,
      excessReturnPercentage: -2,
      trackingErrorPercentage: 2,
      evaluationDate: "2026-02-01",
      createdAt: "2026-02-01",
      updatedAt: "2026-02-01"
    },
    {
      id: "bm-3",
      portfolioId: "portfolio-2",
      benchmarkName: "NASDAQ",
      portfolioReturnPercentage: 20,
      benchmarkReturnPercentage: 15,
      excessReturnPercentage: 5,
      trackingErrorPercentage: 5,
      evaluationDate: "2026-03-01",
      createdAt: "2026-03-01",
      updatedAt: "2026-03-01"
    }
  ];

describe(
  "investmentBenchmarkService",
  () => {
    it(
      "calculates excess return",
      () => {
        expect(
          calculateExcessReturn(
            15,
            10
          )
        ).toBe(5);
      }
    );

    it(
      "calculates negative excess return",
      () => {
        expect(
          calculateExcessReturn(
            8,
            10
          )
        ).toBe(-2);
      }
    );

    it(
      "calculates tracking error",
      () => {
        expect(
          calculateTrackingError(
            15,
            10
          )
        ).toBe(5);
      }
    );

    it(
      "creates benchmark",
      () => {
        const result =
          createInvestmentBenchmark({
            id: "bm-new",
            portfolioId:
              "portfolio-new",
            benchmarkName: "S&P500",
            portfolioReturnPercentage: 18,
            benchmarkReturnPercentage: 12,
            evaluationDate:
              "2026-04-01",
            createdAt:
              "2026-04-01",
            updatedAt:
              "2026-04-01"
          });

        expect(
          result.excessReturnPercentage
        ).toBe(6);

        expect(
          result.trackingErrorPercentage
        ).toBe(6);
      }
    );

    it(
      "updates benchmark",
      () => {
        const result =
          updateInvestmentBenchmark(
            benchmarks[0],
            {
              portfolioReturnPercentage:
                25
            }
          );

        expect(
          result.excessReturnPercentage
        ).toBe(15);
      }
    );

    it(
      "detects outperforming benchmark",
      () => {
        expect(
          isOutperformingBenchmark(
            benchmarks[0]
          )
        ).toBe(true);
      }
    );

    it(
      "gets outperforming benchmarks",
      () => {
        expect(
          getOutperformingBenchmarks(
            benchmarks
          )
        ).toHaveLength(2);
      }
    );

    it(
      "gets underperforming benchmarks",
      () => {
        expect(
          getUnderperformingBenchmarks(
            benchmarks
          )
        ).toHaveLength(1);
      }
    );

    it(
      "gets benchmarks by portfolio",
      () => {
        expect(
          getBenchmarksByPortfolio(
            "portfolio-1",
            benchmarks
          )
        ).toHaveLength(2);
      }
    );

    it(
      "calculates average portfolio return",
      () => {
        expect(
          calculateAveragePortfolioReturn(
            benchmarks
          )
        ).toBe(14.33);
      }
    );

    it(
      "calculates average benchmark return",
      () => {
        expect(
          calculateAverageBenchmarkReturn(
            benchmarks
          )
        ).toBe(11.67);
      }
    );

    it(
      "calculates average excess return",
      () => {
        expect(
          calculateAverageExcessReturn(
            benchmarks
          )
        ).toBe(2.67);
      }
    );

    it(
      "builds benchmark summary",
      () => {
        expect(
          buildInvestmentBenchmarkSummary(
            benchmarks
          )
        ).toEqual({
          totalBenchmarks: 3,
          averagePortfolioReturn:
            14.33,
          averageBenchmarkReturn:
            11.67,
          averageExcessReturn:
            2.67,
          outperformCount: 2,
          underperformCount: 1
        });
      }
    );
  }
);