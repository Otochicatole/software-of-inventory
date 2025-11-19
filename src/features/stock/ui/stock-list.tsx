import styles from "@/features/stock/styles/stock-list.module.css";
import { Product } from "@/core/types/product";
import { Trash2, Edit } from "lucide-react";

interface StockListProps {
  stock: Product[];
  onDelete?: (id: number) => void;
  onEdit?: (product: Product) => void;
}

export default function StockList({ stock, onDelete, onEdit }: StockListProps) {

  const handleDelete = (id: number) => {
    onDelete?.(id);
  }

  const handleEdit = (product: Product) => {
    onEdit?.(product);
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.stockTable} key={stock.length}>
        <thead>
          <tr>
            <th className={styles.alignLeft}>Nombre</th>
            <th className={styles.alignLeft}>Descripción</th>
            <th className={styles.alignCenter}>Categorías</th>
            <th className={styles.alignCenter}>Precio</th>
            <th className={styles.alignCenter}>Stock</th>
            <th className={styles.alignCenter}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item, index) => (
            <tr key={`${item.id}-${index}`} className={styles.stockRow}>
              <td className={styles.stockName}>{item.name}</td>
              <td className={styles.stockDescription}>
                {item.description || '—'}
              </td>
              <td className={styles.stockCategories}>
                <div className={styles.categoriesWrapper}>
                  {item.categories.length > 0 ? (
                    item.categories.map((cat) => (
                      <span key={cat.id} className={styles.categoryBadge}>
                        {cat.category.name}
                      </span>
                    ))
                  ) : (
                    <span className={styles.noCategory}>Sin categoría</span>
                  )}
                </div>
              </td>
              <td className={styles.stockPrice}>${item.price.toFixed(2)}</td>
              <td className={styles.stockStock}>
                <span className={`${styles.stockBadge} ${item.stock <= 10 ? styles.lowStock : item.stock > 50 ? styles.highStock : styles.mediumStock}`}>
                  {item.stock}
                </span>
              </td>
              <td className={styles.stockActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(item)}
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(item.id)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {stock.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hay productos para mostrar</p>
        </div>
      )}
    </div>
  );
}
