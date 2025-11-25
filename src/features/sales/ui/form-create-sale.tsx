"use client";

import { useState, useEffect } from "react";
import { Product } from "@/core/types/product";
import { CreateSaleItem } from "@/core/types/sale";
import { getProducts } from "@/core/services/http/products/get.products";
import { createSale } from "@/core/services/http/sales/create.sale";
import styles from "../styles/form-create-sale.module.css";
import Button from "@/shared/ui/button";
import ProductSearchInput from "./product-search-input";
import { Trash2, ShoppingCart } from "lucide-react";

interface FormCreateSaleProps {
    onSuccess?: () => void;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function FormCreateSale({ onSuccess }: FormCreateSaleProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchProducts = async () => {
            const fetchedProducts = await getProducts();
            setProducts(fetchedProducts.filter(p => p.stock > 0));
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
        const currentCartQty = existingItem ? existingItem.quantity : 0;
        const totalQty = currentCartQty + quantity;

        if (totalQty > product.stock) {
            setError(`Stock insuficiente. Disponible: ${product.stock}, En carrito: ${currentCartQty}`);
            return;
        }

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
        const item = cart.find(c => c.product.id === productId);
        if (!item) return;

        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }

        if (newQuantity > item.product.stock) {
            setError(`Stock insuficiente para ${item.product.name}. Disponible: ${item.product.stock}`);
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

        if (cart.length === 0) {
            setError("Debe agregar al menos un producto");
            return;
        }

        setLoading(true);

        const saleItems: CreateSaleItem[] = cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const result = await createSale(saleItems);

        if (result) {
            setCart([]);
            onSuccess?.();
        } else {
            setError("Error al crear la venta. Verifica el stock disponible.");
        }

        setLoading(false);
    };

    return (
        <>
            <h2 className={styles.title}>Nueva Venta</h2>
            <div className={styles.container}>
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

                {/* Carrito */}
                <div className={styles.cart}>
                    <h3 className={styles.subtitle}>
                        <ShoppingCart size={20} />
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
                                            max={item.product.stock}
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

                {/* Total y acciones */}
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
                        {loading ? 'Procesando...' : 'Completar Venta'}
                    </Button>
                </div>
            </div>
        </>
    );
}

