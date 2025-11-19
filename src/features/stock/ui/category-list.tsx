import { Category } from "@/core/types/category";
import CategoryItem from "./category-item";
import styles from "@/features/stock/styles/category-list.module.css";

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
    if (categories.length === 0) {
        return (
            <div className={styles.categoryList}>
                <p className={styles.emptyMessage}>No hay categorías creadas aún.</p>
            </div>
        );
    }

    return (
        <div className={styles.categoryList}>
            <ul className={styles.list}>
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

