import { Sale } from "@/core/types/sale";

export const getSales = async (): Promise<Sale[]> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(HOST + '/api/sales/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch sales');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

