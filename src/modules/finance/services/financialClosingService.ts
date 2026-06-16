import type {
  AccountingPeriod,
  FinancialClosing,
  FinancialClosingSummary,
  TrialBalanceReport
} from "../types/finance.types";

export function createFinancialClosing(
  period: AccountingPeriod,
  trialBalance: TrialBalanceReport
): FinancialClosing | null {
  if (period.status !== "open") {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    periodId: period.id,
    trialBalanceTotalDebit:
      trialBalance.totalDebit,
    trialBalanceTotalCredit:
      trialBalance.totalCredit,
    status: "draft",
    createdAt: new Date().toISOString()
  };
}

export function canCloseFinancialPeriod(
  closing: FinancialClosing
): boolean {
  return (
    closing.status === "draft" &&
    closing.trialBalanceTotalDebit ===
      closing.trialBalanceTotalCredit
  );
}

export function closeFinancialPeriod(
  closing: FinancialClosing
): FinancialClosing | null {
  if (!canCloseFinancialPeriod(closing)) {
    return null;
  }

  return {
    ...closing,
    status: "closed",
    closedAt: new Date().toISOString()
  };
}

export function reopenFinancialClosing(
  closing: FinancialClosing
): FinancialClosing | null {
  if (closing.status !== "closed") {
    return null;
  }

  return {
    ...closing,
    status: "reopened",
    reopenedAt: new Date().toISOString()
  };
}

export function buildFinancialClosingSummary(
  closing: FinancialClosing
): FinancialClosingSummary {
  return {
    periodId: closing.periodId,
    isTrialBalanceBalanced:
      closing.trialBalanceTotalDebit ===
      closing.trialBalanceTotalCredit,
    totalDebit: closing.trialBalanceTotalDebit,
    totalCredit: closing.trialBalanceTotalCredit,
    status: closing.status
  };
}

export function filterClosedFinancialClosings(
  closings: FinancialClosing[]
): FinancialClosing[] {
  return closings.filter(
    closing => closing.status === "closed"
  );
}