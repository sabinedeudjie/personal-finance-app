import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import TransactionTable from '../components/Transaction/TransactionTable';
import TransactionForm, {
  type TransactionFormValues,
} from '../components/Transaction/TransactionForm';
import { useFinance } from '../context/FinanceContext';
import { getTransactions, type Transaction } from '../services/transactions.api';

export default function Transactions() {
  const {
    transactions,
    categories,
    loading,
    usingLocalStorage,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useFinance();
  const [editing, setEditing] = useState<Transaction | null>(null);

  const [search, setSearch] = useState('');
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>(transactions);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setDisplayedTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search.trim()) {
        setDisplayedTransactions(transactions);
        return;
      }
      setSearchLoading(true);
      try {
        const results = await getTransactions({ search });
        setDisplayedTransactions(results);
      } catch (err) {
        console.error("Erreur lors de la recherche des transactions", err);
      } finally {
        setSearchLoading(false);
      }
    };
    const timeout = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeout);
  }, [search, transactions]);

  const handleSubmit = async (values: TransactionFormValues) => {
    const payload = {
      amount: Number(values.amount),
      date: values.date,
      type: values.type,
      category_id: values.category_id || null,
      notes: values.notes || null,
    };

    if (editing) {
      await editTransaction(editing.id, payload);
    } else {
      await addTransaction(payload);
    }
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette transaction ?')) return;
    await removeTransaction(id);
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Transactions</h1>
          <p className="dashboard-subtitle">Gérez vos revenus et dépenses</p>
        </div>
      </div>

      {usingLocalStorage}

      <div className="transactions-layout">
        <div className="chart-card">
          <TransactionForm
            categories={categories}
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
        </div>
        <div className="chart-card transactions-table-card">
          <div className="chart-card-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Historique</h2>
                <p>{displayedTransactions.length} opération(s)</p>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Rechercher par description, date, montant, catégorie ou type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <TransactionTable
            transactions={displayedTransactions}
            loading={loading || searchLoading}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
