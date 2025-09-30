'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import MapContainer from '../../components/map/MapContainer';
import GoogleMapProvider from '../../components/map/GoogleMapProvider';
import { LayerControl, createDefaultLayers, type MapLayer } from '../../components/map/controls/LayerControl';
import { energyDataSimulator, type SimulatedAsset } from '../../components/map/utils/dataSimulator';
import {
  MapPin,
  Zap,
  Battery,
  Filter,
  Layers,
  RotateCcw,
  Map as MapIcon,
  Satellite,
  Play,
  Pause,
  RefreshCw,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';


// Use the SimulatedAsset type from the data simulator
type Asset = SimulatedAsset;

export default function MapPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // Geographic center of US
  const [mapZoom, setMapZoom] = useState(4);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>(createDefaultLayers());
  const [simulationRunning, setSimulationRunning] = useState(false);

  useEffect(() => {
    // Subscribe to the data simulator
    const unsubscribe = energyDataSimulator.subscribe((simulatedAssets) => {
      setAssets(simulatedAssets);
      setLoading(false);
    });

    // Start simulation automatically
    energyDataSimulator.start(3000); // Update every 3 seconds
    setSimulationRunning(true);

    return () => {
      unsubscribe();
      energyDataSimulator.stop();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discharging': return '#10B981'; // green
      case 'charging': return '#3B82F6'; // blue
      case 'idle': return '#F59E0B'; // yellow
      case 'standby': return '#8B5CF6'; // purple
      case 'maintenance': return '#EF4444'; // red
      case 'offline': return '#6B7280'; // gray
      default: return '#6B7280'; // gray
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'charging': return TrendingDown;
      case 'discharging': return TrendingUp;
      case 'idle': return Activity;
      default: return Battery;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'discharging': return 'success';
      case 'charging': return 'default';
      case 'idle': return 'warning';
      case 'standby': return 'secondary';
      case 'maintenance': return 'error';
      case 'offline': return 'error';
      default: return 'secondary';
    }
  };

  const handleAssetSelect = (asset: SimulatedAsset | Asset) => {
    setSelectedAsset(asset);
    setMapCenter([asset.lat, asset.lng]);
    setMapZoom(8);

    // Scroll to top of the page to show the map
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const resetMapView = () => {
    setMapCenter([39.8283, -98.5795]);
    setMapZoom(4);
    setSelectedAsset(null);
  };

  const handleLayerToggle = (layerId: string, enabled: boolean) => {
    setMapLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, enabled } : layer
      )
    );
  };

  const toggleSimulation = () => {
    if (simulationRunning) {
      energyDataSimulator.stop();
      setSimulationRunning(false);
    } else {
      energyDataSimulator.start(3000);
      setSimulationRunning(true);
    }
  };

  const triggerManualUpdate = () => {
    energyDataSimulator.triggerUpdate();
  };

  const statusCounts = assets.reduce((counts, asset) => {
    counts[asset.status] = (counts[asset.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <GoogleMapProvider>
        <div className="flex h-screen bg-[#F8F9FA]">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[#6B7280]">Loading map...</div>
          </div>
        </div>
      </GoogleMapProvider>
    );
  }

  return (
    <GoogleMapProvider>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Sidebar />
        <main className="flex-1 flex flex-col">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                <Battery className="h-8 w-8 mr-3 text-[#FF8C00]" />
                A123 Battery Storage Map
              </h1>
              <p className="text-[#6B7280]">
                Real-time monitoring of {assets.length} A123 battery storage systems across the United States
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={simulationRunning ? "default" : "outline"}
                  size="sm"
                  onClick={toggleSimulation}
                  className={simulationRunning
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                  }
                >
                  {simulationRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Live Data
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Sim
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerManualUpdate}
                  className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                  disabled={simulationRunning}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={resetMapView}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Map Section with Layer Controls */}
          <div className="flex h-[55vh]">
            {/* Enhanced Google Maps */}
            <div className="flex-1 p-6 pr-0">
              <div className="h-full bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
                <MapContainer
                  assets={assets}
                  center={mapCenter}
                  zoom={mapZoom}
                  onAssetClick={handleAssetSelect as any}
                  selectedAsset={selectedAsset}
                  layers={mapLayers}
                />
              </div>
            </div>

            {/* Layer Controls Sidebar */}
            <div className="w-96 p-6 pl-3 flex flex-col h-full">
              <div className="flex-1 min-h-0 flex">
                <LayerControl
                  layers={mapLayers}
                  onLayerToggle={handleLayerToggle}
                  className="h-full flex-1 flex flex-col"
                />
              </div>
            </div>
          </div>

          {/* Horizontal Legend */}
          <div className="px-6 pb-4 relative z-10">
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 relative z-10">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#1A1D23] flex items-center text-lg">
                  <Layers className="h-5 w-5 mr-2" />
                  Battery Status Legend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="flex items-center space-x-3 p-3 bg-[#F8F9FA] rounded-lg">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getStatusColor(status) }}
                      />
                      <div className="flex-1">
                        <div className="text-sm text-[#1A1D23] capitalize font-medium">{status}</div>
                        <div className="text-xs text-[#6B7280]">{count} assets</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assets Table/Grid */}
          <div className="px-6 pb-6">
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#1A1D23] flex items-center">
                  <Battery className="h-5 w-5 mr-2" />
                  A123 Battery Systems ({assets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {assets.map((asset) => {
                      const StatusIcon = getStatusIcon(asset.status);

                      return (
                        <div
                          key={asset.id}
                          className="p-4 rounded-lg cursor-pointer transition-all duration-200 border bg-white border-[#E5E7EB] hover:bg-[#F8F9FA] hover:border-[#FF8C00] shadow-sm"
                          onClick={() => handleAssetSelect(asset)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Battery className="h-5 w-5 text-[#FF8C00]" />
                              <span className="text-[#1A1D23] font-medium text-sm">{asset.name}</span>
                            </div>
                            <Badge variant={getStatusBadgeVariant(asset.status)} className="text-xs">
                              {asset.status}
                            </Badge>
                          </div>

                          <p className="text-xs text-[#6B7280] mb-1">{asset.location}</p>
                          <p className="text-xs text-[#9CA3AF] mb-3">Model: {asset.model}</p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#6B7280]">SOC</span>
                              <span className="text-[#1A1D23] font-medium">
                                {asset.performance?.stateOfCharge?.toFixed(1) || '0'}%
                              </span>
                            </div>
                            <Progress
                              value={asset.performance?.stateOfCharge || 0}
                              className="h-2"
                            />

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#6B7280] flex items-center">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                Power
                              </span>
                              <span className={`font-medium ${
                                asset.performance?.power > 0 ? 'text-green-600' :
                                asset.performance?.power < 0 ? 'text-blue-600' : 'text-[#6B7280]'
                              }`}>
                                {Math.abs(asset.performance?.power || 0).toFixed(1)} MW
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#6B7280]">Capacity</span>
                              <span className="text-[#1A1D23]">{asset.capacity} MWh</span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#6B7280]">Health</span>
                              <span className="text-green-600">
                                {asset.health?.stateOfHealth?.toFixed(1) || '100'}%
                              </span>
                            </div>

                            {asset.alerts.length > 0 && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[#6B7280]">Alerts</span>
                                <span className="text-yellow-600 font-medium">
                                  {asset.alerts.length}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </main>
      </div>
    </GoogleMapProvider>
  );
}