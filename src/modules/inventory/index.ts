export {
    createProduct,
    createCategory,
    createWarehouse,
    createStockMovement
} from "./services/inventoryService";

export type {
    Product,
    Category,
    Warehouse,
    StockMovement,
    StockMovementType,
    Supplier,
    SupplierStatus
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

export {
  calculatePurchaseOrderTotal,
  createPurchaseOrder,
  changePurchaseOrderStatus
} from "./services/purchaseOrderService";

export type {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus
} from "./types/purchaseOrder.types";

export {
  canChangePurchaseOrderStatus,
  updatePurchaseOrderStatus
} from "./services/purchaseOrderApprovalService";

export {
  isPurchaseOrderReceivable,
  createGoodsReceipt,
  createPartialGoodsReceipt,
  createStockMovementsFromReceipt,
  receivePurchaseOrder
} from "./services/goodsReceiptService";

export type {
  GoodsReceipt,
  PartialReceiptResult
} from "./services/goodsReceiptService";

export {
  createSupplier,
  updateSupplierStatus,
  updateSupplierRating,
  isSupplierActive,
  filterActiveSuppliers
} from "./services/supplierService";

export {
  clampRating,
  calculateSupplierRating,
  applySupplierRating
} from "./services/supplierRatingService";

export type {
  SupplierRatingInput
} from "./services/supplierRatingService";
