import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildPayableAgingItems,
  buildPayableAgingSummary,
  calculatePayableAgingPercentage,
  calculatePayableDaysOverdue,
  calculateVendorBillPaidAmount,
  createPayableAgingItem,
  determinePayableAgingBucket,
  getHighestRiskPayableBucket
} from "../services/payableAgingService";

import type {
  VendorBill,
  BillPayment,
  PayableAgingItem
} from "../types/finance.types";

const today = new Date("2026-05-01");

const bills: VendorBill[] = [
  {
    id: "bill-1",
    vendorId: "vendor-1",
    total: 11000000,
    status: "issued",
    createdAt: "2026-04-01",
    dueDate: "2026-05-10"
  },
  {
    id: "bill-2",
    vendorId: "vendor-1",
    total: 5500000,
    status: "issued",
    createdAt: "2026-03-01",
    dueDate: "2026-04-15"
  },
  {
    id: "bill-3",
    vendorId: "vendor-2",
    total: 4400000,
    status: "issued",
    createdAt: "2026-02-01",
    dueDate: "2026-03-15"
  },
  {
    id: "bill-4",
    vendorId: "vendor-3",
    total: 3300000,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-02-01"
  },
  {
    id: "bill-5",
    vendorId: "vendor-4",
    total: 2200000,
    status: "issued",
    createdAt: "2025-12-01",
    dueDate: "2026-01-01"
  },
  {
    id: "bill-6",
    vendorId: "vendor-5",
    total: 1100000,
    status: "paid",
    createdAt: "2026-04-01",
    dueDate: "2026-04-15",
    paidAt: "2026-04-20"
  }
];

const payments: BillPayment[] = [
  {
    id: "payment-1",
    billId: "bill-2",
    amount: 1500000,
    status: "completed",
    paidAt: "2026-04-20"
  },
  {
    id: "payment-2",
    billId: "bill-2",
    amount: 500000,
    status: "cancelled",
    paidAt: "2026-04-21"
  }
];

describe("payableAgingService", () => {
  it("calculates payable days overdue", () => {
    expect(
      calculatePayableDaysOverdue(
        "2026-04-15",
        today
      )
    ).toBe(16);
  });

  it("returns zero days overdue when bill is not due yet", () => {
    expect(
      calculatePayableDaysOverdue(
        "2026-05-10",
        today
      )
    ).toBe(0);
  });

  it("determines current aging bucket", () => {
    expect(
      determinePayableAgingBucket(0)
    ).toBe("current");
  });

  it("determines 1-30 aging bucket", () => {
    expect(
      determinePayableAgingBucket(16)
    ).toBe("1_30");
  });

  it("determines 31-60 aging bucket", () => {
    expect(
      determinePayableAgingBucket(45)
    ).toBe("31_60");
  });

  it("determines 61-90 aging bucket", () => {
    expect(
      determinePayableAgingBucket(75)
    ).toBe("61_90");
  });

  it("determines 90 plus aging bucket", () => {
    expect(
      determinePayableAgingBucket(120)
    ).toBe("90_plus");
  });

  it("calculates vendor bill paid amount", () => {
    expect(
      calculateVendorBillPaidAmount(
        "bill-2",
        payments
      )
    ).toBe(1500000);
  });

  it("creates payable aging item", () => {
    const item =
      createPayableAgingItem(
        bills[1],
        payments,
        "Alpha Vendor",
        today
      );

    expect(item).toEqual({
      billId: "bill-2",
      vendorId: "vendor-1",
      vendorName: "Alpha Vendor",
      billDate: "2026-03-01",
      dueDate: "2026-04-15",
      outstandingAmount: 4000000,
      daysOverdue: 16,
      bucket: "1_30"
    });
  });

  it("blocks paid bill from payable aging item", () => {
    expect(
      createPayableAgingItem(
        bills[5],
        payments,
        "Paid Vendor",
        today
      )
    ).toBeNull();
  });

  it("builds payable aging items", () => {
    const items =
      buildPayableAgingItems(
        bills,
        payments,
        {
          "vendor-1": "Alpha Vendor",
          "vendor-2": "Beta Vendor",
          "vendor-3": "Gamma Vendor",
          "vendor-4": "Delta Vendor"
        },
        today
      );

    expect(items).toHaveLength(5);

    expect(
      items[0].vendorName
    ).toBe("Alpha Vendor");
  });

  it("builds payable aging summary", () => {
    const items: PayableAgingItem[] =
      buildPayableAgingItems(
        bills,
        payments,
        {
          "vendor-1": "Alpha Vendor",
          "vendor-2": "Beta Vendor",
          "vendor-3": "Gamma Vendor",
          "vendor-4": "Delta Vendor"
        },
        today
      );

    const summary =
      buildPayableAgingSummary(
        items
      );

    expect(summary).toEqual({
      current: 11000000,
      bucket1To30: 4000000,
      bucket31To60: 4400000,
      bucket61To90: 3300000,
      bucket90Plus: 2200000,
      totalOutstanding: 24900000
    });
  });

  it("calculates payable aging percentage", () => {
    expect(
      calculatePayableAgingPercentage(
        4000000,
        20000000
      )
    ).toBe(20);
  });

  it("returns zero payable aging percentage when total is zero", () => {
    expect(
      calculatePayableAgingPercentage(
        4000000,
        0
      )
    ).toBe(0);
  });

  it("gets highest risk payable bucket", () => {
    expect(
      getHighestRiskPayableBucket({
        current: 1000000,
        bucket1To30: 2000000,
        bucket31To60: 3000000,
        bucket61To90: 4000000,
        bucket90Plus: 5000000,
        totalOutstanding: 15000000
      })
    ).toBe("90_plus");
  });
});