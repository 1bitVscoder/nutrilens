'use client';

import React from 'react';
import { motion } from 'motion/react';

export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '4px 0' }}>
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--md-sys-color-primary-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          flexShrink: 0,
        }}
      >
        🤖
      </div>

      <div>
        {/* Dots container */}
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-surface-container-high)',
            borderRadius: '4px 16px 16px 16px',
            padding: '14px 20px',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--md-sys-color-primary)',
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Label */}
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="label-small"
          style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            display: 'block',
            marginTop: '4px',
            paddingLeft: '4px',
          }}
        >
          NutriLens is thinking...
        </motion.span>
      </div>
    </div>
  );
}
