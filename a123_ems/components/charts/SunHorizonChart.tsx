'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { Sun, Eye, TrendingUp, Calendar } from 'lucide-react';

interface SunHorizonChartProps {
  latitude: number;
  longitude: number;
  date?: Date;
  timezone?: string;
}

interface SunPosition {
  time: string;
  hour: number;
  azimuth: number;
  elevation: number;
  irradiance: number;
  isVisible: boolean;
  season: 'winter' | 'spring' | 'summer' | 'autumn';
}

export const SunHorizonChart: React.FC<SunHorizonChartProps> = ({
  latitude,
  longitude,
  date = new Date(),
  timezone = 'UTC'
}) => {
  const sunPositions = useMemo(() => {
    return calculateSunPositions(latitude, longitude, date);
  }, [latitude, longitude, date]);

  const seasonalData = useMemo(() => {
    return calculateSeasonalSunPaths(latitude, longitude);
  }, [latitude, longitude]);

  const polarData = useMemo(() => {
    return sunPositions
      .filter(pos => pos.isVisible)
      .map(pos => ({
        angle: pos.azimuth,
        radius: 90 - pos.elevation,
        elevation: pos.elevation,
        time: pos.time,
        irradiance: pos.irradiance
      }));
  }, [sunPositions]);

  const currentSunPosition = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return calculateSunPosition(latitude, longitude, now, currentHour);
  }, [latitude, longitude]);

  return (
    <div className="space-y-6">
      {/* Sun Path Polar Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sun className="h-5 w-5 mr-2 text-yellow-400" />
            Sun Path Horizon Chart
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Current sun position and daily trajectory for latitude {latitude.toFixed(2)}°
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 80, bottom: 60, left: 80 }}>
                <CartesianGrid stroke="#374151" />
                <XAxis
                  type="number"
                  dataKey="azimuth"
                  domain={[0, 360]}
                  ticks={[0, 45, 90, 135, 180, 225, 270, 315, 360]}
                  tickFormatter={(value) => {
                    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
                    return directions[Math.round(value / 45)] || `${value}°`;
                  }}
                  stroke="#9CA3AF"
                  label={{ value: 'Azimuth (Compass Direction)', position: 'insideBottom', offset: -10, style: { fill: '#9CA3AF' } }}
                />
                <YAxis
                  type="number"
                  dataKey="elevation"
                  domain={[0, 90]}
                  ticks={[0, 15, 30, 45, 60, 75, 90]}
                  tickFormatter={(value) => `${value}°`}
                  stroke="#9CA3AF"
                  label={{ value: 'Elevation Angle', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <p className="text-white font-semibold">{data.time}</p>
                          <p className="text-yellow-400">Azimuth: {data.azimuth.toFixed(1)}°</p>
                          <p className="text-blue-400">Elevation: {data.elevation.toFixed(1)}°</p>
                          <p className="text-green-400">Irradiance: {data.irradiance.toFixed(0)} W/m²</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Sun path throughout the day */}
                <Scatter
                  name="Sun Path"
                  data={sunPositions.filter(pos => pos.isVisible)}
                  fill="#F59E0B"
                  shape="circle"
                  strokeWidth={2}
                />

                {/* Current sun position (if visible) */}
                {currentSunPosition.isVisible && (
                  <Scatter
                    name="Current Position"
                    data={[currentSunPosition]}
                    fill="#EF4444"
                    shape="star"
                    strokeWidth={3}
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and info */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-white font-medium">Sun Path</span>
              </div>
              <p className="text-gray-300 text-sm">Daily trajectory from sunrise to sunset</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-white font-medium">Current Position</span>
              </div>
              <p className="text-gray-300 text-sm">Real-time sun location in sky</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">Viewing Angle</span>
              </div>
              <p className="text-gray-300 text-sm">0° = horizon, 90° = directly overhead</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Sun Paths Comparison */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-400" />
            Seasonal Sun Path Comparison
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Compare sun paths across different seasons for optimal panel positioning
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 80, bottom: 60, left: 80 }}>
                <CartesianGrid stroke="#374151" />
                <XAxis
                  type="number"
                  dataKey="azimuth"
                  domain={[0, 360]}
                  ticks={[0, 90, 180, 270, 360]}
                  tickFormatter={(value) => {
                    const directions = ['N', 'E', 'S', 'W', 'N'];
                    return directions[value / 90] || `${value}°`;
                  }}
                  stroke="#9CA3AF"
                />
                <YAxis
                  type="number"
                  dataKey="elevation"
                  domain={[0, 90]}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                          <p className="text-white font-semibold">{data.season} - {data.time}</p>
                          <p className="text-yellow-400">Elevation: {data.elevation.toFixed(1)}°</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Different seasons with different colors */}
                <Scatter name="Summer Solstice" data={seasonalData.summer} fill="#10B981" />
                <Scatter name="Winter Solstice" data={seasonalData.winter} fill="#3B82F6" />
                <Scatter name="Spring Equinox" data={seasonalData.spring} fill="#F59E0B" />
                <Scatter name="Autumn Equinox" data={seasonalData.autumn} fill="#EF4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white text-sm">Summer (Jun 21)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white text-sm">Winter (Dec 21)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-white text-sm">Spring (Mar 21)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white text-sm">Autumn (Sep 21)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solar Position Data Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Hourly Solar Position Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Current Conditions</h4>
              <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Solar Elevation:</span>
                  <span className="text-white font-semibold">{currentSunPosition.elevation.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Solar Azimuth:</span>
                  <span className="text-white font-semibold">{currentSunPosition.azimuth.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Solar Irradiance:</span>
                  <span className="text-white font-semibold">{currentSunPosition.irradiance.toFixed(0)} W/m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sun Visible:</span>
                  <span className={`font-semibold ${currentSunPosition.isVisible ? 'text-green-400' : 'text-red-400'}`}>
                    {currentSunPosition.isVisible ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white font-medium">Daily Summary</h4>
              <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunrise Time:</span>
                  <span className="text-white font-semibold">
                    {sunPositions.find(pos => pos.isVisible)?.time || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunset Time:</span>
                  <span className="text-white font-semibold">
                    {sunPositions.slice().reverse().find(pos => pos.isVisible)?.time || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Peak Elevation:</span>
                  <span className="text-white font-semibold">
                    {Math.max(...sunPositions.map(pos => pos.elevation)).toFixed(1)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Daylight Hours:</span>
                  <span className="text-white font-semibold">
                    {sunPositions.filter(pos => pos.isVisible).length * 0.5} hrs
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

// Helper functions for solar calculations
function calculateSunPositions(latitude: number, longitude: number, date: Date): SunPosition[] {
  const positions: SunPosition[] = [];

  for (let hour = 0; hour < 24; hour += 0.5) {
    const position = calculateSunPosition(latitude, longitude, date, hour);
    positions.push(position);
  }

  return positions;
}

function calculateSunPosition(latitude: number, longitude: number, date: Date, hour: number): SunPosition {
  // Simplified solar position calculation
  // In a real application, you would use more precise astronomical calculations

  const dayOfYear = getDayOfYear(date);
  const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);

  const hourAngle = 15 * (hour - 12);
  const latRad = latitude * Math.PI / 180;
  const declRad = declination * Math.PI / 180;
  const hourAngleRad = hourAngle * Math.PI / 180;

  // Solar elevation angle
  const elevation = Math.asin(
    Math.sin(latRad) * Math.sin(declRad) +
    Math.cos(latRad) * Math.cos(declRad) * Math.cos(hourAngleRad)
  ) * 180 / Math.PI;

  // Solar azimuth angle
  let azimuth = Math.atan2(
    Math.sin(hourAngleRad),
    Math.cos(hourAngleRad) * Math.sin(latRad) - Math.tan(declRad) * Math.cos(latRad)
  ) * 180 / Math.PI;

  // Convert azimuth to 0-360 degrees from south
  azimuth = (azimuth + 180) % 360;

  const isVisible = elevation > 0;
  const irradiance = isVisible ? Math.max(0, 1000 * Math.sin(elevation * Math.PI / 180) * (0.7 + Math.random() * 0.3)) : 0;

  const season = getSeason(date);

  return {
    time: formatTime(hour),
    hour,
    azimuth,
    elevation: Math.max(0, elevation),
    irradiance,
    isVisible,
    season
  };
}

function calculateSeasonalSunPaths(latitude: number, longitude: number) {
  const currentYear = new Date().getFullYear();

  const seasons = {
    summer: new Date(currentYear, 5, 21), // June 21
    winter: new Date(currentYear, 11, 21), // December 21
    spring: new Date(currentYear, 2, 21), // March 21
    autumn: new Date(currentYear, 8, 21) // September 21
  };

  const seasonalData: { [key: string]: any[] } = {};

  Object.entries(seasons).forEach(([season, date]) => {
    seasonalData[season] = [];
    for (let hour = 6; hour <= 18; hour += 1) {
      const position = calculateSunPosition(latitude, longitude, date, hour);
      if (position.isVisible) {
        seasonalData[season].push({
          ...position,
          season,
        });
      }
    }
  });

  return seasonalData;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getSeason(date: Date): 'winter' | 'spring' | 'summer' | 'autumn' {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function formatTime(hour: number): string {
  const hours = Math.floor(hour);
  const minutes = Math.floor((hour - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export default SunHorizonChart;