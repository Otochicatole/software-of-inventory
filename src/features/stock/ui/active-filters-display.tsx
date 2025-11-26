"use client";

import { StockFilters } from "../types/stock-filter-types";
import { SortField, SortOrder } from "../enums/fileters-enums";
import { StockLevelFilter } from "../constants/stock-thresholds";
import { X } from "lucide-react";
import styles from "../styles/active-filters-display.module.css";

interface ActiveFiltersDisplayProps {
    filters: StockFilters;
    onRemoveFilter: (filterKey: string) => void;
}

export default function ActiveFiltersDisplay({ filters, onRemoveFilter }: ActiveFiltersDisplayProps) {
    const activeFilters: Array<{ key: string; label: string; value: string }> = [];

    if (filters.stockLevel && filters.stockLevel !== StockLevelFilter.All) {
        let levelLabel = "";
        switch (filters.stockLevel) {
            case StockLevelFilter.Low:
                levelLabel = "Stock Bajo";
                break;
            case StockLevelFilter.High:
                levelLabel = "Stock Alto";
                break;
        }
        activeFilters.push({ key: "stockLevel", label: "Nivel", value: levelLabel });
    }

    if (filters.minStock !== undefined || filters.maxStock !== undefined) {
        const min = filters.minStock ?? 0;
        const max = filters.maxStock ?? "∞";
        activeFilters.push({ 
            key: "stockRange", 
            label: "Rango", 
            value: `${min} - ${max}` 
        });
    }

    if (filters.sortField && filters.sortField !== SortField.Name) {
        let sortLabel = "";
        switch (filters.sortField) {
            case SortField.Price:
                sortLabel = "Precio";
                break;
            case SortField.Stock:
                sortLabel = "Stock";
                break;
            case SortField.CreatedAt:
                sortLabel = "Fecha";
                break;
        }
        const orderLabel = filters.sortOrder === SortOrder.Descending ? "↓" : "↑";
        activeFilters.push({ 
            key: "sort", 
            label: "Ordenar", 
            value: `${sortLabel} ${orderLabel}` 
        });
    }

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <span className={styles.label}>Filtros activos:</span>
            <div className={styles.filtersList}>
                {activeFilters.map((filter) => (
                    <div key={filter.key} className={styles.filterTag}>
                        <span className={styles.filterLabel}>{filter.label}:</span>
                        <span className={styles.filterValue}>{filter.value}</span>
                        <button
                            className={styles.removeButton}
                            onClick={() => onRemoveFilter(filter.key)}
                            aria-label={`Remover filtro ${filter.label}`}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

