import {
  describe,
  expect,
  it
} from "vitest";

import {
  convertCurrency,
  createCurrency,
  createExchangeRate,
  deactivateCurrency,
  filterActiveCurrencies,
  findExchangeRate
} from "../services/currencyManagementService";

import type {
  Currency,
  ExchangeRate
} from "../types/finance.types";

const rates: ExchangeRate[] = [
  {
    fromCurrency: "USD",
    toCurrency: "IDR",
    rate: 15500,
    effectiveDate: "2026-01-01"
  },
  {
    fromCurrency: "SGD",
    toCurrency: "IDR",
    rate: 11500,
    effectiveDate: "2026-01-01"
  }
];

describe("currencyManagementService", () => {
  it("creates currency", () => {
    expect(
      createCurrency(
        " usd ",
        " US Dollar ",
        " $ "
      )
    ).toEqual({
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      status: "active"
    });
  });

  it("blocks invalid currency", () => {
    expect(
      createCurrency(
        "US",
        "US Dollar",
        "$"
      )
    ).toBeNull();

    expect(
      createCurrency(
        "USD",
        "",
        "$"
      )
    ).toBeNull();

    expect(
      createCurrency(
        "USD",
        "US Dollar",
        ""
      )
    ).toBeNull();
  });

  it("deactivates active currency", () => {
    const currency = createCurrency(
      "USD",
      "US Dollar",
      "$"
    )!;

    expect(
      deactivateCurrency(currency)
    ).toMatchObject({
      status: "inactive"
    });
  });

  it("blocks deactivating inactive currency", () => {
    const currency = deactivateCurrency(
      createCurrency(
        "USD",
        "US Dollar",
        "$"
      )!
    )!;

    expect(
      deactivateCurrency(currency)
    ).toBeNull();
  });

  it("creates exchange rate", () => {
    expect(
      createExchangeRate(
        " usd ",
        " idr ",
        15500,
        "2026-01-01"
      )
    ).toEqual({
      fromCurrency: "USD",
      toCurrency: "IDR",
      rate: 15500,
      effectiveDate: "2026-01-01"
    });
  });

  it("blocks invalid exchange rate", () => {
    expect(
      createExchangeRate(
        "US",
        "IDR",
        15500,
        "2026-01-01"
      )
    ).toBeNull();

    expect(
      createExchangeRate(
        "USD",
        "IDR",
        0,
        "2026-01-01"
      )
    ).toBeNull();
  });

  it("finds exchange rate", () => {
    const rate = findExchangeRate(
      rates,
      "usd",
      "idr"
    );

    expect(rate?.rate).toBe(15500);
  });

  it("converts currency", () => {
    expect(
      convertCurrency(
        100,
        "USD",
        "IDR",
        rates
      )
    ).toEqual({
      fromCurrency: "USD",
      toCurrency: "IDR",
      originalAmount: 100,
      convertedAmount: 1550000,
      rate: 15500
    });
  });

  it("converts same currency with rate one", () => {
    expect(
      convertCurrency(
        100,
        "IDR",
        "IDR",
        rates
      )
    ).toEqual({
      fromCurrency: "IDR",
      toCurrency: "IDR",
      originalAmount: 100,
      convertedAmount: 100,
      rate: 1
    });
  });

  it("blocks conversion without rate", () => {
    expect(
      convertCurrency(
        100,
        "EUR",
        "IDR",
        rates
      )
    ).toBeNull();
  });

  it("filters active currencies", () => {
    const active = createCurrency(
      "USD",
      "US Dollar",
      "$"
    )!;

    const inactive = deactivateCurrency(
      createCurrency(
        "SGD",
        "Singapore Dollar",
        "S$"
      )!
    )!;

    const currencies: Currency[] = [
      active,
      inactive
    ];

    const result =
      filterActiveCurrencies(currencies);

    expect(result).toHaveLength(1);
    expect(result[0].code).toBe("USD");
  });
});