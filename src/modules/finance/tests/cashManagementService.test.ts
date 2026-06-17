import {
  describe,
  expect,
  it
} from "vitest";

import {
  calculateCashInflow,
  calculateCashOutflow,
  calculateCashPosition,
  createCashManagementSummary,
  createDailyCashSummary
} from "../services/cashManagementService";

import type {
  CashTransaction
} from "../types/finance.types";

const transactions: CashTransaction[] =
  [
    {
      id: "1",
      description:
        "Customer Payment",
      amount: 5000000,
      type: "inflow",
      transactionDate:
        "2026-06-17"
    },
    {
      id: "2",
      description:
        "Supplier Payment",
      amount: 1500000,
      type: "outflow",
      transactionDate:
        "2026-06-17"
    },
    {
      id: "3",
      description:
        "Cash Sales",
      amount: 2000000,
      type: "inflow",
      transactionDate:
        "2026-06-18"
    },
    {
      id: "4",
      description:
        "Office Expense",
      amount: 500000,
      type: "outflow",
      transactionDate:
        "2026-06-18"
    }
  ];

describe(
  "cashManagementService",
  () => {
    it(
      "calculates total cash inflow",
      () => {
        expect(
          calculateCashInflow(
            transactions
          )
        ).toBe(7000000);
      }
    );

    it(
      "calculates total cash outflow",
      () => {
        expect(
          calculateCashOutflow(
            transactions
          )
        ).toBe(2000000);
      }
    );

    it(
      "calculates cash position",
      () => {
        expect(
          calculateCashPosition(
            10000000,
            transactions
          )
        ).toEqual({
          openingBalance:
            10000000,
          totalInflow:
            7000000,
          totalOutflow:
            2000000,
          closingBalance:
            15000000
        });
      }
    );

    it(
      "creates cash management summary",
      () => {
        expect(
          createCashManagementSummary(
            10000000,
            transactions
          )
        ).toEqual({
          totalTransactions:
            4,
          totalInflow:
            7000000,
          totalOutflow:
            2000000,
          endingCashBalance:
            15000000
        });
      }
    );

    it(
      "creates daily cash summary for first day",
      () => {
        expect(
          createDailyCashSummary(
            "2026-06-17",
            transactions
          )
        ).toEqual({
          date:
            "2026-06-17",
          inflow:
            5000000,
          outflow:
            1500000,
          netCashFlow:
            3500000
        });
      }
    );

    it(
      "creates daily cash summary for second day",
      () => {
        expect(
          createDailyCashSummary(
            "2026-06-18",
            transactions
          )
        ).toEqual({
          date:
            "2026-06-18",
          inflow:
            2000000,
          outflow:
            500000,
          netCashFlow:
            1500000
        });
      }
    );

    it(
      "returns zero values for empty day",
      () => {
        expect(
          createDailyCashSummary(
            "2026-06-19",
            transactions
          )
        ).toEqual({
          date:
            "2026-06-19",
          inflow: 0,
          outflow: 0,
          netCashFlow: 0
        });
      }
    );
  }
);