import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildReceivableSummary,
  calculateInvoiceOutstanding,
  calculateInvoicePaidAmount,
  isInvoiceOverdue
} from "../services/receivableSummaryService";

import type {
  Invoice,
  Payment
} from "../types/finance.types";

const invoices: Invoice[] = [
  {
    id: "inv-1",
    customerId: "c1",
    items: [],
    subtotal: 1000,
    tax: 100,
    total: 1100,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-01-10"
  },
  {
    id: "inv-2",
    customerId: "c2",
    items: [],
    subtotal: 2000,
    tax: 200,
    total: 2200,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-12-31"
  }
];

const payments: Payment[] = [
  {
    id: "p1",
    invoiceId: "inv-1",
    amount: 600,
    status: "completed",
    paidAt: "2026-01-02"
  },
  {
    id: "p2",
    invoiceId: "inv-2",
    amount: 1000,
    status: "completed",
    paidAt: "2026-01-03"
  }
];

describe(
  "receivableSummaryService",
  () => {
    it(
      "calculates invoice paid amount",
      () => {
        expect(
          calculateInvoicePaidAmount(
            "inv-1",
            payments
          )
        ).toBe(600);
      }
    );

    it(
      "calculates invoice outstanding",
      () => {
        expect(
          calculateInvoiceOutstanding(
            invoices[0],
            payments
          )
        ).toBe(500);
      }
    );

    it(
      "detects overdue invoice",
      () => {
        expect(
          isInvoiceOverdue(
            invoices[0],
            new Date(
              "2026-02-01"
            )
          )
        ).toBe(true);
      }
    );

    it(
      "detects non overdue invoice",
      () => {
        expect(
          isInvoiceOverdue(
            invoices[1],
            new Date(
              "2026-02-01"
            )
          )
        ).toBe(false);
      }
    );

    it(
      "builds receivable summary",
      () => {
        const summary =
          buildReceivableSummary(
            invoices,
            payments,
            new Date(
              "2026-02-01"
            )
          );

        expect(
          summary.totalInvoiced
        ).toBe(3300);

        expect(
          summary.totalPaid
        ).toBe(1600);

        expect(
          summary.outstandingBalance
        ).toBe(1700);

        expect(
          summary.overdueBalance
        ).toBe(500);

        expect(
          summary.overdueInvoiceCount
        ).toBe(1);
      }
    );
  }
);