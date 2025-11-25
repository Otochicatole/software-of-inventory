import { Sale, CreateSaleItem } from "@/core/types/sale";

export const createSale = async (items: CreateSaleItem[]): Promise<Sale | null> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
    const response = await fetch(HOST+'/api/sales/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
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
