'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import { Zap, Activity, BarChart3, AlertTriangle } from 'lucide-react';

interface SubstationChartsProps {
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

export const SubstationCharts: React.FC<SubstationChartsProps> = ({
  chartData,
  capacity,
  telemetry
}) => {
  const substationSpecificData = chartData.map((item, index) => {
    const hour = new Date().getHours() - (chartData.length - 1 - index);
    const adjustedHour = Math.max(0, Math.min(23, hour));

    return {
      ...item,
      loadDistribution: generateLoadDistribution(adjustedHour, item.generation, capacity),
      powerFactor: generatePowerFactor(item.generation, capacity),
      voltageRegulation: telemetry?.voltage ? telemetry.voltage + (Math.random() - 0.5) * 10 : 120 + Math.random() * 20,
      transformerLoad: (item.generation / capacity) * 100 + (Math.random() - 0.5) * 10,
      harmonicDistortion: 2 + Math.random() * 3,
      frequency: 59.8 + Math.random() * 0.4,
      loadPhaseA: item.generation * (0.3 + Math.random() * 0.2),
      loadPhaseB: item.generation * (0.3 + Math.random() * 0.2),
      loadPhaseC: item.generation * (0.3 + Math.random() * 0.2),
    };
  });

  // Calculate phase distribution for pie chart
  const latestData = substationSpecificData[substationSpecificData.length - 1];
  const phaseData = [
    { name: 'Phase A', value: latestData?.loadPhaseA || 0, fill: '#EF4444' },
    { name: 'Phase B', value: latestData?.loadPhaseB || 0, fill: '#3B82F6' },
    { name: 'Phase C', value: latestData?.loadPhaseC || 0, fill: '#10B981' }
  ];

  return (
    <div className="space-y-6">
      {/* Load Distribution & Power Factor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Load Distribution & Power Factor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={substationSpecificData}>
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
                    dataKey="loadDistribution"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    name="Load Distribution (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="powerFactor"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="Power Factor"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Three-Phase Load Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={phaseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {phaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voltage Regulation & Transformer Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-400" />
              Voltage Regulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={substationSpecificData}>
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
                    dataKey="voltageRegulation"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                    name="Voltage (kV)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="frequency"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Frequency (Hz)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
              Transformer Loading & Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={substationSpecificData}>
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
                  <Bar
                    yAxisId="left"
                    dataKey="transformerLoad"
                    fill="#EF4444"
                    opacity={0.7}
                    name="Transformer Load (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="harmonicDistortion"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={false}
                    name="THD (%)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-green-400" />
            System Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={substationSpecificData}>
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
                    dataKey="loadPhaseA"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name="Phase A Load (MW)"
                  />
                  <Line
                    type="monotone"
                    dataKey="loadPhaseB"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="Phase B Load (MW)"
                  />
                  <Line
                    type="monotone"
                    dataKey="loadPhaseC"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="Phase C Load (MW)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Power Factor</span>
                  <span className="text-white font-semibold">
                    {(substationSpecificData.reduce((sum, item) => sum + item.powerFactor, 0) / substationSpecificData.length).toFixed(3)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Transformer Load</span>
                  <span className="text-white font-semibold">
                    {(substationSpecificData.reduce((sum, item) => sum + item.transformerLoad, 0) / substationSpecificData.length).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average THD</span>
                  <span className="text-white font-semibold">
                    {(substationSpecificData.reduce((sum, item) => sum + item.harmonicDistortion, 0) / substationSpecificData.length).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Frequency</span>
                  <span className="text-white font-semibold">
                    {latestData?.frequency?.toFixed(2) || '60.00'} Hz
                  </span>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Phase Imbalance</span>
                  <span className={`font-semibold ${
                    calculatePhaseImbalance(latestData) < 5 ? 'text-green-400' :
                    calculatePhaseImbalance(latestData) < 10 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {calculatePhaseImbalance(latestData).toFixed(1)}%
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

// Helper functions to generate realistic substation data
function generateLoadDistribution(hour: number, generation: number, capacity: number): number {
  // Load distribution typically follows demand patterns
  let baseLoad = 50;

  // Peak hours (7-9 AM, 5-8 PM)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) {
    baseLoad = 80 + Math.random() * 15;
  }
  // Off-peak hours (10 PM - 6 AM)
  else if (hour >= 22 || hour <= 6) {
    baseLoad = 30 + Math.random() * 20;
  }
  // Mid-day
  else {
    baseLoad = 50 + Math.random() * 20;
  }

  // Adjust based on generation
  if (capacity > 0) {
    const generationRatio = generation / capacity;
    baseLoad = baseLoad * (0.8 + generationRatio * 0.4);
  }

  return Math.max(10, Math.min(100, baseLoad));
}

function generatePowerFactor(generation: number, capacity: number): number {
  // Power factor typically 0.85-0.98 for well-managed systems
  const basePF = 0.90 + Math.random() * 0.08;

  // Slightly lower power factor at higher loads
  const loadRatio = capacity > 0 ? generation / capacity : 0;
  return Math.max(0.80, basePF - loadRatio * 0.05);
}

function calculatePhaseImbalance(data: any): number {
  if (!data) return 0;

  const phases = [data.loadPhaseA || 0, data.loadPhaseB || 0, data.loadPhaseC || 0];
  const avg = phases.reduce((sum, phase) => sum + phase, 0) / 3;

  if (avg === 0) return 0;

  const maxDeviation = Math.max(...phases.map(phase => Math.abs(phase - avg)));
  return (maxDeviation / avg) * 100;
}

export default SubstationCharts;