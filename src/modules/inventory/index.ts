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

export {
  updateWarehouseStatus,
  createWarehouseLocation,
  updateWarehouseLocationStatus,
  filterActiveWarehouses,
  filterActiveWarehouseLocations
} from "./services/warehouseService";

export type {
  WarehouseStatus,
  WarehouseLocation
} from "./types/inventory.types";

export {
  createInventoryAuditResult,
  createAuditAdjustmentMovement
} from "./services/inventoryAuditService";

export type {
  InventoryAuditResult
} from "./services/inventoryAuditService";

export {
  calculateReservedStock,
  calculateAvailableStock,
  canReserveStock,
  createStockReservation,
  releaseStockReservation
} from "./services/stockReservationService";

export type {
  StockReservation
} from "./services/stockReservationService";

export {
  createInventoryReportSummary
} from "./services/inventoryReportingService";

export type {
  InventoryReportSummary
} from "./services/inventoryReportingService";

export {
  createProductLot,
  findLotByNumber,
  calculateLotQuantity,
  consumeLotQuantity
} from "./services/lotTrackingService";

export type {
  ProductLot
} from "./types/inventory.types";

export {
  createSerialNumber,
  findSerialNumber,
  updateSerialNumberStatus,
  filterSerialsByStatus,
  isSerialAvailable
} from "./services/serialNumberService";

export type {
  ProductSerialNumber,
  SerialNumberStatus
} from "./types/inventory.types";

export {
  isLotExpired,
  isLotNearExpiry,
  filterExpiredLots,
  filterNearExpiryLots
} from "./services/expiryTrackingService";

export {
  createCycleCount,
  hasVariance,
  filterVarianceCounts
} from "./services/cycleCountService";

export type {
  CycleCount
} from "./services/cycleCountService";

export {
  createStockPicking,
  markPickingAsPicked,
  cancelPicking,
  filterPendingPickings
} from "./services/stockPickingService";

export type {
  StockPicking,
  StockPickingStatus
} from "./services/stockPickingService";

export {
  createDeliveryOrder,
  markDeliveryAsDelivered,
  cancelDelivery,
  createStockOutMovement
} from "./services/deliveryOrderService";

export type {
  DeliveryOrder,
  DeliveryOrderStatus
} from "./services/deliveryOrderService";

export {
  createReturnOrder,
  acceptReturnOrder,
  rejectReturnOrder,
  createReturnStockMovement
} from "./services/returnOrderService";

export type {
  ReturnOrder,
  ReturnOrderStatus
} from "./services/returnOrderService";

export {
  createPutawayRule,
  findPutawayLocation,
  filterPutawayRulesByWarehouse
} from "./services/putawayRuleService";

export type {
  PutawayRule
} from "./services/putawayRuleService";

export {
  isValidPickingRoute,
  assignPickingRoute,
  filterPickingsByRoute,
  getDefaultRouteForPriority
} from "./services/stockPickingRouteService";

export type {
  PickingRoute,
  RoutedStockPicking
} from "./services/stockPickingRouteService";