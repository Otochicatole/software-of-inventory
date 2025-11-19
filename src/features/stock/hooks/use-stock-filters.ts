import { useState, useMemo } from "react";
import { Product } from "@/core/types/product";
import { StockFilters } from "../types/stock-filter-types";
import { SortField, SortOrder } from "../enums/fileters-enums";
import { StockLevelFilter } from "../constants/stock-thresholds";
import { applyStockFilters } from "../utils/filter-stock";

/**
 * Hook personalizado para manejar filtros de stock
 * Proporciona estado y funciones para filtrar productos de forma reactiva
 */
export function useStockFilters(products: Product[], initialFilters?: StockFilters) {
    const [filters, setFilters] = useState<StockFilters>(initialFilters || {});

    // Aplicar filtros de forma memorizada
    const filteredProducts = useMemo(
        () => applyStockFilters(products, filters),
        [products, filters]
    );

    // Funciones helper para actualizar filtros específicos
    const setSearch = (search: string) => {
        setFilters(prev => ({ ...prev, search }));
    };

    const setSort = (sortField: SortField, sortOrder: SortOrder = SortOrder.Ascending) => {
        setFilters(prev => ({ ...prev, sortField, sortOrder }));
    };

    const setStockRange = (minStock?: number, maxStock?: number) => {
        setFilters(prev => ({ ...prev, minStock, maxStock }));
    };

    const setPriceRange = (minPrice?: number, maxPrice?: number) => {
        setFilters(prev => ({ ...prev, minPrice, maxPrice }));
    };

    const setCategories = (categoryIds: number[]) => {
        setFilters(prev => ({ ...prev, categoryIds }));
    };

    const setStockLevel = (stockLevel: StockLevelFilter) => {
        setFilters(prev => ({ ...prev, stockLevel }));
    };

    const resetFilters = () => {
        setFilters(initialFilters || {});
    };

    const updateFilters = (newFilters: Partial<StockFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return {
        // Estado
        filters,
        filteredProducts,
        
        // Setters específicos
        setSearch,
        setSort,
        setStockRange,
        setPriceRange,
        setCategories,
        setStockLevel,
        
        // Setters generales
        setFilters,
        updateFilters,
        resetFilters,
        
        // Información útil
        totalProducts: products.length,
        filteredCount: filteredProducts.length,
        hasActiveFilters: Object.keys(filters).length > 0,
    };
}

