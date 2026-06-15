import type {
  BankReconciliationSummary,
  BankTransaction,
  Payment
} from "../types/finance.types";

export function createBankTransaction(
  reference: string,
  description: string,
  amount: number,
  occurredAt: string
): BankTransaction | null {
  if (amount === 0) return null;

  return {
    id: crypto.randomUUID(),
    reference: reference.trim(),
    description: description.trim(),
    amount,
    occurredAt,
    status: "unmatched"
  };
}

export function findMatchingPayment(
  transaction: BankTransaction,
  payments: Payment[]
): Payment | undefined {
  return payments.find(
    payment =>
      payment.status === "completed" &&
      payment.amount === Math.abs(transaction.amount)
  );
}

export function matchBankTransactionWithPayment(
  transaction: BankTransaction,
  payments: Payment[]
): BankTransaction | null {
  if (transaction.status !== "unmatched") {
    return null;
  }

  const payment = findMatchingPayment(
    transaction,
    payments
  );

  if (!payment) {
    return null;
  }

  return {
    ...transaction,
    status: "matched",
    matchedPaymentId: payment.id
  };
}

export function reconcileBankTransaction(
  transaction: BankTransaction
): BankTransaction | null {
  if (transaction.status !== "matched") {
    return null;
  }

  return {
    ...transaction,
    status: "reconciled"
  };
}

export function filterUnmatchedBankTransactions(
  transactions: BankTransaction[]
): BankTransaction[] {
  return transactions.filter(
    transaction => transaction.status === "unmatched"
  );
}

export function buildBankReconciliationSummary(
  transactions: BankTransaction[]
): BankReconciliationSummary {
  const matchedTransactions = transactions.filter(
    transaction => transaction.status === "matched"
  );

  const unmatchedTransactions =
    filterUnmatchedBankTransactions(transactions);

  const reconciledTransactions = transactions.filter(
    transaction => transaction.status === "reconciled"
  );

  return {
    totalTransactions: transactions.length,
    matchedTransactions: matchedTransactions.length,
    unmatchedTransactions: unmatchedTransactions.length,
    reconciledTransactions: reconciledTransactions.length,
    totalMatchedAmount: [
      ...matchedTransactions,
      ...reconciledTransactions
    ].reduce(
      (total, transaction) =>
        total + Math.abs(transaction.amount),
      0
    ),
    totalUnmatchedAmount: unmatchedTransactions.reduce(
      (total, transaction) =>
        total + Math.abs(transaction.amount),
      0
    )
  };
}