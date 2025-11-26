import { Product } from "./product";

export interface SaleItem {
    id: number;
    productId: number | null;
    productName?: string | null;
    quantity: number;
    price: number;
    product?: Product | null;
}

export interface Sale {
    id: number;
    totalAmount: number;
    items: SaleItem[];
    date: string | Date;
    active: boolean;
}

export interface CreateSaleItem {
    productId: number;
    quantity: number;
    price: number;
}
  