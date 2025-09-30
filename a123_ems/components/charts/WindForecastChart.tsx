'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { Wind, CloudRain, Thermometer, Eye, AlertTriangle, TrendingUp, Calendar, Navigation } from 'lucide-react';

interface WindForecastChartProps {
  capacity: number;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  forecastHours?: number;
}

interface WindForecastData {
  time: string;
  hour: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  temperature: number;
  humidity: number;
  pressure: number;
  visibility: number;
  cloudCover: number;
  precipitation: number;
  powerOutput: number;
  powerForecast: number;
  confidence: number;
  turbulenceIntensity: number;
  windShear: number;
}

interface WindRose {
  direction: string;
  angle: number;
  frequency: number;
  avgSpeed: number;
  maxSpeed: number;
}

export const WindForecastChart: React.FC<WindForecastChartProps> = ({
  capacity,
  location,
  forecastHours = 72
}) => {
  const forecastData = useMemo(() => {
    return generateWindForecast(capacity, forecastHours);
  }, [capacity, forecastHours]);

  const windRoseData = useMemo(() => {
    return generateWindRoseData(forecastData);
  }, [forecastData]);

  const powerProductionForecast = useMemo(() => {
    return forecastData.map(data => ({
      ...data,
      actualPower: data.powerOutput,
      forecastPower: data.powerForecast,
      capacityFactor: (data.powerForecast / capacity) * 100
    }));
  }, [forecastData, capacity]);

  const shortTermData = forecastData.slice(0, 24); // Next 24 hours
  const currentConditions = forecastData[0];

  return (
    <div className="space-y-6">
      {/* Current Wind Conditions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Wind className="h-5 w-5 mr-2 text-cyan-400" />
            Current Wind Conditions - {location.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {currentConditions.windSpeed.toFixed(1)}
              </div>
              <div className="text-gray-300 text-sm">Wind Speed (m/s)</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {currentConditions.windDirection.toFixed(0)}°
              </div>
              <div className="text-gray-300 text-sm">Wind Direction</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {currentConditions.powerForecast.toFixed(1)}
              </div>
              <div className="text-gray-300 text-sm">Power Output (MW)</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {((currentConditions.powerForecast / capacity) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-300 text-sm">Capacity Factor</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wind Speed and Power Forecast */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            72-Hour Wind and Power Forecast
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Wind speed predictions with corresponding power output estimates
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis yAxisId="wind" stroke="#06B6D4" />
                <YAxis yAxisId="power" orientation="right" stroke="#10B981" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={(value) => `Time: ${value}`}
                />

                {/* Wind speed area */}
                <Area
                  yAxisId="wind"
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.3}
                  name="Wind Speed (m/s)"
                />

                {/* Wind gusts */}
                <Line
                  yAxisId="wind"
                  type="monotone"
                  dataKey="windGust"
                  stroke="#EF4444"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Wind Gusts (m/s)"
                />

                {/* Power forecast */}
                <Line
                  yAxisId="power"
                  type="monotone"
                  dataKey="powerForecast"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Power Forecast (MW)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Wind Direction and Meteorological Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wind Rose Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Navigation className="h-5 w-5 mr-2 text-blue-400" />
              Wind Rose - Direction Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={windRoseData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis
                    dataKey="direction"
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  />
                  <Radar
                    name="Frequency (%)"
                    dataKey="frequency"
                    stroke="#06B6D4"
                    fill="#06B6D4"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Avg Speed (m/s)"
                    dataKey="avgSpeed"
                    stroke="#10B981"
                    fill="transparent"
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Meteorological Conditions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CloudRain className="h-5 w-5 mr-2 text-gray-400" />
              Weather Conditions Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={shortTermData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis yAxisId="temp" stroke="#F59E0B" />
                  <YAxis yAxisId="humidity" orientation="right" stroke="#3B82F6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F9FAFB'
                    }}
                  />

                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="humidity"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="Humidity (%)"
                  />
                  <Bar
                    yAxisId="humidity"
                    dataKey="cloudCover"
                    fill="#6B7280"
                    opacity={0.6}
                    name="Cloud Cover (%)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power Production Analysis */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-400" />
            Power Production Analysis
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Detailed analysis of expected power output based on wind conditions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Power curve chart */}
            <div className="lg:col-span-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={shortTermData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis yAxisId="power" stroke="#10B981" />
                    <YAxis yAxisId="confidence" orientation="right" stroke="#8B5CF6" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F9FAFB'
                      }}
                    />

                    <Area
                      yAxisId="power"
                      type="monotone"
                      dataKey="powerForecast"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      name="Power Forecast (MW)"
                    />
                    <Line
                      yAxisId="confidence"
                      type="monotone"
                      dataKey="confidence"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                      name="Forecast Confidence (%)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary statistics */}
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">24h Expected Output</span>
                  <span className="text-white font-semibold">
                    {shortTermData.reduce((sum, d) => sum + d.powerForecast, 0).toFixed(1)} MWh
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Avg Capacity Factor</span>
                  <span className="text-white font-semibold">
                    {(shortTermData.reduce((sum, d) => sum + (d.powerForecast / capacity) * 100, 0) / shortTermData.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Peak Wind Speed</span>
                  <span className="text-white font-semibold">
                    {Math.max(...shortTermData.map(d => d.windSpeed)).toFixed(1)} m/s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Forecast Confidence</span>
                  <span className="text-white font-semibold">
                    {(shortTermData.reduce((sum, d) => sum + d.confidence, 0) / shortTermData.length).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Wind conditions alerts */}
              <div className="space-y-2">
                <h4 className="text-white font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                  Conditions Alerts
                </h4>
                {getWindAlerts(shortTermData).map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'bg-red-900/20 border-red-500' :
                    alert.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-500' :
                    'bg-blue-900/20 border-blue-500'
                  }`}>
                    <div className="text-white font-medium text-sm">{alert.title}</div>
                    <div className="text-gray-300 text-xs">{alert.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Turbulence and Wind Quality */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="h-5 w-5 mr-2 text-purple-400" />
            Wind Quality and Turbulence Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={shortTermData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis yAxisId="turbulence" stroke="#EF4444" />
                <YAxis yAxisId="shear" orientation="right" stroke="#8B5CF6" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                />

                <Area
                  yAxisId="turbulence"
                  type="monotone"
                  dataKey="turbulenceIntensity"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                  name="Turbulence Intensity (%)"
                />
                <Line
                  yAxisId="shear"
                  type="monotone"
                  dataKey="windShear"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  name="Wind Shear (1/s)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-white font-medium">Wind Quality Index</div>
              <div className="text-green-400 text-2xl font-bold">
                {calculateWindQualityIndex(shortTermData).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">0-100 scale (higher is better)</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-white font-medium">Avg Turbulence</div>
              <div className="text-red-400 text-2xl font-bold">
                {(shortTermData.reduce((sum, d) => sum + d.turbulenceIntensity, 0) / shortTermData.length).toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">Lower is better for turbines</div>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="text-white font-medium">Wind Consistency</div>
              <div className="text-blue-400 text-2xl font-bold">
                {calculateWindConsistency(shortTermData).toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">Steady wind conditions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions for wind forecast calculations
function generateWindForecast(capacity: number, hours: number): WindForecastData[] {
  const forecast: WindForecastData[] = [];
  const now = new Date();

  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours() + (time.getMinutes() / 60);

    // Generate realistic wind patterns
    const baseWindSpeed = 8 + Math.sin(hour * Math.PI / 12) * 3 + Math.random() * 4;
    const windSpeed = Math.max(0, baseWindSpeed);
    const windGust = windSpeed * (1.2 + Math.random() * 0.3);
    const windDirection = (180 + Math.sin(hour * Math.PI / 6) * 60 + Math.random() * 30) % 360;

    // Power curve calculation
    const powerOutput = calculateWindPower(windSpeed, capacity);
    const powerForecast = powerOutput * (0.9 + Math.random() * 0.2);

    // Weather conditions
    const temperature = 15 + Math.sin((hour - 14) * Math.PI / 12) * 8 + Math.random() * 4;
    const humidity = 60 + Math.random() * 30;
    const pressure = 1013 + Math.random() * 20 - 10;
    const cloudCover = Math.random() * 100;
    const precipitation = cloudCover > 70 ? Math.random() * 5 : 0;

    // Wind quality metrics
    const turbulenceIntensity = 5 + Math.random() * 15;
    const windShear = 0.1 + Math.random() * 0.3;
    const confidence = Math.max(60, 95 - i * 0.5 + Math.random() * 10);

    forecast.push({
      time: formatTime(time),
      hour: i,
      windSpeed,
      windDirection,
      windGust,
      temperature,
      humidity,
      pressure,
      visibility: 10 + Math.random() * 40,
      cloudCover,
      precipitation,
      powerOutput,
      powerForecast,
      confidence,
      turbulenceIntensity,
      windShear
    });
  }

  return forecast;
}

function calculateWindPower(windSpeed: number, capacity: number): number {
  // Simplified wind turbine power curve
  if (windSpeed < 3) return 0; // Cut-in speed
  if (windSpeed > 25) return 0; // Cut-out speed
  if (windSpeed > 12) return capacity; // Rated speed

  // Power curve approximation
  const powerCoeff = Math.min(1, Math.pow(windSpeed - 3, 3) / Math.pow(9, 3));
  return capacity * powerCoeff;
}

function generateWindRoseData(forecastData: WindForecastData[]): WindRose[] {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const windRose: WindRose[] = [];

  directions.forEach((dir, index) => {
    const angle = index * 22.5;
    const directionalData = forecastData.filter(d => {
      const dirDiff = Math.abs(d.windDirection - angle);
      return dirDiff <= 11.25 || dirDiff >= 348.75;
    });

    if (directionalData.length > 0) {
      windRose.push({
        direction: dir,
        angle,
        frequency: (directionalData.length / forecastData.length) * 100,
        avgSpeed: directionalData.reduce((sum, d) => sum + d.windSpeed, 0) / directionalData.length,
        maxSpeed: Math.max(...directionalData.map(d => d.windSpeed))
      });
    } else {
      windRose.push({
        direction: dir,
        angle,
        frequency: 0,
        avgSpeed: 0,
        maxSpeed: 0
      });
    }
  });

  return windRose;
}

function getWindAlerts(data: WindForecastData[]) {
  const alerts = [];

  const maxWindSpeed = Math.max(...data.map(d => d.windSpeed));
  const minWindSpeed = Math.min(...data.map(d => d.windSpeed));
  const avgTurbulence = data.reduce((sum, d) => sum + d.turbulenceIntensity, 0) / data.length;

  if (maxWindSpeed > 20) {
    alerts.push({
      severity: 'high',
      title: 'High Wind Speed Warning',
      message: `Expected wind speeds up to ${maxWindSpeed.toFixed(1)} m/s may trigger turbine shutdowns`
    });
  }

  if (minWindSpeed < 3) {
    alerts.push({
      severity: 'medium',
      title: 'Low Wind Period',
      message: `Wind speeds below cut-in speed expected, minimal power generation`
    });
  }

  if (avgTurbulence > 15) {
    alerts.push({
      severity: 'medium',
      title: 'High Turbulence',
      message: `Elevated turbulence levels may reduce turbine efficiency and increase wear`
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      severity: 'low',
      title: 'Favorable Conditions',
      message: 'Wind conditions are within optimal range for power generation'
    });
  }

  return alerts;
}

function calculateWindQualityIndex(data: WindForecastData[]): number {
  const avgWindSpeed = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
  const avgTurbulence = data.reduce((sum, d) => sum + d.turbulenceIntensity, 0) / data.length;
  const consistency = calculateWindConsistency(data);

  // Calculate quality index (0-100)
  const speedScore = Math.min(100, (avgWindSpeed / 12) * 100); // Optimal around 12 m/s
  const turbulenceScore = Math.max(0, 100 - avgTurbulence * 2); // Lower turbulence is better
  const consistencyScore = consistency;

  return (speedScore + turbulenceScore + consistencyScore) / 3;
}

function calculateWindConsistency(data: WindForecastData[]): number {
  if (data.length < 2) return 100;

  const speeds = data.map(d => d.windSpeed);
  const mean = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - mean, 2), 0) / speeds.length;
  const stdDev = Math.sqrt(variance);

  // Convert to consistency percentage (lower std dev = higher consistency)
  return Math.max(0, 100 - (stdDev / mean) * 100);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export default WindForecastChart;