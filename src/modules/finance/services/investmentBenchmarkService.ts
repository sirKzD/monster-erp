import type {
  InvestmentBenchmark,
  InvestmentBenchmarkSummary
} from "../types/finance.types";

export function calculateExcessReturn(
  portfolioReturnPercentage: number,
  benchmarkReturnPercentage: number
): number {
  return Number(
    (
      portfolioReturnPercentage -
      benchmarkReturnPercentage
    ).toFixed(2)
  );
}

export function calculateTrackingError(
  portfolioReturnPercentage: number,
  benchmarkReturnPercentage: number
): number {
  return Number(
    Math.abs(
      portfolioReturnPercentage -
        benchmarkReturnPercentage
    ).toFixed(2)
  );
}

export function createInvestmentBenchmark(
  benchmark: Omit<
    InvestmentBenchmark,
    "excessReturnPercentage" |
    "trackingErrorPercentage"
  >
): InvestmentBenchmark {
  return {
    ...benchmark,
    excessReturnPercentage:
      calculateExcessReturn(
        benchmark.portfolioReturnPercentage,
        benchmark.benchmarkReturnPercentage
      ),
    trackingErrorPercentage:
      calculateTrackingError(
        benchmark.portfolioReturnPercentage,
        benchmark.benchmarkReturnPercentage
      )
  };
}

export function updateInvestmentBenchmark(
  benchmark: InvestmentBenchmark,
  updates: Partial<
    Omit<
      InvestmentBenchmark,
      "id" | "portfolioId"
    >
  >
): InvestmentBenchmark {
  const updated = {
    ...benchmark,
    ...updates
  };

  return {
    ...updated,
    excessReturnPercentage:
      calculateExcessReturn(
        updated.portfolioReturnPercentage,
        updated.benchmarkReturnPercentage
      ),
    trackingErrorPercentage:
      calculateTrackingError(
        updated.portfolioReturnPercentage,
        updated.benchmarkReturnPercentage
      )
  };
}

export function isOutperformingBenchmark(
  benchmark: InvestmentBenchmark
): boolean {
  return (
    benchmark.excessReturnPercentage > 0
  );
}

export function getOutperformingBenchmarks(
  benchmarks: InvestmentBenchmark[]
): InvestmentBenchmark[] {
  return benchmarks.filter(
    isOutperformingBenchmark
  );
}

export function getUnderperformingBenchmarks(
  benchmarks: InvestmentBenchmark[]
): InvestmentBenchmark[] {
  return benchmarks.filter(
    benchmark =>
      benchmark.excessReturnPercentage < 0
  );
}

export function getBenchmarksByPortfolio(
  portfolioId: string,
  benchmarks: InvestmentBenchmark[]
): InvestmentBenchmark[] {
  return benchmarks.filter(
    benchmark =>
      benchmark.portfolioId === portfolioId
  );
}

export function calculateAveragePortfolioReturn(
  benchmarks: InvestmentBenchmark[]
): number {
  if (benchmarks.length === 0) {
    return 0;
  }

  const total = benchmarks.reduce(
    (sum, benchmark) =>
      sum +
      benchmark.portfolioReturnPercentage,
    0
  );

  return Number(
    (
      total / benchmarks.length
    ).toFixed(2)
  );
}

export function calculateAverageBenchmarkReturn(
  benchmarks: InvestmentBenchmark[]
): number {
  if (benchmarks.length === 0) {
    return 0;
  }

  const total = benchmarks.reduce(
    (sum, benchmark) =>
      sum +
      benchmark.benchmarkReturnPercentage,
    0
  );

  return Number(
    (
      total / benchmarks.length
    ).toFixed(2)
  );
}

export function calculateAverageExcessReturn(
  benchmarks: InvestmentBenchmark[]
): number {
  if (benchmarks.length === 0) {
    return 0;
  }

  const total = benchmarks.reduce(
    (sum, benchmark) =>
      sum +
      benchmark.excessReturnPercentage,
    0
  );

  return Number(
    (
      total / benchmarks.length
    ).toFixed(2)
  );
}

export function buildInvestmentBenchmarkSummary(
  benchmarks: InvestmentBenchmark[]
): InvestmentBenchmarkSummary {
  return {
    totalBenchmarks:
      benchmarks.length,
    averagePortfolioReturn:
      calculateAveragePortfolioReturn(
        benchmarks
      ),
    averageBenchmarkReturn:
      calculateAverageBenchmarkReturn(
        benchmarks
      ),
    averageExcessReturn:
      calculateAverageExcessReturn(
        benchmarks
      ),
    outperformCount:
      getOutperformingBenchmarks(
        benchmarks
      ).length,
    underperformCount:
      getUnderperformingBenchmarks(
        benchmarks
      ).length
  };
}