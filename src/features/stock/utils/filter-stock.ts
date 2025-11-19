import { Product } from "@/core/types/product";
import { StockFilters } from "../types/stock-filter-types";
import { SortField, SortOrder } from "../enums/fileters-enums";
import { StockLevelFilter, STOCK_THRESHOLDS } from "../constants/stock-thresholds";

/**
 * Filtra productos por texto de búsqueda
 * Busca en: nombre, descripción y nombres de categorías
 */
function filterBySearch(products: Product[], search: string): Product[] {
    if (!search) return products;
    
    const searchLower = search.toLowerCase();
    
    return products.filter((item) => {
        // Buscar en nombre
        if (item.name.toLowerCase().includes(searchLower)) {
            return true;
        }
        
        // Buscar en descripción
        if (item.description?.toLowerCase().includes(searchLower)) {
            return true;
        }
        
        // Buscar en categorías
        const hasMatchingCategory = item.categories.some((cat) =>
            cat.category.name.toLowerCase().includes(searchLower)
        );
        
        return hasMatchingCategory;
    });
}

/**
 * Filtra productos por rango de stock
 */
function filterByStockRange(
    products: Product[], 
    minStock?: number, 
    maxStock?: number
): Product[] {
    if (minStock === undefined && maxStock === undefined) return products;
    
    return products.filter((item) => {
        if (minStock !== undefined && item.stock < minStock) return false;
        if (maxStock !== undefined && item.stock > maxStock) return false;
        return true;
    });
}

/**
 * Filtra productos por rango de precio
 */
function filterByPriceRange(
    products: Product[], 
    minPrice?: number, 
    maxPrice?: number
): Product[] {
    if (minPrice === undefined && maxPrice === undefined) return products;
    
    return products.filter((item) => {
        if (minPrice !== undefined && item.price < minPrice) return false;
        if (maxPrice !== undefined && item.price > maxPrice) return false;
        return true;
    });
}

/**
 * Filtra productos por categorías
 */
function filterByCategories(
    products: Product[], 
    categoryIds: number[]
): Product[] {
    if (!categoryIds || categoryIds.length === 0) return products;
    
    return products.filter((item) =>
        item.categories.some((cat) => categoryIds.includes(cat.categoryId))
    );
}

/**
 * Filtra productos por nivel de stock (bajo, alto o todos)
 */
function filterByStockLevel(
    products: Product[], 
    stockLevel?: StockLevelFilter
): Product[] {
    if (!stockLevel || stockLevel === StockLevelFilter.All) return products;
    
    return products.filter((item) => {
        switch (stockLevel) {
            case StockLevelFilter.Low:
                return item.stock <= STOCK_THRESHOLDS.LOW;
            case StockLevelFilter.High:
                return item.stock > STOCK_THRESHOLDS.HIGH;
            default:
                return true;
        }
    });
}

/**
 * Ordena productos según el campo y orden especificados
 */
function sortProducts(
    products: Product[], 
    sortField?: SortField, 
    sortOrder: SortOrder = SortOrder.Ascending
): Product[] {
    if (!sortField) return products;
    
    const sorted = [...products]; // Copia para no mutar el array original
    const multiplier = sortOrder === SortOrder.Ascending ? 1 : -1;
    
    sorted.sort((a, b) => {
        switch (sortField) {
            case SortField.Name:
                return multiplier * a.name.localeCompare(b.name);
            
            case SortField.Price:
                return multiplier * (a.price - b.price);
            
            case SortField.Stock:
                return multiplier * (a.stock - b.stock);
            
            case SortField.CreatedAt:
                return multiplier * (
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            
            default:
                return 0;
        }
    });
    
    return sorted;
}

/**
 * Aplica todos los filtros especificados a la lista de productos
 * Los filtros se aplican en el siguiente orden:
 * 1. Búsqueda por texto
 * 2. Filtro por nivel de stock (bajo/alto)
 * 3. Filtro por rango de stock
 * 4. Filtro por precio
 * 5. Filtro por categorías
 * 6. Filtro personalizado
 * 7. Ordenamiento
 */
export function applyStockFilters(
    products: Product[], 
    filters: StockFilters
): Product[] {
    let result = [...products]; // Copia para no mutar el array original
    
    // 1. Filtrar por búsqueda
    if (filters.search) {
        result = filterBySearch(result, filters.search);
    }
    
    // 2. Filtrar por nivel de stock (bajo/alto)
    if (filters.stockLevel) {
        result = filterByStockLevel(result, filters.stockLevel);
    }
    
    // 3. Filtrar por rango de stock
    if (filters.minStock !== undefined || filters.maxStock !== undefined) {
        result = filterByStockRange(result, filters.minStock, filters.maxStock);
    }
    
    // 4. Filtrar por rango de precio
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        result = filterByPriceRange(result, filters.minPrice, filters.maxPrice);
    }
    
    // 5. Filtrar por categorías
    if (filters.categoryIds && filters.categoryIds.length > 0) {
        result = filterByCategories(result, filters.categoryIds);
    }
    
    // 6. Filtro personalizado (para casos especiales)
    if (filters.customFilter) {
        result = result.filter(filters.customFilter);
    }
    
    // 7. Ordenar
    if (filters.sortField) {
        result = sortProducts(result, filters.sortField, filters.sortOrder);
    }
    
    return result;
}

/**
 * @deprecated Usar applyStockFilters para mayor flexibilidad
 * Función legacy mantenida para compatibilidad con código existente
 */
export function filterStock(stock: Product[], filterState: string): Product[] {
    return applyStockFilters(stock, { search: filterState });
}

// Exportar funciones individuales para casos específicos
export {
    filterBySearch,
    filterByStockRange,
    filterByPriceRange,
    filterByCategories,
    filterByStockLevel,
    sortProducts
};
