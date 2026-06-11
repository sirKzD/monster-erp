import type {
  Supplier,
  SupplierStatus
} from "../types/inventory.types";

export function createSupplier(
  name: string,
  email: string,
  phone?: string,
  address?: string
): Supplier {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    address: address?.trim(),
    status: "active",
    rating: 0,
    createdAt: new Date().toISOString()
  };
}

export function updateSupplierStatus(
  supplier: Supplier,
  status: SupplierStatus
): Supplier {
  return {
    ...supplier,
    status
  };
}

export function updateSupplierRating(
  supplier: Supplier,
  rating: number
): Supplier {
  return {
    ...supplier,
    rating: Math.min(Math.max(rating, 0), 5)
  };
}

export function isSupplierActive(
  supplier: Supplier
): boolean {
  return supplier.status === "active";
}

export function filterActiveSuppliers(
  suppliers: Supplier[]
): Supplier[] {
  return suppliers.filter(isSupplierActive);
}