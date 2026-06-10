import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CategoryTable from '../components/Category/CategoryTable';
import CategoryForm, { type CategoryFormValues } from '../components/Category/CategoryForm';
import { useFinance } from '../context/FinanceContext';
import { getCategories, type Category } from '../services/categories.api';

export default function Categories() {
  const {
    categories,
    loading,
    addCategory,
    editCategory,
    removeCategory,
  } = useFinance();
  
  const [editing, setEditing] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [displayedCategories, setDisplayedCategories] = useState<Category[]>(categories);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setDisplayedCategories(categories);
  }, [categories]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search.trim()) {
        setDisplayedCategories(categories);
        return;
      }
      setSearchLoading(true);
      try {
        const results = await getCategories({ search });
        setDisplayedCategories(results);
      } catch (err) {
        console.error("Erreur lors de la recherche des catégories", err);
      } finally {
        setSearchLoading(false);
      }
    };
    const timeout = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeout);
  }, [search, categories]);

  const handleSubmit = async (values: CategoryFormValues) => {
    if (editing) {
      await editCategory(editing.id, values);
    } else {
      await addCategory(values);
    }
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    await removeCategory(id);
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Catégories</h1>
          <p className="dashboard-subtitle">Gérez vos catégories de revenus et dépenses</p>
        </div>
      </div>

      <div className="transactions-layout">
        <div className="chart-card">
          <CategoryForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
        </div>
        <div className="chart-card transactions-table-card">
          <div className="chart-card-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Liste des catégories</h2>
                <p>{displayedCategories.length} catégorie(s)</p>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Rechercher par nom ou type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <CategoryTable
            categories={displayedCategories}
            onEdit={setEditing}
            onDelete={handleDelete}
            loading={loading || searchLoading}
          />
        </div>
      </div>
    </div>
  );
}
