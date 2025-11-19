"use client";
import { StockFilters } from "../types/stock-filter-types";
import { SortField, SortOrder, StockLevelFilter } from "../types/stock-filter-types";
import { STOCK_THRESHOLDS } from "../constants/stock-thresholds";
import Select from "@/shared/ui/select";
import Input from "@/shared/ui/input";
import Button from "@/shared/ui/button";
import styles from "../styles/stock-filters.module.css";

interface StockFiltersProps {
    filters: StockFilters;
    onSortChange: (sortField: SortField, sortOrder: SortOrder) => void;
    onStockLevelChange: (level: StockLevelFilter) => void;
    onStockRangeChange: (min?: number, max?: number) => void;
    onResetFilters: () => void;
}

export default function StockFiltersComponent({
    filters,
    onSortChange,
    onStockLevelChange,
    onStockRangeChange,
    onResetFilters
}: StockFiltersProps) {
    const sortFieldOptions = [
        { value: SortField.Name, label: "Nombre" },
        { value: SortField.Price, label: "Precio" },
        { value: SortField.Stock, label: "Stock" },
        { value: SortField.CreatedAt, label: "Fecha de Creación" }
    ];

    const sortOrderOptions = [
        { value: SortOrder.Ascending, label: "Ascendente" },
        { value: SortOrder.Descending, label: "Descendente" }
    ];

    const handleMinStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? undefined : Number(e.target.value);
        onStockRangeChange(value, filters.maxStock);
    };

    const handleMaxStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? undefined : Number(e.target.value);
        onStockRangeChange(filters.minStock, value);
    };

    const isFilterActive = (level: StockLevelFilter) => {
        return filters.stockLevel === level;
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Filtros de Stock</h2>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Filtros Rápidos</h3>
                <div className={styles.quickFilters}>
                    <button
                        className={`${styles.quickFilterBtn} ${isFilterActive(StockLevelFilter.All) ? styles.active : ""}`}
                        onClick={() => onStockLevelChange(StockLevelFilter.All)}
                        type="button"
                    >
                        📦 Todos los Productos
                    </button>
                    <button
                        className={`${styles.quickFilterBtn} ${styles.lowStock} ${isFilterActive(StockLevelFilter.Low) ? styles.active : ""}`}
                        onClick={() => onStockLevelChange(StockLevelFilter.Low)}
                        type="button"
                    >
                        ⚠️ Stock Bajo (≤ {STOCK_THRESHOLDS.LOW})
                    </button>
                    <button
                        className={`${styles.quickFilterBtn} ${styles.highStock} ${isFilterActive(StockLevelFilter.High) ? styles.active : ""}`}
                        onClick={() => onStockLevelChange(StockLevelFilter.High)}
                        type="button"
                    >
                        ✅ Stock Alto (&gt; {STOCK_THRESHOLDS.HIGH})
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Rango Personalizado</h3>
                <div className={styles.rangeInputs}>
                    <div>
                        <Input
                            type="number"
                            name="minStock"
                            placeholder="Stock mínimo"
                            value={filters.minStock !== undefined ? String(filters.minStock) : ""}
                            onChange={handleMinStockChange}
                        />
                    </div>
                    <br />
                    <div>
                        <Input
                            type="number"
                            name="maxStock"
                            placeholder="Stock máximo"
                            value={filters.maxStock !== undefined ? String(filters.maxStock) : ""}
                            onChange={handleMaxStockChange}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Ordenamiento</h3>
                <Select
                    label="Ordenar Por:"
                    name="sortField"
                    options={sortFieldOptions}
                    value={filters.sortField || SortField.Name}
                    onChange={(e) => onSortChange(
                        e.target.value as SortField,
                        filters.sortOrder as SortOrder || SortOrder.Ascending
                    )}
                />
                <Select
                    label="Orden:"
                    name="sortOrder"
                    options={sortOrderOptions}
                    value={filters.sortOrder || SortOrder.Ascending}
                    onChange={(e) => onSortChange(
                        filters.sortField as SortField || SortField.Name,
                        e.target.value as SortOrder
                    )}
                />
            </div>

            <Button
                variant="secondary"
                fullWidth
                onClick={onResetFilters}
                type="button"
            >
                🔄 Limpiar Filtros
            </Button>
        </div>
    );
}

