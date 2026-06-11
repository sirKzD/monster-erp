import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createSupplier,
  updateSupplierStatus,
  updateSupplierRating,
  isSupplierActive,
  filterActiveSuppliers
} from "../services/supplierService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "supplier-1"
  });
});

describe("supplierService", () => {
  it("creates supplier", () => {
    const supplier = createSupplier(
      " PT Supplier ",
      " SALES@SUPPLIER.COM ",
      " 08123456789 ",
      " Batam "
    );

    expect(supplier).toMatchObject({
      id: "supplier-1",
      name: "PT Supplier",
      email: "sales@supplier.com",
      phone: "08123456789",
      address: "Batam",
      status: "active",
      rating: 0
    });

    expect(supplier.createdAt).toBeTruthy();
  });

  it("updates supplier status", () => {
    const supplier = createSupplier(
      "PT Supplier",
      "sales@supplier.com"
    );

    const updated = updateSupplierStatus(
      supplier,
      "inactive"
    );

    expect(updated.status).toBe("inactive");
  });

  it("updates supplier rating with clamp", () => {
    const supplier = createSupplier(
      "PT Supplier",
      "sales@supplier.com"
    );

    expect(
      updateSupplierRating(supplier, 4.5).rating
    ).toBe(4.5);

    expect(
      updateSupplierRating(supplier, 10).rating
    ).toBe(5);

    expect(
      updateSupplierRating(supplier, -1).rating
    ).toBe(0);
  });

  it("checks active supplier", () => {
    const supplier = createSupplier(
      "PT Supplier",
      "sales@supplier.com"
    );

    expect(isSupplierActive(supplier)).toBe(true);

    expect(
      isSupplierActive({
        ...supplier,
        status: "inactive"
      })
    ).toBe(false);
  });

  it("filters active suppliers", () => {
    const active = createSupplier(
      "Active Supplier",
      "active@supplier.com"
    );

    const inactive = updateSupplierStatus(
      createSupplier(
        "Inactive Supplier",
        "inactive@supplier.com"
      ),
      "inactive"
    );

    const result = filterActiveSuppliers([
      active,
      inactive
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("active");
  });
});