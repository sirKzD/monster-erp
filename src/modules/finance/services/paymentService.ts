import type {
  Invoice,
  Payment
} from "../types/finance.types";

export function calculateTotalPaid(
  payments: Payment[]
): number {
  return payments
    .filter(payment => payment.status === "completed")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );
}

export function calculateRemainingInvoiceBalance(
  invoice: Invoice,
  payments: Payment[]
): number {
  return Math.max(
    invoice.total - calculateTotalPaid(payments),
    0
  );
}

export function createPayment(
  invoice: Invoice,
  existingPayments: Payment[],
  amount: number
): Payment | null {
  if (invoice.status === "draft") return null;
  if (invoice.status === "cancelled") return null;
  if (invoice.status === "paid") return null;
  if (amount <= 0) return null;

  const remainingBalance =
    calculateRemainingInvoiceBalance(
      invoice,
      existingPayments
    );

  if (amount > remainingBalance) {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    invoiceId: invoice.id,
    amount,
    status: "completed",
    paidAt: new Date().toISOString()
  };
}

export function cancelPayment(
  payment: Payment
): Payment | null {
  if (payment.status !== "completed") {
    return null;
  }

  return {
    ...payment,
    status: "cancelled"
  };
}

export function applyPaymentToInvoice(
  invoice: Invoice,
  payments: Payment[]
): Invoice {
  const remainingBalance =
    calculateRemainingInvoiceBalance(
      invoice,
      payments
    );

  if (remainingBalance === 0) {
    return {
      ...invoice,
      status: "paid",
      paidAt: new Date().toISOString()
    };
  }

  return invoice;
}

export function filterCompletedPayments(
  payments: Payment[]
): Payment[] {
  return payments.filter(
    payment => payment.status === "completed"
  );
}