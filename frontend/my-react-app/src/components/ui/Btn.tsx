import React from 'react';
import { C } from '../../theme/colors';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  children: React.ReactNode;
}

export default function Btn({
  variant = 'primary',
  children,
  style,
  disabled,
  ...rest
}: BtnProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    borderRadius: 12,
    border: 'none',
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    ...style,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${C.green}, ${C.greenDim})`,
      color: '#050A04',
      boxShadow: `0 6px 24px ${C.greenGlow}`,
    },
    ghost: {
      background: 'transparent',
      color: C.green,
      border: `1px solid ${C.border}`,
    },
    danger: {
      background: `linear-gradient(135deg, ${C.red}, #D32F2F)`,
      color: C.t1,
    },
  };

  return (
    <button type="button" disabled={disabled} style={{ ...base, ...variants[variant] }} {...rest}>
      {children}
    </button>
  );
}
