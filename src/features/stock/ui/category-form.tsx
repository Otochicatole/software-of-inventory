import { useState, useEffect } from "react";
import { Category } from "@/core/types/category";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";
import Button from "@/shared/ui/button";
import styles from "@/features/stock/styles/category-form.module.css";

interface CategoryFormProps {
    category?: Category | null;
    onSubmit: (data: { name: string; description: string }) => Promise<void>;
    onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || ""
            });
        } else {
            setFormData({ name: "", description: "" });
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
                <h3>{category ? "Editar Categoría" : "Nueva Categoría"}</h3>
            </div>

            <Input
                required
                name="name"
                type="text"
                placeholder="Nombre de la categoría"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
            />

            <Textarea
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción de la categoría (opcional)"
                disabled={isSubmitting}
            />

            <div className={styles.formActions}>
                <Button
                    type="button"
                    variant="danger"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="success"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Guardando..." : (category ? "Actualizar" : "Crear")}
                </Button>
            </div>
        </form>
    );
}

