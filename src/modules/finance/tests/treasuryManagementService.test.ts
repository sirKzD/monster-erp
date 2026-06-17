import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildTreasurySummary,
  calculateLiquidityRatio,
  calculateTotalAvailableFunds,
  calculateTotalBankBalance,
  createTreasuryPosition,
  determineTreasuryStatus
} from "../services/treasuryManagementService";

import type {
  BankAccount
} from "../types/finance.types";

const accounts: BankAccount[] =
  [
    {
      id: "bank-1",
      accountName:
        "BCA Main",
      bankName: "BCA",
      accountNumber:
        "111111",
      currencyCode:
        "IDR",
      balance:
        10000000,
      status: "active",
      createdAt:
        "2026-01-01"
    },
    {
      id: "bank-2",
      accountName:
        "Mandiri Ops",
      bankName:
        "Mandiri",
      accountNumber:
        "222222",
      currencyCode:
        "IDR",
      balance:
        5000000,
      status: "active",
      createdAt:
        "2026-01-01"
    }
  ];

describe(
  "treasuryManagementService",
  () => {
    it(
      "calculates total bank balance",
      () => {
        expect(
          calculateTotalBankBalance(
            accounts
          )
        ).toBe(
          15000000
        );
      }
    );

    it(
      "calculates total available funds",
      () => {
        expect(
          calculateTotalAvailableFunds(
            2000000,
            accounts
          )
        ).toBe(
          17000000
        );
      }
    );

    it(
      "calculates liquidity ratio",
      () => {
        expect(
          calculateLiquidityRatio(
            15000000,
            10000000
          )
        ).toBe(
          1.5
        );
      }
    );

    it(
      "returns zero liquidity ratio",
      () => {
        expect(
          calculateLiquidityRatio(
            15000000,
            0
          )
        ).toBe(0);
      }
    );

    it(
      "determines healthy status",
      () => {
        expect(
          determineTreasuryStatus(
            1.6
          )
        ).toBe(
          "healthy"
        );
      }
    );

    it(
      "determines warning status",
      () => {
        expect(
          determineTreasuryStatus(
            1.2
          )
        ).toBe(
          "warning"
        );
      }
    );

    it(
      "determines critical status",
      () => {
        expect(
          determineTreasuryStatus(
            0.8
          )
        ).toBe(
          "critical"
        );
      }
    );

    it(
      "creates treasury position",
      () => {
        const position =
          createTreasuryPosition(
            2000000,
            accounts,
            10000000
          );

        expect(
          position
        ).toEqual({
          totalCash:
            2000000,
          totalBankBalance:
            15000000,
          totalAvailableFunds:
            17000000,
          minimumLiquidityTarget:
            10000000,
          status:
            "healthy"
        });
      }
    );

    it(
      "builds treasury summary",
      () => {
        const summary =
          buildTreasurySummary(
            2000000,
            accounts,
            10000000
          );

        expect(
          summary
        ).toEqual({
          totalCashAccounts:
            2,
          totalFunds:
            17000000,
          liquidityRatio:
            1.7,
          status:
            "healthy"
        });
      }
    );

    it(
      "handles empty accounts",
      () => {
        const summary =
          buildTreasurySummary(
            0,
            [],
            1000000
          );

        expect(
          summary
        ).toEqual({
          totalCashAccounts:
            0,
          totalFunds: 0,
          liquidityRatio:
            0,
          status:
            "critical"
        });
      }
    );
  }
);