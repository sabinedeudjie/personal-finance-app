/** Palette Nkapflow — vert / bleu */
export type ThemeMode = 'dark' | 'light';

export const C = {
  bg: '#050A04',
  bgSurface: '#0a1208',
  card: '#0f1810',
  cardHover: '#141f16',
  border: 'rgba(0, 230, 118, 0.12)',
  borderHover: 'rgba(68, 138, 255, 0.28)',
  green: '#00E676',
  greenDim: '#00C853',
  greenGlow: 'rgba(0, 230, 118, 0.35)',
  blue: '#448AFF',
  blueDim: '#2979FF',
  blueGlow: 'rgba(68, 138, 255, 0.25)',
  red: '#FF5252',
  amber: '#FFB300',
  t1: '#F1F8F4',
  t2: '#8BA898',
  t3: '#4A6356',
  inputBg: 'rgba(255,255,255,0.04)',
  inputBorder: 'rgba(255,255,255,0.08)',
} as const;

export const LIGHT = {
  bg: '#f4f7f5',
  bgSurface: '#ffffff',
  card: '#ffffff',
  cardHover: '#f0f5f2',
  border: 'rgba(0, 200, 83, 0.18)',
  borderHover: 'rgba(68, 138, 255, 0.28)',
  green: '#00C853',
  greenDim: '#00A844',
  greenGlow: 'rgba(0, 200, 83, 0.2)',
  blue: '#2979FF',
  blueDim: '#1565C0',
  blueGlow: 'rgba(41, 121, 255, 0.18)',
  red: '#E53935',
  amber: '#FB8C00',
  t1: '#1a2e22',
  t2: '#5a6b62',
  t3: '#8a9a92',
  inputBg: 'rgba(0, 0, 0, 0.03)',
  inputBorder: 'rgba(0, 0, 0, 0.1)',
} as const;

export type ThemePalette = typeof C | typeof LIGHT;

export function getThemePalette(theme: ThemeMode): ThemePalette {
  return theme === 'dark' ? C : LIGHT;
}

export const CHART_CATEGORY_COLORS = [
  C.green,
  C.blue,
  '#00BFA5',
  '#69F0AE',
  '#82B1FF',
  '#40C4FF',
  '#18FFFF',
  '#B9F6CA',
] as const;

export const chartTooltipDefaults = {
  backgroundColor: 'rgba(5, 10, 4, 0.96)',
  titleColor: C.green,
  bodyColor: C.t1,
  borderColor: C.borderHover,
  borderWidth: 1,
  padding: 14,
  cornerRadius: 10,
  titleFont: { family: "'DM Sans', sans-serif", size: 12, weight: 600 },
  bodyFont: { family: "'DM Sans', sans-serif", size: 13 },
};
