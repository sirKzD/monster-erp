import type {
  Currency,
  CurrencyConversion,
  ExchangeRate
} from "../types/finance.types";

export function createCurrency(
  code: string,
  name: string,
  symbol: string
): Currency | null {
  if (code.trim().length !== 3) return null;
  if (name.trim().length === 0) return null;
  if (symbol.trim().length === 0) return null;

  return {
    code: code.trim().toUpperCase(),
    name: name.trim(),
    symbol: symbol.trim(),
    status: "active"
  };
}

export function deactivateCurrency(
  currency: Currency
): Currency | null {
  if (currency.status !== "active") {
    return null;
  }

  return {
    ...currency,
    status: "inactive"
  };
}

export function createExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  rate: number,
  effectiveDate: string
): ExchangeRate | null {
  if (fromCurrency.trim().length !== 3) return null;
  if (toCurrency.trim().length !== 3) return null;
  if (rate <= 0) return null;

  return {
    fromCurrency: fromCurrency.trim().toUpperCase(),
    toCurrency: toCurrency.trim().toUpperCase(),
    rate,
    effectiveDate
  };
}

export function findExchangeRate(
  rates: ExchangeRate[],
  fromCurrency: string,
  toCurrency: string
): ExchangeRate | undefined {
  return rates.find(
    rate =>
      rate.fromCurrency ===
        fromCurrency.trim().toUpperCase() &&
      rate.toCurrency ===
        toCurrency.trim().toUpperCase()
  );
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRate[]
): CurrencyConversion | null {
  if (amount < 0) return null;

  if (
    fromCurrency.trim().toUpperCase() ===
    toCurrency.trim().toUpperCase()
  ) {
    return {
      fromCurrency: fromCurrency.trim().toUpperCase(),
      toCurrency: toCurrency.trim().toUpperCase(),
      originalAmount: amount,
      convertedAmount: amount,
      rate: 1
    };
  }

  const rate = findExchangeRate(
    rates,
    fromCurrency,
    toCurrency
  );

  if (!rate) return null;

  return {
    fromCurrency: rate.fromCurrency,
    toCurrency: rate.toCurrency,
    originalAmount: amount,
    convertedAmount: Math.round(
      amount * rate.rate
    ),
    rate: rate.rate
  };
}

export function filterActiveCurrencies(
  currencies: Currency[]
): Currency[] {
  return currencies.filter(
    currency => currency.status === "active"
  );
}