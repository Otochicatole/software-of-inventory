"use client";

import { Quotation } from "@/core/types/quotation";
import { approveQuotation } from "@/core/services/http/quotations/approve.quotation";
import { generateQuotationPDF } from "@/core/utils/generate-quotation-pdf";
import styles from "../styles/quotation-details.module.css";
import Button from "@/shared/ui/button";
import { CheckCircle, Download } from "lucide-react";
import { useState } from "react";

interface QuotationDetailsProps {
    quotation: Quotation;
    onApproved?: () => void;
}

export default function QuotationDetails({ quotation, onApproved }: QuotationDetailsProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

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

    const handleApprove = async () => {
        setLoading(true);
        setError("");
        const result = await approveQuotation(quotation.id);
        setLoading(false);
        
        if (result.success) {
            onApproved?.();
        } else {
            setError(result.error || 'Error al aprobar la cotización');
        }
    };

    const handleDownloadPDF = () => {
        generateQuotationPDF(quotation);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Detalle de Cotización #{quotation.id}</h2>

            <div className={styles.info}>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Cliente:</span>
                    <span className={styles.value}>{quotation.reference}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>{formatDate(quotation.date)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Estado:</span>
                    <span className={`${styles.status} ${quotation.active ? styles.approved : styles.pending}`}>
                        {quotation.active ? 'Aprobada' : 'Pendiente'}
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
                        {quotation.items.map((item) => (
                            <tr key={item.id}>
                                <td className={styles.productName}>
                                    {item.productName || item.product?.name || 'Producto eliminado'}
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
                <span className={styles.totalAmount}>${quotation.totalAmount.toFixed(2)}</span>
            </div>

            <div className={styles.actionsSection}>
                <Button
                    variant="primary"
                    onClick={handleDownloadPDF}
                    fullWidth
                >
                    <Download size={20} />
                    Descargar PDF
                </Button>
            </div>

            {!quotation.active && (
                <div className={styles.approveSection}>
                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}
                    <Button
                        variant="success"
                        onClick={handleApprove}
                        fullWidth
                        disabled={loading}
                    >
                        <CheckCircle size={20} />
                        {loading ? 'Aprobando...' : 'Aprobar Cotización y Crear Venta'}
                    </Button>
                    <p className={styles.approveNote}>
                        Al aprobar, se creará una venta y se descontará el stock de los productos.
                    </p>
                </div>
            )}
        </div>
    );
}

