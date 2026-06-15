import type {
  BillPayment,
  PayableSummary,
  VendorBill
} from "../types/finance.types";

export function calculateBillPaidAmount(
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
      (total, payment) =>
        total + payment.amount,
      0
    );
}

export function calculateBillOutstanding(
  bill: VendorBill,
  payments: BillPayment[]
): number {
  const paidAmount =
    calculateBillPaidAmount(
      bill.id,
      payments
    );

  return Math.max(
    bill.total - paidAmount,
    0
  );
}

export function isBillOverdue(
  bill: VendorBill,
  today: Date
): boolean {
  if (
    bill.status === "paid" ||
    bill.status === "cancelled" ||
    !bill.dueDate
  ) {
    return false;
  }

  return (
    new Date(bill.dueDate).getTime() <
    today.getTime()
  );
}

export function buildPayableSummary(
  bills: VendorBill[],
  payments: BillPayment[],
  today: Date = new Date()
): PayableSummary {
  const activeBills = bills.filter(
    bill => bill.status !== "cancelled"
  );

  const totalBilled =
    activeBills.reduce(
      (total, bill) => total + bill.total,
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
  let overdueBillCount = 0;

  for (const bill of activeBills) {
    const outstanding =
      calculateBillOutstanding(
        bill,
        payments
      );

    if (
      outstanding > 0 &&
      isBillOverdue(
        bill,
        today
      )
    ) {
      overdueBalance += outstanding;
      overdueBillCount++;
    }
  }

  const outstandingPayable =
    Math.max(
      totalBilled - totalPaid,
      0
    );

  const paymentRate =
    totalBilled === 0
      ? 0
      : Number(
          (
            (totalPaid / totalBilled) *
            100
          ).toFixed(2)
        );

  return {
    totalBilled,
    totalPaid,
    outstandingPayable,
    overdueBalance,
    overdueBillCount,
    paymentRate
  };
}