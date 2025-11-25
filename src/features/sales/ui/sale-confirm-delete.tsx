"use client";

import { Sale } from "@/core/types/sale";
import Button from "@/shared/ui/button";
import { AlertTriangle } from "lucide-react";
import styles from "../styles/sale-confirm-delete.module.css";

interface SaleConfirmDeleteProps {
    sale: Sale;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function SaleConfirmDelete({ 
    sale, 
    onConfirm, 
    onCancel 
}: SaleConfirmDeleteProps) {
    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'Fecha no disponible';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(dateObj.getTime())) return 'Fecha inválida';
        
        return dateObj.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.iconContainer}>
                <AlertTriangle size={48} className={styles.icon} />
            </div>
            
            <h2 className={styles.title}>¿Anular venta?</h2>
            
            <div className={styles.saleInfo}>
                <p className={styles.message}>
                    Estás a punto de anular la venta <strong>#{sale.id}</strong>
                </p>
                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Fecha:</span>
                        <span className={styles.detailValue}>{formatDate(sale.date)}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Total:</span>
                        <span className={styles.detailValue}>${sale.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Items:</span>
                        <span className={styles.detailValue}>{sale.items.length} producto{sale.items.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
            
            <p className={styles.warning}>
                Esta acción no se puede deshacer. La venta quedará marcada como anulada.
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
                    Anular Venta
                </Button>
            </div>
        </div>
    );
}

