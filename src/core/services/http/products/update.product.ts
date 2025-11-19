import { Product } from "@/core/types/product";

export const updateProduct = async (product: Product): Promise<Product | null> => {
  try {
    const response = await fetch('/api/products/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
