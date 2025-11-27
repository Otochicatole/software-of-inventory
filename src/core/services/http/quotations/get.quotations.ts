import { Quotation } from "@/core/types/quotation";

export const getQuotations = async (): Promise<Quotation[]> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(HOST + '/api/quotations/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch quotations');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

