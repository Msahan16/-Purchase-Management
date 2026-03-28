export interface Item {
  id: number;
  name: string;
}

export interface Location {
  id: string; // VARCHAR(10) in user's SQL
  name: string;
}

export interface PurchaseItem {
  id?: number;
  itemId: number;
  itemName?: string;
  locationId: string;
  locationName?: string;
  cost: number;
  price: number;
  quantity: number;
  discountPercent: number;
  totalCost: number;
  totalSelling: number;
}

export interface PurchaseBill {
  id?: number;
  transactionNo: string;
  transactionDate: Date;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  items: PurchaseItem[];
  isOffline?: boolean;
}
