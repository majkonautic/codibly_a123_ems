'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sidebar } from '../../components/layout/sidebar';
import { getProductThumbnail } from '../../lib/productCatalog';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { energyDataSimulator, type SimulatedAsset } from '../../components/map/utils/dataSimulator';
import {
  Search,
  Filter,
  Zap,
  Battery,
  AlertTriangle,
  Eye,
  Grid3x3,
  List,
  Activity,
  Power,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Gauge,
  Thermometer,
  Heart
} from 'lucide-react';

// Use the same Asset type from the data simulator
type Asset = SimulatedAsset;

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to the data simulator (same as map page)
    const unsubscribe = energyDataSimulator.subscribe((simulatedAssets) => {
      setAssets(simulatedAssets);
      setFilteredAssets(simulatedAssets);
      setLoading(false);
    });

    // Start simulation automatically
    energyDataSimulator.start(3000); // Update every 3 seconds

    return () => {
      unsubscribe();
      energyDataSimulator.stop();
    };
  }, []);

  useEffect(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.status === statusFilter);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, statusFilter]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'charging': return <TrendingDown className="h-4 w-4" />;
      case 'discharging': return <TrendingUp className="h-4 w-4" />;
      case 'idle': return <Activity className="h-4 w-4" />;
      default: return <Battery className="h-4 w-4" />;
    }
  };

  // Calculate summary statistics for batteries
  const calculateSummaryStats = () => {
    const statusCounts = assets.reduce((counts, asset) => {
      counts[asset.status] = (counts[asset.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const totalCapacity = assets.reduce((sum, asset) => sum + asset.capacity, 0);
    const totalPower = assets.reduce((sum, asset) => sum + asset.power, 0);
    const currentPowerFlow = assets.reduce((sum, asset) =>
      sum + (asset.performance?.power || 0), 0);

    const totalAlerts = assets.reduce((sum, asset) => sum + asset.alerts.length, 0);
    const activeAlerts = assets.filter(asset => asset.alerts.length > 0).length;

    const averageSOC = assets.length > 0
      ? assets.reduce((sum, asset) =>
          sum + (asset.performance?.stateOfCharge || 0), 0) / assets.length
      : 0;

    const averageSOH = assets.length > 0
      ? assets.reduce((sum, asset) =>
          sum + (asset.health?.stateOfHealth || 100), 0) / assets.length
      : 0;

    const averageEfficiency = assets.length > 0
      ? assets.reduce((sum, asset) =>
          sum + (asset.performance?.efficiency || 0), 0) / assets.length
      : 0;

    const operationalAssets = (statusCounts.charging || 0) + (statusCounts.discharging || 0) + (statusCounts.idle || 0);
    const offlineAssets = (statusCounts.offline || 0) + (statusCounts.maintenance || 0);

    return {
      statusCounts,
      totalCapacity,
      totalPower,
      currentPowerFlow,
      totalAlerts,
      activeAlerts,
      averageSOC,
      averageSOH,
      averageEfficiency,
      operationalAssets,
      offlineAssets,
      totalEnergyStored: assets.reduce((sum, asset) =>
        sum + (asset.performance?.energy || 0), 0)
    };
  };

  const stats = calculateSummaryStats();

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B7280]">Loading battery systems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                <Battery className="h-8 w-8 mr-3 text-[#FF8C00]" />
                A123 Battery Container Management
              </h1>
              <p className="text-[#6B7280]">
                Monitor and manage {assets.length} A123 battery storage systems
              </p>
            </div>
          </div>

          {/* Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {/* Total Assets */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Containers</p>
                    <p className="text-2xl font-bold text-[#1A1D23]">{assets.length}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Status */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Operational</p>
                    <p className="text-2xl font-bold text-green-600">{stats.operationalAssets}</p>
                    <p className="text-xs text-[#9CA3AF]">{stats.offlineAssets} offline</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Capacity */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Capacity</p>
                    <p className="text-2xl font-bold text-[#1A1D23]">{stats.totalCapacity.toFixed(0)}</p>
                    <p className="text-xs text-[#9CA3AF]">MWh energy</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Battery className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Power Flow */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Power Flow</p>
                    <p className={`text-2xl font-bold ${stats.currentPowerFlow > 0 ? 'text-green-600' : stats.currentPowerFlow < 0 ? 'text-blue-600' : 'text-[#6B7280]'}`}>
                      {Math.abs(stats.currentPowerFlow).toFixed(0)}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">MW {stats.currentPowerFlow > 0 ? 'discharging' : stats.currentPowerFlow < 0 ? 'charging' : 'idle'}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stats.currentPowerFlow > 0 ? 'bg-green-50' : stats.currentPowerFlow < 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <Activity className={`h-5 w-5 ${stats.currentPowerFlow > 0 ? 'text-green-500' : stats.currentPowerFlow < 0 ? 'text-blue-500' : 'text-gray-500'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average SOC */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Avg SOC</p>
                    <p className="text-2xl font-bold text-cyan-600">{stats.averageSOC.toFixed(1)}%</p>
                    <Progress value={stats.averageSOC} className="h-1 mt-2" />
                  </div>
                  <div className="p-2 bg-cyan-50 rounded-lg">
                    <Gauge className="h-5 w-5 text-cyan-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts Summary */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Active Alerts</p>
                    <p className={`text-2xl font-bold ${stats.totalAlerts > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {stats.totalAlerts}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">{stats.activeAlerts} assets affected</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stats.totalAlerts > 0 ? 'bg-yellow-50' : 'bg-green-50'}`}>
                    {stats.totalAlerts > 0 ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Battery Health & Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Avg Health</p>
                    <p className="text-xl font-bold text-green-600">{stats.averageSOH.toFixed(1)}%</p>
                  </div>
                  <Heart className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Efficiency</p>
                    <p className="text-xl font-bold text-cyan-600">{stats.averageEfficiency.toFixed(1)}%</p>
                  </div>
                  <Activity className="h-6 w-6 text-cyan-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Power</p>
                    <p className="text-xl font-bold text-[#1A1D23]">{stats.totalPower.toFixed(0)} MW</p>
                  </div>
                  <Zap className="h-6 w-6 text-[#FF8C00]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Energy Stored</p>
                    <p className="text-xl font-bold text-purple-600">{stats.totalEnergyStored.toFixed(0)} MWh</p>
                  </div>
                  <Battery className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution */}
          <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300 mb-8">
            <CardHeader>
              <CardTitle className="text-[#1A1D23] flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.statusCounts.discharging || 0}</div>
                  <div className="text-sm text-[#6B7280]">Discharging</div>
                  <Progress
                    value={assets.length > 0 ? ((stats.statusCounts.discharging || 0) / assets.length) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.statusCounts.charging || 0}</div>
                  <div className="text-sm text-[#6B7280]">Charging</div>
                  <Progress
                    value={assets.length > 0 ? ((stats.statusCounts.charging || 0) / assets.length) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.statusCounts.idle || 0}</div>
                  <div className="text-sm text-[#6B7280]">Idle</div>
                  <Progress
                    value={assets.length > 0 ? ((stats.statusCounts.idle || 0) / assets.length) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.statusCounts.standby || 0}</div>
                  <div className="text-sm text-[#6B7280]">Standby</div>
                  <Progress
                    value={assets.length > 0 ? ((stats.statusCounts.standby || 0) / assets.length) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.statusCounts.maintenance || 0}</div>
                  <div className="text-sm text-[#6B7280]">Maintenance</div>
                  <Progress
                    value={assets.length > 0 ? ((stats.statusCounts.maintenance || 0) / assets.length) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.statusCounts.offline || 0}</div>
                  <div className="text-sm text-[#6B7280]">Offline</div>
                  <Progress
                    value={assets.length > 0 ? ((stats.statusCounts.offline || 0) / assets.length) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">Average Efficiency:</span>
                  <span className="text-[#1A1D23] font-semibold">{stats.averageEfficiency.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] h-4 w-4" />
              <Input
                placeholder="Search battery containers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-[#E5E7EB] text-[#1A1D23] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#6B7280]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#E5E7EB] text-[#1A1D23] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="discharging">Discharging</option>
                <option value="charging">Charging</option>
                <option value="idle">Idle</option>
                <option value="standby">Standby</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="flex items-center space-x-1 bg-white rounded-md p-1 border border-[#E5E7EB]">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`p-2 h-8 w-8 ${viewMode === 'grid' ? 'bg-[#FF8C00] text-white' : 'text-[#6B7280] hover:bg-[#F8F9FA]'}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`p-2 h-8 w-8 ${viewMode === 'list' ? 'bg-[#FF8C00] text-white' : 'text-[#6B7280] hover:bg-[#F8F9FA]'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Battery Containers Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredAssets.map((asset) => {
                const hasAlerts = asset.alerts.length > 0;

                return (
                  <Link key={asset.id} href={`/assets/${asset.id}`}>
                    <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                      <CardContent className="p-4 space-y-3">
                        {/* Product Image */}
                        <div className="relative w-full h-24 bg-[#F8F9FA] rounded-lg overflow-hidden border border-[#E5E7EB]">
                          <Image
                            src={getProductThumbnail(asset.model)}
                            alt={`${asset.model}`}
                            fill
                            className="object-contain p-2"
                          />
                          <div className="absolute top-2 right-2 flex items-center space-x-1">
                            {getStatusIcon(asset.status)}
                            {hasAlerts && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-[#1A1D23] text-sm truncate">{asset.name}</h3>
                          <p className="text-xs text-[#6B7280]">{asset.model} • {asset.capacity} MWh</p>
                        </div>

                        <Badge variant={getStatusBadgeVariant(asset.status)} className="text-xs">
                          {asset.status}
                        </Badge>

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#6B7280]">SOC</span>
                              <span className="text-xs text-[#1A1D23] font-medium">
                                {asset.performance?.stateOfCharge?.toFixed(1) || '0'}%
                              </span>
                            </div>
                            <Progress
                              value={asset.performance?.stateOfCharge || 0}
                              className="h-1"
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6B7280]">Power</span>
                            <span className={`font-medium ${
                              asset.performance?.power > 0 ? 'text-green-600' :
                              asset.performance?.power < 0 ? 'text-blue-600' : 'text-[#6B7280]'
                            }`}>
                              {Math.abs(asset.performance?.power || 0).toFixed(1)} MW
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#6B7280]">Health</span>
                            <span className="text-green-600">
                              {asset.health?.stateOfHealth?.toFixed(0) || '100'}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset) => {
                const hasAlerts = asset.alerts.length > 0;

                return (
                  <Link key={asset.id} href={`/assets/${asset.id}`}>
                    <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Product Thumbnail */}
                            <div className="relative w-20 h-16 bg-[#F8F9FA] rounded-lg overflow-hidden border border-[#E5E7EB] flex-shrink-0">
                              <Image
                                src={getProductThumbnail(asset.model)}
                                alt={`${asset.model}`}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-[#1A1D23]">{asset.name}</h3>
                                <Badge variant={getStatusBadgeVariant(asset.status)}>
                                  {asset.status}
                                </Badge>
                                {hasAlerts && (
                                  <div className="flex items-center space-x-1">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    <span className="text-xs text-yellow-500">
                                      {asset.alerts.length} alert{asset.alerts.length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-6 mt-2">
                                <p className="text-sm text-[#6B7280]">{asset.model} • {asset.capacity} MWh</p>
                                <p className="text-sm text-[#6B7280]">{asset.location}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <div className="text-sm text-[#1A1D23]">
                                {Math.abs(asset.performance?.power || 0).toFixed(1)} MW
                              </div>
                              <div className="text-xs text-[#6B7280]">
                                {asset.performance?.efficiency?.toFixed(0) || '0'}% efficiency
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-cyan-600">
                                {asset.performance?.stateOfCharge?.toFixed(1) || '0'}% SOC
                              </div>
                              <div className="text-xs text-green-600">
                                {asset.health?.stateOfHealth?.toFixed(0) || '100'}% Health
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#1A1D23] mb-2">No assets found</h3>
              <p className="text-[#6B7280]">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No assets available to display'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}