import {
  describe,
  expect,
  it
} from "vitest";

import {
  calculateForecastClosingBalance,
  createCashForecastEntry,
  createCashForecastSummary,
  generateCashForecast,
  getHighestForecastBalance,
  getLowestForecastBalance,
  isNegativeCashPosition
} from "../services/cashForecastService";

describe("cashForecastService", () => {
  const entries = [
    createCashForecastEntry(
      "2026-08-01",
      5000000,
      2000000
    ),
    createCashForecastEntry(
      "2026-08-02",
      3000000,
      4000000
    ),
    createCashForecastEntry(
      "2026-08-03",
      1000000,
      1500000
    )
  ];

  it("creates cash forecast entry", () => {
    expect(
      createCashForecastEntry(
        "2026-08-01",
        5000000,
        2000000
      )
    ).toEqual({
      date: "2026-08-01",
      expectedInflow: 5000000,
      expectedOutflow: 2000000
    });
  });

  it("calculates forecast closing balance", () => {
    expect(
      calculateForecastClosingBalance(
        10000000,
        5000000,
        2000000
      )
    ).toBe(13000000);
  });

  it("generates first forecast day", () => {
    const forecasts =
      generateCashForecast(
        10000000,
        entries
      );

    expect(forecasts[0]).toEqual({
      date: "2026-08-01",
      openingBalance: 10000000,
      inflow: 5000000,
      outflow: 2000000,
      closingBalance: 13000000
    });
  });

  it("generates multiple forecast days", () => {
    const forecasts =
      generateCashForecast(
        10000000,
        entries
      );

    expect(
      forecasts
    ).toHaveLength(3);

    expect(
      forecasts[2].closingBalance
    ).toBe(11500000);
  });

  it("creates forecast summary", () => {
    const forecasts =
      generateCashForecast(
        10000000,
        entries
      );

    expect(
      createCashForecastSummary(
        10000000,
        forecasts
      )
    ).toEqual({
      openingBalance: 10000000,
      totalInflow: 9000000,
      totalOutflow: 7500000,
      endingBalance: 11500000
    });
  });

  it("gets lowest forecast balance", () => {
    const forecasts =
      generateCashForecast(
        10000000,
        entries
      );

    expect(
      getLowestForecastBalance(
        forecasts
      )
    ).toBe(11500000);
  });

  it("gets highest forecast balance", () => {
    const forecasts =
      generateCashForecast(
        10000000,
        entries
      );

    expect(
      getHighestForecastBalance(
        forecasts
      )
    ).toBe(13000000);
  });

  it("detects negative cash position", () => {
    const forecasts =
      generateCashForecast(
        1000000,
        [
          createCashForecastEntry(
            "2026-08-01",
            0,
            3000000
          )
        ]
      );

    expect(
      isNegativeCashPosition(
        forecasts
      )
    ).toBe(true);
  });

  it("returns false when cash positive", () => {
    const forecasts =
      generateCashForecast(
        10000000,
        entries
      );

    expect(
      isNegativeCashPosition(
        forecasts
      )
    ).toBe(false);
  });

  it("handles empty forecast", () => {
    expect(
      createCashForecastSummary(
        10000000,
        []
      )
    ).toEqual({
      openingBalance: 10000000,
      totalInflow: 0,
      totalOutflow: 0,
      endingBalance: 10000000
    });
  });
});