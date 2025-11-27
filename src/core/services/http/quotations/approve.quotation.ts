export const approveQuotation = async (id: number): Promise<{ success: boolean; error?: string }> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(HOST + '/api/quotations/approve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Error al aprobar la cotización' };
        }
        
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Error de conexión al aprobar la cotización' };
    }
};
