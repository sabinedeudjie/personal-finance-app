import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Btn from '../ui/Btn';
import Input from '../ui/Input';
import type { Transaction, Category } from '../../services/api';
import { C } from '../../theme/colors';

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

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: `1px solid ${C.inputBorder}`,
    background: C.inputBg,
    color: C.t1,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
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

      <div>
        <label className="field-label">Catégorie</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          style={selectStyle}
        >
          <option value="">Sans catégorie</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Description optionnelle"
          style={{ ...selectStyle, resize: 'vertical' }}
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
