import { Product } from "@/core/types/product";

interface Sale {
    id: number;
    products: Product[];
    total: number;
    createdAt: Date;
}

export const createSale = async (sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale | null> => {
  try {
    const response = await fetch('/api/sales/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sale),
    });
    if (!response.ok) {
      throw new Error('Failed to create sale');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
