import { Quotation, CreateQuotationItem } from "@/core/types/quotation";

export const createQuotation = async (items: CreateQuotationItem[], reference: string): Promise<Quotation | null> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
    const response = await fetch(HOST+'/api/quotations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, reference }),
    });
    if (!response.ok) {
      throw new Error('Failed to create quotation');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

