'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { type SimulatedAsset } from '../map/utils/dataSimulator';

interface BatterySOCChartProps {
  assets: SimulatedAsset[];
  selectedAssetId?: string;
  timeRange?: 'hour' | 'day' | 'week';
}

export function BatterySOCChart({ assets, selectedAssetId, timeRange = 'hour' }: BatterySOCChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Generate time series data for SOC
    const generateTimeSeriesData = () => {
      const dataPoints = timeRange === 'hour' ? 12 : timeRange === 'day' ? 24 : 168;
      const data = [];

      for (let i = 0; i < dataPoints; i++) {
        const timestamp = new Date();
        timestamp.setMinutes(timestamp.getMinutes() - (dataPoints - i) * 5);

        const dataPoint: any = {
          time: timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          timestamp: timestamp.toISOString()
        };

        if (selectedAssetId) {
          // Show single asset
          const asset = assets.find(a => a.id === selectedAssetId);
          if (asset) {
            // Simulate historical SOC with some variation
            const baseSOC = asset.performance.stateOfCharge;
            const variation = Math.sin(i * 0.5) * 10;
            dataPoint.soc = Math.max(5, Math.min(100, baseSOC + variation));
            dataPoint.power = asset.performance.power + (Math.random() - 0.5) * 20;
          }
        } else {
          // Show average of all assets
          const avgSOC = assets.reduce((sum, asset) =>
            sum + (asset.performance?.stateOfCharge || 50), 0) / assets.length;
          const variation = Math.sin(i * 0.3) * 8;
          dataPoint.avgSOC = Math.max(10, Math.min(95, avgSOC + variation));

          // Calculate min and max SOC across fleet
          const socValues = assets.map(a => a.performance?.stateOfCharge || 50);
          dataPoint.minSOC = Math.min(...socValues) - 5;
          dataPoint.maxSOC = Math.max(...socValues) + 5;
        }

        data.push(dataPoint);
      }

      return data;
    };

    const data = generateTimeSeriesData();
    setChartData(data);
  }, [assets, selectedAssetId, timeRange]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#E5E7EB] rounded-lg shadow-lg">
          <p className="text-xs text-[#6B7280] mb-1">{payload[0].payload.time}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="text-xs text-[#6B7280]">{entry.name}:</span>
              <span className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.name.includes('SOC') ? `${entry.value.toFixed(1)}%` : `${entry.value.toFixed(1)} MW`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        {selectedAssetId ? (
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              label={{ value: 'SOC (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="soc"
              stroke="#FF8C00"
              strokeWidth={2}
              dot={false}
              name="State of Charge"
            />
          </LineChart>
        ) : (
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              label={{ value: 'SOC (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6B7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="line"
            />
            <Area
              type="monotone"
              dataKey="minSOC"
              stackId="1"
              stroke="none"
              fill="#E5E7EB"
              fillOpacity={0.3}
              name="Min SOC"
            />
            <Area
              type="monotone"
              dataKey="avgSOC"
              stackId="2"
              stroke="#FF8C00"
              strokeWidth={2}
              fill="#FF8C00"
              fillOpacity={0.6}
              name="Average SOC"
            />
            <Area
              type="monotone"
              dataKey="maxSOC"
              stackId="3"
              stroke="none"
              fill="#E5E7EB"
              fillOpacity={0.3}
              name="Max SOC"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}