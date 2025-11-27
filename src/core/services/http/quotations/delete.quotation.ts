export const deleteQuotation = async (id: number): Promise<boolean> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(HOST + '/api/quotations/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete quotation');
        }
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

