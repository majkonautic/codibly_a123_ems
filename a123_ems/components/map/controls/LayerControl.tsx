'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import {
  Layers,
  Zap,
  TrendingUp,
  Cloud,
  Activity,
  Target,
  Thermometer,
  Wind,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface MapLayer {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  category: 'assets' | 'data' | 'environment' | 'analytics';
  premium?: boolean;
}

interface LayerControlProps {
  layers: MapLayer[];
  onLayerToggle: (layerId: string, enabled: boolean) => void;
  className?: string;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onLayerToggle,
  className = ''
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['assets', 'data', 'environment', 'analytics'])
  );

  const categoryIcons = {
    assets: <Target className="h-4 w-4" />,
    data: <Activity className="h-4 w-4" />,
    environment: <Cloud className="h-4 w-4" />,
    analytics: <TrendingUp className="h-4 w-4" />
  };

  const categoryNames = {
    assets: 'Asset Layers',
    data: 'Real-time Data',
    environment: 'Environmental',
    analytics: 'Analytics & Predictions'
  };

  const groupedLayers = layers.reduce((groups, layer) => {
    if (!groups[layer.category]) {
      groups[layer.category] = [];
    }
    groups[layer.category].push(layer);
    return groups;
  }, {} as Record<string, MapLayer[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const enabledLayersCount = layers.filter(layer => layer.enabled).length;

  if (collapsed) {
    return (
      <Card className={`bg-white border-[#E5E7EB] w-12 ${className}`}>
        <CardContent className="p-2">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full p-2 text-[#6B7280] hover:text-[#1A1D23] transition-colors rounded"
            title="Expand Layer Control"
          >
            <Layers className="h-5 w-5 mx-auto" />
            <div className="text-xs mt-1">{enabledLayersCount}</div>
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white border-[#E5E7EB] h-full shadow-lg flex flex-col ${className}`}>
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#1A1D23] flex items-center text-xl">
            <Layers className="h-6 w-6 mr-3 text-[#FF8C00]" />
            Map Layers & Controls
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-[#E5E7EB] text-[#6B7280] text-sm px-3 py-1">
              {enabledLayersCount}/{layers.length} Active
            </Badge>
            <button
              onClick={() => setCollapsed(true)}
              className="text-[#6B7280] hover:text-[#1A1D23] transition-colors p-2"
              title="Collapse Layer Control"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
        </div>
        <p className="text-[#6B7280] text-sm mt-2">Control visualization layers and map overlays</p>
      </CardHeader>

      <CardContent className="space-y-5 flex-1 overflow-y-auto">
        {Object.entries(groupedLayers).map(([category, categoryLayers]) => {
          const isExpanded = expandedCategories.has(category);
          const enabledInCategory = categoryLayers.filter(l => l.enabled).length;

          return (
            <div key={category} className="space-y-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-[#F8F9FA] hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB]"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-[#FF8C00]">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </div>
                  <span className="text-[#1A1D23] font-semibold text-base">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </span>
                  {enabledInCategory > 0 && (
                    <Badge variant="secondary" className="bg-[#FF8C00] text-white text-sm px-2 py-1">
                      {enabledInCategory} active
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#6B7280]" />
                )}
              </button>

              {/* Category Layers */}
              {isExpanded && (
                <div className="space-y-3 pl-3">
                  {categoryLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                        layer.enabled
                          ? 'bg-white border-[#FF8C00] shadow-md'
                          : 'bg-[#F8F9FA] border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`text-lg ${layer.enabled ? 'text-[#FF8C00]' : 'text-[#9CA3AF]'}`}>
                          {layer.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-base font-medium ${
                              layer.enabled ? 'text-[#1A1D23]' : 'text-[#6B7280]'
                            }`}>
                              {layer.name}
                            </span>
                            {layer.premium && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-600 text-xs">
                                PRO
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[#6B7280]">
                            {layer.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={layer.enabled}
                        onCheckedChange={(enabled) => onLayerToggle(layer.id, enabled)}
                        disabled={false}
                        className="ml-4 data-[state=checked]:bg-[#FF8C00]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Layer Statistics & Quick Actions */}
        <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
          <div className="p-4 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <h4 className="text-[#1A1D23] font-semibold mb-3 flex items-center text-base">
              <Activity className="h-5 w-5 mr-2 text-[#FF8C00]" />
              Layer Status
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Total:</span>
                <span className="text-[#1A1D23] font-medium">{layers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Active:</span>
                <span className="text-green-600 font-medium">{enabledLayersCount}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB]">
            <h4 className="text-[#1A1D23] font-semibold mb-3 flex items-center text-base">
              <Zap className="h-5 w-5 mr-2 text-[#FF8C00]" />
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => layers.forEach(layer => onLayerToggle(layer.id, true))}
                className="w-full p-2 text-sm bg-[#FF8C00] hover:bg-[#D97706] text-white rounded-lg transition-colors font-medium"
              >
                Enable All Layers
              </button>
              <button
                onClick={() => layers.forEach(layer => onLayerToggle(layer.id, false))}
                className="w-full p-2 text-sm bg-[#6B7280] hover:bg-[#4B5563] text-white rounded-lg transition-colors font-medium"
              >
                Disable All Layers
              </button>
            </div>
          </div>

          <div className="text-sm text-[#6B7280] space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#FF8C00] rounded-full"></div>
              <span>Real-time data layers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Premium features (enabled for demo)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Environmental overlays</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Default layer configuration for EMS/SCADA
export const createDefaultLayers = (): MapLayer[] => [
  // Asset Layers
  {
    id: 'assets',
    name: 'Energy Assets',
    description: 'Solar, wind, battery, and substation markers',
    icon: <Zap className="h-4 w-4" />,
    enabled: true,
    category: 'assets'
  },
  {
    id: 'transmission-lines',
    name: 'Transmission Lines',
    description: 'High-voltage transmission network',
    icon: <Activity className="h-4 w-4" />,
    enabled: true,
    category: 'assets'
  },

  // Real-time Data
  {
    id: 'power-flow',
    name: 'Power Flow Animation',
    description: 'Animated power flow with MW values',
    icon: <TrendingUp className="h-4 w-4" />,
    enabled: true,
    category: 'data'
  },
  {
    id: 'telemetry',
    name: 'Real-time Telemetry',
    description: 'Live MW, kV, Hz values on map',
    icon: <Activity className="h-4 w-4" />,
    enabled: false,
    category: 'data'
  },
  {
    id: 'alarms',
    name: 'Alarm Indicators',
    description: 'Active alarms and alerts',
    icon: <Target className="h-4 w-4" />,
    enabled: true,
    category: 'data'
  },

  // Environmental
  {
    id: 'weather',
    name: 'Weather Overlay',
    description: 'Temperature, wind, and conditions',
    icon: <Cloud className="h-4 w-4" />,
    enabled: false,
    category: 'environment'
  },
  {
    id: 'temperature',
    name: 'Temperature Heat Map',
    description: 'Regional temperature visualization',
    icon: <Thermometer className="h-4 w-4" />,
    enabled: false,
    category: 'environment'
  },
  {
    id: 'wind-speed',
    name: 'Wind Speed Vectors',
    description: 'Wind direction and speed arrows',
    icon: <Wind className="h-4 w-4" />,
    enabled: false,
    category: 'environment'
  },

  // Analytics (Premium features for POC)
  {
    id: 'demand-heatmap',
    name: 'Demand Heat Map',
    description: 'Energy demand intensity visualization',
    icon: <TrendingUp className="h-4 w-4" />,
    enabled: false,
    category: 'analytics',
    premium: true
  },
  {
    id: 'congestion-zones',
    name: 'Congestion Analysis',
    description: 'Network congestion and bottlenecks',
    icon: <Target className="h-4 w-4" />,
    enabled: false,
    category: 'analytics',
    premium: true
  },
  {
    id: 'failure-prediction',
    name: 'Predictive Failures',
    description: 'AI-predicted equipment failure zones',
    icon: <Activity className="h-4 w-4" />,
    enabled: false,
    category: 'analytics',
    premium: true
  }
];

export default LayerControl;