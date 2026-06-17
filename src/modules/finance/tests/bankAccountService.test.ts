import {
  describe,
  expect,
  it
} from "vitest";

import {
  activateBankAccount,
  buildBankAccountSummary,
  closeBankAccount,
  createBankAccount,
  deactivateBankAccount,
  depositToBankAccount,
  withdrawFromBankAccount
} from "../services/bankAccountService";

import type {
  BankAccount
} from "../types/finance.types";

const account: BankAccount = {
  id: "bank-1",
  accountName: "Main Account",
  bankName: "BCA",
  accountNumber: "123456789",
  currencyCode: "IDR",
  balance: 10000000,
  status: "active",
  createdAt: "2026-01-01"
};

describe(
  "bankAccountService",
  () => {
    it(
      "creates bank account",
      () => {
        const result =
          createBankAccount(
            account
          );

        expect(
          result.id
        ).toBe("bank-1");
      }
    );

    it(
      "activates bank account",
      () => {
        const result =
          activateBankAccount({
            ...account,
            status:
              "inactive"
          });

        expect(
          result.status
        ).toBe("active");
      }
    );

    it(
      "deactivates bank account",
      () => {
        const result =
          deactivateBankAccount(
            account
          );

        expect(
          result.status
        ).toBe("inactive");
      }
    );

    it(
      "closes bank account",
      () => {
        const result =
          closeBankAccount(
            account
          );

        expect(
          result.status
        ).toBe("closed");
      }
    );

    it(
      "deposits money",
      () => {
        const result =
          depositToBankAccount(
            account,
            5000000
          );

        expect(
          result.balance
        ).toBe(15000000);
      }
    );

    it(
      "blocks invalid deposit",
      () => {
        expect(() =>
          depositToBankAccount(
            account,
            0
          )
        ).toThrow();
      }
    );

    it(
      "withdraws money",
      () => {
        const result =
          withdrawFromBankAccount(
            account,
            3000000
          );

        expect(
          result.balance
        ).toBe(7000000);
      }
    );

    it(
      "prevents overdraft withdrawal",
      () => {
        expect(() =>
          withdrawFromBankAccount(
            account,
            50000000
          )
        ).toThrow();
      }
    );

    it(
      "blocks invalid withdrawal",
      () => {
        expect(() =>
          withdrawFromBankAccount(
            account,
            0
          )
        ).toThrow();
      }
    );

    it(
      "builds bank account summary",
      () => {
        const summary =
          buildBankAccountSummary([
            account,
            {
              ...account,
              id: "bank-2",
              balance: 5000000,
              status:
                "inactive"
            }
          ]);

        expect(
          summary
        ).toEqual({
          totalAccounts: 2,
          activeAccounts: 1,
          inactiveAccounts: 1,
          totalBalance:
            15000000
        });
      }
    );

    it(
      "handles empty account list",
      () => {
        const summary =
          buildBankAccountSummary(
            []
          );

        expect(
          summary
        ).toEqual({
          totalAccounts: 0,
          activeAccounts: 0,
          inactiveAccounts: 0,
          totalBalance: 0
        });
      }
    );
  }
);