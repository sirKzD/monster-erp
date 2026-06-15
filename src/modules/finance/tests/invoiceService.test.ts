import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculateInvoiceSubtotal,
  calculateInvoiceTax,
  calculateInvoiceTotal,
  createInvoice,
  issueInvoice,
  markInvoiceAsPaid,
  cancelInvoice,
  filterInvoicesByStatus
} from "../services/invoiceService";

const items = [
  {
    description: " Website Development ",
    quantity: 2,
    unitPrice: 5000000
  },
  {
    description: " Hosting Setup ",
    quantity: 1,
    unitPrice: 1000000
  }
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "invoice-1"
  });
});

describe("invoiceService", () => {
  it("calculates invoice subtotal", () => {
    expect(
      calculateInvoiceSubtotal(items)
    ).toBe(11000000);
  });

  it("calculates invoice tax", () => {
    expect(
      calculateInvoiceTax(
        11000000,
        0.11
      )
    ).toBe(1210000);
  });

  it("calculates invoice total", () => {
    expect(
      calculateInvoiceTotal(
        11000000,
        1210000
      )
    ).toBe(12210000);
  });

  it("creates invoice", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    );

    expect(invoice).toMatchObject({
      id: "invoice-1",
      customerId: "customer-1",
      subtotal: 11000000,
      tax: 1210000,
      total: 12210000,
      status: "draft"
    });

    expect(invoice?.items[0].description).toBe(
      "Website Development"
    );

    expect(invoice?.createdAt).toBeTruthy();
  });

  it("blocks invoice without items", () => {
    const invoice = createInvoice(
      "customer-1",
      [],
      0.11
    );

    expect(invoice).toBeNull();
  });

  it("blocks invalid invoice item", () => {
    const invoice = createInvoice(
      "customer-1",
      [
        {
          description: "",
          quantity: 0,
          unitPrice: -1
        }
      ],
      0.11
    );

    expect(invoice).toBeNull();
  });

  it("issues draft invoice", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const issued = issueInvoice(invoice);

    expect(issued?.status).toBe("issued");
    expect(issued?.issuedAt).toBeTruthy();
  });

  it("blocks issuing non-draft invoice", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const issued = issueInvoice(invoice)!;
    const again = issueInvoice(issued);

    expect(again).toBeNull();
  });

  it("marks issued invoice as paid", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const issued = issueInvoice(invoice)!;
    const paid = markInvoiceAsPaid(issued);

    expect(paid?.status).toBe("paid");
    expect(paid?.paidAt).toBeTruthy();
  });

  it("blocks paying non-issued invoice", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const paid = markInvoiceAsPaid(invoice);

    expect(paid).toBeNull();
  });

  it("cancels draft invoice", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const cancelled = cancelInvoice(invoice);

    expect(cancelled?.status).toBe("cancelled");
  });

  it("blocks cancelling paid invoice", () => {
    const invoice = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const issued = issueInvoice(invoice)!;
    const paid = markInvoiceAsPaid(issued)!;
    const cancelled = cancelInvoice(paid);

    expect(cancelled).toBeNull();
  });

  it("filters invoices by status", () => {
    const draft = createInvoice(
      "customer-1",
      items,
      0.11
    )!;

    const paid = markInvoiceAsPaid(
      issueInvoice(
        createInvoice(
          "customer-2",
          items,
          0.11
        )!
      )!
    )!;

    const result = filterInvoicesByStatus(
      [draft, paid],
      "paid"
    );

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("paid");
  });
});