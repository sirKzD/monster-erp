import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildCustomerLedgerEntries,
  buildCustomerLedgerSummary,
  calculateCustomerInvoicePaidAmount,
  calculateCustomerOutstandingBalance,
  filterCustomersWithOutstandingBalance
} from "../services/customerLedgerService";

import type {
  Invoice,
  Payment
} from "../types/finance.types";

const invoices: Invoice[] = [
  {
    id: "invoice-1",
    customerId: "customer-1",
    items: [],
    subtotal: 10000000,
    tax: 1000000,
    total: 11000000,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-01-31"
  },
  {
    id: "invoice-2",
    customerId: "customer-1",
    items: [],
    subtotal: 5000000,
    tax: 500000,
    total: 5500000,
    status: "paid",
    createdAt: "2026-01-02",
    dueDate: "2026-01-31",
    paidAt: "2026-01-10"
  },
  {
    id: "invoice-3",
    customerId: "customer-2",
    items: [],
    subtotal: 3000000,
    tax: 300000,
    total: 3300000,
    status: "issued",
    createdAt: "2026-01-03",
    dueDate: "2026-01-31"
  }
];

const payments: Payment[] = [
  {
    id: "payment-1",
    invoiceId: "invoice-1",
    amount: 4000000,
    status: "completed",
    paidAt: "2026-01-05"
  },
  {
    id: "payment-2",
    invoiceId: "invoice-2",
    amount: 5500000,
    status: "completed",
    paidAt: "2026-01-10"
  },
  {
    id: "payment-3",
    invoiceId: "invoice-1",
    amount: 1000000,
    status: "cancelled",
    paidAt: "2026-01-06"
  }
];

describe("customerLedgerService", () => {
  it("calculates customer invoice paid amount", () => {
    expect(
      calculateCustomerInvoicePaidAmount(
        "invoice-1",
        payments
      )
    ).toBe(4000000);
  });

  it("builds customer ledger entries", () => {
    const entries =
      buildCustomerLedgerEntries(
        "customer-1",
        invoices,
        payments
      );

    expect(entries).toHaveLength(2);

    expect(entries[0]).toEqual({
      customerId: "customer-1",
      invoiceId: "invoice-1",
      invoiceTotal: 11000000,
      paidAmount: 4000000,
      outstandingAmount: 7000000,
      status: "issued"
    });
  });

  it("calculates customer outstanding balance", () => {
    expect(
      calculateCustomerOutstandingBalance(
        "customer-1",
        invoices,
        payments
      )
    ).toBe(7000000);
  });

  it("builds customer ledger summary", () => {
    expect(
      buildCustomerLedgerSummary(
        "customer-1",
        invoices,
        payments
      )
    ).toEqual({
      customerId: "customer-1",
      totalInvoiced: 16500000,
      totalPaid: 9500000,
      outstandingBalance: 7000000,
      invoiceCount: 2
    });
  });

  it("returns empty summary for customer without invoices", () => {
    expect(
      buildCustomerLedgerSummary(
        "customer-unknown",
        invoices,
        payments
      )
    ).toEqual({
      customerId: "customer-unknown",
      totalInvoiced: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      invoiceCount: 0
    });
  });

  it("filters customers with outstanding balance", () => {
    const summaries = [
      buildCustomerLedgerSummary(
        "customer-1",
        invoices,
        payments
      ),
      buildCustomerLedgerSummary(
        "customer-2",
        invoices,
        payments
      ),
      {
        customerId: "customer-3",
        totalInvoiced: 1000000,
        totalPaid: 1000000,
        outstandingBalance: 0,
        invoiceCount: 1
      }
    ];

    const result =
      filterCustomersWithOutstandingBalance(
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