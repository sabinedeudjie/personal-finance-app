import React from 'react';
import { C } from '../../theme/colors';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({ label, style, children, ...rest }: SelectProps) {
  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: '1px solid var(--input-border)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    ...style,
  };

  return (
    <div>
      {label && (
        <label
          style={{
            color: 'var(--text-muted)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 8,
          }}
        >
          {label}
        </label>
      )}
      <select
        {...rest}
        style={selectStyle}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--green)';
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--input-border)';
          rest.onBlur?.(e);
        }}
      >
        {children}
      </select>
    </div>
  );
}
