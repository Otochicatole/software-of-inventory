"use client";
import { useState } from "react";
import StockList from "./stock-list";
import { useStockFilters } from "../hooks/use-stock-filters";
import { SortField, SortOrder } from "../enums/fileters-enums";
import { StockLevelFilter } from "../constants/stock-thresholds";
import SearchBar from "@/shared/components/search-bar";
import styles from "@/features/stock/styles/stock-page.module.css";
import Modal from "@/shared/ui/modal";
import FormAddStock from "@/features/stock/ui/form-add-stock";
import FormUpdateStock from "@/features/stock/ui/form-update-stock";
import CategoryManager from "@/features/stock/ui/category-manager";
import StockFiltersComponent from "@/features/stock/ui/stock-filters";
import { Product } from "@/core/types/product";
import { deleteProduct } from "@/core/services/http/products/delete.product";
import { ModalStockType } from "../enums/stock-enums";
import { Funnel, List, Plus } from "lucide-react";

export default function StockPage({ stock: initialStock }: { stock: Product[] }) {
    const [modalType, setModalType] = useState<ModalStockType | null>(null);
    const [stock, setStock] = useState<Product[]>(initialStock);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const {
        filteredProducts,
        setSearch,
        setSort,
        setStockLevel,
        setStockRange,
        resetFilters,
        filters
    } = useStockFilters(stock, {
        sortField: SortField.Name,
        sortOrder: SortOrder.Ascending,
        stockLevel: StockLevelFilter.All
    });

    const handleProductCreated = (newProduct: Product) => {
        setStock(prevStock => [...prevStock, newProduct]);
        setModalType(null);
    };

    const handleProductEdit = (product: Product) => {
        setSelectedProduct(product);
        setModalType(ModalStockType.Update);
    };

    const handleProductUpdated = (updatedProduct: Product) => {
        setStock(prevStock =>
            prevStock.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        setModalType(null);
        setSelectedProduct(null);
    };

    const handleProductDeleted = async (id: number) => {
        const result = await deleteProduct(id);
        if (result) {
            setStock(prevStock => prevStock.filter(product => product.id !== id));
        }
    }

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedProduct(null);
    };


    return (
        <>
            <header className={styles.header}>
                <SearchBar
                    placeholder="Buscar Producto..."
                    style={{ minWidth: "800px" }}
                    onChange={setSearch}
                    value={filters.search || ""}
                />
                <button
                    className={styles.Button}
                    onClick={() => setModalType(ModalStockType.Stock)}>
                    Agregar Stock <Plus size={13} />
                </button>
                <button
                    className={styles.Button}
                    onClick={() => setModalType(ModalStockType.Category)}>
                    Categorias <List size={13} />
                </button>
                <button
                    className={styles.Button}
                    onClick={() => setModalType(ModalStockType.Filters)}>
                    Filtros <Funnel size={13} />
                </button>
            </header>
            <StockList
                stock={filteredProducts}
                onDelete={handleProductDeleted}
                onEdit={handleProductEdit}
            />
            <Modal isOpen={modalType !== null} onClose={handleCloseModal}>
                {modalType === ModalStockType.Stock && (
                    <FormAddStock onSuccess={handleProductCreated} />
                )}
                {modalType === ModalStockType.Update && selectedProduct && (
                    <FormUpdateStock
                        product={selectedProduct}
                        onSuccess={handleProductUpdated}
                    />
                )}
                {modalType === ModalStockType.Category && (
                    <CategoryManager />
                )}
                {modalType === ModalStockType.Filters && (
                    <StockFiltersComponent
                        filters={filters}
                        onSortChange={setSort}
                        onStockLevelChange={setStockLevel}
                        onStockRangeChange={setStockRange}
                        onResetFilters={resetFilters}
                    />
                )}
            </Modal>
        </>
    );
}
