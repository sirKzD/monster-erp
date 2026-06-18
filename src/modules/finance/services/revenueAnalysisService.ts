import type {
  RevenueAnalysis,
  RevenueAnalysisSummary,
  RevenueTrend
} from "../types/finance.types";

export function calculateRevenueGrowthPercentage(
  currentRevenue: number,
  previousRevenue: number
): number {
  if (previousRevenue <= 0) {
    return 0;
  }

  return Number(
    (
      ((currentRevenue - previousRevenue) /
        previousRevenue) *
      100
    ).toFixed(2)
  );
}

export function calculateAverageRevenue(
  revenues: number[]
): number {
  if (revenues.length === 0) {
    return 0;
  }

  const total = revenues.reduce(
    (sum, revenue) => sum + revenue,
    0
  );

  return Number(
    (total / revenues.length).toFixed(2)
  );
}

export function calculateRevenueVolatilityPercentage(
  revenues: number[]
): number {
  if (revenues.length <= 1) {
    return 0;
  }

  const averageRevenue =
    calculateAverageRevenue(revenues);

  if (averageRevenue <= 0) {
    return 0;
  }

  const variance =
    revenues.reduce(
      (sum, revenue) =>
        sum +
        Math.pow(
          revenue - averageRevenue,
          2
        ),
      0
    ) / revenues.length;

  const standardDeviation =
    Math.sqrt(variance);

  return Number(
    (
      (standardDeviation / averageRevenue) *
      100
    ).toFixed(2)
  );
}

export function determineRevenueTrend(
  growthPercentage: number
): RevenueTrend {
  if (growthPercentage >= 20) {
    return "STRONG_GROWTH";
  }

  if (growthPercentage >= 5) {
    return "GROWTH";
  }

  if (growthPercentage > -5) {
    return "STABLE";
  }

  if (growthPercentage > -20) {
    return "DECLINE";
  }

  return "STRONG_DECLINE";
}

export function createRevenueAnalysis(
  analysis: Omit<
    RevenueAnalysis,
    | "revenueGrowthPercentage"
    | "monthlyAverageRevenue"
    | "highestRevenue"
    | "lowestRevenue"
    | "revenueVolatilityPercentage"
    | "trend"
  > & {
    revenues: number[];
  }
): RevenueAnalysis {
  const revenueGrowthPercentage =
    calculateRevenueGrowthPercentage(
      analysis.currentRevenue,
      analysis.previousRevenue
    );

  const monthlyAverageRevenue =
    calculateAverageRevenue(
      analysis.revenues
    );

  const highestRevenue =
    analysis.revenues.length === 0
      ? 0
      : Math.max(...analysis.revenues);

  const lowestRevenue =
    analysis.revenues.length === 0
      ? 0
      : Math.min(...analysis.revenues);

  const revenueVolatilityPercentage =
    calculateRevenueVolatilityPercentage(
      analysis.revenues
    );

  const {
    revenues,
    ...cleanAnalysis
  } = analysis;

  return {
    ...cleanAnalysis,
    revenueGrowthPercentage,
    monthlyAverageRevenue,
    highestRevenue,
    lowestRevenue,
    revenueVolatilityPercentage,
    trend:
      determineRevenueTrend(
        revenueGrowthPercentage
      )
  };
}

export function updateRevenueAnalysis(
  analysis: RevenueAnalysis,
  updates: Partial<
    Omit<
      RevenueAnalysis,
      "id" | "period"
    >
  > & {
    revenues?: number[];
  }
): RevenueAnalysis {
  const revenues =
    updates.revenues ?? [
      analysis.lowestRevenue,
      analysis.monthlyAverageRevenue,
      analysis.highestRevenue
    ];

  return createRevenueAnalysis({
    ...analysis,
    ...updates,
    revenues
  });
}

export function buildRevenueAnalysisSummary(
  analyses: RevenueAnalysis[]
): RevenueAnalysisSummary {
  if (analyses.length === 0) {
    return {
      totalRevenue: 0,
      averageRevenue: 0,
      revenueGrowthPercentage: 0,
      highestRevenue: 0,
      lowestRevenue: 0,
      revenueVolatilityPercentage: 0,
      trend: "STABLE"
    };
  }

  const revenues = analyses.map(
    analysis => analysis.currentRevenue
  );

  const totalRevenue = revenues.reduce(
    (sum, revenue) => sum + revenue,
    0
  );

  const averageRevenue =
    calculateAverageRevenue(revenues);

  const highestRevenue =
    Math.max(...revenues);

  const lowestRevenue =
    Math.min(...revenues);

  const firstRevenue =
    analyses[0].currentRevenue;

  const lastRevenue =
    analyses[
      analyses.length - 1
    ].currentRevenue;

  const revenueGrowthPercentage =
    calculateRevenueGrowthPercentage(
      lastRevenue,
      firstRevenue
    );

  const revenueVolatilityPercentage =
    calculateRevenueVolatilityPercentage(
      revenues
    );

  return {
    totalRevenue,
    averageRevenue,
    revenueGrowthPercentage,
    highestRevenue,
    lowestRevenue,
    revenueVolatilityPercentage,
    trend:
      determineRevenueTrend(
        revenueGrowthPercentage
      )
  };
}