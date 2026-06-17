import type {
  AgingBucket,
  Invoice,
  Payment,
  ReceivableAgingItem,
  ReceivableAgingSummary
} from "../types/finance.types";

export function calculateReceivableDaysOverdue(
  dueDate: string,
  today: Date
): number {
  const dueTime = new Date(dueDate).getTime();
  const todayTime = today.getTime();

  if (Number.isNaN(dueTime)) return 0;

  const diffInMilliseconds =
    todayTime - dueTime;

  if (diffInMilliseconds <= 0) return 0;

  return Math.floor(
    diffInMilliseconds /
      (1000 * 60 * 60 * 24)
  );
}

export function determineReceivableAgingBucket(
  daysOverdue: number
): AgingBucket {
  if (daysOverdue <= 0) return "current";
  if (daysOverdue <= 30) return "1_30";
  if (daysOverdue <= 60) return "31_60";
  if (daysOverdue <= 90) return "61_90";

  return "90_plus";
}

export function calculateReceivableInvoicePaidAmount(
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

export function createReceivableAgingItem(
  invoice: Invoice,
  payments: Payment[],
  customerName: string,
  today: Date
): ReceivableAgingItem | null {
  if (
    invoice.status === "paid" ||
    invoice.status === "cancelled" ||
    !invoice.dueDate
  ) {
    return null;
  }

  const paidAmount =
    calculateReceivableInvoicePaidAmount(
      invoice.id,
      payments
    );

  const outstandingAmount = Math.max(
    invoice.total - paidAmount,
    0
  );

  if (outstandingAmount <= 0) {
    return null;
  }

  const daysOverdue =
    calculateReceivableDaysOverdue(
      invoice.dueDate,
      today
    );

  return {
    invoiceId: invoice.id,
    customerId: invoice.customerId,
    customerName,
    invoiceDate: invoice.createdAt,
    dueDate: invoice.dueDate,
    outstandingAmount,
    daysOverdue,
    bucket:
      determineReceivableAgingBucket(
        daysOverdue
      )
  };
}

export function buildReceivableAgingItems(
  invoices: Invoice[],
  payments: Payment[],
  customerNames: Record<string, string>,
  today: Date
): ReceivableAgingItem[] {
  return invoices
    .map(invoice =>
      createReceivableAgingItem(
        invoice,
        payments,
        customerNames[invoice.customerId] ??
          invoice.customerId,
        today
      )
    )
    .filter(
      (
        item
      ): item is ReceivableAgingItem =>
        item !== null
    );
}

export function buildReceivableAgingSummary(
  items: ReceivableAgingItem[]
): ReceivableAgingSummary {
  const summary: ReceivableAgingSummary = {
    current: 0,
    bucket1To30: 0,
    bucket31To60: 0,
    bucket61To90: 0,
    bucket90Plus: 0,
    totalOutstanding: 0
  };

  for (const item of items) {
    summary.totalOutstanding +=
      item.outstandingAmount;

    if (item.bucket === "current") {
      summary.current += item.outstandingAmount;
    }

    if (item.bucket === "1_30") {
      summary.bucket1To30 +=
        item.outstandingAmount;
    }

    if (item.bucket === "31_60") {
      summary.bucket31To60 +=
        item.outstandingAmount;
    }

    if (item.bucket === "61_90") {
      summary.bucket61To90 +=
        item.outstandingAmount;
    }

    if (item.bucket === "90_plus") {
      summary.bucket90Plus +=
        item.outstandingAmount;
    }
  }

  return summary;
}

export function calculateReceivableAgingPercentage(
  bucketAmount: number,
  totalOutstanding: number
): number {
  if (totalOutstanding <= 0) return 0;

  return Number(
    (
      (bucketAmount / totalOutstanding) *
      100
    ).toFixed(2)
  );
}

export function getReceivableHighestRiskBucket(
  summary: ReceivableAgingSummary
): AgingBucket {
  const buckets: {
    bucket: AgingBucket;
    amount: number;
  }[] = [
    {
      bucket: "90_plus",
      amount: summary.bucket90Plus
    },
    {
      bucket: "61_90",
      amount: summary.bucket61To90
    },
    {
      bucket: "31_60",
      amount: summary.bucket31To60
    },
    {
      bucket: "1_30",
      amount: summary.bucket1To30
    },
    {
      bucket: "current",
      amount: summary.current
    }
  ];

  return buckets.sort(
    (a, b) => b.amount - a.amount
  )[0].bucket;
}