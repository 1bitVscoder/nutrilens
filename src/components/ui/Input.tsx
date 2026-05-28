'use client';

import React, { useState, useId } from 'react';

interface InputProps {
  variant?: 'filled' | 'outlined';
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function Input({
  variant = 'outlined',
  label,
  value,
  onChange,
  type = 'text',
  error,
  helperText,
  leadingIcon,
  trailingIcon,
  placeholder,
  disabled = false,
  className = '',
  min,
  max,
  step,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const hasValue = value !== '' && value !== undefined;
  const isFloating = focused || hasValue;

  const borderColor = error
    ? 'var(--md-sys-color-error)'
    : focused
    ? 'var(--md-sys-color-primary)'
    : 'var(--md-sys-color-outline)';

  return (
    <div className={className} style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          position: 'relative',
          borderRadius:
            variant === 'filled'
              ? 'var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-small) 0 0'
              : 'var(--md-sys-shape-corner-small)',
          backgroundColor:
            variant === 'filled'
              ? 'var(--md-sys-color-surface-container-highest)'
              : 'transparent',
          borderStyle: 'solid',
          borderColor: error ? 'var(--md-sys-color-error)' : borderColor,
          borderTopWidth: variant === 'outlined' ? (focused ? '2px' : '1px') : '0px',
          borderLeftWidth: variant === 'outlined' ? (focused ? '2px' : '1px') : '0px',
          borderRightWidth: variant === 'outlined' ? (focused ? '2px' : '1px') : '0px',
          borderBottomWidth: (variant === 'outlined' || variant === 'filled') ? (focused ? '2px' : '1px') : '0px',
          transition: 'border-color 0.2s, border-width 0.2s',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Floating Label */}
        <label
          htmlFor={inputId}
          style={{
            position: 'absolute',
            left: leadingIcon ? '44px' : '16px',
            top: isFloating ? '6px' : '50%',
            transform: isFloating ? 'none' : 'translateY(-50%)',
            fontSize: isFloating ? '12px' : '16px',
            fontWeight: 400,
            color: error
              ? 'var(--md-sys-color-error)'
              : focused
              ? 'var(--md-sys-color-primary)'
              : 'var(--md-sys-color-on-surface-variant)',
            transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
            pointerEvents: 'none',
            zIndex: 1,
            backgroundColor:
              variant === 'outlined' && isFloating
                ? 'var(--md-sys-color-surface)'
                : 'transparent',
            padding: variant === 'outlined' && isFloating ? '0 4px' : '0',
          }}
        >
          {label}
        </label>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {leadingIcon && (
            <span
              style={{
                display: 'flex',
                padding: '0 0 0 12px',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}
            >
              {leadingIcon}
            </span>
          )}

          <input
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ''}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            style={{
              width: '100%',
              paddingTop: isFloating ? '22px' : '16px',
              paddingBottom: isFloating ? '8px' : '16px',
              paddingLeft: leadingIcon ? '8px' : '16px',
              paddingRight: trailingIcon ? '8px' : '16px',
              fontSize: '16px',
              fontFamily: 'inherit',
              color: 'var(--md-sys-color-on-surface)',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              lineHeight: '24px',
            }}
          />

          {trailingIcon && (
            <span
              style={{
                display: 'flex',
                padding: '0 12px 0 0',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}
            >
              {trailingIcon}
            </span>
          )}
        </div>
      </div>

      {/* Helper/Error text */}
      {(error || helperText) && (
        <p
          className="body-small"
          style={{
            margin: '4px 16px 0',
            color: error
              ? 'var(--md-sys-color-error)'
              : 'var(--md-sys-color-on-surface-variant)',
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
