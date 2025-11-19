# Guía de Migración - Sistema de Filtros

Esta guía te ayudará a migrar del antiguo `filterStock` al nuevo sistema de filtros.

## 🔄 Código Anterior vs Nuevo

### Antes (Old)
```typescript
import { filterStock } from "../utils/filter-stock";

function StockPage({ stock }: { stock: Product[] }) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const filteredStocks = filterStock(stock, searchTerm);
    
    return <StockList stock={filteredStocks} />;
}
```

### Opción 1: Migración Mínima (Mantener compatibilidad)
```typescript
import { filterStock } from "../utils/filter-stock";

// El código sigue funcionando exactamente igual
// filterStock() sigue disponible para compatibilidad
```

### Opción 2: Usar nueva función (Recomendado)
```typescript
import { applyStockFilters } from "../utils/filter-stock";

function StockPage({ stock }: { stock: Product[] }) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    const filteredStocks = applyStockFilters(stock, { 
        search: searchTerm 
    });
    
    return <StockList stock={filteredStocks} />;
}
```

### Opción 3: Usar hook personalizado (Más Potente)
```typescript
import { useStockFilters } from "../hooks/use-stock-filters";
import { SortField, SortOrder } from "../types/stock-filter-types";

function StockPage({ stock }: { stock: Product[] }) {
    const {
        filteredProducts,
        setSearch,
        setSort,
        setStockRange,
        filters,
        filteredCount,
        totalProducts
    } = useStockFilters(stock, {
        sortField: SortField.Name,
        sortOrder: SortOrder.Ascending
    });
    
    return (
        <>
            <SearchBar onChange={setSearch} />
            
            <select onChange={(e) => setSort(e.target.value as SortField)}>
                <option value={SortField.Name}>Nombre</option>
                <option value={SortField.Price}>Precio</option>
                <option value={SortField.Stock}>Stock</option>
            </select>
            
            <div>
                Mostrando {filteredCount} de {totalProducts} productos
            </div>
            
            <StockList stock={filteredProducts} />
        </>
    );
}
```

## 🚀 Casos de Uso Avanzados

### Agregar Filtro de Stock Bajo
```typescript
const {
    filteredProducts,
    setSearch,
    updateFilters
} = useStockFilters(stock);

// Botón para ver solo stock bajo
<button onClick={() => updateFilters({ maxStock: 10 })}>
    Ver Stock Bajo
</button>

// Botón para resetear
<button onClick={() => updateFilters({ maxStock: undefined })}>
    Ver Todos
</button>
```

### Filtro por Categoría
```typescript
const {
    filteredProducts,
    setCategories
} = useStockFilters(stock);

<CategorySelector 
    onChange={(ids) => setCategories(ids)}
/>
```

### Filtro por Rango de Precio
```typescript
const {
    filteredProducts,
    setPriceRange
} = useStockFilters(stock);

<PriceRangeSlider 
    onChange={(min, max) => setPriceRange(min, max)}
/>
```

### Múltiples Filtros Combinados
```typescript
const {
    filteredProducts,
    setSearch,
    setSort,
    setStockRange,
    setCategories,
    filters
} = useStockFilters(stock);

return (
    <div>
        <SearchBar onChange={setSearch} />
        
        <FilterPanel>
            <SortSelector onChange={(field, order) => setSort(field, order)} />
            <StockRangeFilter onChange={(min, max) => setStockRange(min, max)} />
            <CategoryFilter onChange={setCategories} />
        </FilterPanel>
        
        <ActiveFilters filters={filters} />
        <StockList stock={filteredProducts} />
    </div>
);
```

## 📊 Ejemplo Completo con UI

```typescript
function StockPage({ stock }: { stock: Product[] }) {
    const {
        filteredProducts,
        setSearch,
        setSort,
        setStockRange,
        filters,
        filteredCount,
        totalProducts,
        resetFilters
    } = useStockFilters(stock, {
        sortField: SortField.Name,
        sortOrder: SortOrder.Ascending
    });

    return (
        <div className={styles.container}>
            {/* Header con búsqueda */}
            <header className={styles.header}>
                <SearchBar 
                    value={filters.search || ""}
                    onChange={setSearch} 
                />
                
                <select 
                    value={filters.sortField || ""}
                    onChange={(e) => setSort(
                        e.target.value as SortField,
                        filters.sortOrder
                    )}
                >
                    <option value="">Sin ordenar</option>
                    <option value={SortField.Name}>Nombre</option>
                    <option value={SortField.Price}>Precio</option>
                    <option value={SortField.Stock}>Stock</option>
                </select>
                
                <button onClick={resetFilters}>
                    Limpiar Filtros
                </button>
            </header>

            {/* Filtros adicionales */}
            <aside className={styles.filters}>
                <h3>Filtros</h3>
                
                <div>
                    <label>Stock Mínimo</label>
                    <input 
                        type="number" 
                        onChange={(e) => setStockRange(
                            Number(e.target.value),
                            filters.maxStock
                        )}
                    />
                </div>
                
                <div>
                    <label>Stock Máximo</label>
                    <input 
                        type="number" 
                        onChange={(e) => setStockRange(
                            filters.minStock,
                            Number(e.target.value)
                        )}
                    />
                </div>
            </aside>

            {/* Resultados */}
            <main>
                <p>
                    Mostrando {filteredCount} de {totalProducts} productos
                </p>
                
                <StockList stock={filteredProducts} />
            </main>
        </div>
    );
}
```

## ✅ Beneficios de la Migración

1. **Más Flexible**: Múltiples tipos de filtros
2. **Mejor Performance**: Memorización con useMemo
3. **Type-Safe**: TypeScript completo
4. **Mantenible**: Código más limpio y organizado
5. **Extensible**: Fácil agregar nuevos filtros
6. **Reutilizable**: Hook puede usarse en múltiples componentes

## 🔗 Compatibilidad

- ✅ `filterStock()` sigue funcionando (legacy)
- ✅ Código existente NO necesita cambios
- ✅ Migración gradual posible
- ✅ Sin breaking changes

