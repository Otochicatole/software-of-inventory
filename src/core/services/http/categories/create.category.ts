import { Category } from "@/core/types/category";

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const response = await fetch('/api/categories/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
