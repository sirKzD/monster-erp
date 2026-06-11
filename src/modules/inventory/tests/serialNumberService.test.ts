import {
  describe,
  it,
  expect,
  vi,
  beforeEach
} from "vitest";

import {
  createSerialNumber,
  findSerialNumber,
  updateSerialNumberStatus,
  filterSerialsByStatus,
  isSerialAvailable
} from "../services/serialNumberService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "serial-1"
  });
});

describe("serialNumberService", () => {
  it("creates serial number", () => {
    const serial = createSerialNumber(
      "product-1",
      " sn-001 "
    );

    expect(serial).toMatchObject({
      id: "serial-1",
      productId: "product-1",
      serialNumber: "SN-001",
      status: "available"
    });

    expect(serial.receivedAt).toBeTruthy();
  });

  it("finds serial number", () => {
    const serials = [
      createSerialNumber("product-1", "SN-001")
    ];

    const found = findSerialNumber(
      serials,
      "sn-001"
    );

    expect(found).toBeDefined();
    expect(found?.serialNumber).toBe("SN-001");
  });

  it("updates serial number status", () => {
    const serial = createSerialNumber(
      "product-1",
      "SN-001"
    );

    const updated = updateSerialNumberStatus(
      serial,
      "reserved"
    );

    expect(updated.status).toBe("reserved");
  });

  it("filters serials by status", () => {
    const available = createSerialNumber(
      "product-1",
      "SN-001"
    );

    const sold = updateSerialNumberStatus(
      createSerialNumber(
        "product-1",
        "SN-002"
      ),
      "sold"
    );

    const result = filterSerialsByStatus(
      [available, sold],
      "available"
    );

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("available");
  });

  it("checks serial availability", () => {
    const serial = createSerialNumber(
      "product-1",
      "SN-001"
    );

    expect(isSerialAvailable(serial)).toBe(true);

    expect(
      isSerialAvailable({
        ...serial,
        status: "sold"
      })
    ).toBe(false);
  });
});