'use client';

import { Sun, Wind, Battery, Zap } from 'lucide-react';
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

interface InteractiveMapProps {
  assets: Asset[];
  center: [number, number];
  zoom: number;
  onAssetClick: (asset: Asset | SimulatedAsset) => void;
  selectedAsset: Asset | SimulatedAsset | null;
}

export default function InteractiveMap({
  assets,
  center,
  zoom,
  onAssetClick,
  selectedAsset
}: InteractiveMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exporting': return '#10B981'; // green
      case 'curtailing': return '#F59E0B'; // yellow
      case 'offline': return '#EF4444'; // red
      case 'charging': return '#3B82F6'; // blue
      default: return '#6B7280'; // gray
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar': return Sun;
      case 'wind': return Wind;
      case 'battery': return Battery;
      default: return Zap;
    }
  };

  // For demo purposes, create a simple grid layout representing geographic positions
  const getGridPosition = (lat: number, lng: number) => {
    // Normalize lat/lng to grid positions (0-100)
    const normalizedLat = ((lat - 32) / (42 - 32)) * 100; // Approximate US lat range
    const normalizedLng = ((lng + 125) / (-66 + 125)) * 100; // Approximate US lng range

    return {
      top: `${Math.max(5, Math.min(95, 100 - normalizedLat))}%`,
      left: `${Math.max(5, Math.min(95, normalizedLng))}%`
    };
  };

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-blue-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
      {/* Background map representation */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 1000 600" className="w-full h-full">
          {/* Simplified US map outline */}
          <path
            d="M100,200 L200,180 L300,190 L400,185 L500,180 L600,185 L700,190 L800,195 L850,220 L880,250 L900,300 L890,350 L850,400 L800,420 L700,430 L600,425 L500,420 L400,415 L300,410 L200,405 L100,400 Z"
            fill="rgba(59, 130, 246, 0.1)"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 11 }, (_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full border-t border-gray-400"
            style={{ top: `${i * 10}%` }}
          />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full border-l border-gray-400"
            style={{ left: `${i * 10}%` }}
          />
        ))}
      </div>

      {/* Assets */}
      {assets.map((asset) => {
        const IconComponent = getTypeIcon(asset.type);
        const isSelected = selectedAsset?.id === asset.id;
        const position = getGridPosition(asset.lat, asset.lng);
        const latest = asset.performances[0];

        return (
          <div
            key={asset.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
              isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
            }`}
            style={position}
            onClick={() => onAssetClick(asset)}
            title={asset.name}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${
                isSelected ? 'ring-4 ring-blue-400' : ''
              }`}
              style={{ backgroundColor: getStatusColor(asset.status) }}
            >
              <IconComponent className="w-4 h-4 text-white" />
            </div>

            {/* Asset name label */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {asset.name}
              <br />
              <span className="text-gray-300">
                {latest?.generation?.toFixed(1) || '0'} MW
              </span>
            </div>
          </div>
        );
      })}

      {/* Map controls overlay */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
        Interactive Asset Map
      </div>
    </div>
  );
}