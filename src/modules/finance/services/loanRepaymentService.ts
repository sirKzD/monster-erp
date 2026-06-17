import type {
  LoanRepayment,
  LoanRepaymentSummary
} from "../types/finance.types";

export function createLoanRepayment(
  repayment: LoanRepayment
): LoanRepayment {
  return {
    ...repayment
  };
}

export function markLoanRepaymentPaid(
  repayment: LoanRepayment
): LoanRepayment {
  return {
    ...repayment,
    status: "paid"
  };
}

export function calculateTotalPrincipalPaid(
  repayments: LoanRepayment[]
): number {
  return repayments
    .filter(
      repayment =>
        repayment.status === "paid"
    )
    .reduce(
      (total, repayment) =>
        total + repayment.principalAmount,
      0
    );
}

export function calculateTotalInterestPaid(
  repayments: LoanRepayment[]
): number {
  return repayments
    .filter(
      repayment =>
        repayment.status === "paid"
    )
    .reduce(
      (total, repayment) =>
        total + repayment.interestAmount,
      0
    );
}

export function calculateTotalPaid(
  repayments: LoanRepayment[]
): number {
  return repayments
    .filter(
      repayment =>
        repayment.status === "paid"
    )
    .reduce(
      (total, repayment) =>
        total + repayment.totalAmount,
      0
    );
}

export function countPaidRepayments(
  repayments: LoanRepayment[]
): number {
  return repayments.filter(
    repayment =>
      repayment.status === "paid"
  ).length;
}

export function countOverdueRepayments(
  repayments: LoanRepayment[]
): number {
  return repayments.filter(
    repayment =>
      repayment.status === "overdue"
  ).length;
}

export function buildLoanRepaymentSummary(
  repayments: LoanRepayment[]
): LoanRepaymentSummary {
  return {
    totalPrincipalPaid:
      calculateTotalPrincipalPaid(
        repayments
      ),
    totalInterestPaid:
      calculateTotalInterestPaid(
        repayments
      ),
    totalPaid:
      calculateTotalPaid(
        repayments
      ),
    paidCount:
      countPaidRepayments(
        repayments
      ),
    overdueCount:
      countOverdueRepayments(
        repayments
      )
  };
}