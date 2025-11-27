"use client";

import { Quotation } from "@/core/types/quotation";
import Button from "@/shared/ui/button";
import { AlertTriangle } from "lucide-react";
import styles from "../styles/quotation-confirm-delete.module.css";

interface QuotationConfirmDeleteProps {
    quotation: Quotation;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function QuotationConfirmDelete({ 
    quotation, 
    onConfirm, 
    onCancel 
}: QuotationConfirmDeleteProps) {
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
            
            <h2 className={styles.title}>¿Eliminar cotización?</h2>
            
            <div className={styles.quotationInfo}>
                <p className={styles.message}>
                    Estás a punto de eliminar permanentemente la cotización <strong>#{quotation.id}</strong>
                </p>
                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Fecha:</span>
                        <span className={styles.detailValue}>{formatDate(quotation.date)}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Total:</span>
                        <span className={styles.detailValue}>${quotation.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Items:</span>
                        <span className={styles.detailValue}>{quotation.items.length} producto{quotation.items.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
            
            <p className={styles.warning}>
                Esta acción no se puede deshacer. La cotización será eliminada permanentemente de la base de datos.
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
                    Eliminar Cotización
                </Button>
            </div>
        </div>
    );
}

