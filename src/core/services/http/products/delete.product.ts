export const deleteProduct = async (id: number): Promise<{ success: boolean; error?: string }> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
        const response = await fetch(HOST + '/api/products/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 409) {
                return { 
                    success: false, 
                    error: `No se puede eliminar el producto porque tiene ${data.salesCount} venta${data.salesCount > 1 ? 's' : ''} asociada${data.salesCount > 1 ? 's' : ''}.` 
                };
            }
            return { success: false, error: data.error || 'Error al eliminar el producto' };
        }
        
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Error de conexión al eliminar el producto' };
    }
};
