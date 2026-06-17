import type {
  VendorBill,
  BillPayment,
  AgingBucket,
  PayableAgingItem,
  PayableAgingSummary
} from "../types/finance.types";

export function calculatePayableDaysOverdue(
  dueDate: string,
  today: Date
): number {
  const due = new Date(dueDate);

  const diff =
    today.getTime() - due.getTime();

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  return days > 0 ? days : 0;
}

export function determinePayableAgingBucket(
  daysOverdue: number
): AgingBucket {
  if (daysOverdue <= 0) return "current";
  if (daysOverdue <= 30) return "1_30";
  if (daysOverdue <= 60) return "31_60";
  if (daysOverdue <= 90) return "61_90";

  return "90_plus";
}

export function calculateVendorBillPaidAmount(
  billId: string,
  payments: BillPayment[]
): number {
  return payments
    .filter(
      payment =>
        payment.billId === billId &&
        payment.status === "completed"
    )
    .reduce(
      (sum, payment) =>
        sum + payment.amount,
      0
    );
}

export function createPayableAgingItem(
  bill: VendorBill,
  payments: BillPayment[],
  vendorName: string,
  today: Date
): PayableAgingItem | null {
  if (
    bill.status === "paid" ||
    !bill.dueDate
  ) {
    return null;
  }

  const paidAmount =
    calculateVendorBillPaidAmount(
      bill.id,
      payments
    );

  const outstandingAmount =
    bill.total - paidAmount;

  const daysOverdue =
    calculatePayableDaysOverdue(
      bill.dueDate,
      today
    );

  return {
    billId: bill.id,
    vendorId: bill.vendorId,
    vendorName,
    billDate: bill.createdAt,
    dueDate: bill.dueDate,
    outstandingAmount,
    daysOverdue,
    bucket:
      determinePayableAgingBucket(
        daysOverdue
      )
  };
}

export function buildPayableAgingItems(
  bills: VendorBill[],
  payments: BillPayment[],
  vendorNames: Record<string, string>,
  today: Date
): PayableAgingItem[] {
  return bills
    .map(bill =>
      createPayableAgingItem(
        bill,
        payments,
        vendorNames[
          bill.vendorId
        ] ?? "Unknown Vendor",
        today
      )
    )
    .filter(
      (
        item
      ): item is PayableAgingItem =>
        item !== null
    );
}

export function buildPayableAgingSummary(
  items: PayableAgingItem[]
): PayableAgingSummary {
  const summary: PayableAgingSummary = {
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

    switch (item.bucket) {
      case "current":
        summary.current +=
          item.outstandingAmount;
        break;

      case "1_30":
        summary.bucket1To30 +=
          item.outstandingAmount;
        break;

      case "31_60":
        summary.bucket31To60 +=
          item.outstandingAmount;
        break;

      case "61_90":
        summary.bucket61To90 +=
          item.outstandingAmount;
        break;

      case "90_plus":
        summary.bucket90Plus +=
          item.outstandingAmount;
        break;
    }
  }

  return summary;
}

export function calculatePayableAgingPercentage(
  bucketAmount: number,
  totalOutstanding: number
): number {
  if (totalOutstanding <= 0) {
    return 0;
  }

  return Number(
    (
      (bucketAmount /
        totalOutstanding) *
      100
    ).toFixed(2)
  );
}

export function getHighestRiskPayableBucket(
  summary: PayableAgingSummary
): AgingBucket {
  const entries = [
    {
      bucket: "current" as AgingBucket,
      amount: summary.current
    },
    {
      bucket: "1_30" as AgingBucket,
      amount: summary.bucket1To30
    },
    {
      bucket: "31_60" as AgingBucket,
      amount: summary.bucket31To60
    },
    {
      bucket: "61_90" as AgingBucket,
      amount: summary.bucket61To90
    },
    {
      bucket: "90_plus" as AgingBucket,
      amount: summary.bucket90Plus
    }
  ];

  entries.sort(
    (a, b) =>
      b.amount - a.amount
  );

  return entries[0].bucket;
}