import { beforeEach, describe, expect, it } from "vitest";
import { revenueForecastingService } from "../services/revenueForecastingService";

describe("revenueForecastingService", () => {
  beforeEach(() => {
    revenueForecastingService.clearRevenueForecasts();
  });

  it("creates forecast", () => {
    const forecast =
      revenueForecastingService.createRevenueForecast({
        id: "RF-001",
        name: "2026 Revenue Forecast",
        forecastDate: "2026-01-01",
        method: "GROWTH_RATE",
        forecastPeriods: [],
        status: "DRAFT",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      });

    expect(forecast.id).toBe("RF-001");
  });

  it("updates forecast", () => {
    revenueForecastingService.createRevenueForecast({
      id: "RF-001",
      name: "Old",
      forecastDate: "2026-01-01",
      method: "MANUAL",
      forecastPeriods: [],
      status: "DRAFT",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    });

    const updated =
      revenueForecastingService.updateRevenueForecast(
        "RF-001",
        {
          name: "Updated",
        }
      );

    expect(updated.name).toBe("Updated");
  });

  it("approves forecast", () => {
    revenueForecastingService.createRevenueForecast({
      id: "RF-001",
      name: "Forecast",
      forecastDate: "2026-01-01",
      method: "MANUAL",
      forecastPeriods: [],
      status: "DRAFT",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    });

    const result =
      revenueForecastingService.approveRevenueForecast(
        "RF-001"
      );

    expect(result.status).toBe("APPROVED");
  });

  it("calculates growth rate", () => {
    expect(
      revenueForecastingService.calculateGrowthRate(
        100000,
        120000
      )
    ).toBe(20);
  });

  it("returns zero growth if historical revenue is zero", () => {
    expect(
      revenueForecastingService.calculateGrowthRate(
        0,
        100000
      )
    ).toBe(0);
  });

  it("calculates projected revenue", () => {
    expect(
      revenueForecastingService.calculateProjectedRevenue(
        100000,
        10
      )
    ).toBe(110000);
  });

  it("supports negative growth", () => {
    expect(
      revenueForecastingService.calculateProjectedRevenue(
        100000,
        -10
      )
    ).toBe(90000);
  });

  it("generates forecast period", () => {
    const period =
      revenueForecastingService.generateForecastPeriod(
        "2026-Q1",
        100000,
        15
      );

    expect(period.projectedRevenue).toBe(115000);
  });

  it("builds summary", () => {
    const summary =
      revenueForecastingService.buildRevenueForecastSummary(
        [
          {
            period: "Q1",
            historicalRevenue: 100000,
            projectedRevenue: 110000,
            growthPercentage: 10,
          },
          {
            period: "Q2",
            historicalRevenue: 200000,
            projectedRevenue: 240000,
            growthPercentage: 20,
          },
        ]
      );

    expect(summary.periodCount).toBe(2);
    expect(summary.totalHistoricalRevenue).toBe(
      300000
    );
    expect(summary.totalProjectedRevenue).toBe(
      350000
    );
    expect(summary.averageGrowthPercentage).toBe(
      15
    );
  });

  it("builds empty summary", () => {
    const summary =
      revenueForecastingService.buildRevenueForecastSummary(
        []
      );

    expect(summary.periodCount).toBe(0);
    expect(summary.averageGrowthPercentage).toBe(0);
  });

  it("gets forecast by id", () => {
    revenueForecastingService.createRevenueForecast({
      id: "RF-001",
      name: "Forecast",
      forecastDate: "2026-01-01",
      method: "MANUAL",
      forecastPeriods: [],
      status: "DRAFT",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    });

    expect(
      revenueForecastingService.getRevenueForecastById(
        "RF-001"
      )
    ).toBeDefined();
  });

  it("returns all forecasts", () => {
    revenueForecastingService.createRevenueForecast({
      id: "RF-001",
      name: "Forecast",
      forecastDate: "2026-01-01",
      method: "MANUAL",
      forecastPeriods: [],
      status: "DRAFT",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    });

    expect(
      revenueForecastingService.getAllRevenueForecasts()
        .length
    ).toBe(1);
  });

  it("throws when updating unknown forecast", () => {
    expect(() =>
      revenueForecastingService.updateRevenueForecast(
        "UNKNOWN",
        {}
      )
    ).toThrow();
  });

  it("throws when approving unknown forecast", () => {
    expect(() =>
      revenueForecastingService.approveRevenueForecast(
        "UNKNOWN"
      )
    ).toThrow();
  });
});