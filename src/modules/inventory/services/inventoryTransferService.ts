import type {
    StockMovement
} from "../types/inventory.types";

import {
    hasEnoughStock
} from "./inventoryStockService";

export function createTransferMovements(
    movements: StockMovement[],
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number 
): StockMovement[] | null {
    if (fromWarehouseId === toWarehouseId) return null;
    if (quantity <= 0) return null;

    const enoughStock = hasEnoughStock(
        movements,
        productId,
        fromWarehouseId,
        quantity
    );

    if (!enoughStock) return null;

    const createdAt = new Date().toISOString();

    return [
        {
            id: crypto.randomUUID(),
            productId,
            warehouseId: fromWarehouseId,
            type: "out",
            quantity,
            createdAt
        },
        {
            id: crypto.randomUUID(),
            productId,
            warehouseId: toWarehouseId,
            type: "in",
            quantity,
            createdAt
        }
    ];
}