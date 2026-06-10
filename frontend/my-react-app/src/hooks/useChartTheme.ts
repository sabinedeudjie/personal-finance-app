import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { C } from '../theme/colors';

export function useChartTheme() {
  const { theme } = useTheme();

  return useMemo(
    () => ({
      tickColor: theme === 'dark' ? C.t2 : '#5a6b62',
      gridColor: theme === 'dark' ? 'rgba(139, 168, 152, 0.08)' : 'rgba(26, 46, 34, 0.08)',
      doughnutBorder: theme === 'dark' ? C.bg : '#ffffff',
      lineFillStart: theme === 'dark' ? 'rgba(0, 230, 118, 0.35)' : 'rgba(0, 200, 83, 0.28)',
      lineFillMid: theme === 'dark' ? 'rgba(68, 138, 255, 0.12)' : 'rgba(68, 138, 255, 0.16)',
      lineFillEnd: theme === 'dark' ? 'rgba(5, 10, 4, 0)' : 'rgba(244, 247, 245, 0)',
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(5, 10, 4, 0.96)' : 'rgba(255, 255, 255, 0.98)',
        titleColor: C.green,
        bodyColor: theme === 'dark' ? C.t1 : '#1a2e22',
        borderColor: theme === 'dark' ? C.borderHover : 'rgba(0, 200, 83, 0.25)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
        titleFont: { family: "'DM Sans', sans-serif", size: 12, weight: 600 as const },
        bodyFont: { family: "'DM Sans', sans-serif", size: 13 },
      },
    }),
    [theme]
  );
}
