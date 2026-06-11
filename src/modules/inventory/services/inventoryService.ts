import type {
  Product,
  Category,
  Warehouse,
  StockMovement,
  StockMovementType
} from "../types/inventory.types";

export function createProduct(
  name: string,
  sku: string,
  categoryId: string,
  price: number
): Product {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    sku: sku.trim().toUpperCase(),
    categoryId,
    price,
    createdAt: new Date().toISOString()
  };
}

export function createCategory(
  name: string
): Category {
  return {
    id: crypto.randomUUID(),
    name: name.trim()
  };
}

export function createWarehouse(
  name: string,
  location: string
): Warehouse {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    location: location.trim(),
    status: "active",
    createdAt: new Date().toISOString()
  };
}

export function createStockMovement(
  productId: string,
  warehouseId: string,
  type: StockMovementType,
  quantity: number
): StockMovement {
  return {
    id: crypto.randomUUID(),
    productId,
    warehouseId,
    type,
    quantity,
    createdAt: new Date().toISOString()
  };
}

