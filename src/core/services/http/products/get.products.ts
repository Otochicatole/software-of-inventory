import { Product } from "@/core/types/product";

export const getProducts = async (): Promise<Product[]> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const response = await fetch(HOST+'/api/products/get');
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
