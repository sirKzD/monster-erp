import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from "vitest";

import {
  buildBankReconciliationSummary,
  createBankTransaction,
  filterUnmatchedBankTransactions,
  findMatchingPayment,
  matchBankTransactionWithPayment,
  reconcileBankTransaction
} from "../services/bankReconciliationService";

import type {
  BankTransaction,
  Payment
} from "../types/finance.types";

const payments: Payment[] = [
  {
    id: "payment-1",
    invoiceId: "invoice-1",
    amount: 5000,
    status: "completed",
    paidAt: "2026-01-01"
  },
  {
    id: "payment-2",
    invoiceId: "invoice-2",
    amount: 2000,
    status: "cancelled",
    paidAt: "2026-01-02"
  }
];

const transactions: BankTransaction[] = [
  {
    id: "txn-1",
    reference: "BANK-001",
    description: "Customer payment",
    amount: 5000,
    occurredAt: "2026-01-01",
    status: "matched",
    matchedPaymentId: "payment-1"
  },
  {
    id: "txn-2",
    reference: "BANK-002",
    description: "Unknown transfer",
    amount: 3000,
    occurredAt: "2026-01-02",
    status: "unmatched"
  },
  {
    id: "txn-3",
    reference: "BANK-003",
    description: "Reconciled payment",
    amount: 1000,
    occurredAt: "2026-01-03",
    status: "reconciled",
    matchedPaymentId: "payment-3"
  }
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "bank-transaction-1"
  });
});

describe("bankReconciliationService", () => {
  it("creates bank transaction", () => {
    const transaction = createBankTransaction(
      " BANK-001 ",
      " Customer payment ",
      5000,
      "2026-01-01"
    );

    expect(transaction).toEqual({
      id: "bank-transaction-1",
      reference: "BANK-001",
      description: "Customer payment",
      amount: 5000,
      occurredAt: "2026-01-01",
      status: "unmatched"
    });
  });

  it("blocks zero amount bank transaction", () => {
    expect(
      createBankTransaction(
        "BANK-001",
        "Invalid",
        0,
        "2026-01-01"
      )
    ).toBeNull();
  });

  it("finds matching completed payment", () => {
    const transaction = createBankTransaction(
      "BANK-001",
      "Customer payment",
      5000,
      "2026-01-01"
    )!;

    const payment = findMatchingPayment(
      transaction,
      payments
    );

    expect(payment?.id).toBe("payment-1");
  });

  it("matches bank transaction with payment", () => {
    const transaction = createBankTransaction(
      "BANK-001",
      "Customer payment",
      5000,
      "2026-01-01"
    )!;

    const matched = matchBankTransactionWithPayment(
      transaction,
      payments
    );

    expect(matched?.status).toBe("matched");
    expect(matched?.matchedPaymentId).toBe("payment-1");
  });

  it("blocks matching already matched transaction", () => {
    const matched = matchBankTransactionWithPayment(
      transactions[0],
      payments
    );

    expect(matched).toBeNull();
  });

  it("reconciles matched transaction", () => {
    const reconciled = reconcileBankTransaction(
      transactions[0]
    );

    expect(reconciled?.status).toBe("reconciled");
  });

  it("blocks reconcile unmatched transaction", () => {
    const reconciled = reconcileBankTransaction(
      transactions[1]
    );

    expect(reconciled).toBeNull();
  });

  it("filters unmatched transactions", () => {
    const result = filterUnmatchedBankTransactions(
      transactions
    );

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("unmatched");
  });

  it("builds bank reconciliation summary", () => {
    const summary = buildBankReconciliationSummary(
      transactions
    );

    expect(summary).toEqual({
      totalTransactions: 3,
      matchedTransactions: 1,
      unmatchedTransactions: 1,
      reconciledTransactions: 1,
      totalMatchedAmount: 6000,
      totalUnmatchedAmount: 3000
    });
  });
});