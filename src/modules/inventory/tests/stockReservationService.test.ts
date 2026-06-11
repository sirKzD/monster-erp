import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  calculateReservedStock,
  calculateAvailableStock,
  canReserveStock,
  createStockReservation,
  releaseStockReservation
} from "../services/stockReservationService";

import type {
  StockMovement
} from "../types/inventory.types";

import type {
  StockReservation
} from "../services/stockReservationService";

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 100,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "move-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "out",
    quantity: 20,
    createdAt: "2026-01-02T00:00:00.000Z"
  }
];

const reservations: StockReservation[] = [
  {
    id: "reservation-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    quantity: 30,
    status: "active",
    createdAt: "2026-01-03T00:00:00.000Z"
  },
  {
    id: "reservation-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    quantity: 10,
    status: "released",
    createdAt: "2026-01-04T00:00:00.000Z"
  }
];

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "reservation-new"
  });
});

describe("stockReservationService", () => {
  it("calculates reserved stock", () => {
    const reserved = calculateReservedStock(
      reservations,
      "product-1",
      "warehouse-1"
    );

    expect(reserved).toBe(30);
  });

  it("calculates available stock", () => {
    const available = calculateAvailableStock(
      movements,
      reservations,
      "product-1",
      "warehouse-1"
    );

    expect(available).toBe(50);
  });

  it("checks if stock can be reserved", () => {
    expect(
      canReserveStock(
        movements,
        reservations,
        "product-1",
        "warehouse-1",
        50
      )
    ).toBe(true);

    expect(
      canReserveStock(
        movements,
        reservations,
        "product-1",
        "warehouse-1",
        51
      )
    ).toBe(false);
  });

  it("blocks zero or negative reservation", () => {
    expect(
      canReserveStock(
        movements,
        reservations,
        "product-1",
        "warehouse-1",
        0
      )
    ).toBe(false);
  });

  it("creates stock reservation", () => {
    const reservation = createStockReservation(
      movements,
      reservations,
      "product-1",
      "warehouse-1",
      20
    );

    expect(reservation).toMatchObject({
      id: "reservation-new",
      productId: "product-1",
      warehouseId: "warehouse-1",
      quantity: 20,
      status: "active"
    });

    expect(reservation?.createdAt).toBeTruthy();
  });

  it("returns null when reservation exceeds available stock", () => {
    const reservation = createStockReservation(
      movements,
      reservations,
      "product-1",
      "warehouse-1",
      60
    );

    expect(reservation).toBeNull();
  });

  it("releases stock reservation", () => {
    const released = releaseStockReservation(
      reservations[0]
    );

    expect(released.status).toBe("released");
  });
});