import type {
  CashForecastEntry,
  CashForecastResult,
  CashForecastSummary
} from "../types/finance.types";

export function createCashForecastEntry(
  date: string,
  expectedInflow: number,
  expectedOutflow: number
): CashForecastEntry {
  return {
    date,
    expectedInflow,
    expectedOutflow
  };
}

export function calculateForecastClosingBalance(
  openingBalance: number,
  inflow: number,
  outflow: number
): number {
  return openingBalance + inflow - outflow;
}

export function generateCashForecast(
  openingBalance: number,
  entries: CashForecastEntry[]
): CashForecastResult[] {
  let runningBalance = openingBalance;

  return entries.map((entry) => {
    const closingBalance =
      calculateForecastClosingBalance(
        runningBalance,
        entry.expectedInflow,
        entry.expectedOutflow
      );

    const result: CashForecastResult = {
      date: entry.date,
      openingBalance: runningBalance,
      inflow: entry.expectedInflow,
      outflow: entry.expectedOutflow,
      closingBalance
    };

    runningBalance = closingBalance;

    return result;
  });
}

export function createCashForecastSummary(
  openingBalance: number,
  forecasts: CashForecastResult[]
): CashForecastSummary {
  const totalInflow = forecasts.reduce(
    (sum, forecast) => sum + forecast.inflow,
    0
  );

  const totalOutflow = forecasts.reduce(
    (sum, forecast) => sum + forecast.outflow,
    0
  );

  const endingBalance =
    forecasts.length > 0
      ? forecasts[forecasts.length - 1].closingBalance
      : openingBalance;

  return {
    openingBalance,
    totalInflow,
    totalOutflow,
    endingBalance
  };
}

export function getLowestForecastBalance(
  forecasts: CashForecastResult[]
): number {
  if (forecasts.length === 0) {
    return 0;
  }

  return Math.min(
    ...forecasts.map(
      (forecast) => forecast.closingBalance
    )
  );
}

export function getHighestForecastBalance(
  forecasts: CashForecastResult[]
): number {
  if (forecasts.length === 0) {
    return 0;
  }

  return Math.max(
    ...forecasts.map(
      (forecast) => forecast.closingBalance
    )
  );
}

export function isNegativeCashPosition(
  forecasts: CashForecastResult[]
): boolean {
  return forecasts.some(
    (forecast) => forecast.closingBalance < 0
  );
}