'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { type SimulatedAsset } from '../map/utils/dataSimulator';

interface PowerFlowChartProps {
  assets: SimulatedAsset[];
  view?: 'individual' | 'aggregate';
}

export function PowerFlowChart({ assets, view = 'individual' }: PowerFlowChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (view === 'individual') {
      // Show each battery's power flow
      const data = assets.map(asset => ({
        name: asset.name.replace('Grid Storage', '').replace('Battery', '').trim(),
        power: asset.performance?.power || 0,
        capacity: asset.power,
        soc: asset.performance?.stateOfCharge || 50,
        status: asset.status
      }));
      setChartData(data);
    } else {
      // Show aggregate power flow by location or time
      const locationGroups: Record<string, { power: number, count: number, capacity: number }> = {};

      assets.forEach(asset => {
        const location = asset.location.split(',')[1]?.trim() || asset.location;
        if (!locationGroups[location]) {
          locationGroups[location] = { power: 0, count: 0, capacity: 0 };
        }
        locationGroups[location].power += asset.performance?.power || 0;
        locationGroups[location].count += 1;
        locationGroups[location].capacity += asset.power;
      });

      const data = Object.entries(locationGroups).map(([location, stats]) => ({
        name: location.replace('United States', '').replace('USA', '').trim(),
        power: stats.power,
        avgPower: stats.power / stats.count,
        capacity: stats.capacity,
        count: stats.count
      }));

      setChartData(data);
    }
  }, [assets, view]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-[#E5E7EB] rounded-lg shadow-lg">
          <p className="text-sm font-medium text-[#1A1D23] mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-xs text-[#6B7280]">Power:</span>
              <span className={`text-xs font-medium ${data.power > 0 ? 'text-green-600' : data.power < 0 ? 'text-blue-600' : 'text-[#6B7280]'}`}>
                {data.power > 0 ? '↑' : data.power < 0 ? '↓' : ''} {Math.abs(data.power).toFixed(1)} MW
              </span>
            </div>
            {view === 'individual' && (
              <>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-[#6B7280]">Max Power:</span>
                  <span className="text-xs font-medium text-[#1A1D23]">{data.capacity} MW</span>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-[#6B7280]">SOC:</span>
                  <span className="text-xs font-medium text-[#1A1D23]">{data.soc?.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-[#6B7280]">Status:</span>
                  <span className="text-xs font-medium text-[#1A1D23] capitalize">{data.status}</span>
                </div>
              </>
            )}
            {view === 'aggregate' && (
              <>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-[#6B7280]">Systems:</span>
                  <span className="text-xs font-medium text-[#1A1D23]">{data.count}</span>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-xs text-[#6B7280]">Total Capacity:</span>
                  <span className="text-xs font-medium text-[#1A1D23]">{data.capacity} MW</span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (power: number) => {
    if (power > 0) return '#10B981'; // Green for discharging
    if (power < 0) return '#3B82F6'; // Blue for charging
    return '#6B7280'; // Gray for idle
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            label={{
              value: 'Power (MW)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#6B7280' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            content={() => (
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs text-[#6B7280]">Discharging</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs text-[#6B7280]">Charging</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span className="text-xs text-[#6B7280]">Idle</span>
                </div>
              </div>
            )}
          />
          <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
          <Bar dataKey="power" name="Power Flow">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.power)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}