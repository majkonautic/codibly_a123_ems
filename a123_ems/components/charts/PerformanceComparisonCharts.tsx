'use client';

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  AreaChart
} from 'recharts';
import { PerformanceData } from '../map/utils/dataSimulator';

interface PerformanceComparisonChartsProps {
  chartData: Array<PerformanceData & { time: string }>;
  assetType: string;
  capacity: number;
}

export const PerformanceComparisonCharts: React.FC<PerformanceComparisonChartsProps> = ({
  chartData,
  assetType,
  capacity
}) => {
  // Transform data for different visualizations
  const comparisonData = chartData.map((item, index) => ({
    ...item,
    time: item.time,
    // Convert MW values to percentages of capacity for better comparison
    generationPct: capacity > 0 ? (item.generation / capacity) * 100 : 0,
    commitmentPct: capacity > 0 ? Math.abs(item.commitment / capacity) * 100 : 0,
    availabilityPct: item.availability,
    efficiencyPct: item.efficiency,
    // Performance ratio metrics
    commitmentFulfillment: item.commitment !== 0 ? (item.generation / Math.abs(item.commitment)) * 100 : 100,
    availabilityUtilization: item.availability > 0 ? (item.generation / (capacity * (item.availability / 100))) * 100 : 0
  }));

  // Calculate summary statistics
  const avgAvailability = comparisonData.reduce((sum, item) => sum + item.availability, 0) / comparisonData.length;
  const avgEfficiency = comparisonData.reduce((sum, item) => sum + item.efficiency, 0) / comparisonData.length;
  const avgCommitmentFulfillment = comparisonData.reduce((sum, item) => sum + item.commitmentFulfillment, 0) / comparisonData.length;

  // Radar chart data for performance overview
  const radarData = [
    {
      metric: 'Availability',
      value: avgAvailability,
      fullMark: 100,
    },
    {
      metric: 'Efficiency',
      value: avgEfficiency,
      fullMark: 100,
    },
    {
      metric: 'Commitment\nFulfillment',
      value: Math.min(avgCommitmentFulfillment, 100),
      fullMark: 100,
    },
    {
      metric: 'Capacity\nUtilization',
      value: comparisonData.reduce((sum, item) => sum + item.generationPct, 0) / comparisonData.length,
      fullMark: 100,
    }
  ];

  const getAssetSpecificMetrics = () => {
    switch (assetType) {
      case 'solar':
        return {
          title: 'Solar Performance Metrics',
          color: '#F59E0B',
          description: 'Availability: System uptime | Commitment: Forecasted output | Efficiency: DC to AC conversion'
        };
      case 'wind':
        return {
          title: 'Wind Performance Metrics',
          color: '#10B981',
          description: 'Availability: Turbine uptime | Commitment: Wind forecast output | Efficiency: Wind to power conversion'
        };
      case 'battery':
        return {
          title: 'Battery Performance Metrics',
          color: '#3B82F6',
          description: 'Availability: System readiness | Commitment: Grid service obligations | Efficiency: Round-trip energy'
        };
      case 'substation':
        return {
          title: 'Substation Performance Metrics',
          color: '#8B5CF6',
          description: 'Availability: Grid connection uptime | Commitment: Load forecasts | Efficiency: Transmission losses'
        };
      default:
        return {
          title: 'Asset Performance Metrics',
          color: '#6B7280',
          description: 'Availability: System uptime | Commitment: Contracted output | Efficiency: Conversion rate'
        };
    }
  };

  const assetMetrics = getAssetSpecificMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-2">{assetMetrics.title}</h3>
        <p className="text-gray-400 text-sm">{assetMetrics.description}</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">{avgAvailability.toFixed(1)}%</div>
          <div className="text-gray-400 text-sm">Avg Availability</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">{avgEfficiency.toFixed(1)}%</div>
          <div className="text-gray-400 text-sm">Avg Efficiency</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">{avgCommitmentFulfillment.toFixed(1)}%</div>
          <div className="text-gray-400 text-sm">Commitment Rate</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-400">
            {(comparisonData.reduce((sum, item) => sum + item.generationPct, 0) / comparisonData.length).toFixed(1)}%
          </div>
          <div className="text-gray-400 text-sm">Capacity Usage</div>
        </div>
      </div>

      {/* Performance Radar Chart */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h4 className="text-white font-semibold mb-4">Performance Overview</h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#4B5563" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#E5E7EB', fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke={assetMetrics.color}
              fill={assetMetrics.color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#E5E7EB'
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Value']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Availability vs Commitment vs Efficiency Timeline */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h4 className="text-white font-semibold mb-4">Performance Timeline Comparison</h4>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#E5E7EB'
              }}
              formatter={(value: number, name: string) => {
                const unit = name.includes('Pct') ? '%' : name.includes('generation') || name.includes('commitment') ? 'MW' : '%';
                return [`${typeof value === 'number' ? value.toFixed(1) : value}${unit}`, name];
              }}
            />
            <Legend />

            {/* Area chart for availability as background */}
            <Area
              type="monotone"
              dataKey="availabilityPct"
              fill="#10B981"
              fillOpacity={0.1}
              stroke="none"
              name="Availability %"
            />

            {/* Line for efficiency */}
            <Line
              type="monotone"
              dataKey="efficiencyPct"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 0, r: 3 }}
              name="Efficiency %"
            />

            {/* Line for commitment fulfillment */}
            <Line
              type="monotone"
              dataKey="commitmentFulfillment"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', strokeWidth: 0, r: 3 }}
              name="Commitment Rate %"
            />

            {/* Bar for generation percentage */}
            <Bar
              dataKey="generationPct"
              fill="#8B5CF6"
              fillOpacity={0.6}
              name="Generation % of Capacity"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Generation vs Commitment Correlation */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h4 className="text-white font-semibold mb-4">Generation vs Commitment Tracking</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              label={{ value: 'MW', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#E5E7EB'
              }}
              formatter={(value: number, name: string) => [`${value.toFixed(1)} MW`, name]}
            />
            <Legend />

            {/* Commitment line (dashed) */}
            <Line
              type="monotone"
              dataKey="commitment"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#F59E0B', strokeWidth: 0, r: 3 }}
              name="Commitment"
            />

            {/* Actual generation line */}
            <Line
              type="monotone"
              dataKey="generation"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
              name="Actual Generation"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Correlation Matrix */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h4 className="text-white font-semibold mb-4">Efficiency vs Availability Correlation</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              domain={[0, 100]}
              label={{ value: '%', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#E5E7EB'
              }}
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
            />
            <Legend />

            {/* Availability area */}
            <Area
              type="monotone"
              dataKey="availabilityPct"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.4}
              name="Availability %"
            />

            {/* Efficiency line overlay */}
            <Line
              type="monotone"
              dataKey="efficiencyPct"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: '#EF4444', strokeWidth: 0, r: 3 }}
              name="Efficiency %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceComparisonCharts;