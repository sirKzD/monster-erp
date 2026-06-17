import type {
  Budget,
  BudgetVarianceAnalysis,
  BudgetVarianceStatus,
  BudgetVarianceSummary
} from "../types/finance.types";

export function calculateVarianceAmount(
  plannedAmount: number,
  actualAmount: number
): number {
  return actualAmount - plannedAmount;
}

export function calculateVariancePercentage(
  plannedAmount: number,
  actualAmount: number
): number {
  if (plannedAmount <= 0) {
    return 0;
  }

  return Number(
    (
      ((actualAmount - plannedAmount) /
        plannedAmount) *
      100
    ).toFixed(2)
  );
}

export function determineBudgetVarianceStatus(
  plannedAmount: number,
  actualAmount: number
): BudgetVarianceStatus {
  const variance =
    actualAmount - plannedAmount;

  if (variance < 0) {
    return "under_budget";
  }

  if (variance > 0) {
    return "over_budget";
  }

  return "on_budget";
}

export function createBudgetVarianceAnalysis(
  budget: Budget,
  actualAmount: number
): BudgetVarianceAnalysis {
  return {
    budgetId: budget.id,
    accountCode: budget.accountCode,
    period: budget.period,
    plannedAmount: budget.plannedAmount,
    actualAmount,
    varianceAmount:
      calculateVarianceAmount(
        budget.plannedAmount,
        actualAmount
      ),
    variancePercentage:
      calculateVariancePercentage(
        budget.plannedAmount,
        actualAmount
      ),
    status:
      determineBudgetVarianceStatus(
        budget.plannedAmount,
        actualAmount
      )
  };
}

export function buildBudgetVarianceSummary(
  analyses: BudgetVarianceAnalysis[]
): BudgetVarianceSummary {
  const totalPlanned =
    analyses.reduce(
      (sum, item) =>
        sum + item.plannedAmount,
      0
    );

  const totalActual =
    analyses.reduce(
      (sum, item) =>
        sum + item.actualAmount,
      0
    );

  const totalVariance =
    totalActual - totalPlanned;

  return {
    totalPlanned,
    totalActual,
    totalVariance,
    totalVariancePercentage:
      calculateVariancePercentage(
        totalPlanned,
        totalActual
      ),
    underBudgetCount:
      analyses.filter(
        a =>
          a.status ===
          "under_budget"
      ).length,
    onBudgetCount:
      analyses.filter(
        a =>
          a.status ===
          "on_budget"
      ).length,
    overBudgetCount:
      analyses.filter(
        a =>
          a.status ===
          "over_budget"
      ).length
  };
}

export function getLargestVariance(
  analyses: BudgetVarianceAnalysis[]
): BudgetVarianceAnalysis | null {
  if (analyses.length === 0) {
    return null;
  }

  return analyses.reduce(
    (largest, current) =>
      Math.abs(
        current.varianceAmount
      ) >
      Math.abs(
        largest.varianceAmount
      )
        ? current
        : largest
  );
}