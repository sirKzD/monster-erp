import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculateTotalPaid,
  calculateRemainingInvoiceBalance,
  createPayment,
  cancelPayment,
  applyPaymentToInvoice,
  filterCompletedPayments
} from "../services/paymentService";

import type {
  Invoice,
  Payment
} from "../types/finance.types";

const issuedInvoice: Invoice = {
  id: "invoice-1",
  customerId: "customer-1",
  items: [
    {
      description: "Website Development",
      quantity: 1,
      unitPrice: 10000000
    }
  ],
  subtotal: 10000000,
  tax: 1000000,
  total: 11000000,
  status: "issued",
  createdAt: "2026-01-01T00:00:00.000Z",
  issuedAt: "2026-01-01T01:00:00.000Z"
};

const completedPayment: Payment = {
  id: "payment-1",
  invoiceId: "invoice-1",
  amount: 4000000,
  status: "completed",
  paidAt: "2026-01-02T00:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "payment-1"
  });
});

describe("paymentService", () => {
  it("calculates total paid", () => {
    expect(
      calculateTotalPaid([
        completedPayment,
        {
          ...completedPayment,
          id: "payment-2",
          amount: 2000000,
          status: "cancelled"
        }
      ])
    ).toBe(4000000);
  });

  it("calculates remaining invoice balance", () => {
    expect(
      calculateRemainingInvoiceBalance(
        issuedInvoice,
        [completedPayment]
      )
    ).toBe(7000000);
  });

  it("creates payment for issued invoice", () => {
    const payment = createPayment(
      issuedInvoice,
      [],
      5000000
    );

    expect(payment).toMatchObject({
      id: "payment-1",
      invoiceId: "invoice-1",
      amount: 5000000,
      status: "completed"
    });

    expect(payment?.paidAt).toBeTruthy();
  });

  it("blocks payment for draft invoice", () => {
    const payment = createPayment(
      {
        ...issuedInvoice,
        status: "draft"
      },
      [],
      5000000
    );

    expect(payment).toBeNull();
  });

  it("blocks payment exceeding remaining balance", () => {
    const payment = createPayment(
      issuedInvoice,
      [completedPayment],
      8000000
    );

    expect(payment).toBeNull();
  });

  it("blocks invalid payment amount", () => {
    const payment = createPayment(
      issuedInvoice,
      [],
      0
    );

    expect(payment).toBeNull();
  });

  it("cancels completed payment", () => {
    const cancelled = cancelPayment(
      completedPayment
    );

    expect(cancelled?.status).toBe("cancelled");
  });

  it("blocks cancelling already cancelled payment", () => {
    const cancelled = cancelPayment(
      completedPayment
    )!;

    const again = cancelPayment(
      cancelled
    );

    expect(again).toBeNull();
  });

  it("marks invoice as paid when fully paid", () => {
    const updatedInvoice = applyPaymentToInvoice(
      issuedInvoice,
      [
        {
          ...completedPayment,
          amount: 11000000
        }
      ]
    );

    expect(updatedInvoice.status).toBe("paid");
    expect(updatedInvoice.paidAt).toBeTruthy();
  });

  it("keeps invoice issued when partially paid", () => {
    const updatedInvoice = applyPaymentToInvoice(
      issuedInvoice,
      [completedPayment]
    );

    expect(updatedInvoice.status).toBe("issued");
  });

  it("filters completed payments", () => {
    const result = filterCompletedPayments([
      completedPayment,
      {
        ...completedPayment,
        id: "payment-2",
        status: "cancelled"
      }
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("completed");
  });
});