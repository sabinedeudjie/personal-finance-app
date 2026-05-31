import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Btn from '../components/ui/Btn';
import ThemeToggle from '../components/ui/ThemeToggle';
import { getThemePalette } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const palette = getThemePalette(theme);
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      login({ email: email || 'demo@nkapflow.app', name: 'Utilisateur' }, 'demo-token');
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', background: palette.bg, display: 'flex', flexDirection: 'column' }}>
      <div className="auth-topbar">
        <ThemeToggle />
      </div>

      <div className="auth-layout" style={{ flex: 1, display: 'flex' }}>
        <div className="auth-panel auth-panel--hero">
          <div
            className="auth-glow auth-glow--green"
            style={{
              background: 'radial-gradient(circle,#00E67620,transparent 70%)',
            }}
          />
          <div
            className="auth-glow auth-glow--blue"
            style={{
              background: 'radial-gradient(circle,#448AFF18,transparent 70%)',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${palette.green}, ${palette.greenDim})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 24px ${palette.greenGlow}`,
              }}
            >
              <TrendingUp size={19} color="#050A04" strokeWidth={2.5} />
            </div>
            <span style={{ color: palette.t1, fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
              Nkapflow
            </span>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: 48,
                height: 2,
                background: `linear-gradient(90deg, ${palette.green}, ${palette.blue})`,
                borderRadius: 2,
                marginBottom: 28,
              }}
            />
            <h2
              style={{
                color: palette.t1,
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.18,
                marginBottom: 16,
                letterSpacing: '-0.03em',
              }}
            >
              Prenez le contrôle
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${palette.green}, ${palette.blue})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                de vos finances.
              </span>
            </h2>
            <p style={{ color: palette.t2, fontSize: 14, lineHeight: 1.7, maxWidth: 340 }}>
              Analysez vos dépenses, suivez vos revenus et atteignez vos objectifs avec une précision
              chirurgicale.
            </p>
          </div>
        </div>

        <div className="auth-panel auth-panel--form" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ width: '100%', maxWidth: 380 }}>
            <h1 style={{ color: palette.t1, fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>
              Bon retour
            </h1>
            <p style={{ color: palette.t2, fontSize: 13, marginBottom: 36 }}>Connectez-vous à votre espace personnel</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label
                  style={{
                    color: palette.t3,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  E-mail
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="vous@exemple.com"
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: 12,
                    border: `1px solid ${palette.inputBorder}`,
                    background: palette.inputBg,
                    color: palette.t1,
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label
                    style={{
                      color: palette.t3,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: palette.green, fontSize: 11, cursor: 'pointer' }}
                  >
                    Oublié ?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '13px 44px 13px 16px',
                      borderRadius: 12,
                      border: `1px solid ${palette.inputBorder}`,
                      background: palette.inputBg,
                      color: palette.t1,
                      fontSize: 14,
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: palette.t3,
                      cursor: 'pointer',
                      display: 'flex',
                    }}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Btn onClick={handleSubmit} disabled={loading} style={{ justifyContent: 'center', padding: 14, marginTop: 4 }}>
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

            <p style={{ color: palette.t2, fontSize: 12, textAlign: 'center', marginTop: 28 }}>
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: palette.green,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Syne', sans-serif",
                }}
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
