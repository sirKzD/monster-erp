export type PurchaseOrderStatus =
  | "draft"
  | "approved"
  | "received"
  | "cancelled";

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdAt: string;
}