import type {
  Invoice,
  InvoiceItem
} from "../types/finance.types";

export function calculateInvoiceSubtotal(
  items: InvoiceItem[]
): number {
  return items.reduce(
    (total, item) =>
      total + item.quantity * item.unitPrice,
    0
  );
}

export function calculateInvoiceTax(
  subtotal: number,
  taxRate: number
): number {
  if (taxRate <= 0) return 0;

  return Math.round(
    subtotal * taxRate
  );
}

export function calculateInvoiceTotal(
  subtotal: number,
  tax: number
): number {
  return subtotal + tax;
}

export function createInvoice(
  customerId: string,
  items: InvoiceItem[],
  taxRate: number
): Invoice | null {
  if (items.length === 0) return null;

  const hasInvalidItem = items.some(
    item =>
      item.quantity <= 0 ||
      item.unitPrice < 0 ||
      item.description.trim().length === 0
  );

  if (hasInvalidItem) return null;

  const subtotal = calculateInvoiceSubtotal(
    items
  );

  const tax = calculateInvoiceTax(
    subtotal,
    taxRate
  );

  return {
    id: crypto.randomUUID(),
    customerId,
    items: items.map(item => ({
      ...item,
      description: item.description.trim()
    })),
    subtotal,
    tax,
    total: calculateInvoiceTotal(
      subtotal,
      tax
    ),
    status: "draft",
    createdAt: new Date().toISOString()
  };
}

export function issueInvoice(
  invoice: Invoice
): Invoice | null {
  if (invoice.status !== "draft") {
    return null;
  }

  return {
    ...invoice,
    status: "issued",
    issuedAt: new Date().toISOString()
  };
}

export function markInvoiceAsPaid(
  invoice: Invoice
): Invoice | null {
  if (invoice.status !== "issued") {
    return null;
  }

  return {
    ...invoice,
    status: "paid",
    paidAt: new Date().toISOString()
  };
}

export function cancelInvoice(
  invoice: Invoice
): Invoice | null {
  if (
    invoice.status === "paid" ||
    invoice.status === "cancelled"
  ) {
    return null;
  }

  return {
    ...invoice,
    status: "cancelled"
  };
}

export function filterInvoicesByStatus(
  invoices: Invoice[],
  status: Invoice["status"]
): Invoice[] {
  return invoices.filter(
    invoice => invoice.status === status
  );
}