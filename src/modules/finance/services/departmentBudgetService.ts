import type {
  DepartmentBudget,
  DepartmentBudgetSummary
} from "../types/finance.types";

export function calculateRemainingBudget(
  allocatedBudget: number,
  usedBudget: number
): number {
  return allocatedBudget - usedBudget;
}

export function calculateBudgetUtilizationRate(
  allocatedBudget: number,
  usedBudget: number
): number {
  if (allocatedBudget <= 0) {
    return 0;
  }

  return Number(
    (
      (usedBudget / allocatedBudget) *
      100
    ).toFixed(2)
  );
}

export function createDepartmentBudget(
  budget: DepartmentBudget
): DepartmentBudget {
  return {
    ...budget
  };
}

export function consumeDepartmentBudget(
  budget: DepartmentBudget,
  amount: number
): DepartmentBudget {
  return {
    ...budget,
    usedBudget:
      budget.usedBudget + amount
  };
}

export function closeDepartmentBudget(
  budget: DepartmentBudget
): DepartmentBudget {
  return {
    ...budget,
    status: "closed"
  };
}

export function validateBudgetAvailability(
  budget: DepartmentBudget,
  amount: number
): boolean {
  return (
    calculateRemainingBudget(
      budget.allocatedBudget,
      budget.usedBudget
    ) >= amount
  );
}

export function buildDepartmentBudgetSummary(
  budget: DepartmentBudget
): DepartmentBudgetSummary {
  return {
    departmentId:
      budget.departmentId,
    departmentName:
      budget.departmentName,
    allocatedBudget:
      budget.allocatedBudget,
    usedBudget:
      budget.usedBudget,
    remainingBudget:
      calculateRemainingBudget(
        budget.allocatedBudget,
        budget.usedBudget
      ),
    utilizationRate:
      calculateBudgetUtilizationRate(
        budget.allocatedBudget,
        budget.usedBudget
      )
  };
}

export function getDepartmentWithHighestUtilization(
  budgets: DepartmentBudget[]
): DepartmentBudget | null {
  if (budgets.length === 0) {
    return null;
  }

  return budgets.reduce(
    (highest, current) =>
      calculateBudgetUtilizationRate(
        current.allocatedBudget,
        current.usedBudget
      ) >
      calculateBudgetUtilizationRate(
        highest.allocatedBudget,
        highest.usedBudget
      )
        ? current
        : highest
  );
}

export function getDepartmentWithLowestRemainingBudget(
  budgets: DepartmentBudget[]
): DepartmentBudget | null {
  if (budgets.length === 0) {
    return null;
  }

  return budgets.reduce(
    (lowest, current) =>
      calculateRemainingBudget(
        current.allocatedBudget,
        current.usedBudget
      ) <
      calculateRemainingBudget(
        lowest.allocatedBudget,
        lowest.usedBudget
      )
        ? current
        : lowest
  );
}

export function getTotalAllocatedBudget(
  budgets: DepartmentBudget[]
): number {
  return budgets.reduce(
    (sum, budget) =>
      sum + budget.allocatedBudget,
    0
  );
}