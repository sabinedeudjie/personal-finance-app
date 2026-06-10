import React from 'react';
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '../../services/transactions.api';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  loading,
}: TransactionTableProps) {
  const formatMoney = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner" />
        <p>Chargement des transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="table-empty">
        <p>Aucune transaction pour le moment.</p>
        <p className="table-empty-hint">Ajoutez votre première opération via le formulaire.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Type</th>
            <th className="text-right">Montant</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <tr key={tx.id}>
                <td className="cell-muted">{formatDate(tx.date)}</td>
                <td>{tx.notes || '—'}</td>
                <td>
                  <span className="category-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    {tx.category?.icon ? <span>{tx.category.icon}</span> : null}
                    {tx.category?.name || 'Non classé'}
                  </span>
                </td>
                <td>
                  <span className={`type-pill type-pill--${tx.type}`}>
                    {isIncome ? (
                      <ArrowDownLeft size={12} />
                    ) : (
                      <ArrowUpRight size={12} />
                    )}
                    {isIncome ? 'Revenu' : 'Dépense'}
                  </span>
                </td>
                <td className={`text-right amount-cell amount-cell--${tx.type}`}>
                  {isIncome ? '+' : '-'}
                  {formatMoney(Number(tx.amount))}
                </td>
                <td className="text-right">
                  <div className="row-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => onEdit(tx)}
                      aria-label="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => onDelete(tx.id)}
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
