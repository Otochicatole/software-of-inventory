"use client";

import { useState } from "react";
import { Category } from "@/core/types/category";
import { useCategories } from "../hooks/use-categories";
import CategoryForm from "./category-form";
import CategoryList from "./category-list";
import CategoryConfirmDelete from "./category-confirm-delete";
import Button from "@/shared/ui/button";
import { Plus } from "lucide-react";
import styles from "@/features/stock/styles/form-category.module.css";
import { CategoryViewMode } from "../enums/category-enums";




export default function CategoryManager() {
    const { categories, addCategory, editCategory, removeCategory } = useCategories();
    const [viewMode, setViewMode] = useState<CategoryViewMode>(CategoryViewMode.List);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const handleFormSubmit = async (data: { name: string; description: string }) => {
        const success = editingCategory
            ? await editCategory(editingCategory.id, data)
            : await addCategory(data);

        if (success) {
            handleCloseForm();
        } else {
            console.error(`Error al ${editingCategory ? 'actualizar' : 'crear'} la categoría`);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setViewMode(CategoryViewMode.Form);
    };

    const handleDeleteClick = (id: number) => {
        const category = categories.find(cat => cat.id === id);
        if (category) {
            setDeletingCategory(category);
            setViewMode(CategoryViewMode.Delete);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingCategory) return;

        const success = await removeCategory(deletingCategory.id);
        if (success) {
            setDeletingCategory(null);
            setViewMode(CategoryViewMode.List);
        } else {
            console.error("Error al eliminar la categoría");
        }
    };

    const handleCancelDelete = () => {
        setDeletingCategory(null);
        setViewMode(CategoryViewMode.List);
    };

    const handleCloseForm = () => {
        setViewMode(CategoryViewMode.List);
        setEditingCategory(null);
    };

    const handleOpenForm = () => {
        setEditingCategory(null);
        setViewMode(CategoryViewMode.Form);
    };

    const renderContent = () => {
        switch (viewMode) {
            case CategoryViewMode.Form:
                return (
                    <CategoryForm
                        category={editingCategory}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseForm}
                    />
                );
            case CategoryViewMode.Delete:
                return deletingCategory ? (
                    <CategoryConfirmDelete
                        category={deletingCategory}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                ) : null;
            case CategoryViewMode.List:
            default:
                return (
                    <CategoryList
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                );
        }
    };

    return (
        <div className={styles.container}>
            {viewMode === CategoryViewMode.List && (
                <>
                    <h2 className={styles.title}>Gestión de Categorías</h2>
                    <div className={styles.header}>
                        <Button variant="success"
                            fullWidth
                            onClick={handleOpenForm}>
                            <Plus size={18} />
                            Nueva Categoría
                        </Button>
                    </div>
                </>
            )}

            {renderContent()}
        </div>
    );
}
