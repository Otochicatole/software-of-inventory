import { Sale } from "@/core/types/sale";
import styles from "../styles/sale-details.module.css";

interface SaleDetailsProps {
    sale: Sale;
}

export default function SaleDetails({ sale }: SaleDetailsProps) {
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

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Detalle de Venta #{sale.id}</h2>

            <div className={styles.info}>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>{formatDate(sale.date)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Estado:</span>
                    <span className={`${styles.status} ${sale.active ? styles.active : styles.inactive}`}>
                        {sale.active ? 'Activa' : 'Anulada'}
                    </span>
                </div>
            </div>

            <div className={styles.items}>
                <h3 className={styles.subtitle}>Productos</h3>
                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th className={styles.alignCenter}>Cantidad</th>
                            <th className={styles.alignRight}>Precio Unit.</th>
                            <th className={styles.alignRight}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.items.map((item) => (
                            <tr key={item.id}>
                                <td className={styles.productName}>
                                    {item.product?.name || `Producto ID ${item.productId}`}
                                </td>
                                <td className={styles.alignCenter}>{item.quantity}</td>
                                <td className={styles.alignRight}>${item.price.toFixed(2)}</td>
                                <td className={styles.alignRight}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.total}>
                <span className={styles.totalLabel}>Total:</span>
                <span className={styles.totalAmount}>${sale.totalAmount.toFixed(2)}</span>
            </div>
        </div>
    );
}

