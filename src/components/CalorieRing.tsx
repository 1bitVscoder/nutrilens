'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

export default function CalorieRing({
  consumed,
  target,
  size = 220,
  strokeWidth = 14,
  animate = true,
}: CalorieRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((consumed / target) * 100, 150);
  const remaining = target - consumed;

  // Animated progress
  const springProgress = useSpring(0, { stiffness: 180, damping: 22 });
  const strokeDashoffset = useTransform(
    springProgress,
    (v: number) => circumference - (circumference * v) / 100
  );

  // Animated counter
  const [displayedCalories, setDisplayedCalories] = useState(0);

  useEffect(() => {
    if (animate) {
      springProgress.set(percentage);
    } else {
      springProgress.jump(percentage);
    }
  }, [percentage, animate, springProgress]);

  // Count-up animation for calories
  useEffect(() => {
    if (!animate) {
      setDisplayedCalories(consumed);
      return;
    }
    const duration = 1000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedCalories(Math.round(eased * consumed));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }, [consumed, animate]);

  // Color based on progress
  const getProgressColor = () => {
    if (percentage > 100) return 'var(--md-sys-color-error)';
    if (percentage > 80) return 'var(--md-sys-color-tertiary)';
    return 'var(--md-sys-color-primary)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--md-sys-color-outline-variant)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />

          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            className="display-medium"
            style={{
              color: 'var(--md-sys-color-on-surface)',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {displayedCalories.toLocaleString()}
          </motion.span>
          <span
            className="body-medium"
            style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}
          >
            of {target.toLocaleString()} kcal
          </span>
        </div>
      </div>

      {/* Remaining label */}
      <span
        className="label-large"
        style={{
          color: remaining >= 0
            ? 'var(--md-sys-color-primary)'
            : 'var(--md-sys-color-error)',
          fontWeight: 600,
        }}
      >
        {remaining >= 0
          ? `${remaining.toLocaleString()} kcal remaining`
          : `${Math.abs(remaining).toLocaleString()} kcal over`}
      </span>
    </div>
  );
}
