'use client';

import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  elevated: {
    backgroundColor: 'var(--md-sys-color-surface-container-low)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    border: 'none',
  },
  filled: {
    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
    border: 'none',
    boxShadow: 'none',
  },
  outlined: {
    backgroundColor: 'var(--md-sys-color-surface)',
    border: '1px solid var(--md-sys-color-outline-variant)',
    boxShadow: 'none',
  },
};

const paddingMap = { sm: '12px', md: '16px', lg: '24px' };

export default function Card({
  variant = 'elevated',
  children,
  onClick,
  className = '',
  padding = 'md',
  interactive = false,
}: CardProps) {
  const isClickable = interactive || !!onClick;

  return (
    <motion.div
      onClick={onClick}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      whileHover={isClickable ? { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } : undefined}
      transition={{ duration: 0.15 }}
      className={className}
      style={{
        ...variantStyles[variant],
        padding: paddingMap[padding],
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background-color 0.2s, box-shadow 0.2s',
      }}
    >
      {children}
    </motion.div>
  );
}
