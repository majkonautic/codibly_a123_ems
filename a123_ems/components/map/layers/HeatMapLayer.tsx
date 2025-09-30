'use client';

import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '../GoogleMapProvider';

interface HeatMapPoint {
  lat: number;
  lng: number;
  weight: number;
}

interface HeatMapLayerProps {
  enabled: boolean;
  type: 'demand' | 'temperature' | 'generation';
  assets: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    capacity: number;
    performances: Array<{ generation: number }>;
  }>;
}

export const HeatMapLayer: React.FC<HeatMapLayerProps> = ({
  enabled,
  type,
  assets
}) => {
  const { mapInstance } = useGoogleMap();
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!mapInstance || !enabled) {
      // Clean up existing heatmap
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      return;
    }

    // Check if visualization library is loaded
    if (!google?.maps?.visualization?.HeatmapLayer) {
      console.error('Google Maps visualization library not loaded');
      return;
    }

    // Generate heat map data points
    const heatMapData = generateHeatMapData(type, assets);

    if (heatMapData.length === 0) {
      console.warn(`No heat map data generated for type: ${type}`);
      return;
    }

    console.log(`Creating heatmap with ${heatMapData.length} points for type: ${type}`);

    // Create heatmap layer
    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: heatMapData.map(point => ({
        location: new google.maps.LatLng(point.lat, point.lng),
        weight: point.weight
      })),
      map: mapInstance
    });

    // Configure heatmap appearance based on type
    const heatmapConfig = getHeatmapConfig(type);
    heatmapRef.current.set('gradient', heatmapConfig.gradient);
    heatmapRef.current.set('radius', heatmapConfig.radius);
    heatmapRef.current.set('opacity', heatmapConfig.opacity);
    heatmapRef.current.set('maxIntensity', 10); // Set maximum intensity

    console.log(`Heatmap configured for ${type} with config:`, heatmapConfig);

    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [mapInstance, enabled, type, assets]);

  return null; // This component doesn't render anything directly
};

function generateHeatMapData(type: string, assets: any[]): HeatMapPoint[] {
  const points: HeatMapPoint[] = [];

  if (type === 'demand') {
    // Generate demand intensity around populated areas and assets
    assets.forEach(asset => {
      // Add points around each asset with simulated demand
      const demandRadius = 0.5; // degrees
      const pointCount = 20;

      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * 2 * Math.PI;
        const distance = Math.random() * demandRadius;
        const lat = asset.lat + Math.cos(angle) * distance;
        const lng = asset.lng + Math.sin(angle) * distance;

        // Weight based on asset capacity and random demand factor
        const baseWeight = asset.capacity / 100;
        const demandFactor = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
        const weight = baseWeight * demandFactor;

        points.push({ lat, lng, weight });
      }
    });

    // Add some urban centers with high demand
    const urbanCenters = [
      { lat: 40.7128, lng: -74.0060, population: 8.3 }, // NYC
      { lat: 34.0522, lng: -118.2437, population: 4.0 }, // LA
      { lat: 41.8781, lng: -87.6298, population: 2.7 }, // Chicago
      { lat: 29.7604, lng: -95.3698, population: 2.3 }, // Houston
      { lat: 33.4484, lng: -112.0740, population: 1.7 } // Phoenix
    ];

    urbanCenters.forEach(center => {
      const pointCount = Math.floor(center.population * 10);
      const radius = 0.3;

      for (let i = 0; i < pointCount; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;
        const lat = center.lat + Math.cos(angle) * distance;
        const lng = center.lng + Math.sin(angle) * distance;
        const weight = center.population * (0.8 + Math.random() * 0.4);

        points.push({ lat, lng, weight });
      }
    });

  } else if (type === 'temperature') {
    // Generate temperature data across a grid
    const latRange = { min: 32, max: 48 };
    const lngRange = { min: -125, max: -70 };
    const gridSize = 50;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = latRange.min + (i / gridSize) * (latRange.max - latRange.min);
        const lng = lngRange.min + (j / gridSize) * (lngRange.max - lngRange.min);

        // Simulate temperature based on latitude (warmer in south)
        const baseTemp = 70 - (lat - 32) * 2; // Rough temperature gradient
        const variation = (Math.random() - 0.5) * 20; // ±10°F variation
        const temperature = baseTemp + variation;

        // Normalize temperature to weight (0-1)
        const weight = Math.max(0, Math.min(1, (temperature - 20) / 80));

        if (Math.random() > 0.8) { // Only show 20% of points to avoid clutter
          points.push({ lat, lng, weight });
        }
      }
    }

  } else if (type === 'generation') {
    // Generate renewable generation potential
    assets.forEach(asset => {
      if (asset.type === 'solar' || asset.type === 'wind') {
        const generation = asset.performances[0]?.generation || 0;
        const capacity = asset.capacity;
        const efficiency = capacity > 0 ? generation / capacity : 0;

        // Add multiple points around high-performing assets
        const pointCount = Math.floor(efficiency * 15) + 5;
        const radius = 0.2;

        for (let i = 0; i < pointCount; i++) {
          const angle = (i / pointCount) * 2 * Math.PI;
          const distance = Math.random() * radius;
          const lat = asset.lat + Math.cos(angle) * distance;
          const lng = asset.lng + Math.sin(angle) * distance;
          const weight = efficiency * (0.8 + Math.random() * 0.4);

          points.push({ lat, lng, weight });
        }
      }
    });
  }

  return points;
}

function getHeatmapConfig(type: string) {
  switch (type) {
    case 'demand':
      return {
        gradient: [
          'rgba(0, 255, 255, 0)',     // Transparent cyan
          'rgba(0, 255, 255, 1)',     // Cyan
          'rgba(0, 191, 255, 1)',     // Deep sky blue
          'rgba(0, 127, 255, 1)',     // Blue
          'rgba(127, 0, 255, 1)',     // Violet
          'rgba(255, 0, 255, 1)',     // Magenta
          'rgba(255, 0, 127, 1)',     // Pink
          'rgba(255, 0, 0, 1)'        // Red
        ],
        radius: 50,
        opacity: 0.6
      };

    case 'temperature':
      return {
        gradient: [
          'rgba(0, 0, 255, 0)',       // Transparent blue (cold)
          'rgba(0, 0, 255, 1)',       // Blue
          'rgba(0, 255, 255, 1)',     // Cyan
          'rgba(0, 255, 0, 1)',       // Green
          'rgba(255, 255, 0, 1)',     // Yellow
          'rgba(255, 165, 0, 1)',     // Orange
          'rgba(255, 0, 0, 1)'        // Red (hot)
        ],
        radius: 40,
        opacity: 0.5
      };

    case 'generation':
      return {
        gradient: [
          'rgba(0, 255, 0, 0)',       // Transparent green
          'rgba(0, 255, 0, 0.3)',     // Light green
          'rgba(50, 255, 50, 0.6)',   // Medium green
          'rgba(100, 255, 100, 0.8)', // Bright green
          'rgba(150, 255, 150, 1)',   // Very bright green
          'rgba(200, 255, 200, 1)'    // Brilliant green
        ],
        radius: 35,
        opacity: 0.7
      };

    default:
      return {
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(127, 0, 255, 1)',
          'rgba(255, 0, 255, 1)',
          'rgba(255, 0, 127, 1)',
          'rgba(255, 0, 0, 1)'
        ],
        radius: 50,
        opacity: 0.6
      };
  }
}

export default HeatMapLayer;