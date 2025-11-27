"use client";

import { X } from "lucide-react";
import styles from "../styles/active-date-filters.module.css";

interface ActiveDateFiltersProps {
    startDate: Date | null;
    endDate: Date | null;
    onClearFilters: () => void;
}

export default function ActiveDateFilters({ 
    startDate, 
    endDate, 
    onClearFilters 
}: ActiveDateFiltersProps) {
    if (!startDate && !endDate) {
        return null;
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getFilterLabel = () => {
        if (startDate && endDate) {
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        } else if (startDate) {
            return `Desde ${formatDate(startDate)}`;
        } else if (endDate) {
            return `Hasta ${formatDate(endDate)}`;
        }
        return "";
    };

    return (
        <div className={styles.container}>
            <span className={styles.label}>Filtro de fecha:</span>
            <div className={styles.filterTag}>
                <span className={styles.filterValue}>{getFilterLabel()}</span>
                <button
                    className={styles.removeButton}
                    onClick={onClearFilters}
                    aria-label="Limpiar filtro de fecha"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

