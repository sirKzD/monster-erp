import type {
  CustomerLedgerEntry,
  CustomerLedgerSummary,
  Invoice,
  Payment
} from "../types/finance.types";

export function calculateCustomerInvoicePaidAmount(
  invoiceId: string,
  payments: Payment[]
): number {
  return payments
    .filter(
      payment =>
        payment.invoiceId === invoiceId &&
        payment.status === "completed"
    )
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );
}

export function buildCustomerLedgerEntries(
  customerId: string,
  invoices: Invoice[],
  payments: Payment[]
): CustomerLedgerEntry[] {
  return invoices
    .filter(
      invoice =>
        invoice.customerId === customerId
    )
    .map(invoice => {
      const paidAmount =
        calculateCustomerInvoicePaidAmount(
          invoice.id,
          payments
        );

      return {
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        invoiceTotal: invoice.total,
        paidAmount,
        outstandingAmount: Math.max(
          invoice.total - paidAmount,
          0
        ),
        status: invoice.status
      };
    });
}

export function calculateCustomerOutstandingBalance(
  customerId: string,
  invoices: Invoice[],
  payments: Payment[]
): number {
  return buildCustomerLedgerEntries(
    customerId,
    invoices,
    payments
  ).reduce(
    (total, entry) =>
      total + entry.outstandingAmount,
    0
  );
}

export function buildCustomerLedgerSummary(
  customerId: string,
  invoices: Invoice[],
  payments: Payment[]
): CustomerLedgerSummary {
  const entries = buildCustomerLedgerEntries(
    customerId,
    invoices,
    payments
  );

  return {
    customerId,
    totalInvoiced: entries.reduce(
      (total, entry) =>
        total + entry.invoiceTotal,
      0
    ),
    totalPaid: entries.reduce(
      (total, entry) =>
        total + entry.paidAmount,
      0
    ),
    outstandingBalance: entries.reduce(
      (total, entry) =>
        total + entry.outstandingAmount,
      0
    ),
    invoiceCount: entries.length
  };
}

export function filterCustomersWithOutstandingBalance(
  summaries: CustomerLedgerSummary[]
): CustomerLedgerSummary[] {
  return summaries.filter(
    summary =>
      summary.outstandingBalance > 0
  );
}