import {
  describe,
  expect,
  it
} from "vitest";

import {
  approveExpenseClaim,
  buildExpenseClaimSummary,
  createExpenseClaim,
  getEmployeeExpenseClaims,
  payExpenseClaim,
  rejectExpenseClaim
} from "../services/expenseClaimService";

import type {
  ExpenseClaim
} from "../types/finance.types";

describe(
  "expenseClaimService",
  () => {
    const claim: ExpenseClaim = {
      id: "claim-1",
      employeeId: "EMP-001",
      category: "Travel",
      description:
        "Business Trip Jakarta",
      amount: 1500000,
      status: "submitted",
      submittedAt: "2026-07-01"
    };

    const claims: ExpenseClaim[] = [
      {
        id: "claim-1",
        employeeId: "EMP-001",
        category: "Travel",
        description: "Trip",
        amount: 1500000,
        status: "paid",
        submittedAt: "2026-07-01",
        approvedAt: "2026-07-02",
        paidAt: "2026-07-03"
      },
      {
        id: "claim-2",
        employeeId: "EMP-001",
        category: "Meal",
        description: "Lunch",
        amount: 500000,
        status: "approved",
        submittedAt: "2026-07-01",
        approvedAt: "2026-07-02"
      },
      {
        id: "claim-3",
        employeeId: "EMP-002",
        category: "Internet",
        description: "Internet",
        amount: 300000,
        status: "rejected",
        submittedAt: "2026-07-01"
      }
    ];

    it(
      "creates expense claim",
      () => {
        const result =
          createExpenseClaim(claim);

        expect(
          result.status
        ).toBe("submitted");
      }
    );

    it(
      "approves expense claim",
      () => {
        const result =
          approveExpenseClaim(
            claim,
            "2026-07-02"
          );

        expect(
          result.status
        ).toBe("approved");

        expect(
          result.approvedAt
        ).toBe("2026-07-02");
      }
    );

    it(
      "rejects expense claim",
      () => {
        const result =
          rejectExpenseClaim(claim);

        expect(
          result.status
        ).toBe("rejected");
      }
    );

    it(
      "pays expense claim",
      () => {
        const approved =
          approveExpenseClaim(
            claim,
            "2026-07-02"
          );

        const paid =
          payExpenseClaim(
            approved,
            "2026-07-03"
          );

        expect(
          paid.status
        ).toBe("paid");

        expect(
          paid.paidAt
        ).toBe("2026-07-03");
      }
    );

    it(
      "gets employee expense claims",
      () => {
        const result =
          getEmployeeExpenseClaims(
            "EMP-001",
            claims
          );

        expect(
          result.length
        ).toBe(2);
      }
    );

    it(
      "returns empty employee expense claims",
      () => {
        const result =
          getEmployeeExpenseClaims(
            "EMP-999",
            claims
          );

        expect(
          result.length
        ).toBe(0);
      }
    );

    it(
      "builds expense claim summary",
      () => {
        const summary =
          buildExpenseClaimSummary(
            claims
          );

        expect(summary).toEqual({
          totalClaims: 3,
          totalAmount: 2300000,
          approvedAmount: 2000000,
          paidAmount: 1500000
        });
      }
    );

    it(
      "calculates total claims",
      () => {
        const summary =
          buildExpenseClaimSummary(
            claims
          );

        expect(
          summary.totalClaims
        ).toBe(3);
      }
    );

    it(
      "calculates approved amount",
      () => {
        const summary =
          buildExpenseClaimSummary(
            claims
          );

        expect(
          summary.approvedAmount
        ).toBe(2000000);
      }
    );

    it(
      "calculates paid amount",
      () => {
        const summary =
          buildExpenseClaimSummary(
            claims
          );

        expect(
          summary.paidAmount
        ).toBe(1500000);
      }
    );

    it(
      "handles empty claims",
      () => {
        const summary =
          buildExpenseClaimSummary(
            []
          );

        expect(summary).toEqual({
          totalClaims: 0,
          totalAmount: 0,
          approvedAmount: 0,
          paidAmount: 0
        });
      }
    );
  }
);