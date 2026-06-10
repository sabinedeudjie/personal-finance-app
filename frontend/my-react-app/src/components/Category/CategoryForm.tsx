import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Btn from '../ui/Btn';
import Input from '../ui/Input';
import type { Category } from '../../services/categories.api';
import styles from './CategoryForm.module.css';

export interface CategoryFormValues {
  name: string;
  type: 'income' | 'expense';
  icon?: string;
}

interface CategoryFormProps {
  initial?: Category | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onCancel?: () => void;
}

const PRESET_EMOJIS = ['💰', '🍽️', '🚗', '🏠', '🛒', '⚕️', '🎓', '✈️', '👗', '📱', '💡', '🎮', '🎁', '🐶', '💼', '📈', '🏦', '🔧'];

const emptyForm = (): CategoryFormValues => ({
  name: '',
  type: 'expense',
  icon: '💰',
});

export default function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [form, setForm] = useState<CategoryFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, type: initial.type, icon: initial.icon || '💰' });
    } else {
      setForm(emptyForm());
    }
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError('Veuillez entrer un nom pour la catégorie.');
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
        <h3>{initial ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
        {onCancel && (
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Fermer le formulaire">
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
            onClick={() => setForm((prev) => ({ ...prev, type: t }))}
            aria-pressed={form.type === t}
          >
            {t === 'income' ? 'Revenu' : 'Dépense'}
          </button>
        ))}
      </div>

      <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
        <Input
          label="Nom de la catégorie"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Ex: Salaire, Loyer..."
          required
        />
      </div>

      <div className={styles.iconSection}>
        <label className={styles.iconLabel}>Icône</label>
        <div className={styles.emojiGrid}>
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`${styles.emojiBtn} ${form.icon === emoji ? styles.emojiBtnActive : styles.emojiBtnDefault}`}
              onClick={() => setForm((prev) => ({ ...prev, icon: emoji }))}
              aria-label={`Sélectionner l'icône ${emoji}`}
              aria-pressed={form.icon === emoji}
            >
              {emoji}
            </button>
          ))}
          <Input
            type="text"
            maxLength={2}
            value={!PRESET_EMOJIS.includes(form.icon || '') ? form.icon : ''}
            onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
            placeholder="Autre?"
            style={{ width: '90px', padding: '0.4rem', fontSize: '1rem', textAlign: 'center' }}
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <Btn type="submit" disabled={saving} style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
        <Plus size={16} />
        {saving ? 'Enregistrement...' : initial ? 'Mettre à jour' : 'Ajouter'}
      </Btn>
    </form>
  );
}
