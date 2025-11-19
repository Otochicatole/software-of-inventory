import { Product } from "@/core/types/product";

export const createProduct = async (product: Omit<Product, 'id' | 'categories' | 'createdAt' | 'updatedAt'> & { categoryIds: number[] }): Promise<Product | null> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
    const response = await fetch(HOST+'/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
