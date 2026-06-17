import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildFundTransferSummary,
  calculateTransferredAmount,
  cancelFundTransfer,
  createFundTransfer,
  executeFundTransfer,
  validateFundTransfer
} from "../services/fundTransferService";

import type {
  BankAccount,
  FundTransfer
} from "../types/finance.types";

const sourceAccount: BankAccount = {
  id: "bank-1",
  accountName: "BCA Main",
  bankName: "BCA",
  accountNumber: "111",
  currencyCode: "IDR",
  balance: 10000000,
  status: "active",
  createdAt: "2026-01-01"
};

const destinationAccount: BankAccount =
  {
    id: "bank-2",
    accountName: "Mandiri Ops",
    bankName: "Mandiri",
    accountNumber: "222",
    currencyCode: "IDR",
    balance: 5000000,
    status: "active",
    createdAt: "2026-01-01"
  };

const transfer: FundTransfer = {
  id: "transfer-1",
  fromBankAccountId:
    "bank-1",
  toBankAccountId:
    "bank-2",
  amount: 3000000,
  description:
    "Operational Transfer",
  transferredAt:
    "2026-06-01",
  status: "draft"
};

describe(
  "fundTransferService",
  () => {
    it(
      "creates fund transfer",
      () => {
        expect(
          createFundTransfer(
            transfer
          )
        ).toEqual(transfer);
      }
    );

    it(
      "validates transfer",
      () => {
        expect(
          validateFundTransfer(
            sourceAccount,
            destinationAccount,
            3000000
          )
        ).toBe(true);
      }
    );

    it(
      "rejects zero amount",
      () => {
        expect(
          validateFundTransfer(
            sourceAccount,
            destinationAccount,
            0
          )
        ).toBe(false);
      }
    );

    it(
      "rejects same account transfer",
      () => {
        expect(
          validateFundTransfer(
            sourceAccount,
            sourceAccount,
            1000
          )
        ).toBe(false);
      }
    );

    it(
      "rejects insufficient balance",
      () => {
        expect(
          validateFundTransfer(
            sourceAccount,
            destinationAccount,
            50000000
          )
        ).toBe(false);
      }
    );

    it(
      "executes transfer",
      () => {
        const result =
          executeFundTransfer(
            transfer,
            sourceAccount,
            destinationAccount
          );

        expect(
          result.transfer
            .status
        ).toBe(
          "completed"
        );

        expect(
          result.sourceAccount
            .balance
        ).toBe(7000000);

        expect(
          result.destinationAccount
            .balance
        ).toBe(8000000);
      }
    );

    it(
      "throws on invalid transfer",
      () => {
        expect(() =>
          executeFundTransfer(
            {
              ...transfer,
              amount:
                50000000
            },
            sourceAccount,
            destinationAccount
          )
        ).toThrow();
      }
    );

    it(
      "cancels transfer",
      () => {
        expect(
          cancelFundTransfer(
            transfer
          ).status
        ).toBe(
          "cancelled"
        );
      }
    );

    it(
      "calculates transferred amount",
      () => {
        expect(
          calculateTransferredAmount(
            [
              {
                ...transfer,
                status:
                  "completed"
              },
              {
                ...transfer,
                id: "t2",
                amount:
                  2000000,
                status:
                  "completed"
              }
            ]
          )
        ).toBe(
          5000000
        );
      }
    );

    it(
      "builds transfer summary",
      () => {
        const summary =
          buildFundTransferSummary(
            [
              {
                ...transfer,
                status:
                  "completed"
              },
              {
                ...transfer,
                id: "t2",
                status:
                  "cancelled"
              }
            ]
          );

        expect(
          summary
        ).toEqual({
          totalTransfers: 2,
          completedTransfers: 1,
          cancelledTransfers: 1,
          totalTransferredAmount:
            3000000
        });
      }
    );
  }
);