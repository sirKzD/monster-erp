import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createProductLot,
  findLotByNumber,
  calculateLotQuantity,
  consumeLotQuantity
} from "../services/lotTrackingService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "lot-1"
  });
});

describe("lotTrackingService", () => {
  it("creates product lot", () => {
    const lot = createProductLot(
      "product-1",
      " lot-001 ",
      100
    );

    expect(lot).toMatchObject({
      id: "lot-1",
      productId: "product-1",
      lotNumber: "LOT-001",
      quantity: 100
    });

    expect(lot.receivedAt).toBeTruthy();
  });

  it("finds lot by number", () => {
    const lots = [
      createProductLot(
        "product-1",
        "LOT-001",
        100
      )
    ];

    const found = findLotByNumber(
      lots,
      "lot-001"
    );

    expect(found).toBeDefined();
    expect(found?.lotNumber).toBe("LOT-001");
  });

  it("calculates total lot quantity", () => {
    const lots = [
      createProductLot(
        "product-1",
        "LOT-001",
        100
      ),
      createProductLot(
        "product-1",
        "LOT-002",
        50
      )
    ];

    expect(
      calculateLotQuantity(
        lots,
        "product-1"
      )
    ).toBe(150);
  });

  it("consumes lot quantity", () => {
    const lot = createProductLot(
      "product-1",
      "LOT-001",
      100
    );

    const updated =
      consumeLotQuantity(
        lot,
        30
      );

    expect(
      updated?.quantity
    ).toBe(70);
  });

  it("blocks over consumption", () => {
    const lot = createProductLot(
      "product-1",
      "LOT-001",
      100
    );

    const updated =
      consumeLotQuantity(
        lot,
        200
      );

    expect(updated).toBeNull();
  });

  it("blocks zero quantity", () => {
    const lot = createProductLot(
      "product-1",
      "LOT-001",
      100
    );

    expect(
      consumeLotQuantity(
        lot,
        0
      )
    ).toBeNull();
  });
});