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