"use client";

import { useState, useMemo } from "react";
import { Sale } from "@/core/types/sale";
import { deleteSale } from "@/core/services/http/sales/delete.sale";
import SalesList from "./sales-list";
import SalesFilters from "./sales-filters";
import ActiveDateFilters from "./active-date-filters";
import FormCreateSale from "./form-create-sale";
import SaleDetails from "./sale-details";
import SaleConfirmDelete from "./sale-confirm-delete";
import Modal from "@/shared/ui/modal";
import { ModalSalesType } from "../enums/sales-enums";
import styles from "../styles/sales-page.module.css";
import { Plus, DollarSign, TrendingUp } from "lucide-react";

interface SalesPageProps {
    initialSales: Sale[];
}

export default function SalesPage({ initialSales }: SalesPageProps) {
    const [sales, setSales] = useState<Sale[]>(initialSales);
    const [modalType, setModalType] = useState<ModalSalesType | null>(null);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);

    const handleCreateSale = () => {
        setModalType(ModalSalesType.CreateSale);
    };

    const handleSaleCreated = () => {
        setModalType(null);
        window.location.reload();
    };

    const handleViewDetails = (sale: Sale) => {
        setSelectedSale(sale);
        setModalType(ModalSalesType.ViewDetails);
    };

    const handleRequestDelete = (id: number) => {
        const sale = sales.find(s => s.id === id);
        if (sale) {
            setSelectedSale(sale);
            setModalType(ModalSalesType.ConfirmDelete);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedSale) return;

        const success = await deleteSale(selectedSale.id);
        if (success) {
            setSales(sales.map(sale =>
                sale.id === selectedSale.id ? { ...sale, active: false } : sale
            ));
            setModalType(null);
            setSelectedSale(null);
        } else {
            alert('Error al anular la venta');
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedSale(null);
    };

    const handleFilterChange = (startDate: Date | null, endDate: Date | null) => {
        setStartDateFilter(startDate);
        setEndDateFilter(endDate);
    };

    const handleClearDateFilters = () => {
        setStartDateFilter(null);
        setEndDateFilter(null);
    };

    const filteredSales = useMemo(() => {
        let filtered = sales;

        if (startDateFilter || endDateFilter) {
            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale.date);

                if (startDateFilter && saleDate < startDateFilter) {
                    return false;
                }

                if (endDateFilter && saleDate > endDateFilter) {
                    return false;
                }

                return true;
            });
        } else {
            filtered = sales.filter(s => s.active);
        }

        return filtered;
    }, [sales, startDateFilter, endDateFilter]);

    const allActiveSales = sales.filter(s => s.active);
    const totalAllSales = allActiveSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalFilteredSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const hasActiveFilter = startDateFilter !== null || endDateFilter !== null;

    return (
        <>
            <header className={styles.header}>
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <DollarSign size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>
                                {hasActiveFilter ? 'Total Filtrado' : 'Total Ventas'}
                            </span>
                            <span className={styles.statValue}>
                                ${(hasActiveFilter ? totalFilteredSales : totalAllSales).toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <TrendingUp size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>
                                {hasActiveFilter ? 'Ventas en período' : 'Ventas Activas'}
                            </span>
                            <span className={styles.statValue}>
                                {hasActiveFilter ? filteredSales.length : allActiveSales.length}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.button}
                        onClick={handleCreateSale}
                    >
                        <Plus size={16} />
                        Nueva Venta
                    </button>
                    <SalesFilters onFilterChange={handleFilterChange} />
                </div>
            </header>

            <ActiveDateFilters
                startDate={startDateFilter}
                endDate={endDateFilter}
                onClearFilters={handleClearDateFilters}
            />

            <SalesList
                sales={hasActiveFilter ? filteredSales : sales}
                onDelete={handleRequestDelete}
                onViewDetails={handleViewDetails}
            />

            <Modal isOpen={modalType !== null} onClose={handleCloseModal}>
                {modalType === ModalSalesType.CreateSale && (
                    <FormCreateSale onSuccess={handleSaleCreated} />
                )}
                {modalType === ModalSalesType.ViewDetails && selectedSale && (
                    <SaleDetails sale={selectedSale} />
                )}
                {modalType === ModalSalesType.ConfirmDelete && selectedSale && (
                    <SaleConfirmDelete
                        sale={selectedSale}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
}

