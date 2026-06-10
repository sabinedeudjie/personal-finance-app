import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Category } from '../../services/categories.api';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
  loading,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner" />
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="table-empty">
        <p>Aucune catégorie pour le moment.</p>
        <p className="table-empty-hint">Ajoutez votre première catégorie via le formulaire.</p>
      </div>
    );
  }

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'income' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((cat) => {
            const isIncome = cat.type === 'income';
            return (
              <tr key={cat.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{cat.icon || '📁'}</span>
                    <span>{cat.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`type-pill type-pill--${cat.type}`}>
                    {isIncome ? (
                      <ArrowDownLeft size={12} />
                    ) : (
                      <ArrowUpRight size={12} />
                    )}
                    {isIncome ? 'Revenu' : 'Dépense'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onEdit(cat)}
                      aria-label="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => onDelete(cat.id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
