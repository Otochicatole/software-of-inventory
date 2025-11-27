import { Sale } from "@/core/types/sale";
import styles from "../styles/sales-list.module.css";
import { Trash2, Eye } from "lucide-react";

interface SalesListProps {
    sales: Sale[];
    onDelete?: (id: number) => void;
    onViewDetails?: (sale: Sale) => void;
}

export default function SalesList({ sales, onDelete, onViewDetails }: SalesListProps) {
    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        onDelete?.(id);
    };

    const handleViewDetails = (sale: Sale) => {
        onViewDetails?.(sale);
    };

    const handleRowClick = (sale: Sale) => {
        handleViewDetails(sale);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.salesTable} key={sales.length}>
                <thead>
                    <tr>
                        <th className={styles.alignCenter}>ID</th>
                        <th className={styles.alignLeft}>Fecha y Hora</th>
                        <th className={styles.alignCenter}>Productos</th>
                        <th className={styles.alignCenter}>Total</th>
                        <th className={styles.alignCenter}>Estado</th>
                        <th className={styles.alignCenter}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr 
                            key={sale.id} 
                            className={styles.salesRow}
                            onClick={() => handleRowClick(sale)}
                        >
                            <td className={styles.saleId}>#{sale.id}</td>
                            <td className={styles.saleDate}>
                                {formatDate(sale.date)}
                            </td>
                            <td className={styles.saleItems}>
                                <span className={styles.itemsCount}>
                                    {sale.items.length} {sale.items.length === 1 ? 'producto' : 'productos'}
                                </span>
                            </td>
                            <td className={styles.saleTotal}>
                                ${sale.totalAmount.toFixed(2)}
                            </td>
                            <td className={styles.saleStatus}>
                                <span className={`${styles.statusBadge} ${sale.active ? styles.active : styles.inactive}`}>
                                    {sale.active ? 'Activa' : 'Anulada'}
                                </span>
                            </td>
                            <td className={styles.saleActions}>
                                <button
                                    className={styles.viewButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(sale);
                                    }}
                                    title="Ver detalles"
                                >
                                    <Eye size={16} />
                                </button>
                                {sale.active && (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDelete(e, sale.id)}
                                        title="Anular venta"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {sales.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No hay ventas registradas</p>
                </div>
            )}
        </div>
    );
}

