import { Product } from "./product";

export interface QuotationItem {
    id: number;
    productId: number | null;
    productName?: string | null;
    quantity: number;
    price: number;
    product?: Product | null;
}

export interface Quotation {
    id: number;
    totalAmount: number;
    items: QuotationItem[];
    date: string | Date;
    active: boolean;
    reference: string;
}

export interface CreateQuotationItem {
    productId: number;
    quantity: number;
    price: number;
}

