import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createDeliveryOrder,
  markDeliveryAsDelivered,
  cancelDelivery,
  createStockOutMovement
} from "../services/deliveryOrderService";

import type {
  StockPicking
} from "../services/stockPickingService";

const picking: StockPicking = {
  id: "picking-1",
  reservationId: "reservation-1",
  productId: "product-1",
  warehouseId: "warehouse-1",
  quantity: 10,
  status: "picked",
  createdAt: "2026-01-01T00:00:00.000Z",
  pickedAt: "2026-01-01T01:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "delivery-1"
  });
});

describe("deliveryOrderService", () => {

  it("creates delivery order from picked stock", () => {
    const delivery =
      createDeliveryOrder(picking);

    expect(delivery).toMatchObject({
      id: "delivery-1",
      pickingId: "picking-1",
      productId: "product-1",
      warehouseId: "warehouse-1",
      quantity: 10,
      status: "pending"
    });

    expect(
      delivery?.createdAt
    ).toBeTruthy();
  });

  it("blocks delivery creation from non picked stock", () => {
    const delivery =
      createDeliveryOrder({
        ...picking,
        status: "pending"
      });

    expect(delivery).toBeNull();
  });

  it("marks delivery as delivered", () => {
    const delivery =
      createDeliveryOrder(picking)!;

    const delivered =
      markDeliveryAsDelivered(
        delivery
      );

    expect(
      delivered?.status
    ).toBe("delivered");

    expect(
      delivered?.deliveredAt
    ).toBeTruthy();
  });

  it("cancels pending delivery", () => {
    const delivery =
      createDeliveryOrder(picking)!;

    const cancelled =
      cancelDelivery(delivery);

    expect(
      cancelled?.status
    ).toBe("cancelled");
  });

  it("creates stock out movement after delivery", () => {
    const delivery =
      createDeliveryOrder(picking)!;

    const delivered =
      markDeliveryAsDelivered(
        delivery
      )!;

    const movement =
      createStockOutMovement(
        delivered
      );

    expect(movement).toMatchObject({
      productId: "product-1",
      warehouseId: "warehouse-1",
      type: "out",
      quantity: 10
    });
  });

  it("blocks stock out movement before delivery", () => {
    const delivery =
      createDeliveryOrder(picking)!;

    const movement =
      createStockOutMovement(
        delivery
      );

    expect(movement).toBeNull();
  });

  it("blocks second delivery confirmation", () => {
    const delivery =
      createDeliveryOrder(picking)!;

    const delivered =
      markDeliveryAsDelivered(
        delivery
      )!;

    const again =
      markDeliveryAsDelivered(
        delivered
      );

    expect(again).toBeNull();
  });
});