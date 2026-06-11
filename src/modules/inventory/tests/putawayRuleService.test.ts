import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createPutawayRule,
  findPutawayLocation,
  filterPutawayRulesByWarehouse
} from "../services/putawayRuleService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "rule-1"
  });
});

describe("putawayRuleService", () => {
  it("creates putaway rule", () => {
    const rule = createPutawayRule(
      "warehouse-1",
      "location-1",
      10,
      "product-1"
    );

    expect(rule).toEqual({
      id: "rule-1",
      warehouseId: "warehouse-1",
      locationId: "location-1",
      priority: 10,
      productId: "product-1",
      categoryId: undefined
    });
  });

  it("finds product specific putaway location", () => {
    const rules = [
      createPutawayRule(
        "warehouse-1",
        "default-location",
        1
      ),
      createPutawayRule(
        "warehouse-1",
        "category-location",
        5,
        undefined,
        "category-1"
      ),
      createPutawayRule(
        "warehouse-1",
        "product-location",
        1,
        "product-1"
      )
    ];

    const location = findPutawayLocation(
      rules,
      "warehouse-1",
      "product-1",
      "category-1"
    );

    expect(location).toBe("product-location");
  });

  it("falls back to category putaway location", () => {
    const rules = [
      createPutawayRule(
        "warehouse-1",
        "default-location",
        1
      ),
      createPutawayRule(
        "warehouse-1",
        "category-location",
        5,
        undefined,
        "category-1"
      )
    ];

    const location = findPutawayLocation(
      rules,
      "warehouse-1",
      "missing-product",
      "category-1"
    );

    expect(location).toBe("category-location");
  });

  it("falls back to default location", () => {
    const rules = [
      createPutawayRule(
        "warehouse-1",
        "default-location",
        1
      )
    ];

    const location = findPutawayLocation(
      rules,
      "warehouse-1",
      "missing-product",
      "missing-category"
    );

    expect(location).toBe("default-location");
  });

  it("returns null when no rule matches", () => {
    const rules = [
      createPutawayRule(
        "warehouse-2",
        "other-location",
        1
      )
    ];

    const location = findPutawayLocation(
      rules,
      "warehouse-1",
      "product-1",
      "category-1"
    );

    expect(location).toBeNull();
  });

  it("filters rules by warehouse", () => {
    const rules = [
      createPutawayRule(
        "warehouse-1",
        "location-1",
        1
      ),
      createPutawayRule(
        "warehouse-2",
        "location-2",
        1
      )
    ];

    const result = filterPutawayRulesByWarehouse(
      rules,
      "warehouse-1"
    );

    expect(result).toHaveLength(1);
    expect(result[0].warehouseId).toBe("warehouse-1");
  });
});