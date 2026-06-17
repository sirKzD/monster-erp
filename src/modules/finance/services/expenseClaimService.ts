import type {
  ExpenseClaim,
  ExpenseClaimSummary
} from "../types/finance.types";

export function createExpenseClaim(
  claim: ExpenseClaim
): ExpenseClaim {
  return {
    ...claim,
    status: "submitted"
  };
}

export function approveExpenseClaim(
  claim: ExpenseClaim,
  approvedAt: string
): ExpenseClaim {
  return {
    ...claim,
    status: "approved",
    approvedAt
  };
}

export function rejectExpenseClaim(
  claim: ExpenseClaim
): ExpenseClaim {
  return {
    ...claim,
    status: "rejected"
  };
}

export function payExpenseClaim(
  claim: ExpenseClaim,
  paidAt: string
): ExpenseClaim {
  return {
    ...claim,
    status: "paid",
    paidAt
  };
}

export function getEmployeeExpenseClaims(
  employeeId: string,
  claims: ExpenseClaim[]
): ExpenseClaim[] {
  return claims.filter(
    claim =>
      claim.employeeId === employeeId
  );
}

export function buildExpenseClaimSummary(
  claims: ExpenseClaim[]
): ExpenseClaimSummary {
  const totalClaims = claims.length;

  const totalAmount = claims.reduce(
    (sum, claim) => sum + claim.amount,
    0
  );

  const approvedAmount = claims
    .filter(
      claim =>
        claim.status === "approved" ||
        claim.status === "paid"
    )
    .reduce(
      (sum, claim) =>
        sum + claim.amount,
      0
    );

  const paidAmount = claims
    .filter(
      claim => claim.status === "paid"
    )
    .reduce(
      (sum, claim) =>
        sum + claim.amount,
      0
    );

  return {
    totalClaims,
    totalAmount,
    approvedAmount,
    paidAmount
  };
}