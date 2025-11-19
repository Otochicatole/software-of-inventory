import { Category } from "@/core/types/category";
import { Pencil, Trash2 } from "lucide-react";
import styles from "@/features/stock/styles/category-item.module.css";

interface CategoryItemProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

export default function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
    return (
        <li className={styles.categoryItem}>
            <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                {category.description && (
                    <p className={styles.categoryDescription}>
                        {category.description}
                    </p>
                )}
            </div>
            
            <div className={styles.categoryActions}>
                <button
                    className={styles.editButton}
                    onClick={() => onEdit(category)}
                    title="Editar categoría"
                >
                    <Pencil size={16} />
                </button>
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(category.id)}
                    title="Eliminar categoría"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    );
}

