'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MealEntry, MEAL_TYPE_INFO } from '@/lib/nutrition';

interface MealCardProps {
  meal: MealEntry;
  index: number;
  onClick?: () => void;
}

export default function MealCard({ meal, index, onClick }: MealCardProps) {
  const mealInfo = MEAL_TYPE_INFO[meal.mealType];
  const time = new Date(meal.loggedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const displayItems = meal.items.slice(0, 3);
  const remaining = meal.items.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.2, 0, 0, 1] }}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      style={{
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{mealInfo.emoji}</span>
          <div>
            <span className="title-small" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              {mealInfo.label}
            </span>
            <span className="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginLeft: '8px' }}>
              {time}
            </span>
          </div>
        </div>

        {/* Calorie badge */}
        <div
          style={{
            backgroundColor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            padding: '4px 12px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {meal.totalNutrition.calories} kcal
        </div>
      </div>

      {/* Food items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {displayItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="body-medium" style={{ color: 'var(--md-sys-color-on-surface)' }}>
              {item.name}
            </span>
            <span className="label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {Math.round(item.nutrition.calories * item.portionMultiplier)} cal
            </span>
          </div>
        ))}
        {remaining > 0 && (
          <span className="label-medium" style={{ color: 'var(--md-sys-color-primary)', marginTop: '2px' }}>
            +{remaining} more item{remaining > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </motion.div>
  );
}
