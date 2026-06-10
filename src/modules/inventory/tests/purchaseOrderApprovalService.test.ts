import { describe, it, expect } from "vitest";

import {
  canChangePurchaseOrderStatus,
  updatePurchaseOrderStatus
} from "../services/purchaseOrderApprovalService";

import type {
  PurchaseOrder
} from "../types/purchaseOrder.types";

const baseOrder: PurchaseOrder = {
  id: "po-1",
  supplierId: "supplier-1",
  items: [],
  totalAmount: 0,
  status: "draft",
  createdAt: "2026-01-01T00:00:00.000Z"
};

describe("purchaseOrderApprovalService", () => {
  it("allows draft to approved", () => {
    expect(
      canChangePurchaseOrderStatus("draft", "approved")
    ).toBe(true);
  });

  it("allows draft to cancelled", () => {
    expect(
      canChangePurchaseOrderStatus("draft", "cancelled")
    ).toBe(true);
  });

  it("allows approved to received", () => {
    expect(
      canChangePurchaseOrderStatus("approved", "received")
    ).toBe(true);
  });

  it("allows approved to cancelled", () => {
    expect(
      canChangePurchaseOrderStatus("approved", "cancelled")
    ).toBe(true);
  });

  it("blocks received to cancelled", () => {
    expect(
      canChangePurchaseOrderStatus("received", "cancelled")
    ).toBe(false);
  });

  it("updates purchase order status", () => {
    const updated = updatePurchaseOrderStatus(
      baseOrder,
      "approved"
    );

    expect(updated?.status).toBe("approved");
  });

  it("returns null for invalid transition", () => {
    const receivedOrder: PurchaseOrder = {
      ...baseOrder,
      status: "received"
    };

    const updated = updatePurchaseOrderStatus(
      receivedOrder,
      "cancelled"
    );

    expect(updated).toBeNull();
  });
});