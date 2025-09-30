'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const STATUS_COLORS = {
  exporting: '#10B981', // green
  curtailing: '#F59E0B', // yellow
  offline: '#EF4444', // red
  charging: '#3B82F6', // blue
  islanded: '#8B5CF6' // purple
};

interface StatusChartProps {
  data: Record<string, number>;
}

export function StatusChart({ data }: StatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6B7280'
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F9FAFB'
            }}
          />
          <Legend
            wrapperStyle={{ color: '#D1D5DB' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}