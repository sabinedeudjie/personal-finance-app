import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Btn from '../components/ui/Btn';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { register } from '../services/auth.api';
import styles from './Register.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Vide', color: 'var(--theme-border)', text: 'var(--theme-t3)' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Faible', color: 'var(--theme-red)', text: 'var(--theme-red)' };
    if (score <= 4) return { score, label: 'Moyen', color: '#f59e0b', text: '#f59e0b' };
    return { score, label: 'Excellent', color: 'var(--theme-green)', text: 'var(--theme-green)' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page} key={theme}>
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
            <h2 className={styles.heroTitle}>Vos avantages exclusifs</h2>
            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                <p className={styles.benefitText}>Tableau de bord intelligent mis à jour en temps réel.</p>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                <p className={styles.benefitText}>Analyses avancées et prévisions budgétaires automatisées.</p>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                <p className={styles.benefitText}>Sécurité de bout en bout et protocoles de chiffrement renforcés.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Panneau formulaire ── */}
        <div className={styles.formPanel}>
          <div className={styles.formInner}>
            <h1 className={styles.formTitle}>Créer un compte</h1>
            <p className={styles.formSubtitle}>Rejoignez notre plateforme nouvelle génération</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
              {error && (
                <div className={styles.error}>
                  {Array.isArray(error) ? error.join(', ') : error}
                </div>
              )}

              <div>
                <label className={styles.fieldLabel} htmlFor="reg-name">Nom complet</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Pierre Kamga"
                  style={{
                    width: '100%', padding: '13px 16px', borderRadius: 12,
                    border: '1px solid var(--theme-input-border)',
                    background: 'var(--theme-input-bg)',
                    color: 'var(--theme-t1)', fontSize: 14, boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label className={styles.fieldLabel} htmlFor="reg-email">Adresse e-mail</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  style={{
                    width: '100%', padding: '13px 16px', borderRadius: 12,
                    border: '1px solid var(--theme-input-border)',
                    background: 'var(--theme-input-bg)',
                    color: 'var(--theme-t1)', fontSize: 14, boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label className={styles.fieldLabel} htmlFor="reg-password">Mot de passe</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '13px 44px 13px 16px', borderRadius: 12,
                      border: '1px solid var(--theme-input-border)',
                      background: 'var(--theme-input-bg)',
                      color: 'var(--theme-t1)', fontSize: 14, boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePwd}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {password && (
                  <div style={{ marginTop: 12 }}>
                    <div className={styles.strengthRow}>
                      <span className={styles.strengthLabel}>Sécurité du mot de passe :</span>
                      <span style={{ color: strength.text }}>{strength.label}</span>
                    </div>
                    <div className={styles.strengthBar}>
                      <div
                        className={styles.strengthFill}
                        style={{
                          background: strength.color,
                          width: `${(strength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Btn onClick={handleSubmit} disabled={loading} style={{ justifyContent: 'center', padding: 14, marginTop: 12 }}>
                {loading ? (
                  <div style={{
                    width: 16, height: 16, border: '2px solid #05a04440',
                    borderTop: '2px solid #050A04', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </Btn>
            </form>

            <p className={styles.footer}>
              Déjà inscrit ?{' '}
              <button type="button" onClick={() => navigate('/login')} className={styles.footerLink}>
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
