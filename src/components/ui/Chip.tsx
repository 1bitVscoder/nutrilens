'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ChipProps {
  variant?: 'filter' | 'suggestion' | 'input' | 'assist';
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  icon?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export default function Chip({
  variant = 'filter',
  label,
  selected = false,
  onSelect,
  icon,
  onRemove,
  className = '',
}: ChipProps) {
  return (
    <motion.button
      onClick={onSelect}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: selected ? [1, 1.05, 1] : 1 }}
      transition={{ duration: 0.15 }}
      className={`label-large ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 16px',
        height: '32px',
        borderRadius: 'var(--md-sys-shape-corner-small)',
        border: selected
          ? '1px solid transparent'
          : '1px solid var(--md-sys-color-outline)',
        backgroundColor: selected
          ? 'var(--md-sys-color-secondary-container)'
          : 'transparent',
        color: selected
          ? 'var(--md-sys-color-on-secondary-container)'
          : 'var(--md-sys-color-on-surface-variant)',
        cursor: 'pointer',
        outline: 'none',
        transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      {selected && variant === 'filter' && (
        <motion.svg
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M6.75 12.15L3.6 9L2.55 10.05L6.75 14.25L15.75 5.25L14.7 4.2L6.75 12.15Z"
            fill="currentColor"
          />
        </motion.svg>
      )}
      {icon && !selected && <span style={{ display: 'flex' }}>{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            display: 'flex',
            cursor: 'pointer',
            marginLeft: '2px',
            opacity: 0.7,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.5 4.5L11.5 3.5L8 7L4.5 3.5L3.5 4.5L7 8L3.5 11.5L4.5 12.5L8 9L11.5 12.5L12.5 11.5L9 8L12.5 4.5Z" />
          </svg>
        </span>
      )}
    </motion.button>
  );
}
