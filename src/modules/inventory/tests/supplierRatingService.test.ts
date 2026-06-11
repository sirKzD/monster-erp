import { describe, it, expect } from "vitest";

import {
  clampRating,
  calculateSupplierRating,
  applySupplierRating
} from "../services/supplierRatingService";

import type {
  Supplier
} from "../types/inventory.types";

const supplier: Supplier = {
  id: "supplier-1",
  name: "PT Supplier",
  email: "sales@supplier.com",
  phone: "08123456789",
  address: "Batam",
  status: "active",
  rating: 0,
  createdAt: "2026-01-01T00:00:00.000Z"
};

describe("supplierRatingService", () => {
  it("clamps rating between 0 and 5", () => {
    expect(clampRating(6)).toBe(5);
    expect(clampRating(-1)).toBe(0);
    expect(clampRating(4)).toBe(4);
  });

  it("calculates supplier rating average", () => {
    const rating = calculateSupplierRating({
      deliveryScore: 5,
      qualityScore: 4,
      priceScore: 3
    });

    expect(rating).toBe(4);
  });

  it("calculates supplier rating with decimal", () => {
    const rating = calculateSupplierRating({
      deliveryScore: 5,
      qualityScore: 4,
      priceScore: 4
    });

    expect(rating).toBe(4.33);
  });

  it("applies supplier rating", () => {
    const updated = applySupplierRating(
      supplier,
      {
        deliveryScore: 5,
        qualityScore: 4,
        priceScore: 3
      }
    );

    expect(updated.rating).toBe(4);
    expect(updated.id).toBe("supplier-1");
  });
});