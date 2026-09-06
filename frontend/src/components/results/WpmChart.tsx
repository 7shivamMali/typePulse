import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { ChartDataPoint } from '../../types/typing';

interface WpmChartProps {
  data: ChartDataPoint[];
}

export const WpmChart: React.FC<WpmChartProps> = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-text-sub text-xs font-mono">
        Not enough keystroke data points for chart
      </div>
    );
  }

  return (
    <div className="w-full h-56 font-mono select-none my-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-sub)" strokeOpacity={0.15} />
          <XAxis
            dataKey="second"
            stroke="var(--color-sub)"
            fontSize={11}
            tickLine={false}
            unit="s"
          />
          <YAxis
            stroke="var(--color-sub)"
            fontSize={11}
            tickLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-bg-surface)',
              borderColor: 'var(--color-sub)',
              borderRadius: '8px',
              color: 'var(--color-text)',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono, monospace',
            }}
            formatter={(value: any, name: any) => [
              value,
              name === 'wpm' ? 'Net WPM' : name === 'raw' ? 'Raw WPM' : 'Errors',
            ]}
            labelFormatter={(label) => `${label} seconds`}
          />
          <Line
            type="monotone"
            dataKey="raw"
            stroke="var(--color-sub)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="raw"
          />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="var(--color-main)"
            strokeWidth={2.5}
            dot={false}
            name="wpm"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
