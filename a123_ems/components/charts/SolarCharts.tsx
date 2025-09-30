'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { Sun, Thermometer, TrendingUp, Battery } from 'lucide-react';
import type { PerformanceData } from '../map/utils/dataSimulator';

interface SolarChartsProps {
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

export const SolarCharts: React.FC<SolarChartsProps> = ({
  chartData,
  capacity,
  telemetry
}) => {
  // Generate solar-specific data
  const solarSpecificData = chartData.map((item, index) => {
    const hour = new Date().getHours() - (chartData.length - 1 - index);
    const adjustedHour = Math.max(0, Math.min(23, hour));

    return {
      ...item,
      irradiance: generateIrradiance(adjustedHour),
      panelTemp: telemetry?.temperature ? telemetry.temperature + (Math.random() - 0.5) * 10 : 25 + Math.random() * 40,
      dcPower: item.generation * (0.95 + Math.random() * 0.1),
      inverterEff: 92 + Math.random() * 6
    };
  });

  return (
    <div className="space-y-6">
      {/* Solar Irradiance vs Power Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sun className="h-5 w-5 mr-2 text-yellow-400" />
              Solar Irradiance vs Power Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={solarSpecificData}>
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
                  <Bar yAxisId="left" dataKey="irradiance" fill="#F59E0B" opacity={0.6} name="Irradiance (W/m²)" />
                  <Line yAxisId="right" type="monotone" dataKey="generation" stroke="#10B981" strokeWidth={2} dot={false} name="Power Output (MW)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Panel Temperature Impact */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-red-400" />
              Temperature vs Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={solarSpecificData}>
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
                  <Area yAxisId="left" type="monotone" dataKey="panelTemp" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Panel Temp (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#3B82F6" strokeWidth={2} dot={false} name="Efficiency (%)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Generation Pattern */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Daily Generation Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={solarSpecificData}>
                <defs>
                  <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="generation"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#generationGradient)"
                  name="Generation (MW)"
                />
                <Line type="monotone" dataKey="dcPower" stroke="#F59E0B" strokeWidth={1} strokeDasharray="5 5" dot={false} name="DC Power (MW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* DC/AC Conversion Efficiency */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Battery className="h-5 w-5 mr-2 text-purple-400" />
            Inverter Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={solarSpecificData}>
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
                  <Line type="monotone" dataKey="inverterEff" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Inverter Efficiency (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Inverter Efficiency</span>
                  <span className="text-white font-semibold">
                    {(solarSpecificData.reduce((sum, item) => sum + item.inverterEff, 0) / solarSpecificData.length).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">DC/AC Ratio</span>
                  <span className="text-white font-semibold">
                    {solarSpecificData.length > 0 ? (solarSpecificData[solarSpecificData.length - 1].dcPower / solarSpecificData[solarSpecificData.length - 1].generation).toFixed(2) : '1.00'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Peak Power Today</span>
                  <span className="text-white font-semibold">
                    {Math.max(...solarSpecificData.map(d => d.generation)).toFixed(1)} MW
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

// Helper function to generate realistic solar irradiance based on time of day
function generateIrradiance(hour: number): number {
  // Solar irradiance follows a bell curve during daylight hours
  if (hour < 6 || hour > 18) {
    return 0;
  }

  // Peak irradiance around noon (1000 W/m²)
  const noonFactor = 1 - Math.abs(hour - 12) / 6;
  const baseIrradiance = 1000 * noonFactor * noonFactor;

  // Add some random variation (clouds, weather)
  return Math.max(0, baseIrradiance * (0.7 + Math.random() * 0.3));
}

export default SolarCharts;