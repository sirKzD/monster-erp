export {
    createProduct,
    createCategory,
    createWarehouse,
    createStockMovement,
    createSupplier
} from "./services/inventoryService";

export type {
    Product,
    Category,
    Warehouse,
    StockMovement,
    StockMovementType,
    Supplier
} from "./types/inventory.types";

export {
    calculateCurrentStock,
    hasEnoughStock,
    preventNegativeStock
} from "./services/inventoryStockService";

export {
    createTransferMovements
} from "./services/inventoryTransferService";