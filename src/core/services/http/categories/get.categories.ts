import { Category } from "@/core/types/category";

export const getCategories = async (): Promise<Category[]> => {
  const HOST = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${HOST}/api/categories/get`, {
        cache: 'no-store'
    });
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
