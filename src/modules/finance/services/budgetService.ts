import type {
  Budget,
  BudgetVariance,
  LedgerEntry
} from "../types/finance.types";

export function createBudget(
  accountCode: string,
  period: string,
  plannedAmount: number
): Budget | null {
  if (plannedAmount < 0) return null;

  return {
    id: crypto.randomUUID(),
    accountCode: accountCode.trim(),
    period: period.trim(),
    plannedAmount,
    status: "active",
    createdAt: new Date().toISOString()
  };
}

export function closeBudget(
  budget: Budget
): Budget | null {
  if (budget.status !== "active") {
    return null;
  }

  return {
    ...budget,
    status: "closed"
  };
}

export function calculateActualAmountForBudget(
  budget: Budget,
  entries: LedgerEntry[]
): number {
  return entries
    .filter(
      entry =>
        entry.accountCode === budget.accountCode &&
        entry.postedAt.startsWith(budget.period)
    )
    .reduce(
      (total, entry) =>
        total + entry.debit - entry.credit,
      0
    );
}

export function calculateBudgetVariance(
  plannedAmount: number,
  actualAmount: number
): number {
  return plannedAmount - actualAmount;
}

export function getBudgetVarianceStatus(
  variance: number
): "under_budget" | "on_budget" | "over_budget" {
  if (variance > 0) return "under_budget";
  if (variance < 0) return "over_budget";

  return "on_budget";
}

export function createBudgetVariance(
  budget: Budget,
  entries: LedgerEntry[]
): BudgetVariance {
  const actualAmount = calculateActualAmountForBudget(
    budget,
    entries
  );

  const variance = calculateBudgetVariance(
    budget.plannedAmount,
    actualAmount
  );

  return {
    accountCode: budget.accountCode,
    period: budget.period,
    plannedAmount: budget.plannedAmount,
    actualAmount,
    variance,
    status: getBudgetVarianceStatus(variance)
  };
}

export function filterActiveBudgets(
  budgets: Budget[]
): Budget[] {
  return budgets.filter(
    budget => budget.status === "active"
  );
}