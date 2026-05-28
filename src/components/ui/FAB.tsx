'use client';

import React from 'react';
import { motion } from 'motion/react';

interface FABProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  className?: string;
  extended?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--md-sys-color-primary-container)',
    color: 'var(--md-sys-color-on-primary-container)',
  },
  secondary: {
    backgroundColor: 'var(--md-sys-color-secondary-container)',
    color: 'var(--md-sys-color-on-secondary-container)',
  },
  tertiary: {
    backgroundColor: 'var(--md-sys-color-tertiary-container)',
    color: 'var(--md-sys-color-on-tertiary-container)',
  },
  surface: {
    backgroundColor: 'var(--md-sys-color-surface-container-high)',
    color: 'var(--md-sys-color-primary)',
  },
};

const sizeMap = {
  sm: { size: '40px', iconSize: '24px' },
  md: { size: '56px', iconSize: '24px' },
  lg: { size: '96px', iconSize: '36px' },
};

export default function FAB({
  icon,
  label,
  onClick,
  size = 'md',
  variant = 'primary',
  className = '',
  extended = false,
}: FABProps) {
  const s = sizeMap[size];

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.15 }}
      className={`label-large ${className}`}
      style={{
        ...variantStyles[variant],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: extended ? '12px' : '0',
        width: extended ? 'auto' : s.size,
        height: s.size,
        padding: extended ? '0 20px' : '0',
        borderRadius: 'var(--md-sys-shape-corner-large)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 3px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        outline: 'none',
        transition: 'box-shadow 0.2s',
        fontSize: s.iconSize,
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </span>
      {extended && label && <span>{label}</span>}
    </motion.button>
  );
}
