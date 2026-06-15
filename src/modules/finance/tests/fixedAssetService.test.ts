import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  calculateDepreciableAmount,
  calculateMonthlyDepreciation,
  calculateTotalFixedAssetValue,
  createFixedAsset,
  disposeFixedAsset,
  filterActiveFixedAssets
} from "../services/fixedAssetService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "asset-1"
  });
});

describe("fixedAssetService", () => {
  it("creates fixed asset", () => {
    const asset = createFixedAsset(
      " Laptop ",
      12000000,
      2000000,
      10,
      "2026-01-01"
    );

    expect(asset).toMatchObject({
      id: "asset-1",
      name: "Laptop",
      acquisitionCost: 12000000,
      residualValue: 2000000,
      usefulLifeMonths: 10,
      status: "active",
      acquiredAt: "2026-01-01"
    });
  });

  it("blocks invalid fixed asset", () => {
    expect(
      createFixedAsset(
        "",
        12000000,
        2000000,
        10,
        "2026-01-01"
      )
    ).toBeNull();

    expect(
      createFixedAsset(
        "Laptop",
        0,
        2000000,
        10,
        "2026-01-01"
      )
    ).toBeNull();

    expect(
      createFixedAsset(
        "Laptop",
        12000000,
        12000000,
        10,
        "2026-01-01"
      )
    ).toBeNull();
  });

  it("calculates depreciable amount", () => {
    const asset = createFixedAsset(
      "Laptop",
      12000000,
      2000000,
      10,
      "2026-01-01"
    )!;

    expect(
      calculateDepreciableAmount(asset)
    ).toBe(10000000);
  });

  it("calculates monthly depreciation", () => {
    const asset = createFixedAsset(
      "Laptop",
      12000000,
      2000000,
      10,
      "2026-01-01"
    )!;

    expect(
      calculateMonthlyDepreciation(asset)
    ).toBe(1000000);
  });

  it("disposes active fixed asset", () => {
    const asset = createFixedAsset(
      "Laptop",
      12000000,
      2000000,
      10,
      "2026-01-01"
    )!;

    const disposed = disposeFixedAsset(
      asset,
      "2026-12-31"
    );

    expect(disposed?.status).toBe("disposed");
    expect(disposed?.disposedAt).toBe("2026-12-31");
  });

  it("blocks disposing already disposed asset", () => {
    const asset = createFixedAsset(
      "Laptop",
      12000000,
      2000000,
      10,
      "2026-01-01"
    )!;

    const disposed = disposeFixedAsset(
      asset,
      "2026-12-31"
    )!;

    expect(
      disposeFixedAsset(
        disposed,
        "2027-01-01"
      )
    ).toBeNull();
  });

  it("filters active fixed assets", () => {
    const active = createFixedAsset(
      "Laptop",
      12000000,
      2000000,
      10,
      "2026-01-01"
    )!;

    const disposed = disposeFixedAsset(
      createFixedAsset(
        "Printer",
        3000000,
        500000,
        10,
        "2026-01-01"
      )!,
      "2026-12-31"
    )!;

    const result = filterActiveFixedAssets([
      active,
      disposed
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });

  it("calculates total fixed asset value", () => {
    const laptop = createFixedAsset(
      "Laptop",
      12000000,
      2000000,
      10,
      "2026-01-01"
    )!;

    const printer = createFixedAsset(
      "Printer",
      3000000,
      500000,
      10,
      "2026-01-01"
    )!;

    expect(
      calculateTotalFixedAssetValue([
        laptop,
        printer
      ])
    ).toBe(15000000);
  });
});