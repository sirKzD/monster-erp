import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  isPurchaseOrderReceivable,
  createGoodsReceipt,
  createPartialGoodsReceipt,
  createStockMovementsFromReceipt,
  receivePurchaseOrder
} from "../services/goodsReceiptService";

import type {
  PurchaseOrder
} from "../types/purchaseOrder.types";

let idCounter = 0;

beforeEach(() => {
  idCounter = 0;

  vi.stubGlobal("crypto", {
    randomUUID: () => {
      idCounter += 1;
      return `receipt-${idCounter}`;
    }
  });
});

const approvedOrder: PurchaseOrder = {
  id: "po-1",
  supplierId: "supplier-1",
  items: [
    {
      productId: "product-1",
      quantity: 10,
      unitPrice: 1000
    }
  ],
  totalAmount: 10000,
  status: "approved",
  createdAt: "2026-01-01T00:00:00.000Z"
};

const partialOrder: PurchaseOrder = {
  ...approvedOrder,
  status: "partial_received"
};

describe("goodsReceiptService", () => {
  it("checks if purchase order is receivable", () => {
    expect(isPurchaseOrderReceivable(approvedOrder)).toBe(true);
    expect(isPurchaseOrderReceivable(partialOrder)).toBe(true);

    expect(
      isPurchaseOrderReceivable({
        ...approvedOrder,
        status: "draft"
      })
    ).toBe(false);
  });

  it("creates goods receipt from approved order", () => {
    const receipt = createGoodsReceipt(approvedOrder);

    expect(receipt).toMatchObject({
      id: "receipt-1",
      purchaseOrderId: "po-1",
      items: approvedOrder.items
    });

    expect(receipt?.receivedAt).toBeTruthy();
  });

  it("blocks goods receipt for non-approved order", () => {
    const receipt = createGoodsReceipt({
      ...approvedOrder,
      status: "draft"
    });

    expect(receipt).toBeNull();
  });

  it("creates stock movements from receipt", () => {
    const receipt = createGoodsReceipt(approvedOrder)!;

    const movements = createStockMovementsFromReceipt(
      receipt,
      "warehouse-1"
    );

    expect(movements).toHaveLength(1);

    expect(movements[0]).toMatchObject({
      id: "receipt-2",
      productId: "product-1",
      warehouseId: "warehouse-1",
      type: "in",
      quantity: 10
    });
  });

  it("marks purchase order as received", () => {
    const received = receivePurchaseOrder(approvedOrder);

    expect(received?.status).toBe("received");
  });

  it("does not receive invalid order transition", () => {
    const received = receivePurchaseOrder({
      ...approvedOrder,
      status: "cancelled"
    });

    expect(received).toBeNull();
  });

  it("creates partial receipt when receiving less than ordered", () => {
    const result = createPartialGoodsReceipt(
      approvedOrder,
      [
        {
          productId: "product-1",
          quantity: 6,
          unitPrice: 1000
        }
      ]
    );

    expect(result).not.toBeNull();
    expect(result?.receipt.items[0].quantity).toBe(6);
    expect(result?.updatedOrder.status).toBe("partial_received");
    expect(result?.remainingItems[0].quantity).toBe(4);
    expect(result?.isFullyReceived).toBe(false);
  });

  it("marks order as received when partial completes full quantity", () => {
    const result = createPartialGoodsReceipt(
      approvedOrder,
      [
        {
          productId: "product-1",
          quantity: 10,
          unitPrice: 1000
        }
      ]
    );

    expect(result).not.toBeNull();
    expect(result?.updatedOrder.status).toBe("received");
    expect(result?.remainingItems).toHaveLength(0);
    expect(result?.isFullyReceived).toBe(true);
  });

  it("blocks partial receipt exceeding original quantity", () => {
    const result = createPartialGoodsReceipt(
      approvedOrder,
      [
        {
          productId: "product-1",
          quantity: 15,
          unitPrice: 1000
        }
      ]
    );

    expect(result).toBeNull();
  });

  it("allows receiving from partial_received order", () => {
    const result = createPartialGoodsReceipt(
      partialOrder,
      [
        {
          productId: "product-1",
          quantity: 4,
          unitPrice: 1000
        }
      ]
    );

    expect(result).not.toBeNull();
  });
});