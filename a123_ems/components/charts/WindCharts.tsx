'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, ScatterChart, Scatter } from 'recharts';
import { Wind, RotateCcw, TrendingUp, Gauge } from 'lucide-react';

interface WindChartsProps {
  chartData: Array<{
    time: string;
    generation: number;
    efficiency: number;
    availability: number;
  }>;
  capacity: number;
  telemetry?: {
    temperature: number;
    voltage: number;
  };
}

export const WindCharts: React.FC<WindChartsProps> = ({
  chartData,
  capacity,
  telemetry
}) => {
  // Generate wind-specific data
  const windSpecificData = chartData.map((item, index) => {
    const hour = new Date().getHours() - (chartData.length - 1 - index);
    const adjustedHour = Math.max(0, Math.min(23, hour));

    return {
      ...item,
      windSpeed: generateWindSpeed(adjustedHour, item.generation, capacity),
      turbineRPM: generateTurbineRPM(item.generation, capacity),
      pitchAngle: generatePitchAngle(item.generation, capacity),
      powerCoeff: 0.35 + Math.random() * 0.15, // Cp typically 0.35-0.50
      capacityFactor: (item.generation / capacity) * 100
    };
  });

  return (
    <div className="space-y-6">
      {/* Wind Speed vs Power Curve */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wind className="h-5 w-5 mr-2 text-cyan-400" />
            Wind Speed vs Power Curve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={windSpecificData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.3}
                  name="Wind Speed (m/s)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="generation"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Power Output (MW)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Turbine Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <RotateCcw className="h-5 w-5 mr-2 text-blue-400" />
              Turbine RPM & Pitch Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={windSpecificData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis yAxisId="left" stroke="#9CA3AF" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="turbineRPM"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="RPM"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pitchAngle"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Pitch Angle (°)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gauge className="h-5 w-5 mr-2 text-purple-400" />
              Power Coefficient & Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={windSpecificData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="powerCoeff"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                    name="Power Coefficient (Cp)"
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="Overall Efficiency (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Factor Trends */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Capacity Factor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={windSpecificData}>
                  <defs>
                    <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="capacityFactor"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#capacityGradient)"
                    name="Capacity Factor (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Wind Speed</span>
                  <span className="text-white font-semibold">
                    {(windSpecificData.reduce((sum, item) => sum + item.windSpeed, 0) / windSpecificData.length).toFixed(1)} m/s
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Capacity Factor</span>
                  <span className="text-white font-semibold">
                    {(windSpecificData.reduce((sum, item) => sum + item.capacityFactor, 0) / windSpecificData.length).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Power Coefficient</span>
                  <span className="text-white font-semibold">
                    {(windSpecificData.reduce((sum, item) => sum + item.powerCoeff, 0) / windSpecificData.length).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Peak Power Today</span>
                  <span className="text-white font-semibold">
                    {Math.max(...windSpecificData.map(d => d.generation)).toFixed(1)} MW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions to generate realistic wind turbine data
function generateWindSpeed(hour: number, generation: number, capacity: number): number {
  // Wind speed typically varies throughout the day and correlates with power output
  const baseWindSpeed = 3 + Math.random() * 12; // 3-15 m/s typical range

  // If we have generation data, reverse-engineer approximate wind speed
  if (generation > 0 && capacity > 0) {
    const capacityFactor = generation / capacity;
    // Simplified wind speed estimation from power curve
    return Math.max(3, Math.min(25, 3 + capacityFactor * 15));
  }

  return baseWindSpeed;
}

function generateTurbineRPM(generation: number, capacity: number): number {
  // Typical wind turbine operates at 10-30 RPM
  const capacityFactor = capacity > 0 ? generation / capacity : 0;
  return 10 + capacityFactor * 20 + (Math.random() - 0.5) * 2;
}

function generatePitchAngle(generation: number, capacity: number): number {
  // Pitch angle typically 0-30 degrees
  // Lower angles for optimal wind, higher angles for protection in high winds
  const capacityFactor = capacity > 0 ? generation / capacity : 0;

  if (capacityFactor > 0.8) {
    // High wind conditions - increase pitch for protection
    return 15 + Math.random() * 15;
  } else {
    // Normal conditions - optimize for power
    return Math.random() * 10;
  }
}

export default WindCharts;