export interface SaleItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
  }
  
  export interface Sale {
    id: number;
    totalAmount: number;
    items: SaleItem[];
    createdAt: Date;
  }
  