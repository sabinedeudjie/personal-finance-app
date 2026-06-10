import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Btn from '../components/ui/Btn';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { login as apiLogin } from '../services/auth.api';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiLogin(email, password);
      login(data.user, data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <ThemeToggle />
      </div>

      <div className={styles.layout}>
        {/* ── Panneau héro ── */}
        <div className={styles.hero}>
          <div className={`${styles.glow} ${styles.glowGreen}`} />
          <div className={`${styles.glow} ${styles.glowBlue}`} />

          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <TrendingUp size={19} color="#050A04" strokeWidth={2.5} />
            </div>
            <span className={styles.brandName}>Nkapflow</span>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.divider} />
            <h2 className={styles.heroTitle}>
              Prenez le contrôle
              <br />
              <span key={theme} className={styles.heroGradientText}>
                de vos finances.
              </span>
            </h2>
            <p className={styles.heroDesc}>
              Analysez vos dépenses, suivez vos revenus et atteignez vos objectifs avec une
              précision chirurgicale.
            </p>
          </div>
        </div>

        {/* ── Panneau formulaire ── */}
        <div className={styles.formPanel}>
          <div className={styles.formInner}>
            <h1 className={styles.formTitle}>Bon retour</h1>
            <p className={styles.formSubtitle}>Connectez-vous à votre espace personnel</p>

            <div className={styles.fields}>
              {error && (
                <div className={styles.error}>
                  {Array.isArray(error) ? error.join(', ') : error}
                </div>
              )}

              <div>
                <label className={styles.fieldLabel} htmlFor="login-email">
                  E-mail
                </label>
                <input
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="vous@exemple.com"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--theme-input-border)',
                    background: 'var(--theme-input-bg)',
                    color: 'var(--theme-t1)',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <div className={styles.passwordRow}>
                  <label className={styles.fieldLabel} htmlFor="login-password">
                    Mot de passe
                  </label>
                  <button type="button" className={styles.forgotBtn}>
                    Oublié ?
                  </button>
                </div>
                <div className={styles.passwordWrapper}>
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '13px 44px 13px 16px',
                      borderRadius: 12,
                      border: '1px solid var(--theme-input-border)',
                      background: 'var(--theme-input-bg)',
                      color: 'var(--theme-t1)',
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className={styles.togglePwd}
                    aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Btn
                onClick={handleSubmit}
                disabled={loading}
                className={styles.submitBtn}
                style={{ justifyContent: 'center', padding: 14, marginTop: 4 }}
              >
                {loading ? (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid #05a04440',
                      borderTop: '2px solid #050A04',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </Btn>
            </div>

            <p className={styles.footer}>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className={styles.footerLink}
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
