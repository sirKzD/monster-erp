import type {
  DividendPayment,
  DividendSummary
} from "../types/finance.types";

export function createDividendPayment(
  payment: DividendPayment
): DividendPayment {
  return {
    ...payment
  };
}

export function calculateTotalDividend(
  payments: DividendPayment[]
): number {
  return payments.reduce(
    (total, payment) =>
      total + payment.amount,
    0
  );
}

export function calculateAverageDividend(
  payments: DividendPayment[]
): number {
  if (payments.length === 0) {
    return 0;
  }

  return Number(
    (
      calculateTotalDividend(
        payments
      ) / payments.length
    ).toFixed(2)
  );
}

export function getDividendPaymentsByInvestment(
  investmentId: string,
  payments: DividendPayment[]
): DividendPayment[] {
  return payments.filter(
    payment =>
      payment.investmentId === investmentId
  );
}

export function getLatestDividendPayment(
  payments: DividendPayment[]
): DividendPayment | null {
  if (payments.length === 0) {
    return null;
  }

  return [...payments].sort(
    (a, b) =>
      new Date(b.paymentDate).getTime() -
      new Date(a.paymentDate).getTime()
  )[0];
}

export function buildDividendSummary(
  payments: DividendPayment[]
): DividendSummary {
  return {
    totalDividend:
      calculateTotalDividend(payments),
    paymentCount:
      payments.length,
    averageDividend:
      calculateAverageDividend(payments)
  };
}