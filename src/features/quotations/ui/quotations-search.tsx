"use client";

import { Search } from "lucide-react";
import styles from "../styles/quotations-search.module.css";

interface QuotationsSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function QuotationsSearch({ value, onChange }: QuotationsSearchProps) {
    return (
        <div className={styles.container}>
            <div className={styles.searchWrapper}>
                <Search size={20} className={styles.icon} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Buscar por ID, nombre o productos..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button
                        className={styles.clearButton}
                        onClick={() => onChange("")}
                        aria-label="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}

