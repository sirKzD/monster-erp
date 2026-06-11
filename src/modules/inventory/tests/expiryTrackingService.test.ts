import {
  describe,
  it,
  expect
} from "vitest";

import {
  isLotExpired,
  isLotNearExpiry,
  filterExpiredLots,
  filterNearExpiryLots
} from "../services/expiryTrackingService";

import type {
  ProductLot
} from "../types/inventory.types";

const lots: ProductLot[] = [
  {
    id: "lot-1",
    productId: "product-1",
    lotNumber: "LOT-001",
    quantity: 100,
    receivedAt: "2026-01-01T00:00:00.000Z",
    expiryDate: "2026-01-10T00:00:00.000Z"
  },
  {
    id: "lot-2",
    productId: "product-1",
    lotNumber: "LOT-002",
    quantity: 50,
    receivedAt: "2026-01-01T00:00:00.000Z",
    expiryDate: "2026-02-01T00:00:00.000Z"
  },
  {
    id: "lot-3",
    productId: "product-1",
    lotNumber: "LOT-003",
    quantity: 25,
    receivedAt: "2026-01-01T00:00:00.000Z"
  }
];

describe("expiryTrackingService", () => {
  it("detects expired lot", () => {
    expect(
      isLotExpired(
        lots[0],
        "2026-01-11T00:00:00.000Z"
      )
    ).toBe(true);
  });

  it("does not mark lot without expiry as expired", () => {
    expect(
      isLotExpired(
        lots[2],
        "2026-01-11T00:00:00.000Z"
      )
    ).toBe(false);
  });

  it("detects near expiry lot", () => {
    expect(
      isLotNearExpiry(
        lots[0],
        "2026-01-05T00:00:00.000Z",
        7
      )
    ).toBe(true);
  });

  it("does not mark expired lot as near expiry", () => {
    expect(
      isLotNearExpiry(
        lots[0],
        "2026-01-11T00:00:00.000Z",
        7
      )
    ).toBe(false);
  });

  it("filters expired lots", () => {
    const result = filterExpiredLots(
      lots,
      "2026-01-11T00:00:00.000Z"
    );

    expect(result).toHaveLength(1);
    expect(result[0].lotNumber).toBe("LOT-001");
  });

  it("filters near expiry lots", () => {
    const result = filterNearExpiryLots(
      lots,
      "2026-01-05T00:00:00.000Z",
      7
    );

    expect(result).toHaveLength(1);
    expect(result[0].lotNumber).toBe("LOT-001");
  });
});