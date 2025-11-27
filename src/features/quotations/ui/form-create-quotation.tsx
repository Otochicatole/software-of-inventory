"use client";

import { useState, useEffect } from "react";
import { Product } from "@/core/types/product";
import { CreateQuotationItem } from "@/core/types/quotation";
import { getProducts } from "@/core/services/http/products/get.products";
import { createQuotation } from "@/core/services/http/quotations/create.quotation";
import styles from "../styles/form-create-quotation.module.css";
import Button from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import ProductSearchInput from "@/features/sales/ui/product-search-input";
import { Trash2, FileText } from "lucide-react";

interface FormCreateQuotationProps {
    onSuccess?: () => void;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function FormCreateQuotation({ onSuccess }: FormCreateQuotationProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [reference, setReference] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchProducts = async () => {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts);
        };
        fetchProducts();
    }, []);

    const handleProductSelect = (product: Product, quantity: number) => {
        setError("");

        if (quantity <= 0) {
            setError("La cantidad debe ser mayor a 0");
            return;
        }

        const existingItem = cart.find(item => item.product.id === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity }]);
        }
    };

    const handleRemoveFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }

        setCart(cart.map(c =>
            c.product.id === productId
                ? { ...c, quantity: newQuantity }
                : c
        ));
        setError("");
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!reference.trim()) {
            setError("Debe ingresar el nombre del cliente");
            return;
        }

        if (cart.length === 0) {
            setError("Debe agregar al menos un producto");
            return;
        }

        setLoading(true);

        const quotationItems: CreateQuotationItem[] = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const result = await createQuotation(quotationItems, reference.trim());

        if (result) {
            setCart([]);
            setReference("");
            onSuccess?.();
        } else {
            setError("Error al crear la cotización.");
        }

        setLoading(false);
    };

    return (
        <>
            <h2 className={styles.title}>Nueva Cotización</h2>
            <div className={styles.container}>
                <div className={styles.productSelector}>
                    <h3 className={styles.subtitle}>Información del Cliente</h3>
                    <div className={styles.referenceInput}>
                        <Input
                            type="text"
                            placeholder="Nombre del cliente o referencia"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.productSelector}>
                    <h3 className={styles.subtitle}>Agregar Productos</h3>
                    <div className={styles.addProductForm}>
                        <ProductSearchInput
                            products={products}
                            onSelectProduct={handleProductSelect}
                            excludeProductIds={cart.map(item => item.product.id)}
                            placeholder="Buscar por nombre, categoría o descripción..."
                        />
                    </div>
                </div>

                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                <div className={styles.cart}>
                    <h3 className={styles.subtitle}>
                        <FileText size={20} />
                        Carrito ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                    </h3>

                    {cart.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>No hay productos en el carrito</p>
                        </div>
                    ) : (
                        <div className={styles.cartItems}>
                            {cart.map(item => (
                                <div key={item.product.id} className={styles.cartItem}>
                                    <div className={styles.cartItemInfo}>
                                        <span className={styles.cartItemName}>{item.product.name}</span>
                                        <span className={styles.cartItemPrice}>${item.product.price.toFixed(2)}</span>
                                    </div>
                                    <div className={styles.cartItemActions}>
                                        <input
                                            type="number"
                                            className={styles.quantityInput}
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value, 10))}
                                            min="1"
                                        />
                                        <span className={styles.cartItemSubtotal}>
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveFromCart(item.product.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.total}>
                        <span className={styles.totalLabel}>Total:</span>
                        <span className={styles.totalAmount}>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        variant="success"
                        fullWidth
                        disabled={cart.length === 0 || loading}
                    >
                        {loading ? 'Procesando...' : 'Crear Cotización'}
                    </Button>
                </div>
            </div>
        </>
    );
}

