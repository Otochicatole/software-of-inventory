import { Category } from "@/core/types/category";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/api/categories/get');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
