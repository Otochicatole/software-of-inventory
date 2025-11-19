import { Category } from "@/core/types/category";

export const updateCategory = async (category: Omit<Category, 'createdAt' | 'updatedAt'>): Promise<Category | null> => {
    const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    try {
    const response = await fetch(HOST+'/api/categories/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
