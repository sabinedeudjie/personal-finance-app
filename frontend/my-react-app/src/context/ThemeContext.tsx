import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { C, LIGHT, getThemePalette } from '../theme/colors';
import type { ThemeMode } from '../theme/colors';

export type { ThemeMode };

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const STORAGE_KEY = 'nkapflow-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

/** Injecte la palette active comme variables CSS sur :root */
function applyThemeCssVars(theme: ThemeMode) {
  const palette = getThemePalette(theme);
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', palette.bg);
  root.style.setProperty('--theme-bg-surface', palette.bgSurface);
  root.style.setProperty('--theme-card', palette.card);
  root.style.setProperty('--theme-card-hover', palette.cardHover);
  root.style.setProperty('--theme-border', palette.border);
  root.style.setProperty('--theme-border-hover', palette.borderHover);
  root.style.setProperty('--theme-green', palette.green);
  root.style.setProperty('--theme-green-dim', palette.greenDim);
  root.style.setProperty('--theme-green-glow', palette.greenGlow);
  root.style.setProperty('--theme-blue', palette.blue);
  root.style.setProperty('--theme-blue-dim', palette.blueDim);
  root.style.setProperty('--theme-blue-glow', palette.blueGlow);
  root.style.setProperty('--theme-red', palette.red);
  root.style.setProperty('--theme-amber', palette.amber);
  root.style.setProperty('--theme-t1', palette.t1);
  root.style.setProperty('--theme-t2', palette.t2);
  root.style.setProperty('--theme-t3', palette.t3);
  root.style.setProperty('--theme-input-bg', palette.inputBg);
  root.style.setProperty('--theme-input-border', palette.inputBorder);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    applyThemeCssVars(theme);
  }, [theme]);

  // Appliquer immédiatement au premier rendu (avant paint)
  useMemo(() => applyThemeCssVars(theme), [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/** Variables CSS statiques (valeurs dark par défaut, pour l'auto-complétion) */
export const THEME_VARS = {
  bg: 'var(--theme-bg)',
  bgSurface: 'var(--theme-bg-surface)',
  card: 'var(--theme-card)',
  cardHover: 'var(--theme-card-hover)',
  border: 'var(--theme-border)',
  borderHover: 'var(--theme-border-hover)',
  green: 'var(--theme-green)',
  greenDim: 'var(--theme-green-dim)',
  greenGlow: 'var(--theme-green-glow)',
  blue: 'var(--theme-blue)',
  blueDim: 'var(--theme-blue-dim)',
  blueGlow: 'var(--theme-blue-glow)',
  red: 'var(--theme-red)',
  amber: 'var(--theme-amber)',
  t1: 'var(--theme-t1)',
  t2: 'var(--theme-t2)',
  t3: 'var(--theme-t3)',
  inputBg: 'var(--theme-input-bg)',
  inputBorder: 'var(--theme-input-border)',
} as const;

// Supprimer les avertissements TS pour les imports non utilisés
void C; void LIGHT;
