/**
 * Constantes para el módulo de ventas
 */

export const SALES_CONFIG = {
    MAX_ITEMS_PER_SALE: 50,
    MIN_SALE_AMOUNT: 0,
    CURRENCY_SYMBOL: '$',
    DATE_FORMAT: 'DD/MM/YYYY HH:mm',
} as const;

export const SALES_MESSAGES = {
    SUCCESS_CREATE: 'Venta creada exitosamente',
    SUCCESS_DELETE: 'Venta anulada exitosamente',
    ERROR_CREATE: 'Error al crear la venta',
    ERROR_DELETE: 'Error al anular la venta',
    ERROR_INSUFFICIENT_STOCK: 'Stock insuficiente para completar la venta',
    ERROR_NO_ITEMS: 'Debe agregar al menos un producto',
    CONFIRM_DELETE: '¿Estás seguro de anular esta venta?',
} as const;

