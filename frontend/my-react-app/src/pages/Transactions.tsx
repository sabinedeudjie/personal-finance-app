import React, { useState } from 'react';
import TransactionTable from '../components/Transaction/TransactionTable';
import TransactionForm, {
  type TransactionFormValues,
} from '../components/Transaction/TransactionForm';
import { useFinance } from '../context/FinanceContext';

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
  const [editing, setEditing] = useState<(typeof transactions)[number] | null>(null);

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

      {usingLocalStorage && (
        <div className="api-notice">
          Mode local actif — chaque ajout met à jour vos compteurs instantanément.
        </div>
      )}

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
          <div className="chart-card-header">
            <div>
              <h2>Historique</h2>
              <p>{transactions.length} opération(s)</p>
            </div>
          </div>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
