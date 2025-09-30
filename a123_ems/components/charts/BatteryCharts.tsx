'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, RadialBarChart, RadialBar } from 'recharts';
import { Battery, Zap, TrendingUp, RotateCcw } from 'lucide-react';

interface BatteryChartsProps {
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

export const BatteryCharts: React.FC<BatteryChartsProps> = ({
  chartData,
  capacity,
  telemetry
}) => {
  const batterySpecificData = chartData.map((item, index) => {
    const hour = new Date().getHours() - (chartData.length - 1 - index);
    const adjustedHour = Math.max(0, Math.min(23, hour));

    const isCharging = item.generation < 0;
    const powerMagnitude = Math.abs(item.generation);

    return {
      ...item,
      stateOfCharge: generateStateOfCharge(adjustedHour, isCharging, powerMagnitude, capacity),
      chargingPower: isCharging ? powerMagnitude : 0,
      dischargingPower: !isCharging ? powerMagnitude : 0,
      roundTripEff: 85 + Math.random() * 10,
      batteryTemp: telemetry?.temperature ? telemetry.temperature + (Math.random() - 0.5) * 15 : 20 + Math.random() * 30,
      cycleCount: 1000 + Math.random() * 2000,
      cellVoltage: telemetry?.voltage ? telemetry.voltage / 100 : 3.6 + Math.random() * 0.8
    };
  });

  const currentSoC = batterySpecificData[batterySpecificData.length - 1]?.stateOfCharge || 50;

  return (
    <div className="space-y-6">
      {/* State of Charge & Power Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Battery className="h-5 w-5 mr-2 text-green-400" />
              State of Charge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={batterySpecificData}>
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
                    dataKey="stateOfCharge"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    name="SoC (%)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="chargingPower"
                    fill="#3B82F6"
                    name="Charging (MW)"
                    opacity={0.7}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="dischargingPower"
                    fill="#F59E0B"
                    name="Discharging (MW)"
                    opacity={0.7}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-400" />
              Current State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ name: 'SoC', value: currentSoC, fill: '#10B981' }]}>
                    <RadialBar
                      minAngle={15}
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 14 }}
                      background
                      clockWise
                      dataKey="value"
                    />
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                      {currentSoC.toFixed(0)}%
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {batterySpecificData[batterySpecificData.length - 1]?.cellVoltage.toFixed(2) || '3.7'}V
                </div>
                <div className="text-gray-300 text-sm">Cell Voltage</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {batterySpecificData[batterySpecificData.length - 1]?.batteryTemp.toFixed(1) || '25'}°C
                </div>
                <div className="text-gray-300 text-sm">Temperature</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency & Cycling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
              Round-Trip Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={batterySpecificData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" domain={[75, 100]} />
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
                    dataKey="roundTripEff"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                    name="Round-Trip Efficiency (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <RotateCcw className="h-5 w-5 mr-2 text-orange-400" />
              Battery Health & Cycles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Cycle Count</span>
                  <span className="text-white font-semibold">
                    {Math.round(batterySpecificData[batterySpecificData.length - 1]?.cycleCount || 1500)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Round-Trip Efficiency</span>
                  <span className="text-white font-semibold">
                    {(batterySpecificData.reduce((sum, item) => sum + item.roundTripEff, 0) / batterySpecificData.length).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Battery Health</span>
                  <span className="text-green-400 font-semibold">
                    {(95 - (batterySpecificData[batterySpecificData.length - 1]?.cycleCount || 1500) / 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Estimated Remaining Life</span>
                  <span className="text-blue-400 font-semibold">
                    {Math.max(0, Math.round((5000 - (batterySpecificData[batterySpecificData.length - 1]?.cycleCount || 1500)) / 365))} years
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Throughput Analysis */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Battery className="h-5 w-5 mr-2 text-cyan-400" />
            Energy Throughput Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={batterySpecificData}>
                <defs>
                  <linearGradient id="chargingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="dischargingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                  dataKey="chargingPower"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#chargingGradient)"
                  name="Charging Power (MW)"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="dischargingPower"
                  stroke="#F59E0B"
                  fillOpacity={1}
                  fill="url(#dischargingGradient)"
                  name="Discharging Power (MW)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="stateOfCharge"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="State of Charge (%)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to generate realistic state of charge based on time and power flow
function generateStateOfCharge(hour: number, isCharging: boolean, power: number, capacity: number): number {
  // Base SoC pattern - typically higher during off-peak hours (charging) and lower during peak (discharging)
  let baseSoC = 50;

  // Night hours (10 PM - 6 AM) typically charge
  if (hour >= 22 || hour <= 6) {
    baseSoC = 70 + Math.random() * 20; // 70-90%
  }
  // Peak hours (4 PM - 9 PM) typically discharge
  else if (hour >= 16 && hour <= 21) {
    baseSoC = 30 + Math.random() * 30; // 30-60%
  }
  // Mid-day (10 AM - 3 PM) moderate levels
  else {
    baseSoC = 50 + Math.random() * 30; // 50-80%
  }

  // Adjust based on current power flow
  if (capacity > 0) {
    const powerRatio = power / capacity;
    if (isCharging) {
      baseSoC += powerRatio * 10; // Higher SoC when charging heavily
    } else {
      baseSoC -= powerRatio * 15; // Lower SoC when discharging heavily
    }
  }

  // Ensure SoC stays within realistic bounds
  return Math.max(5, Math.min(95, baseSoC));
}

export default BatteryCharts;