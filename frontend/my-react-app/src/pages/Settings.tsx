import React, { useState } from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';
import Input from '../components/ui/Input';
import Btn from '../components/ui/Btn';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { updateUser } from '../services/auth.api';

export default function Settings() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { email: email || user?.email || '', name, ...(user?.id ? { id: user.id } : {}) };
    
    if (user?.id) {
      try {
        await updateUser(user.id, { name, email });
      } catch (err) {
        console.error("Erreur mise à jour profil", err);
      }
    }
    
    localStorage.setItem('user', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    
    setPasswordError('');
    if (user?.id) {
      try {
        await updateUser(user.id, { password });
        setPasswordSaved(true);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSaved(false), 2500);
      } catch (err) {
        setPasswordError('Erreur lors de la modification du mot de passe.');
      }
    }
  };

  const sections = [
    { icon: User, title: 'Profil', desc: 'Informations personnelles de votre compte' },
    { icon: Bell, title: 'Notifications', desc: 'Alertes de budget et rappels mensuels' },
    { icon: Shield, title: 'Sécurité', desc: 'Mot de passe et authentification' },
    {
      icon: Palette,
      title: 'Apparence',
      desc: `Thème ${theme === 'dark' ? 'sombre' : 'clair'} Nkapflow`,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Paramètres</h1>
          <p className="dashboard-subtitle">Personnalisez votre expérience Nkapflow</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="settings-grid">
        {sections.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="settings-card">
            <div
              className="settings-card-icon"
              style={{ background: 'linear-gradient(135deg, var(--theme-green)33, var(--theme-blue)33)' }}
            >
              <Icon size={18} color="var(--theme-green)" />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <div className="transactions-layout">
        <div className="chart-card settings-form-card">
        <h2>Mon profil</h2>
        <form onSubmit={handleSave} className="settings-form">
          <Input label="Nom affiché" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span>Recevoir les alertes de dépassement de budget</span>
          </label>
          <div className="settings-theme-row">
            <span>Thème de l&apos;interface</span>
            <ThemeToggle />
          </div>
          <Btn type="submit" style={{ marginTop: 8 }}>
            Enregistrer les modifications
          </Btn>
          {saved && <p className="settings-saved">Profil mis à jour.</p>}
        </form>
      </div>

        <div className="chart-card settings-form-card">
        <h2>Sécurité</h2>
        <form onSubmit={handlePasswordSave} className="settings-form">
          <Input 
            label="Nouveau mot de passe" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Input 
            label="Confirmer le mot de passe" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <Btn type="submit" style={{ marginTop: 8 }} disabled={!password || password !== confirmPassword}>
            Modifier le mot de passe
          </Btn>
          {passwordError && <p className="text-danger" style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{passwordError}</p>}
          {passwordSaved && <p className="settings-saved">Mot de passe mis à jour avec succès.</p>}
        </form>
        </div>
      </div>
    </div>
  );
}
