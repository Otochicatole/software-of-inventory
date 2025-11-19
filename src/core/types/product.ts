import {ProductCategory} from "@/core/types/category";

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
    categories: ProductCategory[];
}