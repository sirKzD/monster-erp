export interface Product {
    id: string;
    name: string;
    sku: string;
    categoryId: string;
    price: number;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    status: WarehouseStatus;
    createdAt: string;
}

export type StockMovementType = "in" | "out" | "transfer";

export interface StockMovement {
    id: string;
    productId: string;
    warehouseId: string;
    type: StockMovementType;
    quantity: number;
    createdAt: string;
}

export type SupplierStatus =
  | "active"
  | "inactive"
  | "blacklisted"

export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    status: SupplierStatus;
    rating: number;
    createdAt: string;
}

export type WarehouseStatus =
  | "active"
  | "inactive";

export interface WarehouseLocation {
    id: string;
    warehouseId: string;
    name: string;
    code: string;
    status: WarehouseStatus;
    createdAt: string;
}

export interface ProductLot {
  id: string;
  productId: string;
  lotNumber: string;
  quantity: number;
  receivedAt: string;
}

export type SerialNumberStatus =
  | "available"
  | "reserved"
  | "sold"
  | "damaged";

export interface ProductSerialNumber {
  id: string;
  productId: string;
  serialNumber: string;
  status: SerialNumberStatus;
  receivedAt: string;
}