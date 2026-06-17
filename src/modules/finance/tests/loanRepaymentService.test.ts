import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildLoanRepaymentSummary,
  calculateTotalInterestPaid,
  calculateTotalPaid,
  calculateTotalPrincipalPaid,
  countOverdueRepayments,
  countPaidRepayments,
  createLoanRepayment,
  markLoanRepaymentPaid
} from "../services/loanRepaymentService";

import type {
  LoanRepayment
} from "../types/finance.types";

const repayments: LoanRepayment[] = [
  {
    id: "repayment-1",
    loanId: "loan-1",
    dueDate: "2026-02-01",
    principalAmount: 5000000,
    interestAmount: 500000,
    totalAmount: 5500000,
    status: "paid"
  },
  {
    id: "repayment-2",
    loanId: "loan-1",
    dueDate: "2026-03-01",
    principalAmount: 5000000,
    interestAmount: 450000,
    totalAmount: 5450000,
    status: "paid"
  },
  {
    id: "repayment-3",
    loanId: "loan-2",
    dueDate: "2026-04-01",
    principalAmount: 3000000,
    interestAmount: 300000,
    totalAmount: 3300000,
    status: "overdue"
  },
  {
    id: "repayment-4",
    loanId: "loan-2",
    dueDate: "2026-05-01",
    principalAmount: 3000000,
    interestAmount: 250000,
    totalAmount: 3250000,
    status: "scheduled"
  }
];

describe("loanRepaymentService", () => {
  it("creates repayment", () => {
    const repayment =
      createLoanRepayment(
        repayments[0]
      );

    expect(
      repayment.id
    ).toBe("repayment-1");
  });

  it("marks repayment paid", () => {
    const repayment =
      markLoanRepaymentPaid(
        repayments[3]
      );

    expect(
      repayment.status
    ).toBe("paid");
  });

  it("calculates principal paid", () => {
    expect(
      calculateTotalPrincipalPaid(
        repayments
      )
    ).toBe(10000000);
  });

  it("calculates interest paid", () => {
    expect(
      calculateTotalInterestPaid(
        repayments
      )
    ).toBe(950000);
  });

  it("calculates total paid", () => {
    expect(
      calculateTotalPaid(
        repayments
      )
    ).toBe(10950000);
  });

  it("counts paid repayments", () => {
    expect(
      countPaidRepayments(
        repayments
      )
    ).toBe(2);
  });

  it("counts overdue repayments", () => {
    expect(
      countOverdueRepayments(
        repayments
      )
    ).toBe(1);
  });

  it("builds repayment summary", () => {
    expect(
      buildLoanRepaymentSummary(
        repayments
      )
    ).toEqual({
      totalPrincipalPaid:
        10000000,
      totalInterestPaid:
        950000,
      totalPaid:
        10950000,
      paidCount:
        2,
      overdueCount:
        1
    });
  });

  it("handles empty repayments", () => {
    expect(
      buildLoanRepaymentSummary(
        []
      )
    ).toEqual({
      totalPrincipalPaid: 0,
      totalInterestPaid: 0,
      totalPaid: 0,
      paidCount: 0,
      overdueCount: 0
    });
  });

  it("handles all paid repayments", () => {
    expect(
      countPaidRepayments([
        repayments[0],
        repayments[1]
      ])
    ).toBe(2);
  });
});