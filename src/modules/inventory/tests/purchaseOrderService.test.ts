import { describe, it, expect } from "vitest";

import {
  calculatePurchaseOrderTotal,
  createPurchaseOrder,
  changePurchaseOrderStatus
} from "../services/purchaseOrderService";

describe("purchaseOrderService", () => {

  it("calculates purchase order total", () => {

    const total =
      calculatePurchaseOrderTotal([
        {
          productId: "p1",
          quantity: 10,
          unitPrice: 1000
        },
        {
          productId: "p2",
          quantity: 5,
          unitPrice: 2000
        }
      ]);

    expect(total).toBe(20000);
  });

  it("creates purchase order", () => {

    const po =
      createPurchaseOrder(
        "supplier-1",
        [
          {
            productId: "p1",
            quantity: 10,
            unitPrice: 1000
          }
        ]
      );

    expect(po.status).toBe("draft");
    expect(po.totalAmount).toBe(10000);
  });

  it("changes status", () => {

    const po =
      createPurchaseOrder(
        "supplier-1",
        []
      );

    const approved =
      changePurchaseOrderStatus(
        po,
        "approved"
      );

    expect(
      approved.status
    ).toBe("approved");
  });

});