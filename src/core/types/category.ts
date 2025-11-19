export interface Category {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCategory {
    id: number;
    productId: number;
    categoryId: number;
    createdAt: string;
    category: Category;
}