"use client";

import { useState, useMemo } from "react";
import { Quotation } from "@/core/types/quotation";
import { deleteQuotation } from "@/core/services/http/quotations/delete.quotation";
import QuotationsList from "./quotations-list";
import QuotationsFilters from "./quotations-filters";
import QuotationsSearch from "./quotations-search";
import ActiveFilters from "./active-filters";
import FormCreateQuotation from "./form-create-quotation";
import QuotationDetails from "./quotation-details";
import QuotationConfirmDelete from "./quotation-confirm-delete";
import Modal from "@/shared/ui/modal";
import { ModalQuotationsType } from "../enums/quotations-enums";
import styles from "../styles/quotations-page.module.css";
import { Plus, FileText, TrendingUp } from "lucide-react";

interface QuotationsPageProps {
    initialQuotations: Quotation[];
}

export default function QuotationsPage({ initialQuotations }: QuotationsPageProps) {
    const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
    const [modalType, setModalType] = useState<ModalQuotationsType | null>(null);
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

    const handleCreateQuotation = () => {
        setModalType(ModalQuotationsType.CreateQuotation);
    };

    const handleQuotationCreated = () => {
        setModalType(null);
        window.location.reload();
    };

    const handleViewDetails = (quotation: Quotation) => {
        setSelectedQuotation(quotation);
        setModalType(ModalQuotationsType.ViewDetails);
    };

    const handleQuotationApproved = () => {
        setModalType(null);
        setSelectedQuotation(null);
        window.location.reload();
    };

    const handleRequestDelete = (id: number) => {
        const quotation = quotations.find(q => q.id === id);
        if (quotation) {
            setSelectedQuotation(quotation);
            setModalType(ModalQuotationsType.ConfirmDelete);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedQuotation) return;

        const success = await deleteQuotation(selectedQuotation.id);
        if (success) {
            setQuotations(quotations.filter(quotation => quotation.id !== selectedQuotation.id));
            setModalType(null);
            setSelectedQuotation(null);
        } else {
            alert('Error al eliminar la cotización');
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedQuotation(null);
    };

    const handleFilterChange = (filters: {
        startDate: Date | null;
        endDate: Date | null;
        status: 'all' | 'pending' | 'approved';
    }) => {
        setStartDateFilter(filters.startDate);
        setEndDateFilter(filters.endDate);
        setStatusFilter(filters.status);
    };

    const handleSearchChange = (search: string) => {
        setSearchFilter(search);
    };

    const handleClearDateFilters = () => {
        setStartDateFilter(null);
        setEndDateFilter(null);
    };

    const handleClearStatus = () => {
        setStatusFilter('all');
    };

    const filteredQuotations = useMemo(() => {
        let filtered = quotations;

        if (statusFilter === 'pending') {
            filtered = filtered.filter(q => !q.active);
        } else if (statusFilter === 'approved') {
            filtered = filtered.filter(q => q.active);
        }

        if (searchFilter.trim()) {
            const searchLower = searchFilter.toLowerCase();
            filtered = filtered.filter(quotation => {
                const idMatch = quotation.id.toString().includes(searchLower);
                const referenceMatch = quotation.reference.toLowerCase().includes(searchLower);
                const productsMatch = quotation.items.some(item =>
                    (item.productName?.toLowerCase().includes(searchLower) || false) ||
                    (item.product?.name.toLowerCase().includes(searchLower) || false)
                );
                return idMatch || referenceMatch || productsMatch;
            });
        }

        if (startDateFilter || endDateFilter) {
            filtered = filtered.filter(quotation => {
                const quotationDate = new Date(quotation.date);

                if (startDateFilter && quotationDate < startDateFilter) {
                    return false;
                }

                if (endDateFilter && quotationDate > endDateFilter) {
                    return false;
                }

                return true;
            });
        }

        return filtered;
    }, [quotations, startDateFilter, endDateFilter, searchFilter, statusFilter]);

    const totalAllQuotations = quotations.reduce((sum, quotation) => sum + quotation.totalAmount, 0);
    const totalFilteredQuotations = filteredQuotations.reduce((sum, quotation) => sum + quotation.totalAmount, 0);
    const hasActiveFilter = startDateFilter !== null || endDateFilter !== null || searchFilter !== "" || statusFilter !== 'all';

    return (
        <>
            <header className={styles.header}>
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <FileText size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>
                                {hasActiveFilter ? 'Total Filtrado' : 'Total Cotizaciones'}
                            </span>
                            <span className={styles.statValue}>
                                ${(hasActiveFilter ? totalFilteredQuotations : totalAllQuotations).toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <TrendingUp size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>
                                {hasActiveFilter ? 'Cotizaciones en período' : 'Total Cotizaciones'}
                            </span>
                            <span className={styles.statValue}>
                                {hasActiveFilter ? filteredQuotations.length : quotations.length}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        className={styles.button}
                        onClick={handleCreateQuotation}
                    >
                        <Plus size={16} />
                        Nueva Cotización
                    </button>
                    <QuotationsFilters 
                        onFilterChange={handleFilterChange}
                    />
                </div>
            </header>

            <ActiveFilters
                startDate={startDateFilter}
                endDate={endDateFilter}
                status={statusFilter}
                onClearDateFilters={handleClearDateFilters}
                onClearStatus={handleClearStatus}
            />

            <QuotationsSearch 
                value={searchFilter}
                onChange={handleSearchChange}
            />

            <QuotationsList
                quotations={filteredQuotations}
                onDelete={handleRequestDelete}
                onViewDetails={handleViewDetails}
            />

            <Modal isOpen={modalType !== null} onClose={handleCloseModal}>
                {modalType === ModalQuotationsType.CreateQuotation && (
                    <FormCreateQuotation onSuccess={handleQuotationCreated} />
                )}
                {modalType === ModalQuotationsType.ViewDetails && selectedQuotation && (
                    <QuotationDetails quotation={selectedQuotation} onApproved={handleQuotationApproved} />
                )}
                {modalType === ModalQuotationsType.ConfirmDelete && selectedQuotation && (
                    <QuotationConfirmDelete
                        quotation={selectedQuotation}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
}

