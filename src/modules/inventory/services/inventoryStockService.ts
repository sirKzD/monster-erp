import type {
    StockMovement
}from "../types/inventory.types";

export function calculateCurrentStock(
    movements: StockMovement[],
    productId: string,
    warehouseId: string 
): number {
    return movements
       .filter(movements => 
         movements.productId === productId &&
         movements.warehouseId === warehouseId
       )
       .reduce((total, movement) => {
         if (movement.type === "in") {
            return total + movement.quantity;
         }

         if (movement.type === "out") {
            return total - movement.quantity;
         }

         return total;
       }, 0);
}

export function hasEnoughStock(
    movements: StockMovement[],
    productId: string,
    warehouseId: string,
    quantity: number 
): boolean {
    return calculateCurrentStock(
        movements,
        productId,
        warehouseId
    ) >= quantity;
}

export function preventNegativeStock(
    movements: StockMovement[],
    movement: StockMovement 
): boolean {
    if (movement.type !== "out") return true;

    return hasEnoughStock(
        movements,
        movement.productId,
        movement.warehouseId,
        movement.quantity
    );
}