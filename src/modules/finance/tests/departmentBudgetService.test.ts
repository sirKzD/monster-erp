import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildDepartmentBudgetSummary,
  calculateBudgetUtilizationRate,
  calculateRemainingBudget,
  closeDepartmentBudget,
  consumeDepartmentBudget,
  createDepartmentBudget,
  getDepartmentWithHighestUtilization,
  getDepartmentWithLowestRemainingBudget,
  getTotalAllocatedBudget,
  validateBudgetAvailability
} from "../services/departmentBudgetService";

import type {
  DepartmentBudget
} from "../types/finance.types";

const budgetA: DepartmentBudget =
  {
    id: "dept-budget-1",
    departmentId: "it",
    departmentName: "IT",
    period: "2026-Q1",
    allocatedBudget:
      100000000,
    usedBudget: 40000000,
    status: "active",
    createdAt:
      "2026-01-01"
  };

const budgetB: DepartmentBudget =
  {
    id: "dept-budget-2",
    departmentId: "hr",
    departmentName: "HR",
    period: "2026-Q1",
    allocatedBudget:
      50000000,
    usedBudget: 45000000,
    status: "active",
    createdAt:
      "2026-01-01"
  };

describe(
  "departmentBudgetService",
  () => {
    it(
      "calculates remaining budget",
      () => {
        expect(
          calculateRemainingBudget(
            100000000,
            40000000
          )
        ).toBe(60000000);
      }
    );

    it(
      "calculates utilization rate",
      () => {
        expect(
          calculateBudgetUtilizationRate(
            100000000,
            40000000
          )
        ).toBe(40);
      }
    );

    it(
      "returns zero utilization when allocated budget is zero",
      () => {
        expect(
          calculateBudgetUtilizationRate(
            0,
            5000000
          )
        ).toBe(0);
      }
    );

    it(
      "creates department budget",
      () => {
        const result =
          createDepartmentBudget(
            budgetA
          );

        expect(
          result.departmentName
        ).toBe("IT");
      }
    );

    it(
      "consumes department budget",
      () => {
        const result =
          consumeDepartmentBudget(
            budgetA,
            10000000
          );

        expect(
          result.usedBudget
        ).toBe(50000000);
      }
    );

    it(
      "closes department budget",
      () => {
        const result =
          closeDepartmentBudget(
            budgetA
          );

        expect(
          result.status
        ).toBe("closed");
      }
    );

    it(
      "validates available budget",
      () => {
        expect(
          validateBudgetAvailability(
            budgetA,
            50000000
          )
        ).toBe(true);
      }
    );

    it(
      "builds department budget summary",
      () => {
        expect(
          buildDepartmentBudgetSummary(
            budgetA
          )
        ).toEqual({
          departmentId: "it",
          departmentName: "IT",
          allocatedBudget:
            100000000,
          usedBudget:
            40000000,
          remainingBudget:
            60000000,
          utilizationRate: 40
        });
      }
    );

    it(
      "gets department with highest utilization",
      () => {
        expect(
          getDepartmentWithHighestUtilization(
            [
              budgetA,
              budgetB
            ]
          )?.departmentId
        ).toBe("hr");
      }
    );

    it(
      "gets department with lowest remaining budget",
      () => {
        expect(
          getDepartmentWithLowestRemainingBudget(
            [
              budgetA,
              budgetB
            ]
          )?.departmentId
        ).toBe("hr");
      }
    );

    it(
      "calculates total allocated budget",
      () => {
        expect(
          getTotalAllocatedBudget(
            [
              budgetA,
              budgetB
            ]
          )
        ).toBe(
          150000000
        );
      }
    );
  }
);