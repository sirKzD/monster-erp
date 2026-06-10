import { describe, it, expect } from "vitest";

import {
  createReorderSuggestion,
  filterReorderSuggestions
} from "../services/inventoryReorderService";

import type {
  Product,
  StockMovement
} from "../types/inventory.types";

const product: Product = {
  id: "product-1",
  name: "Laptop",
  sku: "LAP-001",
  categoryId: "category-1",
  price: 15000000,
  createdAt: "2026-01-01T00:00:00.000Z"
};

const movements: StockMovement[] = [
  {
    id: "move-1",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "in",
    quantity: 50,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "move-2",
    productId: "product-1",
    warehouseId: "warehouse-1",
    type: "out",
    quantity: 45,
    createdAt: "2026-01-02T00:00:00.000Z"
  }
];

describe("inventoryReorderService", () => {
  it("creates reorder suggestion when stock is low", () => {
    const suggestion = createReorderSuggestion(
      product,
      movements,
      "warehouse-1",
      10,
      50
    );

    expect(suggestion).toEqual({
      productId: "product-1",
      warehouseId: "warehouse-1",
      currentStock: 5,
      minimumStock: 10,
      reorderQuantity: 45,
      status: "reorder_needed"
    });
  });

  it("does not suggest reorder when stock is safe", () => {
    const suggestion = createReorderSuggestion(
      product,
      movements,
      "warehouse-1",
      3,
      50
    );

    expect(suggestion.status).toBe("no_reorder");
    expect(suggestion.reorderQuantity).toBe(0);
  });

  it("filters reorder suggestions", () => {
    const low = createReorderSuggestion(
      product,
      movements,
      "warehouse-1",
      10,
      50
    );

    const safe = createReorderSuggestion(
      product,
      movements,
      "warehouse-1",
      3,
      50
    );

    const result = filterReorderSuggestions([
      low,
      safe
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("reorder_needed");
  });
});