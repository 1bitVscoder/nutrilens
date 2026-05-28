'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<string, React.CSSProperties> = {
  filled: {
    backgroundColor: 'var(--md-sys-color-primary)',
    color: 'var(--md-sys-color-on-primary)',
    border: 'none',
  },
  outlined: {
    backgroundColor: 'transparent',
    color: 'var(--md-sys-color-primary)',
    border: '1px solid var(--md-sys-color-outline)',
  },
  text: {
    backgroundColor: 'transparent',
    color: 'var(--md-sys-color-primary)',
    border: 'none',
  },
  tonal: {
    backgroundColor: 'var(--md-sys-color-secondary-container)',
    color: 'var(--md-sys-color-on-secondary-container)',
    border: 'none',
  },
  elevated: {
    backgroundColor: 'var(--md-sys-color-surface-container-low)',
    color: 'var(--md-sys-color-primary)',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
  },
};

const sizeStyles: Record<string, { padding: string; fontSize: string; height: string }> = {
  sm: { padding: '0 16px', fontSize: '13px', height: '36px' },
  md: { padding: '0 24px', fontSize: '14px', height: '40px' },
  lg: { padding: '0 32px', fontSize: '16px', height: '48px' },
};

export default function Button({
  variant = 'filled',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const sizeStyle = sizeStyles[size];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.96 }}
      whileHover={{ opacity: 0.92 }}
      transition={{ duration: 0.1 }}
      className={`ripple-container label-large ${className}`}
      style={{
        ...variantStyles[variant],
        ...{
          padding: sizeStyle.padding,
          fontSize: sizeStyle.fontSize,
          height: sizeStyle.height,
        },
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 500,
        letterSpacing: '0.1px',
        transition: 'background-color 0.2s, box-shadow 0.2s',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '64px',
      }}
    >
      {loading ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          style={{ animation: 'spin 0.8s linear infinite' }}
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="40"
            strokeDashoffset="10"
          />
        </svg>
      ) : (
        <>
          {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
