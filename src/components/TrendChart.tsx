'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  dayLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  target: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  type: 'calories' | 'macros';
  height?: number;
}


interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  type: 'calories' | 'macros';
}

function CustomTooltip({ active, payload, label, type }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--md-sys-color-surface-container-highest)',
        borderRadius: 'var(--md-sys-shape-corner-small)',
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid var(--md-sys-color-outline-variant)',
      }}
    >
      <div className="label-medium" style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '4px' }}>
        {label}
      </div>
      {type === 'calories' ? (
        <div className="body-medium" style={{ color: 'var(--md-sys-color-primary)' }}>
          {payload[0]?.value?.toLocaleString()} kcal
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {payload.map((p: TooltipPayloadEntry) => (
            <div key={p.name} className="body-small" style={{ color: p.color }}>
              {p.name}: {p.value}g
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrendChart({ data, type, height = 250 }: TrendChartProps) {
  if (type === 'calories') {
    const target = data[0]?.target ?? 2000;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--md-sys-color-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--md-sys-color-outline-variant)"
            opacity={0.15}
            vertical={false}
          />
          <XAxis
            dataKey="dayLabel"
            tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip type="calories" />} />
          <ReferenceLine
            y={target}
            stroke="var(--md-sys-color-outline)"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: 'Target',
              position: 'right',
              fill: 'var(--md-sys-color-on-surface-variant)',
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="calories"
            stroke="var(--md-sys-color-primary)"
            strokeWidth={2.5}
            fill="url(#calorieGradient)"
            dot={{
              fill: 'var(--md-sys-color-primary)',
              stroke: 'var(--md-sys-color-surface)',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{ r: 6 }}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Macros stacked bar chart
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--md-sys-color-outline-variant)"
          opacity={0.15}
          vertical={false}
        />
        <XAxis
          dataKey="dayLabel"
          tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--md-sys-color-on-surface-variant)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          label={{
            value: 'grams',
            angle: -90,
            position: 'insideLeft',
            fill: 'var(--md-sys-color-on-surface-variant)',
            fontSize: 11,
          }}
        />
        <Tooltip content={<CustomTooltip type="macros" />} />
        <Bar
          dataKey="protein"
          stackId="macros"
          fill="#4ECDC4"
          name="Protein"
          radius={[0, 0, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="carbs"
          stackId="macros"
          fill="#FFB347"
          name="Carbs"
          radius={[0, 0, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="fat"
          stackId="macros"
          fill="#FF6B8A"
          name="Fat"
          radius={[4, 4, 0, 0]}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
