import {
  describe,
  it,
  expect
} from "vitest";

import {
  isValidPickingRoute,
  assignPickingRoute,
  filterPickingsByRoute,
  getDefaultRouteForPriority
} from "../services/stockPickingRouteService";

import type {
  StockPicking
} from "../services/stockPickingService";

const picking: StockPicking = {
  id: "picking-1",
  reservationId: "reservation-1",
  productId: "product-1",
  warehouseId: "warehouse-1",
  quantity: 10,
  status: "pending",
  createdAt: "2026-01-01T00:00:00.000Z"
};

describe("stockPickingRouteService", () => {
  it("validates picking route", () => {
    expect(isValidPickingRoute("standard")).toBe(true);
    expect(isValidPickingRoute("express")).toBe(true);
    expect(isValidPickingRoute("invalid")).toBe(false);
  });

  it("assigns route to pending picking", () => {
    const routed = assignPickingRoute(
      picking,
      "express"
    );

    expect(routed).toMatchObject({
      id: "picking-1",
      route: "express"
    });
  });

  it("blocks route assignment for non-pending picking", () => {
    const routed = assignPickingRoute(
      {
        ...picking,
        status: "picked"
      },
      "express"
    );

    expect(routed).toBeNull();
  });

  it("filters pickings by route", () => {
    const standard = assignPickingRoute(
      picking,
      "standard"
    )!;

    const express = assignPickingRoute(
      {
        ...picking,
        id: "picking-2"
      },
      "express"
    )!;

    const result = filterPickingsByRoute(
      [standard, express],
      "express"
    );

    expect(result).toHaveLength(1);
    expect(result[0].route).toBe("express");
  });

  it("gets default route from priority", () => {
    expect(getDefaultRouteForPriority("normal")).toBe("standard");
    expect(getDefaultRouteForPriority("urgent")).toBe("express");
    expect(getDefaultRouteForPriority("fragile")).toBe("fragile");
    expect(getDefaultRouteForPriority("temperature_sensitive")).toBe("cold_chain");
  });
});