import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'register' | 'login';

const BENEFITS = [
  'Tableau de bord intelligent mis à jour en temps réel',
  'Analyses avancées et prévisions budgétaires automatisées',
  'Sécurité de bout en bout et protocoles de chiffrement renforcés',
] as const;

function getPasswordStrength(pass: string) {
  if (!pass) return { score: 0, label: 'Vide', level: 'none' as const };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) return { score, label: 'Faible', level: 'weak' as const };
  if (score <= 4) return { score, label: 'Moyen', level: 'medium' as const };
  return { score, label: 'Excellent', level: 'strong' as const };
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('register');

  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const strength = getPasswordStrength(registerPassword);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      login(
        { email: loginEmail || 'demo@nkapflow.app', name: 'Utilisateur' },
        'demo-token'
      );
      setLoginLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="auth-register-page">
      <aside className="auth-benefits-panel" aria-label="Avantages Nkapflow">
        <div className="auth-benefits-glow auth-benefits-glow--blue" />
        <div className="auth-benefits-glow auth-benefits-glow--green" />

        <div className="auth-benefits-brand">Nkapflow</div>

        <div className="auth-benefits-content">
          <h1 className="auth-benefits-title">Vos avantages exclusifs</h1>
          <ul className="auth-benefits-list">
            {BENEFITS.map((text) => (
              <li key={text} className="auth-benefits-item">
                <span className="auth-benefits-check" aria-hidden>
                  ✓
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-benefits-footer">&copy; 2026 Nkapflow. Tous droits réservés.</p>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-card">
          {mode === 'register' ? (
            <>
              <header className="auth-form-header">
                <h2 className="auth-form-title">Créer un compte</h2>
                <p className="auth-form-subtitle">
                  Rejoignez notre plateforme de gestion financière nouvelle génération
                </p>
              </header>

              <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
                <div className="auth-form-fields">
                  <div className="auth-field-group">
                    <label htmlFor="register-name" className="register-label">
                      Nom complet
                    </label>
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="register-field"
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="register-email" className="register-label">
                      Adresse e-mail
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="register-field"
                      placeholder="john@exemple.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="register-password" className="register-label">
                      Mot de passe
                    </label>
                    <div className="register-password-wrap">
                      <input
                        id="register-password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="register-field register-field--password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="register-toggle-pwd"
                        onClick={() => setShowRegisterPassword((v) => !v)}
                      >
                        {showRegisterPassword ? 'Masquer' : 'Afficher'}
                      </button>
                    </div>

                    {registerPassword && (
                      <div className="register-strength">
                        <div className="register-strength-labels">
                          <span>Sécurité du mot de passe :</span>
                          <span className={`register-strength-text register-strength-text--${strength.level}`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="register-strength-bar">
                          <div
                            className={`register-strength-fill register-strength-fill--${strength.level}`}
                            style={{ width: `${(strength.score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="register-submit">
                  Créer mon compte
                </button>
              </form>

              <p className="auth-form-switch">
                Déjà inscrit ?{' '}
                <button type="button" className="auth-form-switch-link" onClick={() => setMode('login')}>
                  Se connecter
                </button>
              </p>
            </>
          ) : (
            <>
              <header className="auth-form-header">
                <h2 className="auth-form-title">Se connecter</h2>
                <p className="auth-form-subtitle">Connectez-vous à votre espace personnel</p>
              </header>

              <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
                <div className="auth-form-fields">
                  <div className="auth-field-group">
                    <label htmlFor="login-email" className="register-label">
                      Adresse e-mail
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="register-field"
                      placeholder="john@exemple.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="login-password" className="register-label">
                      Mot de passe
                    </label>
                    <div className="register-password-wrap">
                      <input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="register-field register-field--password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="register-toggle-pwd"
                        onClick={() => setShowLoginPassword((v) => !v)}
                      >
                        {showLoginPassword ? 'Masquer' : 'Afficher'}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="register-submit" disabled={loginLoading}>
                  {loginLoading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>

              <p className="auth-form-switch">
                Pas encore de compte ?{' '}
                <button type="button" className="auth-form-switch-link" onClick={() => setMode('register')}>
                  S&apos;inscrire
                </button>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
