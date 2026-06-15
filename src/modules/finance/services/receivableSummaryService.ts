import type {
  Invoice,
  Payment,
  ReceivableSummary
} from "../types/finance.types";

export function calculateInvoicePaidAmount(
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
      (total, payment) =>
        total + payment.amount,
      0
    );
}

export function calculateInvoiceOutstanding(
  invoice: Invoice,
  payments: Payment[]
): number {
  const paidAmount =
    calculateInvoicePaidAmount(
      invoice.id,
      payments
    );

  return Math.max(
    invoice.total - paidAmount,
    0
  );
}

export function isInvoiceOverdue(
  invoice: Invoice,
  today: Date
): boolean {
  if (
    invoice.status === "paid" ||
    !invoice.dueDate
  ) {
    return false;
  }

  return (
    new Date(invoice.dueDate).getTime() <
    today.getTime()
  );
}

export function buildReceivableSummary(
  invoices: Invoice[],
  payments: Payment[],
  today: Date = new Date()
): ReceivableSummary {
  const totalInvoiced =
    invoices.reduce(
      (total, invoice) =>
        total + invoice.total,
      0
    );

  const totalPaid =
    payments
      .filter(
        payment =>
          payment.status === "completed"
      )
      .reduce(
        (total, payment) =>
          total + payment.amount,
        0
      );

  let overdueBalance = 0;
  let overdueInvoiceCount = 0;

  for (const invoice of invoices) {
    const outstanding =
      calculateInvoiceOutstanding(
        invoice,
        payments
      );

    if (
      outstanding > 0 &&
      isInvoiceOverdue(
        invoice,
        today
      )
    ) {
      overdueBalance += outstanding;
      overdueInvoiceCount++;
    }
  }

  const outstandingBalance =
    Math.max(
      totalInvoiced - totalPaid,
      0
    );

  const collectionRate =
    totalInvoiced === 0
      ? 0
      : Number(
          (
            (totalPaid /
              totalInvoiced) *
            100
          ).toFixed(2)
        );

  return {
    totalInvoiced,
    totalPaid,
    outstandingBalance,
    overdueBalance,
    overdueInvoiceCount,
    collectionRate
  };
}