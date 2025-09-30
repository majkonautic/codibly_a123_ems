'use client';

import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '../GoogleMapProvider';

interface WeatherLayerProps {
  enabled: boolean;
  assets: Array<{
    id: string;
    lat: number;
    lng: number;
    name: string;
    type: string;
  }>;
}

export const WeatherLayer: React.FC<WeatherLayerProps> = ({
  enabled,
  assets
}) => {
  const { mapInstance } = useGoogleMap();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const weatherDataRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapInstance || !enabled) {
      // Clean up existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      return;
    }

    // Generate weather data for asset locations
    const weatherData = generateWeatherData(assets);
    weatherDataRef.current = weatherData;

    // Create weather markers
    weatherData.forEach(weather => {
      const marker = new google.maps.Marker({
        position: { lat: weather.lat, lng: weather.lng },
        icon: createWeatherIcon(weather),
        title: `${weather.location}: ${weather.temperature}°F, ${weather.condition}`,
        map: mapInstance,
        zIndex: 500
      });

      markersRef.current.push(marker);

      // Add info window with detailed weather info
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="
              background-color: white;
              color: #1f2937;
              font-family: system-ui, -apple-system, sans-serif;
              padding: 16px;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              min-width: 260px;
              max-width: 320px;
            ">
              <h4 style="
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
                display: flex;
                align-items: center;
                gap: 6px;
              ">${weather.condition} Weather</h4>

              <div style="margin-bottom: 12px;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                  <strong>Location:</strong> ${weather.location}
                </p>
              </div>

              <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin: 12px 0;
                font-size: 13px;
                line-height: 1.4;
              ">
                <div>
                  <div style="margin: 4px 0;">
                    <strong style="color: #6b7280;">Temperature:</strong>
                    <span style="color: #1f2937; font-weight: 500;">${weather.temperature}°F</span>
                  </div>
                  <div style="margin: 4px 0;">
                    <strong style="color: #6b7280;">Humidity:</strong>
                    <span style="color: #1f2937; font-weight: 500;">${weather.humidity}%</span>
                  </div>
                  <div style="margin: 4px 0;">
                    <strong style="color: #6b7280;">Pressure:</strong>
                    <span style="color: #1f2937; font-weight: 500;">${weather.pressure} mb</span>
                  </div>
                </div>
                <div>
                  <div style="margin: 4px 0;">
                    <strong style="color: #6b7280;">Wind:</strong>
                    <span style="color: #1f2937; font-weight: 500;">${weather.windSpeed} mph ${weather.windDirection}</span>
                  </div>
                  <div style="margin: 4px 0;">
                    <strong style="color: #6b7280;">Visibility:</strong>
                    <span style="color: #1f2937; font-weight: 500;">${weather.visibility} mi</span>
                  </div>
                  <div style="margin: 4px 0;">
                    <strong style="color: #6b7280;">UV Index:</strong>
                    <span style="color: #1f2937; font-weight: 500;">${weather.uvIndex}</span>
                  </div>
                </div>
              </div>

              <div style="
                border-top: 1px solid #e5e7eb;
                padding-top: 12px;
                font-size: 12px;
                color: #6b7280;
                line-height: 1.4;
                font-style: italic;
              ">
                ${weather.forecast}
              </div>
            </div>
          `,
          position: { lat: weather.lat, lng: weather.lng }
        });
        infoWindow.open(mapInstance);
      });
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [mapInstance, enabled, assets]);

  return null;
};

function generateWeatherData(assets: any[]) {
  const weatherStations: Array<{
    lat: number;
    lng: number;
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    uvIndex: number;
    forecast: string;
  }> = [];

  // Create weather stations near asset clusters
  const regions = [
    { name: 'California Central Valley', lat: 36.7783, lng: -119.4179, baseTemp: 72 },
    { name: 'Texas Panhandle', lat: 35.0067, lng: -101.8313, baseTemp: 75 },
    { name: 'Kansas Plains', lat: 38.5266, lng: -96.7265, baseTemp: 68 },
    { name: 'Arizona Desert', lat: 33.4484, lng: -112.0740, baseTemp: 85 },
    { name: 'Nevada Basin', lat: 39.1638, lng: -115.7681, baseTemp: 70 },
    { name: 'Colorado Rockies', lat: 39.0598, lng: -105.3111, baseTemp: 65 },
    { name: 'New Mexico High Plains', lat: 34.8405, lng: -106.2485, baseTemp: 73 },
    { name: 'Wyoming Valley', lat: 42.7475, lng: -107.2026, baseTemp: 62 }
  ];

  regions.forEach(region => {
    // Check if there are assets nearby
    const nearbyAssets = assets.filter(asset => {
      const distance = calculateDistance(asset.lat, asset.lng, region.lat, region.lng);
      return distance < 3; // Within ~3 degrees
    });

    if (nearbyAssets.length > 0) {
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear', 'Windy'];
      const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const forecasts = [
        'Ideal conditions for solar generation',
        'Good wind conditions expected',
        'Variable cloud cover throughout the day',
        'Steady conditions with light winds',
        'High pressure system bringing clear skies'
      ];

      const temperature = region.baseTemp + (Math.random() - 0.5) * 20; // ±10°F variation
      const condition = conditions[Math.floor(Math.random() * conditions.length)];

      weatherStations.push({
        lat: region.lat + (Math.random() - 0.5) * 0.5, // Small random offset
        lng: region.lng + (Math.random() - 0.5) * 0.5,
        location: region.name,
        temperature: Math.round(temperature),
        condition,
        humidity: Math.round(30 + Math.random() * 40), // 30-70%
        pressure: Math.round(1000 + Math.random() * 40), // 1000-1040 mb
        windSpeed: Math.round(5 + Math.random() * 15), // 5-20 mph
        windDirection: windDirections[Math.floor(Math.random() * windDirections.length)],
        visibility: Math.round(8 + Math.random() * 7), // 8-15 mi
        uvIndex: Math.round(3 + Math.random() * 7), // 3-10
        forecast: forecasts[Math.floor(Math.random() * forecasts.length)]
      });
    }
  });

  return weatherStations;
}

function createWeatherIcon(weather: any): google.maps.Icon {
  // Choose icon based on weather condition
  let emoji: string;
  let color: string;

  switch (weather.condition) {
    case 'Sunny':
    case 'Clear':
      emoji = '☀️';
      color = '%23f59e0b'; // yellow
      break;
    case 'Partly Cloudy':
      emoji = '⛅';
      color = '%236b7280'; // gray
      break;
    case 'Cloudy':
      emoji = '☁️';
      color = '%234b5563'; // dark gray
      break;
    case 'Windy':
      emoji = '💨';
      color = '%2306b6d4'; // cyan
      break;
    default:
      emoji = '🌤️';
      color = '%236b7280';
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2" opacity="0.8"/>
      <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">${emoji}</text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 20)
  };
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 0.00872665; // Convert to approximate degrees
}

export default WeatherLayer;