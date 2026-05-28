'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

const MACRO_COLORS = {
  protein: '#4ECDC4',
  carbs: '#FFB347',
  fat: '#FF6B8A',
};

export default function MacroChart({
  protein,
  carbs,
  fat,
  proteinTarget,
  carbsTarget,
  fatTarget,
}: MacroChartProps) {
  const data = [
    { name: 'Protein', value: protein || 0.1, color: MACRO_COLORS.protein },
    { name: 'Carbs', value: carbs || 0.1, color: MACRO_COLORS.carbs },
    { name: 'Fat', value: fat || 0.1, color: MACRO_COLORS.fat },
  ];

  const totalGrams = Math.round(protein + carbs + fat);

  const macros = [
    { name: 'Protein', current: protein, target: proteinTarget, color: MACRO_COLORS.protein, emoji: '🥩' },
    { name: 'Carbs', current: carbs, target: carbsTarget, color: MACRO_COLORS.carbs, emoji: '🍞' },
    { name: 'Fat', current: fat, target: fatTarget, color: MACRO_COLORS.fat, emoji: '🥑' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      style={{ width: '100%' }}
    >
      {/* Doughnut Chart */}
      <div style={{ width: '100%', height: 180, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={200}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div className="title-large" style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 700 }}>
            {totalGrams}g
          </div>
          <div className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            total
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
        {macros.map((macro) => {
          const pct = macro.target > 0 ? Math.min((macro.current / macro.target) * 100, 100) : 0;
          return (
            <div key={macro.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{macro.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="label-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {macro.name}
                  </span>
                  <span className="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {Math.round(macro.current)}g / {macro.target}g
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      backgroundColor: macro.color,
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
