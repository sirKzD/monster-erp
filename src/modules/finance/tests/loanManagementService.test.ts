import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildLoanSummary,
  calculateTotalOutstanding,
  calculateTotalPrincipal,
  closeLoan,
  countActiveLoans,
  countClosedLoans,
  createLoan
} from "../services/loanManagementService";

import type {
  Loan
} from "../types/finance.types";

const loans: Loan[] = [
  {
    id: "loan-1",
    lenderName: "Bank Mandiri",
    principalAmount: 100000000,
    outstandingAmount: 80000000,
    interestRate: 8,
    startDate: "2026-01-01",
    maturityDate: "2029-01-01",
    status: "active"
  },
  {
    id: "loan-2",
    lenderName: "Bank BCA",
    principalAmount: 50000000,
    outstandingAmount: 25000000,
    interestRate: 7,
    startDate: "2026-02-01",
    maturityDate: "2028-02-01",
    status: "active"
  },
  {
    id: "loan-3",
    lenderName: "Bank BNI",
    principalAmount: 30000000,
    outstandingAmount: 0,
    interestRate: 6,
    startDate: "2025-01-01",
    maturityDate: "2026-01-01",
    status: "closed"
  }
];

describe(
  "loanManagementService",
  () => {
    it("creates loan", () => {
      const loan =
        createLoan(loans[0]);

      expect(loan.id)
        .toBe("loan-1");
    });

    it("closes loan", () => {
      const loan =
        closeLoan(loans[0]);

      expect(
        loan.status
      ).toBe("closed");

      expect(
        loan.outstandingAmount
      ).toBe(0);
    });

    it(
      "calculates total principal",
      () => {
        expect(
          calculateTotalPrincipal(
            loans
          )
        ).toBe(
          180000000
        );
      }
    );

    it(
      "calculates total outstanding",
      () => {
        expect(
          calculateTotalOutstanding(
            loans
          )
        ).toBe(
          105000000
        );
      }
    );

    it(
      "counts active loans",
      () => {
        expect(
          countActiveLoans(
            loans
          )
        ).toBe(2);
      }
    );

    it(
      "counts closed loans",
      () => {
        expect(
          countClosedLoans(
            loans
          )
        ).toBe(1);
      }
    );

    it(
      "builds loan summary",
      () => {
        expect(
          buildLoanSummary(
            loans
          )
        ).toEqual({
          totalPrincipal:
            180000000,

          totalOutstanding:
            105000000,

          activeLoanCount:
            2,

          closedLoanCount:
            1
        });
      }
    );

    it(
      "handles empty loans",
      () => {
        expect(
          buildLoanSummary(
            []
          )
        ).toEqual({
          totalPrincipal: 0,
          totalOutstanding: 0,
          activeLoanCount: 0,
          closedLoanCount: 0
        });
      }
    );

    it(
      "handles all active loans",
      () => {
        expect(
          countActiveLoans([
            loans[0],
            loans[1]
          ])
        ).toBe(2);
      }
    );

    it(
      "handles all closed loans",
      () => {
        expect(
          countClosedLoans([
            loans[2]
          ])
        ).toBe(1);
      }
    );
  }
);