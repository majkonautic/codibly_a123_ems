'use client';

import React, { useState } from 'react';
import { getStatusColor } from './utils/mapConfig';
import type { SimulatedAsset } from './utils/dataSimulator';

interface Asset {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  lat: number;
  lng: number;
  status: string;
  performances: Array<{
    generation: number;
    availability: number;
    efficiency: number;
  }>;
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
}

interface FallbackMapProps {
  assets: Asset[];
  center: [number, number];
  zoom: number;
  onAssetClick: (asset: Asset | SimulatedAsset) => void;
  selectedAsset: Asset | SimulatedAsset | null;
  className?: string;
}

export const FallbackMap: React.FC<FallbackMapProps> = ({
  assets,
  center,
  zoom,
  onAssetClick,
  selectedAsset,
  className = "w-full h-full"
}) => {
  const [hoveredAsset, setHoveredAsset] = useState<Asset | null>(null);

  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectCoordinates = (lat: number, lng: number) => {
    // US bounding box approximation
    const minLat = 24.5; // Southern tip of Florida
    const maxLat = 49.0; // Northern border
    const minLng = -125.0; // West coast
    const maxLng = -66.0; // East coast

    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500;

    return { x: Math.max(20, Math.min(780, x)), y: Math.max(20, Math.min(480, y)) };
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'solar': return '☀️';
      case 'wind': return '💨';
      case 'battery': return '🔋';
      case 'substation': return '⚡';
      default: return '⚡';
    }
  };

  return (
    <div className={`${className} bg-gray-800 rounded-lg overflow-hidden relative`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">US Energy Assets Map</h3>
            <p className="text-gray-400 text-sm">Coordinate-based visualization ({assets.length} assets)</p>
          </div>
          <div className="text-yellow-400 text-sm">
            ⚠️ Fallback Mode
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        style={{ marginTop: '80px' }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* US outline approximation */}
        <rect
          x="50"
          y="50"
          width="700"
          height="400"
          fill="none"
          stroke="#4B5563"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.6"
        />

        {/* Geographic labels */}
        <text x="100" y="40" fill="#9CA3AF" fontSize="12" textAnchor="middle">West Coast</text>
        <text x="700" y="40" fill="#9CA3AF" fontSize="12" textAnchor="middle">East Coast</text>
        <text x="400" y="30" fill="#9CA3AF" fontSize="14" textAnchor="middle" fontWeight="bold">United States</text>

        {/* Assets */}
        {assets.map((asset) => {
          const { x, y } = projectCoordinates(asset.lat, asset.lng);
          const isSelected = selectedAsset?.id === asset.id;
          const isHovered = hoveredAsset?.id === asset.id;
          const statusColor = getStatusColor(asset.status);

          return (
            <g key={asset.id}>
              {/* Asset circle */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 12 : isHovered ? 10 : 8}
                fill={statusColor}
                stroke={isSelected ? '#ffffff' : isHovered ? '#ffffff' : statusColor}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                opacity={isSelected ? 1 : isHovered ? 0.9 : 0.8}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onAssetClick(asset)}
                onMouseEnter={() => setHoveredAsset(asset)}
                onMouseLeave={() => setHoveredAsset(null)}
              />

              {/* Asset label */}
              {(isSelected || isHovered) && (
                <g>
                  <rect
                    x={x - 60}
                    y={y - 35}
                    width="120"
                    height="20"
                    fill="#1F2937"
                    stroke="#4B5563"
                    strokeWidth="1"
                    rx="4"
                    opacity="0.95"
                  />
                  <text
                    x={x}
                    y={y - 21}
                    fill="#ffffff"
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {asset.name.length > 15 ? asset.name.substring(0, 15) + '...' : asset.name}
                  </text>
                  <text
                    x={x}
                    y={y - 8}
                    fill="#9CA3AF"
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {asset.performances[0]?.generation?.toFixed(1) || '0'} MW
                  </text>
                </g>
              )}

              {/* Type icon */}
              <text
                x={x}
                y={y + 4}
                fontSize="10"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {getAssetIcon(asset.type)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-90 p-3 rounded-lg">
        <h4 className="text-white text-sm font-semibold mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-300">Exporting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-300">Charging</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-300">Curtailing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-300">Offline</span>
          </div>
        </div>
      </div>

      {/* Asset info panel */}
      {hoveredAsset && (
        <div className="absolute top-20 right-4 bg-gray-900 bg-opacity-95 p-4 rounded-lg border border-gray-600 min-w-[250px]">
          <h4 className="text-white font-semibold mb-2">{hoveredAsset.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white capitalize">{hoveredAsset.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-white capitalize">{hoveredAsset.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Generation:</span>
              <span className="text-white">{hoveredAsset.performances[0]?.generation?.toFixed(1) || '0'} MW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Capacity:</span>
              <span className="text-white">{hoveredAsset.capacity} MW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span className="text-white text-right">{hoveredAsset.location}</span>
            </div>
            {hoveredAsset.alerts.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Alerts:</span>
                <span className="text-yellow-400">{hoveredAsset.alerts.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FallbackMap;