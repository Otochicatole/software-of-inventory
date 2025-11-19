import { Product } from "@/core/types/product";
import { SortField, SortOrder } from "../enums/fileters-enums";
import { StockLevelFilter } from "../constants/stock-thresholds";

// Re-exportar enums para mayor conveniencia
export { SortField, SortOrder } from "../enums/fileters-enums";
export { StockLevelFilter } from "../constants/stock-thresholds";

export interface StockFilters {
    search?: string;
    sortField?: SortField;
    sortOrder?: SortOrder;
    minStock?: number;
    maxStock?: number;
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: number[];
    stockLevel?: StockLevelFilter;  // Filtro rápido para stock bajo/alto
    customFilter?: (product: Product) => boolean;
}

