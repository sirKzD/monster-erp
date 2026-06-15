import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildPayableSummary,
  calculateBillOutstanding,
  calculateBillPaidAmount,
  isBillOverdue
} from "../services/payableSummaryService";

import type {
  BillPayment,
  VendorBill
} from "../types/finance.types";

const bills: VendorBill[] = [
  {
    id: "bill-1",
    vendorId: "vendor-1",
    total: 1100,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-01-10"
  },
  {
    id: "bill-2",
    vendorId: "vendor-2",
    total: 2200,
    status: "issued",
    createdAt: "2026-01-01",
    dueDate: "2026-12-31"
  }
];

const payments: BillPayment[] = [
  {
    id: "payment-1",
    billId: "bill-1",
    amount: 600,
    status: "completed",
    paidAt: "2026-01-02"
  },
  {
    id: "payment-2",
    billId: "bill-2",
    amount: 1000,
    status: "completed",
    paidAt: "2026-01-03"
  }
];

describe("payableSummaryService", () => {
  it("calculates bill paid amount", () => {
    expect(
      calculateBillPaidAmount(
        "bill-1",
        payments
      )
    ).toBe(600);
  });

  it("calculates bill outstanding", () => {
    expect(
      calculateBillOutstanding(
        bills[0],
        payments
      )
    ).toBe(500);
  });

  it("detects overdue bill", () => {
    expect(
      isBillOverdue(
        bills[0],
        new Date("2026-02-01")
      )
    ).toBe(true);
  });

  it("detects non overdue bill", () => {
    expect(
      isBillOverdue(
        bills[1],
        new Date("2026-02-01")
      )
    ).toBe(false);
  });

  it("builds payable summary", () => {
    const summary = buildPayableSummary(
      bills,
      payments,
      new Date("2026-02-01")
    );

    expect(summary.totalBilled).toBe(3300);
    expect(summary.totalPaid).toBe(1600);
    expect(summary.outstandingPayable).toBe(1700);
    expect(summary.overdueBalance).toBe(500);
    expect(summary.overdueBillCount).toBe(1);
    expect(summary.paymentRate).toBe(48.48);
  });
});