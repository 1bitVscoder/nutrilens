'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  className = '',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--md-sys-color-scrim)',
              zIndex: 70,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={className}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '420px',
              maxHeight: '85vh',
              backgroundColor: 'var(--md-sys-color-surface-container-high)',
              borderRadius: 'var(--md-sys-shape-corner-large)',
              zIndex: 71,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {title && (
              <div
                className="headline-small"
                style={{
                  padding: '24px 24px 16px',
                  color: 'var(--md-sys-color-on-surface)',
                }}
              >
                {title}
              </div>
            )}

            <div
              className="body-medium"
              style={{
                padding: title ? '0 24px 24px' : '24px',
                color: 'var(--md-sys-color-on-surface-variant)',
                overflow: 'auto',
                flex: 1,
              }}
            >
              {children}
            </div>

            {actions && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  padding: '0 24px 24px',
                }}
              >
                {actions}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
