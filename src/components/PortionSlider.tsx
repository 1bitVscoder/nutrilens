'use client';

import React from 'react';
import { motion } from 'motion/react';

interface PortionSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
}

export default function PortionSlider({
  value,
  onChange,
  min = 0.25,
  max = 3.0,
  step = 0.25,
  label = 'Portion Size',
  baseCalories,
  baseProtein,
  baseCarbs,
  baseFat,
}: PortionSliderProps) {
  const adjustedCalories = Math.round(baseCalories * value);
  const adjustedProtein = Math.round(baseProtein * value * 10) / 10;
  const adjustedCarbs = Math.round(baseCarbs * value * 10) / 10;
  const adjustedFat = Math.round(baseFat * value * 10) / 10;

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className="label-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>{label}</span>
        <motion.span
          key={value}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.2 }}
          className="title-medium"
          style={{
            color: 'var(--md-sys-color-primary)',
            fontWeight: 700,
          }}
        >
          {value}x
        </motion.span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--md-sys-color-primary)' }}
      />

      {/* Nutrition values */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginTop: '12px',
        }}
      >
        {[
          { label: 'Calories', value: `${adjustedCalories}`, unit: 'kcal', color: 'var(--md-sys-color-on-surface)' },
          { label: 'Protein', value: `${adjustedProtein}`, unit: 'g', color: '#4ECDC4' },
          { label: 'Carbs', value: `${adjustedCarbs}`, unit: 'g', color: '#FFB347' },
          { label: 'Fat', value: `${adjustedFat}`, unit: 'g', color: '#FF6B8A' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              textAlign: 'center',
              backgroundColor: 'var(--md-sys-color-surface-container)',
              borderRadius: 'var(--md-sys-shape-corner-small)',
              padding: '8px 4px',
            }}
          >
            <motion.div
              key={`${item.label}-${value}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="title-small"
              style={{ color: item.color, fontWeight: 700 }}
            >
              {item.value}
              <span className="label-small" style={{ fontWeight: 400 }}> {item.unit}</span>
            </motion.div>
            <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
