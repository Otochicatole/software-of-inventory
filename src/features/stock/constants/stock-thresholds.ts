/**
 * Constantes para umbrales de stock
 * Estos valores definen qué se considera stock bajo, medio y alto
 */

export const STOCK_THRESHOLDS = {
    LOW: 10,      // Stock <= 10 se considera bajo
    MEDIUM: 50,   // Stock entre 11-50 se considera medio
    HIGH: 50      // Stock > 50 se considera alto
} as const;

/**
 * Enum para filtros rápidos de stock
 */
export enum StockLevelFilter {
    All = "all",
    Low = "low",      // Stock bajo (crítico)
    High = "high"     // Stock alto (bien abastecido)
}

