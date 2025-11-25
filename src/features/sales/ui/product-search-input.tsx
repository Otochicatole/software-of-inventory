"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/core/types/product";
import { Search, X } from "lucide-react";
import styles from "../styles/product-search-input.module.css";

interface ProductSearchInputProps {
    products: Product[];
    onSelectProduct: (product: Product, quantity: number) => void;
    excludeProductIds?: number[];
    placeholder?: string;
}

export default function ProductSearchInput({
    products,
    onSelectProduct,
    excludeProductIds = [],
    placeholder = "Buscar producto..."
}: ProductSearchInputProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [quantities, setQuantities] = useState<Map<number, string>>(new Map());
    const [shouldPreventOpen, setShouldPreventOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredProducts = products
        .filter(p => !excludeProductIds.includes(p.id))
        .filter(p => {
            const search = searchTerm.toLowerCase().trim();
            if (!search) return true;

            return (
                p.name.toLowerCase().includes(search) ||
                (p.description && p.description.toLowerCase().includes(search)) ||
                p.categories.some(cat => cat.category.name.toLowerCase().includes(search))
            );
        })
        .slice(0, 10);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [searchTerm]);

    const handleQuantityChange = (productId: number, value: string) => {
        const newMap = new Map(quantities);
        if (value === "" || parseInt(value) <= 0) {
            newMap.delete(productId);
        } else {
            newMap.set(productId, value);
        }
        setQuantities(newMap);
    };

    const handleAddProduct = (product: Product) => {
        const qty = parseInt(quantities.get(product.id) || "1", 10);
        onSelectProduct(product, qty);

        const newMap = new Map(quantities);
        newMap.delete(product.id);
        setQuantities(newMap);

        setIsOpen(false);
        setSearchTerm("");
        setShouldPreventOpen(true);

        setTimeout(() => {
            setShouldPreventOpen(false);
            inputRef.current?.focus();
        }, 200);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && e.key !== "Escape") {
            if (!shouldPreventOpen) {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredProducts.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case "Enter":
                e.preventDefault();
                if (filteredProducts[highlightedIndex]) {
                    handleAddProduct(filteredProducts[highlightedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearchTerm("");
                break;
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        inputRef.current?.focus();
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <label className={styles.label}>Producto</label>
            <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        if (!shouldPreventOpen) {
                            setIsOpen(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                {searchTerm && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClearSearch}
                        aria-label="Limpiar búsqueda"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {filteredProducts.length === 0 ? (
                        <div className={styles.emptyState}>
                            {searchTerm
                                ? "No se encontraron productos"
                                : "No hay productos disponibles"}
                        </div>
                    ) : (
                        <ul className={styles.productList}>
                            {filteredProducts.map((product, index) => {
                                const currentQty = quantities.get(product.id) || "1";

                                return (
                                    <li
                                        key={product.id}
                                        className={`${styles.productItem} ${index === highlightedIndex ? styles.highlighted : ""
                                            }`}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <div className={styles.productMainInfo}>
                                            <div className={styles.productInfo}>
                                                <span className={styles.productName}>{product.name}</span>
                                                {product.categories.length > 0 && (
                                                    <div className={styles.categories}>
                                                        {product.categories.map(cat => (
                                                            <span key={cat.id} className={styles.categoryTag}>
                                                                {cat.category.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.productDetails}>
                                                <span className={styles.price}>${product.price.toFixed(2)}</span>
                                                <span className={styles.stock}>
                                                    Stock: {product.stock}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.quantityControls} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="number"
                                                className={styles.quantityInputField}
                                                value={currentQty}
                                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                placeholder="1"
                                                min="1"
                                                max={product.stock}
                                            />
                                            <button
                                                type="button"
                                                className={styles.addButton}
                                                onClick={() => handleAddProduct(product)}
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
