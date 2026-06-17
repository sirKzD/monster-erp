import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildReceivableAgingItems,
  buildReceivableAgingSummary,
  calculateReceivableAgingPercentage,
  calculateReceivableDaysOverdue,
  calculateReceivableInvoicePaidAmount,
  createReceivableAgingItem,
  determineReceivableAgingBucket,
  getReceivableHighestRiskBucket
} from "../services/receivableAgingService";

import type {
  Invoice,
  Payment,
  ReceivableAgingItem
} from "../types/finance.types";

const today = new Date("2026-05-01");

const invoices: Invoice[] = [
  {
    id: "invoice-1",
    customerId: "customer-1",
    items: [],
    subtotal: 10000000,
    tax: 1000000,
    total: 11000000,
    status: "issued",
    createdAt: "2026-04-01",
    dueDate: "2026-05-10"
  },
  {
    id: "invoice-2",
    customerId: "customer-1",
    items: [],
    subtotal: 5000000,
    tax: 500000,
    total: 5500000,
    status: "issued",
    createdAt: "2026-03-01",
    dueDate: "2026-04-15"
  },
  {
    id: "invoice-3",
    customerId: "customer-2",
    items: [],
    subtotal: 4000000,
    tax: 400000,
    total: 4400000,
    status: "issued",
    createdAt: "2026-02-01",
    dueDate: "2026-03-15"
  },
  {
    id: "invoice-4",
    customerId: "customer-3",
    items: [],
    subtotal: 3000000,
    tax: 300000,
    total: 3300000,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-02-01"
  },
  {
    id: "invoice-5",
    customerId: "customer-4",
    items: [],
    subtotal: 2000000,
    tax: 200000,
    total: 2200000,
    status: "issued",
    createdAt: "2025-12-01",
    dueDate: "2026-01-01"
  },
  {
    id: "invoice-6",
    customerId: "customer-5",
    items: [],
    subtotal: 1000000,
    tax: 100000,
    total: 1100000,
    status: "paid",
    createdAt: "2026-04-01",
    dueDate: "2026-04-15",
    paidAt: "2026-04-20"
  }
];

const payments: Payment[] = [
  {
    id: "payment-1",
    invoiceId: "invoice-2",
    amount: 1500000,
    status: "completed",
    paidAt: "2026-04-20"
  },
  {
    id: "payment-2",
    invoiceId: "invoice-2",
    amount: 500000,
    status: "cancelled",
    paidAt: "2026-04-21"
  }
];

describe("receivableAgingService", () => {
  it("calculates receivable days overdue", () => {
    expect(
      calculateReceivableDaysOverdue(
        "2026-04-15",
        today
      )
    ).toBe(16);
  });

  it("returns zero days overdue when invoice is not due yet", () => {
    expect(
      calculateReceivableDaysOverdue(
        "2026-05-10",
        today
      )
    ).toBe(0);
  });

  it("determines current aging bucket", () => {
    expect(
      determineReceivableAgingBucket(0)
    ).toBe("current");
  });

  it("determines 1-30 aging bucket", () => {
    expect(
      determineReceivableAgingBucket(16)
    ).toBe("1_30");
  });

  it("determines 31-60 aging bucket", () => {
    expect(
      determineReceivableAgingBucket(45)
    ).toBe("31_60");
  });

  it("determines 61-90 aging bucket", () => {
    expect(
      determineReceivableAgingBucket(75)
    ).toBe("61_90");
  });

  it("determines 90 plus aging bucket", () => {
    expect(
      determineReceivableAgingBucket(120)
    ).toBe("90_plus");
  });

  it("calculates receivable invoice paid amount", () => {
    expect(
      calculateReceivableInvoicePaidAmount(
        "invoice-2",
        payments
      )
    ).toBe(1500000);
  });

  it("creates receivable aging item", () => {
    const item = createReceivableAgingItem(
      invoices[1],
      payments,
      "Alpha Customer",
      today
    );

    expect(item).toEqual({
      invoiceId: "invoice-2",
      customerId: "customer-1",
      customerName: "Alpha Customer",
      invoiceDate: "2026-03-01",
      dueDate: "2026-04-15",
      outstandingAmount: 4000000,
      daysOverdue: 16,
      bucket: "1_30"
    });
  });

  it("blocks paid invoice from receivable aging item", () => {
    expect(
      createReceivableAgingItem(
        invoices[5],
        payments,
        "Paid Customer",
        today
      )
    ).toBeNull();
  });

  it("builds receivable aging items", () => {
    const items = buildReceivableAgingItems(
      invoices,
      payments,
      {
        "customer-1": "Alpha Customer",
        "customer-2": "Beta Customer",
        "customer-3": "Gamma Customer",
        "customer-4": "Delta Customer"
      },
      today
    );

    expect(items).toHaveLength(5);
    expect(items[0].customerName).toBe(
      "Alpha Customer"
    );
  });

  it("builds receivable aging summary", () => {
    const items: ReceivableAgingItem[] =
      buildReceivableAgingItems(
        invoices,
        payments,
        {
          "customer-1": "Alpha Customer",
          "customer-2": "Beta Customer",
          "customer-3": "Gamma Customer",
          "customer-4": "Delta Customer"
        },
        today
      );

    const summary =
      buildReceivableAgingSummary(items);

    expect(summary).toEqual({
      current: 11000000,
      bucket1To30: 4000000,
      bucket31To60: 4400000,
      bucket61To90: 3300000,
      bucket90Plus: 2200000,
      totalOutstanding: 24900000
    });
  });

  it("calculates receivable aging percentage", () => {
    expect(
      calculateReceivableAgingPercentage(
        4000000,
        20000000
      )
    ).toBe(20);
  });

  it("returns zero receivable aging percentage when total is zero", () => {
    expect(
      calculateReceivableAgingPercentage(
        4000000,
        0
      )
    ).toBe(0);
  });

  it("gets highest risk bucket", () => {
    expect(
      getReceivableHighestRiskBucket({
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