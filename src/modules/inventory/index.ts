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

export {
  createLowStockAlert,
  filterLowStockAlerts
} from "./services/inventoryLowStockService";

export type {
  LowStockAlert
} from "./services/inventoryLowStockService";

export {
  calculateInventoryValue,
  calculateTotalInventoryValue
} from "./services/inventoryValuationService";

export type {
  InventoryValuation
} from "./services/inventoryValuationService";

export {
  createReorderSuggestion,
  filterReorderSuggestions
} from "./services/inventoryReorderService";

export type {
  ReorderSuggestion
} from "./services/inventoryReorderService";