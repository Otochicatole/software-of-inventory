export const deleteSale = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch('/api/sales/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete sale');
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
