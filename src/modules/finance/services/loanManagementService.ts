import type {
  Loan,
  LoanSummary
} from "../types/finance.types";

export function createLoan(
  loan: Loan
): Loan {
  return {
    ...loan
  };
}

export function closeLoan(
  loan: Loan
): Loan {
  return {
    ...loan,
    outstandingAmount: 0,
    status: "closed"
  };
}

export function calculateTotalPrincipal(
  loans: Loan[]
): number {
  return loans.reduce(
    (total, loan) =>
      total + loan.principalAmount,
    0
  );
}

export function calculateTotalOutstanding(
  loans: Loan[]
): number {
  return loans.reduce(
    (total, loan) =>
      total + loan.outstandingAmount,
    0
  );
}

export function countActiveLoans(
  loans: Loan[]
): number {
  return loans.filter(
    (loan) => loan.status === "active"
  ).length;
}

export function countClosedLoans(
  loans: Loan[]
): number {
  return loans.filter(
    (loan) => loan.status === "closed"
  ).length;
}

export function buildLoanSummary(
  loans: Loan[]
): LoanSummary {
  return {
    totalPrincipal:
      calculateTotalPrincipal(loans),

    totalOutstanding:
      calculateTotalOutstanding(loans),

    activeLoanCount:
      countActiveLoans(loans),

    closedLoanCount:
      countClosedLoans(loans)
  };
}