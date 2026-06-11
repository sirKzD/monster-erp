import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createReturnOrder,
  acceptReturnOrder,
  rejectReturnOrder,
  createReturnStockMovement
} from "../services/returnOrderService";

import type {
  DeliveryOrder
} from "../services/deliveryOrderService";

const deliveredOrder: DeliveryOrder = {
  id: "delivery-1",
  pickingId: "picking-1",
  productId: "product-1",
  warehouseId: "warehouse-1",
  quantity: 10,
  status: "delivered",
  createdAt: "2026-01-01T00:00:00.000Z",
  deliveredAt: "2026-01-01T01:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "return-1"
  });
});

describe("returnOrderService", () => {
  it("creates return order from delivered order", () => {
    const returnOrder = createReturnOrder(
      deliveredOrder,
      2,
      "Damaged item"
    );

    expect(returnOrder).toMatchObject({
      id: "return-1",
      deliveryOrderId: "delivery-1",
      productId: "product-1",
      warehouseId: "warehouse-1",
      quantity: 2,
      reason: "Damaged item",
      status: "pending"
    });

    expect(returnOrder?.createdAt).toBeTruthy();
  });

  it("blocks return from non-delivered order", () => {
    const returnOrder = createReturnOrder(
      {
        ...deliveredOrder,
        status: "pending"
      },
      2,
      "Damaged item"
    );

    expect(returnOrder).toBeNull();
  });

  it("blocks invalid return quantity", () => {
    expect(
      createReturnOrder(
        deliveredOrder,
        0,
        "Invalid qty"
      )
    ).toBeNull();

    expect(
      createReturnOrder(
        deliveredOrder,
        20,
        "Too much"
      )
    ).toBeNull();
  });

  it("accepts pending return order", () => {
    const returnOrder = createReturnOrder(
      deliveredOrder,
      2,
      "Damaged item"
    )!;

    const accepted = acceptReturnOrder(
      returnOrder
    );

    expect(accepted?.status).toBe("accepted");
    expect(accepted?.resolvedAt).toBeTruthy();
  });

  it("rejects pending return order", () => {
    const returnOrder = createReturnOrder(
      deliveredOrder,
      2,
      "Damaged item"
    )!;

    const rejected = rejectReturnOrder(
      returnOrder
    );

    expect(rejected?.status).toBe("rejected");
    expect(rejected?.resolvedAt).toBeTruthy();
  });

  it("creates stock in movement for accepted return", () => {
    const returnOrder = createReturnOrder(
      deliveredOrder,
      2,
      "Damaged item"
    )!;

    const accepted = acceptReturnOrder(
      returnOrder
    )!;

    const movement = createReturnStockMovement(
      accepted
    );

    expect(movement).toMatchObject({
      productId: "product-1",
      warehouseId: "warehouse-1",
      type: "in",
      quantity: 2
    });
  });

  it("blocks stock movement for non-accepted return", () => {
    const returnOrder = createReturnOrder(
      deliveredOrder,
      2,
      "Damaged item"
    )!;

    const movement = createReturnStockMovement(
      returnOrder
    );

    expect(movement).toBeNull();
  });
});