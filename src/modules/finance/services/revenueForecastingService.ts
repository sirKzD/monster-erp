import {
  ForecastMethod,
  RevenueForecast,
  RevenueForecastPeriod,
  RevenueForecastStatus,
  RevenueForecastSummary,
} from "../types/finance.types";

const forecasts = new Map<string, RevenueForecast>();

function createRevenueForecast(
  forecast: RevenueForecast
): RevenueForecast {
  forecasts.set(forecast.id, forecast);

  return forecast;
}

function updateRevenueForecast(
  id: string,
  updates: Partial<RevenueForecast>
): RevenueForecast {
  const existing = forecasts.get(id);

  if (!existing) {
    throw new Error("Revenue forecast not found");
  }

  const updated: RevenueForecast = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  forecasts.set(id, updated);

  return updated;
}

function approveRevenueForecast(id: string): RevenueForecast {
  const forecast = forecasts.get(id);

  if (!forecast) {
    throw new Error("Revenue forecast not found");
  }

  forecast.status = "APPROVED";

  forecasts.set(id, forecast);

  return forecast;
}

function calculateGrowthRate(
  historicalRevenue: number,
  projectedRevenue: number
): number {
  if (historicalRevenue === 0) {
    return 0;
  }

  return Number(
    (
      ((projectedRevenue - historicalRevenue) /
        historicalRevenue) *
      100
    ).toFixed(2)
  );
}

function calculateProjectedRevenue(
  historicalRevenue: number,
  growthPercentage: number
): number {
  return Number(
    (
      historicalRevenue *
      (1 + growthPercentage / 100)
    ).toFixed(2)
  );
}

function generateForecastPeriod(
  period: string,
  historicalRevenue: number,
  growthPercentage: number
): RevenueForecastPeriod {
  return {
    period,
    historicalRevenue,
    projectedRevenue: calculateProjectedRevenue(
      historicalRevenue,
      growthPercentage
    ),
    growthPercentage,
  };
}

function buildRevenueForecastSummary(
  periods: RevenueForecastPeriod[]
): RevenueForecastSummary {
  const periodCount = periods.length;

  const totalHistoricalRevenue = periods.reduce(
    (sum, item) => sum + item.historicalRevenue,
    0
  );

  const totalProjectedRevenue = periods.reduce(
    (sum, item) => sum + item.projectedRevenue,
    0
  );

  const averageGrowthPercentage =
    periodCount === 0
      ? 0
      : Number(
          (
            periods.reduce(
              (sum, item) =>
                sum + item.growthPercentage,
              0
            ) / periodCount
          ).toFixed(2)
        );

  return {
    periodCount,
    totalHistoricalRevenue,
    totalProjectedRevenue,
    averageGrowthPercentage,
    projectedIncreaseAmount:
      totalProjectedRevenue -
      totalHistoricalRevenue,
  };
}

function getRevenueForecastById(
  id: string
): RevenueForecast | undefined {
  return forecasts.get(id);
}

function getAllRevenueForecasts(): RevenueForecast[] {
  return [...forecasts.values()];
}

function clearRevenueForecasts(): void {
  forecasts.clear();
}

export const revenueForecastingService = {
  createRevenueForecast,
  updateRevenueForecast,
  approveRevenueForecast,
  calculateGrowthRate,
  calculateProjectedRevenue,
  generateForecastPeriod,
  buildRevenueForecastSummary,
  getRevenueForecastById,
  getAllRevenueForecasts,
  clearRevenueForecasts,
};