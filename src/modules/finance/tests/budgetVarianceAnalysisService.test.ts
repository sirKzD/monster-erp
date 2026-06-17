import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildBudgetVarianceSummary,
  calculateVarianceAmount,
  calculateVariancePercentage,
  createBudgetVarianceAnalysis,
  determineBudgetVarianceStatus,
  getLargestVariance
} from "../services/budgetVarianceAnalysisService";

import type {
  Budget,
  BudgetVarianceAnalysis
} from "../types/finance.types";

const budget: Budget = {
  id: "budget-1",
  accountCode: "EXP-001",
  period: "2026-06",
  plannedAmount: 10000000,
  status: "active",
  createdAt: "2026-06-01"
};

describe(
  "budgetVarianceAnalysisService",
  () => {
    it(
      "calculates variance amount",
      () => {
        expect(
          calculateVarianceAmount(
            10000000,
            12000000
          )
        ).toBe(2000000);
      }
    );

    it(
      "calculates variance percentage",
      () => {
        expect(
          calculateVariancePercentage(
            10000000,
            12000000
          )
        ).toBe(20);
      }
    );

    it(
      "returns zero variance percentage when planned is zero",
      () => {
        expect(
          calculateVariancePercentage(
            0,
            1000000
          )
        ).toBe(0);
      }
    );

    it(
      "determines under budget status",
      () => {
        expect(
          determineBudgetVarianceStatus(
            10000000,
            9000000
          )
        ).toBe("under_budget");
      }
    );

    it(
      "determines over budget status",
      () => {
        expect(
          determineBudgetVarianceStatus(
            10000000,
            12000000
          )
        ).toBe("over_budget");
      }
    );

    it(
      "determines on budget status",
      () => {
        expect(
          determineBudgetVarianceStatus(
            10000000,
            10000000
          )
        ).toBe("on_budget");
      }
    );

    it(
      "creates budget variance analysis",
      () => {
        const analysis =
          createBudgetVarianceAnalysis(
            budget,
            12000000
          );

        expect(
          analysis.status
        ).toBe(
          "over_budget"
        );
      }
    );

    it(
      "builds budget variance summary",
      () => {
        const analyses: BudgetVarianceAnalysis[] =
          [
            createBudgetVarianceAnalysis(
              budget,
              12000000
            ),
            {
              budgetId: "2",
              accountCode:
                "EXP-002",
              period:
                "2026-06",
              plannedAmount:
                5000000,
              actualAmount:
                4000000,
              varianceAmount:
                -1000000,
              variancePercentage:
                -20,
              status:
                "under_budget"
            }
          ];

        expect(
          buildBudgetVarianceSummary(
            analyses
          )
        ).toEqual({
          totalPlanned:
            15000000,
          totalActual:
            16000000,
          totalVariance:
            1000000,
          totalVariancePercentage:
            6.67,
          underBudgetCount:
            1,
          onBudgetCount:
            0,
          overBudgetCount:
            1
        });
      }
    );

    it(
      "gets largest variance",
      () => {
        const analyses: BudgetVarianceAnalysis[] =
          [
            createBudgetVarianceAnalysis(
              budget,
              15000000
            ),
            createBudgetVarianceAnalysis(
              budget,
              11000000
            )
          ];

        expect(
          getLargestVariance(
            analyses
          )?.varianceAmount
        ).toBe(
          5000000
        );
      }
    );

    it(
      "returns null when no analyses",
      () => {
        expect(
          getLargestVariance([])
        ).toBeNull();
      }
    );
  }
);