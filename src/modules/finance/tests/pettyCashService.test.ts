import {
  describe,
  expect,
  it
} from "vitest";

import {
  addPettyCashExpense,
  calculatePettyCashBalance,
  calculateTotalPettyCashExpenses,
  calculateTotalReplenishments,
  createPettyCashFund,
  createPettyCashSummary,
  replenishPettyCash
} from "../services/pettyCashService";

import type {
  PettyCashExpense,
  PettyCashFund,
  PettyCashReplenishment
} from "../types/finance.types";

describe(
  "pettyCashService",
  () => {
    const fund: PettyCashFund = {
      id: "fund-1",
      name: "Office Cash",
      openingBalance: 5000000,
      currentBalance: 5000000,
      status: "active",
      createdAt: "2026-06-17"
    };

    const expenses: PettyCashExpense[] =
      [
        {
          id: "exp-1",
          fundId: "fund-1",
          description:
            "Stationery",
          amount: 250000,
          expenseDate:
            "2026-06-17"
        },
        {
          id: "exp-2",
          fundId: "fund-1",
          description:
            "Transport",
          amount: 150000,
          expenseDate:
            "2026-06-18"
        }
      ];

    const replenishments: PettyCashReplenishment[] =
      [
        {
          id: "rep-1",
          fundId: "fund-1",
          amount: 1000000,
          replenishedAt:
            "2026-06-20"
        }
      ];

    it(
      "creates petty cash fund",
      () => {
        expect(
          createPettyCashFund(
            fund
          )
        ).toEqual(fund);
      }
    );

    it(
      "rejects negative opening balance",
      () => {
        expect(() =>
          createPettyCashFund({
            ...fund,
            openingBalance:
              -1
          })
        ).toThrow();
      }
    );

    it(
      "adds petty cash expense",
      () => {
        const result =
          addPettyCashExpense(
            fund,
            expenses[0]
          );

        expect(
          result.currentBalance
        ).toBe(4750000);
      }
    );

    it(
      "rejects expense over balance",
      () => {
        expect(() =>
          addPettyCashExpense(
            fund,
            {
              ...expenses[0],
              amount:
                99999999
            }
          )
        ).toThrow();
      }
    );

    it(
      "replenishes petty cash",
      () => {
        const result =
          replenishPettyCash(
            fund,
            replenishments[0]
          );

        expect(
          result.currentBalance
        ).toBe(6000000);
      }
    );

    it(
      "calculates petty cash balance",
      () => {
        expect(
          calculatePettyCashBalance(
            fund
          )
        ).toBe(5000000);
      }
    );

    it(
      "calculates total expenses",
      () => {
        expect(
          calculateTotalPettyCashExpenses(
            expenses
          )
        ).toBe(400000);
      }
    );

    it(
      "calculates total replenishments",
      () => {
        expect(
          calculateTotalReplenishments(
            replenishments
          )
        ).toBe(1000000);
      }
    );

    it(
      "creates petty cash summary",
      () => {
        expect(
          createPettyCashSummary(
            fund,
            expenses,
            replenishments
          )
        ).toEqual({
          fundId: "fund-1",
          openingBalance:
            5000000,
          currentBalance:
            5000000,
          totalExpenses:
            400000,
          totalReplenishments:
            1000000
        });
      }
    );

    it(
      "handles empty expenses",
      () => {
        expect(
          calculateTotalPettyCashExpenses(
            []
          )
        ).toBe(0);
      }
    );

    it(
      "handles empty replenishments",
      () => {
        expect(
          calculateTotalReplenishments(
            []
          )
        ).toBe(0);
      }
    );
  }
);