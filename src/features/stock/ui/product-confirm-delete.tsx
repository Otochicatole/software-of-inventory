"use client";

import { Product } from "@/core/types/product";
import Button from "@/shared/ui/button";
import { AlertTriangle } from "lucide-react";
import styles from "../styles/product-confirm-delete.module.css";

interface ProductConfirmDeleteProps {
    product: Product;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ProductConfirmDelete({ 
    product, 
    onConfirm, 
    onCancel 
}: ProductConfirmDeleteProps) {
    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <AlertTriangle size={48} className={styles.icon} />
            </div>
            
            <h2 className={styles.title}>¿Eliminar producto?</h2>
            
            <div className={styles.productInfo}>
                <p className={styles.message}>
                    Estás a punto de eliminar el producto <strong>{product.name}</strong>
                </p>
                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Precio:</span>
                        <span className={styles.detailValue}>${product.price.toFixed(2)}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Stock actual:</span>
                        <span className={styles.detailValue}>{product.stock} unidades</span>
                    </div>
                    {product.categories && product.categories.length > 0 && (
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Categorías:</span>
                            <span className={styles.detailValue}>
                                {product.categories.map(c => c.category.name).join(', ')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            <p className={styles.warning}>
                Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.
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
                    Eliminar Producto
                </Button>
            </div>
        </div>
    );
}

