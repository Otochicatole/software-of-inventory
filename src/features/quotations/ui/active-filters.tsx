"use client";

import { X } from "lucide-react";
import styles from "../styles/active-filters.module.css";

interface ActiveFiltersProps {
    startDate: Date | null;
    endDate: Date | null;
    status: 'all' | 'pending' | 'approved';
    onClearDateFilters: () => void;
    onClearStatus: () => void;
}

export default function ActiveFilters({ 
    startDate, 
    endDate,
    status,
    onClearDateFilters,
    onClearStatus
}: ActiveFiltersProps) {
    const hasDateFilter = startDate || endDate;
    const hasStatusFilter = status !== 'all';
    const hasAnyFilter = hasDateFilter || hasStatusFilter;

    if (!hasAnyFilter) {
        return null;
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDateFilterLabel = () => {
        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        } else if (startDate) {
            return `Desde ${formatDate(startDate)}`;
        } else if (endDate) {
            return `Hasta ${formatDate(endDate)}`;
        }
        return "";
    };

    const getStatusLabel = () => {
        if (status === 'pending') return 'Pendientes';
        if (status === 'approved') return 'Aprobadas';
        return '';
    };

    return (
        <div className={styles.container}>
            <span className={styles.label}>Filtros activos:</span>
            
            <div className={styles.filtersGroup}>
                {hasDateFilter && (
                    <div className={styles.filterTag}>
                        <span className={styles.filterValue}>{getDateFilterLabel()}</span>
                        <button
                            className={styles.removeButton}
                            onClick={onClearDateFilters}
                            aria-label="Limpiar filtro de fecha"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {hasStatusFilter && (
                    <div className={`${styles.filterTag} ${status === 'pending' ? styles.pendingTag : styles.approvedTag}`}>
                        <span className={styles.filterValue}>{getStatusLabel()}</span>
                        <button
                            className={styles.removeButton}
                            onClick={onClearStatus}
                            aria-label="Limpiar filtro de estado"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

