import { Product } from "@/core/types/product";

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const response = await fetch('/api/products/create', {
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
