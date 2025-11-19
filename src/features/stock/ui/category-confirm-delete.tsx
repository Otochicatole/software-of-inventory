import Button from "@/shared/ui/button";
import { Category } from "@/core/types/category";
import { AlertTriangle } from "lucide-react";
import styles from "@/features/stock/styles/category-confirm-delete.module.css";

interface CategoryConfirmDeleteProps {
    category: Category;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CategoryConfirmDelete({ 
    category, 
    onConfirm, 
    onCancel 
}: CategoryConfirmDeleteProps) {
    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <AlertTriangle size={48} className={styles.icon} />
            </div>
            
            <h2 className={styles.title}>¿Eliminar categoría?</h2>
            
            <p className={styles.message}>
                Estás a punto de eliminar la categoría <strong>&ldquo;{category.name}&rdquo;</strong>.
            </p>
            
            {category.description && (
                <p className={styles.description}>
                    {category.description}
                </p>
            )}
            
            <p className={styles.warning}>
                Esta acción no se puede deshacer.
            </p>
            
            <div className={styles.actions}>
                <Button 
                    variant="primary" 
                    onClick={onCancel}
                    fullWidth
                >
                    Cancelar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={onConfirm}
                    fullWidth
                >
                    Eliminar
                </Button>
            </div>
        </div>
    );
}
