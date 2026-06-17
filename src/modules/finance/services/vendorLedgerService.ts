import type {
  BillPayment,
  VendorBill,
  VendorLedgerEntry,
  VendorLedgerSummary
} from "../types/finance.types";

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
      (total, payment) => total + payment.amount,
      0
    );
}

export function buildVendorLedgerEntries(
  vendorId: string,
  bills: VendorBill[],
  payments: BillPayment[]
): VendorLedgerEntry[] {
  return bills
    .filter(bill => bill.vendorId === vendorId)
    .map(bill => {
      const paidAmount =
        calculateVendorBillPaidAmount(
          bill.id,
          payments
        );

      return {
        vendorId: bill.vendorId,
        billId: bill.id,
        billTotal: bill.total,
        paidAmount,
        outstandingAmount: Math.max(
          bill.total - paidAmount,
          0
        ),
        status: bill.status
      };
    });
}

export function calculateVendorOutstandingBalance(
  vendorId: string,
  bills: VendorBill[],
  payments: BillPayment[]
): number {
  return buildVendorLedgerEntries(
    vendorId,
    bills,
    payments
  ).reduce(
    (total, entry) =>
      total + entry.outstandingAmount,
    0
  );
}

export function buildVendorLedgerSummary(
  vendorId: string,
  bills: VendorBill[],
  payments: BillPayment[]
): VendorLedgerSummary {
  const entries = buildVendorLedgerEntries(
    vendorId,
    bills,
    payments
  );

  return {
    vendorId,
    totalBilled: entries.reduce(
      (total, entry) => total + entry.billTotal,
      0
    ),
    totalPaid: entries.reduce(
      (total, entry) => total + entry.paidAmount,
      0
    ),
    outstandingBalance: entries.reduce(
      (total, entry) =>
        total + entry.outstandingAmount,
      0
    ),
    billCount: entries.length
  };
}

export function filterVendorsWithOutstandingBalance(
  summaries: VendorLedgerSummary[]
): VendorLedgerSummary[] {
  return summaries.filter(
    summary => summary.outstandingBalance > 0
  );
}