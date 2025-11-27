"use client";

import { CompositeValidation } from "@/validations/input/composite-validation";
import { RegexValidation } from "@/validations/input/must-contain-at";
import styles from "@/features/stock/styles/form-add-stock.module.css"
import Input from "@/shared/ui/input";
import Select from "@/shared/ui/select";
import Textarea from "@/shared/ui/textarea";
import Button from "@/shared/ui/button";
import { useState, useEffect } from "react";
import { getCategories } from "@/core/services/http/categories/get.categories";
import { Category } from "@/core/types/category";
import { createProduct } from "@/core/services/http/products/create.product";
import { Product } from "@/core/types/product";

interface FormAddStockProps {
    onSuccess?: (product: Product) => void;
}

export default function FormAddStock({ onSuccess }: FormAddStockProps) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        stock: "",
        categoryIds: [] as number[]
    });
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "category") {
            setFormData(prev => ({
                ...prev,
                categoryIds: [Number(value)]
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description.trim() || null,
            stock: parseInt(formData.stock, 10),
            categoryIds: formData.categoryIds
        };

        const result = await createProduct(productData);

        if (result) {
            console.log("Producto creado:", result);
            setFormData({
                name: "",
                price: "",
                description: "",
                stock: "",
                categoryIds: []
            });
            onSuccess?.(result);
        } else {
            console.error("Error al crear el producto");
        }
    };

    const validator = new CompositeValidation([
        new RegexValidation(
            /^[a-zA-Z0-9 ]+$/,
            "Formato inválido.",
        ),
    ]);

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <>
            <h2 className={styles.title}>Agregar Producto</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    required
                    name="name"
                    type="text"
                    placeholder="Nombre del Producto"
                    value={formData.name}
                    onChange={handleChange}
                    validate={(value) => validator.validate(value)}
                />
                <Input
                    required
                    name="price"
                    type="number"
                    placeholder="Precio"
                    value={formData.price}
                    onChange={handleChange}
                />
                <Textarea
                    label="Descripción (opcional)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción del producto (opcional)"
                />
                <Input
                    required
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                />
                <Select
                    label="Categoría"
                    name="category"
                    options={categoryOptions}
                    value={formData.categoryIds[0] || ""}
                    onChange={handleChange}
                    placeholder="Selecciona una categoría"
                />
                <Button type="submit" variant="success" fullWidth>
                    Guardar Producto
                </Button>
            </form>
        </>
    );
}
