import { useState, useEffect } from "react";
import { Category } from "@/core/types/category";
import { getCategories } from "@/core/services/http/categories/get.categories";
import { createCategory } from "@/core/services/http/categories/create.category";
import { updateCategory } from "@/core/services/http/categories/update.category";
import { deleteCategory } from "@/core/services/http/categories/delete.category";

export interface CategoryFormData {
    name: string;
    description: string;
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        setIsLoading(false);
    };

    const addCategory = async (data: CategoryFormData): Promise<boolean> => {
        const categoryData = {
            name: data.name,
            description: data.description || null
        };

        const result = await createCategory(categoryData);

        if (result) {
            setCategories(prev => [...prev, result]);
            return true;
        }
        return false;
    };

    const editCategory = async (id: number, data: CategoryFormData): Promise<boolean> => {
        const categoryData = {
            id,
            name: data.name,
            description: data.description || null
        };

        const result = await updateCategory(categoryData);

        if (result) {
            setCategories(prev =>
                prev.map(cat => cat.id === result.id ? result : cat)
            );
            return true;
        }
        return false;
    };

    const removeCategory = async (id: number): Promise<boolean> => {
        const result = await deleteCategory(id);
        
        if (result) {
            setCategories(prev => prev.filter(cat => cat.id !== id));
            return true;
        }
        return false;
    };

    return {
        categories,
        isLoading,
        addCategory,
        editCategory,
        removeCategory,
    };
}

