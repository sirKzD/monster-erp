import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createStockPicking,
  markPickingAsPicked,
  cancelPicking,
  filterPendingPickings
} from "../services/stockPickingService";

import type {
  StockReservation
} from "../services/stockReservationService";

const reservation: StockReservation = {
  id: "reservation-1",
  productId: "product-1",
  warehouseId: "warehouse-1",
  quantity: 10,
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z"
};

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "picking-1"
  });
});

describe("stockPickingService", () => {
  it("creates stock picking from active reservation", () => {
    const picking = createStockPicking(
      reservation
    );

    expect(picking).toMatchObject({
      id: "picking-1",
      reservationId: "reservation-1",
      productId: "product-1",
      warehouseId: "warehouse-1",
      quantity: 10,
      status: "pending"
    });

    expect(picking?.createdAt).toBeTruthy();
  });

  it("blocks picking from released reservation", () => {
    const picking = createStockPicking({
      ...reservation,
      status: "released"
    });

    expect(picking).toBeNull();
  });

  it("marks picking as picked", () => {
    const picking = createStockPicking(
      reservation
    )!;

    const picked = markPickingAsPicked(
      picking
    );

    expect(picked?.status).toBe("picked");
    expect(picked?.pickedAt).toBeTruthy();
  });

  it("blocks picking if not pending", () => {
    const picking = createStockPicking(
      reservation
    )!;

    const picked = markPickingAsPicked(
      picking
    )!;

    const again = markPickingAsPicked(
      picked
    );

    expect(again).toBeNull();
  });

  it("cancels pending picking", () => {
    const picking = createStockPicking(
      reservation
    )!;

    const cancelled = cancelPicking(
      picking
    );

    expect(cancelled?.status).toBe("cancelled");
  });

  it("filters pending pickings", () => {
    const pending = createStockPicking(
      reservation
    )!;

    const picked = markPickingAsPicked(
      createStockPicking(
        reservation
      )!
    )!;

    const result = filterPendingPickings([
      pending,
      picked
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });
});