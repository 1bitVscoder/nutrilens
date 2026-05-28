'use client';

import React from 'react';
import { motion } from 'motion/react';

interface NavItem {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  path: string;
  badge?: boolean;
}

interface BottomNavProps {
  items: NavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
}

export default function BottomNav({ items, activePath, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="safe-area-bottom"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderTop: '1px solid var(--md-sys-color-outline-variant)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '80px',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map((item) => {
        const isActive = activePath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              position: 'relative',
              width: '64px',
              outline: 'none',
            }}
          >
            {/* Active indicator pill */}
            <div style={{ position: 'relative', width: '64px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    width: '64px',
                    height: '32px',
                    borderRadius: 'var(--md-sys-shape-corner-full)',
                    backgroundColor: 'var(--md-sys-color-secondary-container)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  color: isActive
                    ? 'var(--md-sys-color-on-secondary-container)'
                    : 'var(--md-sys-color-on-surface-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--md-sys-color-error)',
                    }}
                  />
                )}
              </motion.div>
            </div>

            {/* Label */}
            <span
              className="label-small"
              style={{
                color: isActive
                  ? 'var(--md-sys-color-on-surface)'
                  : 'var(--md-sys-color-on-surface-variant)',
                fontWeight: isActive ? 600 : 500,
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
