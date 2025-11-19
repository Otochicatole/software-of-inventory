import { Category } from "@/core/types/category";

export const updateCategory = async (category: Category): Promise<Category | null> => {
  try {
    const response = await fetch('/api/categories/update', {
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
