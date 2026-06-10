import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Btn from '../ui/Btn';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import type { Transaction } from '../../services/transactions.api';
import type { Category } from '../../services/categories.api';

export interface TransactionFormValues {
  amount: string;
  date: string;
  type: 'income' | 'expense';
  category_id: string;
  notes: string;
}

interface TransactionFormProps {
  categories: Category[];
  initial?: Transaction | null;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  onCancel?: () => void;
}

const emptyForm = (): TransactionFormValues => ({
  amount: '',
  date: new Date().toISOString().split('T')[0],
  type: 'expense',
  category_id: '',
  notes: '',
});

export default function TransactionForm({
  categories,
  initial,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [form, setForm] = useState<TransactionFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        amount: String(initial.amount),
        date: initial.date.split('T')[0],
        type: initial.type,
        category_id: initial.category_id || '',
        notes: initial.notes || '',
      });
    } else {
      setForm(emptyForm());
    }
  }, [initial]);

  const incomes = categories.filter((c) => c.type === 'income');
  const expenses = categories.filter((c) => c.type === 'expense');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'category_id' && value) {
      const selectedCategory = categories.find((c) => c.id === value);
      if (selectedCategory) {
        setForm((prev) => ({ ...prev, [name]: value, type: selectedCategory.type }));
        return;
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Indiquez un montant valide.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
      if (!initial) setForm(emptyForm());
    } catch {
      setError('Enregistrement impossible. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{initial ? 'Modifier la transaction' : 'Nouvelle transaction'}</h3>
        {onCancel && (
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Fermer">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="type-toggle">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={`type-toggle-btn ${form.type === t ? 'type-toggle-btn--active' : ''}`}
            onClick={() => setForm((prev) => ({ ...prev, type: t, category_id: '' }))}
          >
            {t === 'income' ? 'Revenu' : 'Dépense'}
          </button>
        ))}
      </div>

      <div className="form-grid">
        <Input
          label="Montant (XAF)"
          name="amount"
          type="number"
          min="0"
          step="1"
          value={form.amount}
          onChange={handleChange}
          placeholder="0"
          required
        />
        <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
      </div>

      <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
        <Select
          label="Catégorie"
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
        >
          <option value="">Sans catégorie</option>
          {expenses.length > 0 && (
            <optgroup label="Dépenses">
              {expenses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}{c.name}
                </option>
              ))}
            </optgroup>
          )}
          {incomes.length > 0 && (
            <optgroup label="Revenus">
              {incomes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}{c.name}
                </option>
              ))}
            </optgroup>
          )}
        </Select>
      </div>

      <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
        <Textarea
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Description optionnelle"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <Btn type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
        <Plus size={16} />
        {saving ? 'Enregistrement...' : initial ? 'Mettre à jour' : 'Ajouter'}
      </Btn>
    </form>
  );
}
