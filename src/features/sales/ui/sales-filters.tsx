"use client";

import { useState } from "react";
import { Calendar, X, Filter } from "lucide-react";
import Button from "@/shared/ui/button";
import styles from "../styles/sales-filters.module.css";

interface SalesFiltersProps {
    onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function SalesFilters({ onFilterChange }: SalesFiltersProps) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [isExpanded, setIsExpanded] = useState(false);

    const handleApplyFilter = () => {
        let start: Date | null = null;
        let end: Date | null = null;

        if (startDate) {
            const [year, month, day] = startDate.split('-').map(Number);
            start = new Date(year, month - 1, day, 0, 0, 0, 0);
        }

        if (endDate) {
            const [year, month, day] = endDate.split('-').map(Number);
            end = new Date(year, month - 1, day, 23, 59, 59, 999);
        }

        if (end && start && end < start) {
            alert("La fecha final no puede ser anterior a la fecha inicial");
            return;
        }

        onFilterChange(start, end);
        setIsExpanded(false);
    };

    const handleClearFilter = () => {
        setStartDate("");
        setEndDate("");
        onFilterChange(null, null);
    };

    const hasActiveFilter = startDate || endDate;

    return (
        <div className={styles.container}>
            <button
                className={`${styles.toggleButton} ${hasActiveFilter ? styles.active : ""}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Filter size={18} />
                Filtrar por fecha
                {hasActiveFilter && <span className={styles.badge}>●</span>}
            </button>

            {isExpanded && (
                <div className={styles.filterPanel}>
                    <div className={styles.filterHeader}>
                        <h3 className={styles.filterTitle}>
                            <Calendar size={20} />
                            Filtrar ventas por fecha
                        </h3>
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsExpanded(false)}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className={styles.filterContent}>
                        <div className={styles.dateInputGroup}>
                            <label className={styles.label}>
                                Fecha desde
                                <input
                                    type="date"
                                    className={styles.dateInput}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className={styles.dateInputGroup}>
                            <label className={styles.label}>
                                Fecha hasta
                                <input
                                    type="date"
                                    className={styles.dateInput}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles.filterActions}>
                        <Button
                            variant="secondary"
                            onClick={handleClearFilter}
                            disabled={!hasActiveFilter}
                        >
                            Limpiar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleApplyFilter}
                        >
                            Aplicar filtro
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

