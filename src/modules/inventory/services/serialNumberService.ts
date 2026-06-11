import type {
  ProductSerialNumber,
  SerialNumberStatus
} from "../types/inventory.types";

export function createSerialNumber(
  productId: string,
  serialNumber: string
): ProductSerialNumber {
  return {
    id: crypto.randomUUID(),
    productId,
    serialNumber: serialNumber.trim().toUpperCase(),
    status: "available",
    receivedAt: new Date().toISOString()
  };
}

export function findSerialNumber(
  serials: ProductSerialNumber[],
  serialNumber: string
): ProductSerialNumber | undefined {
  return serials.find(
    serial =>
      serial.serialNumber.toLowerCase() ===
      serialNumber.trim().toLowerCase()
  );
}

export function updateSerialNumberStatus(
  serial: ProductSerialNumber,
  status: SerialNumberStatus
): ProductSerialNumber {
  return {
    ...serial,
    status
  };
}

export function filterSerialsByStatus(
  serials: ProductSerialNumber[],
  status: SerialNumberStatus
): ProductSerialNumber[] {
  return serials.filter(
    serial => serial.status === status
  );
}

export function isSerialAvailable(
  serial: ProductSerialNumber
): boolean {
  return serial.status === "available";
}