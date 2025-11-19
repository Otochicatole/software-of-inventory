import { Product } from "@/core/types/product";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products/get');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
