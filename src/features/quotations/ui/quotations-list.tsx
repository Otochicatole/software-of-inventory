"use client";

import { Quotation } from "@/core/types/quotation";
import styles from "../styles/quotations-list.module.css";
import { Trash2, Eye } from "lucide-react";

interface QuotationsListProps {
    quotations: Quotation[];
    onDelete?: (id: number) => void;
    onViewDetails?: (quotation: Quotation) => void;
}

export default function QuotationsList({ quotations, onDelete, onViewDetails }: QuotationsListProps) {
    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        onDelete?.(id);
    };

    const handleViewDetails = (quotation: Quotation) => {
        onViewDetails?.(quotation);
    };

    const handleRowClick = (quotation: Quotation) => {
        handleViewDetails(quotation);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.quotationsTable}>
                <thead>
                    <tr>
                        <th className={styles.alignCenter}>ID</th>
                        <th className={styles.alignLeft}>Referencia</th>
                        <th className={styles.alignLeft}>Fecha y Hora</th>
                        <th className={styles.alignCenter}>Productos</th>
                        <th className={styles.alignCenter}>Total</th>
                        <th className={styles.alignCenter}>Estado</th>
                        <th className={styles.alignCenter}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {quotations.map((quotation) => (
                        <tr 
                            key={quotation.id} 
                            className={styles.quotationsRow}
                            onClick={() => handleRowClick(quotation)}
                        >
                            <td className={styles.quotationId}>#{quotation.id}</td>
                            <td className={styles.quotationReference}>
                                {quotation.reference}
                            </td>
                            <td className={styles.quotationDate}>
                                {formatDate(quotation.date)}
                            </td>
                            <td className={styles.quotationItems}>
                                <span className={styles.itemsCount}>
                                    {quotation.items.length} {quotation.items.length === 1 ? 'producto' : 'productos'}
                                </span>
                            </td>
                            <td className={styles.quotationTotal}>
                                ${quotation.totalAmount.toFixed(2)}
                            </td>
                            <td className={styles.quotationStatus}>
                                <span className={`${styles.statusBadge} ${quotation.active ? styles.approved : styles.pending}`}>
                                    {quotation.active ? 'Aprobada' : 'Pendiente'}
                                </span>
                            </td>
                            <td className={styles.quotationActions}>
                                <button
                                    className={styles.viewButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(quotation);
                                    }}
                                    title="Ver detalles"
                                >
                                    <Eye size={16} />
                                </button>
                                {!quotation.active && (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDelete(e, quotation.id)}
                                        title="Eliminar cotización"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {quotations.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No hay cotizaciones registradas</p>
                </div>
            )}
        </div>
    );
}

