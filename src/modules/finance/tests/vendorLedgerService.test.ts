import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildVendorLedgerEntries,
  buildVendorLedgerSummary,
  calculateVendorBillPaidAmount,
  calculateVendorOutstandingBalance,
  filterVendorsWithOutstandingBalance
} from "../services/vendorLedgerService";

import type {
  BillPayment,
  VendorBill
} from "../types/finance.types";

const bills: VendorBill[] = [
  {
    id: "bill-1",
    vendorId: "vendor-1",
    total: 11000000,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-01-31"
  },
  {
    id: "bill-2",
    vendorId: "vendor-1",
    total: 5500000,
    status: "paid",
    createdAt: "2026-01-02",
    dueDate: "2026-01-31",
    paidAt: "2026-01-10"
  },
  {
    id: "bill-3",
    vendorId: "vendor-2",
    total: 3300000,
    status: "issued",
    createdAt: "2026-01-03",
    dueDate: "2026-01-31"
  }
];

const payments: BillPayment[] = [
  {
    id: "payment-1",
    billId: "bill-1",
    amount: 4000000,
    status: "completed",
    paidAt: "2026-01-05"
  },
  {
    id: "payment-2",
    billId: "bill-2",
    amount: 5500000,
    status: "completed",
    paidAt: "2026-01-10"
  },
  {
    id: "payment-3",
    billId: "bill-1",
    amount: 1000000,
    status: "cancelled",
    paidAt: "2026-01-06"
  }
];

describe("vendorLedgerService", () => {
  it("calculates vendor bill paid amount", () => {
    expect(
      calculateVendorBillPaidAmount(
        "bill-1",
        payments
      )
    ).toBe(4000000);
  });

  it("builds vendor ledger entries", () => {
    const entries = buildVendorLedgerEntries(
      "vendor-1",
      bills,
      payments
    );

    expect(entries).toHaveLength(2);

    expect(entries[0]).toEqual({
      vendorId: "vendor-1",
      billId: "bill-1",
      billTotal: 11000000,
      paidAmount: 4000000,
      outstandingAmount: 7000000,
      status: "issued"
    });
  });

  it("calculates vendor outstanding balance", () => {
    expect(
      calculateVendorOutstandingBalance(
        "vendor-1",
        bills,
        payments
      )
    ).toBe(7000000);
  });

  it("builds vendor ledger summary", () => {
    expect(
      buildVendorLedgerSummary(
        "vendor-1",
        bills,
        payments
      )
    ).toEqual({
      vendorId: "vendor-1",
      totalBilled: 16500000,
      totalPaid: 9500000,
      outstandingBalance: 7000000,
      billCount: 2
    });
  });

  it("returns empty summary for vendor without bills", () => {
    expect(
      buildVendorLedgerSummary(
        "vendor-unknown",
        bills,
        payments
      )
    ).toEqual({
      vendorId: "vendor-unknown",
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      billCount: 0
    });
  });

  it("filters vendors with outstanding balance", () => {
    const summaries = [
      buildVendorLedgerSummary(
        "vendor-1",
        bills,
        payments
      ),
      buildVendorLedgerSummary(
        "vendor-2",
        bills,
        payments
      ),
      {
        vendorId: "vendor-3",
        totalBilled: 1000000,
        totalPaid: 1000000,
        outstandingBalance: 0,
        billCount: 1
      }
    ];

    const result =
      filterVendorsWithOutstandingBalance(
        summaries
      );

    expect(result).toHaveLength(2);
    expect(
      result.every(
        summary =>
          summary.outstandingBalance > 0
      )
    ).toBe(true);
  });
});