'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { energyDataSimulator, type SimulatedAsset } from '../../../components/map/utils/dataSimulator';
import GoogleMapProvider from '../../../components/map/GoogleMapProvider';
import AssetLocationMap from '../../../components/map/AssetLocationMap';
import { getProductByModel, getProductImage } from '../../../lib/productCatalog';
import Image from 'next/image';
import {
  ArrowLeft,
  Zap,
  Battery,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Clock,
  Thermometer,
  BarChart3,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Use the same Asset type from the data simulator
type Asset = SimulatedAsset;

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to the data simulator and find the specific asset
    const unsubscribe = energyDataSimulator.subscribe((simulatedAssets) => {
      const foundAsset = simulatedAssets.find(a => a.id === params.id);
      setAsset(foundAsset || null);
      setLoading(false);
    });

    // Start simulation automatically
    energyDataSimulator.start(3000); // Update every 3 seconds

    return () => {
      unsubscribe();
      energyDataSimulator.stop();
    };
  }, [params.id]);

  // Generate historical data for charts
  const generateHistoricalData = (asset: Asset) => {
    const data = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseSOC = asset.performance.stateOfCharge;
      const basePower = asset.performance.power;

      data.push({
        time: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        soc: Math.max(10, Math.min(95, baseSOC + (Math.random() - 0.5) * 20)),
        power: basePower + (Math.random() - 0.5) * 10,
        efficiency: asset.performance.efficiency + (Math.random() - 0.5) * 5,
        voltage: asset.performance.voltage + (Math.random() - 0.5) * 10,
        current: asset.performance.current + (Math.random() - 0.5) * 50,
        timestamp: timestamp.toISOString()
      });
    }

    return data;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'discharging': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'charging': return <TrendingDown className="h-5 w-5 text-blue-600" />;
      case 'idle': return <Activity className="h-5 w-5 text-yellow-600" />;
      default: return <Battery className="h-5 w-5 text-[#6B7280]" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-[#6B7280]';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B7280]">Loading battery details...</div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#1A1D23] mb-2">Battery Not Found</h2>
            <p className="text-[#6B7280] mb-4">The requested battery system could not be found.</p>
            <Button onClick={() => router.push('/assets')} variant="outline" className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Batteries
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const historicalData = generateHistoricalData(asset);

  return (
    <GoogleMapProvider>
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/assets')}
                  className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                    <Battery className="h-8 w-8 mr-3 text-[#FF8C00]" />
                    {asset.name}
                  </h1>
                  <p className="text-[#6B7280]">
                    {asset.model} • {asset.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusIcon(asset.status)}
                <Badge variant={getStatusBadgeVariant(asset.status)} className="text-sm">
                  {asset.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Product Image & Overview */}
            <Card className="bg-white border-[#E5E7EB] shadow-sm mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product Image */}
                  <div className="md:col-span-1">
                    <div className="relative w-full h-64 bg-[#F8F9FA] rounded-lg overflow-hidden border border-[#E5E7EB]">
                      <Image
                        src={getProductImage(asset.model)}
                        alt={`${asset.model} Battery Container`}
                        fill
                        className="object-contain p-4"
                        priority
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#1A1D23] mb-2">{asset.model}</h3>
                        <p className="text-[#6B7280]">
                          {getProductByModel(asset.model)?.name || 'A123 Battery Storage Container'}
                        </p>
                      </div>
                      <Badge className="bg-[#FF8C00] text-white">
                        {getProductByModel(asset.model)?.category === 'utility' ? 'Utility Scale' : 'C&I'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Capacity</p>
                        <p className="text-sm font-semibold text-[#1A1D23]">{asset.capacity} MWh</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Chemistry</p>
                        <p className="text-sm font-semibold text-[#1A1D23]">
                          {getProductByModel(asset.model)?.chemistry.split(' ')[0] || 'LFP'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Cooling</p>
                        <p className="text-sm font-semibold text-[#1A1D23]">
                          {getProductByModel(asset.model)?.coolingType || 'Liquid'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Rated Power</p>
                        <p className="text-sm font-semibold text-[#1A1D23]">{asset.power} MW</p>
                      </div>
                    </div>

                    {getProductByModel(asset.model)?.features && (
                      <div>
                        <p className="text-xs text-[#6B7280] mb-2 font-semibold">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {getProductByModel(asset.model)!.features.slice(0, 4).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="border-[#E5E7EB] text-[#6B7280] text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#6B7280] flex items-center">
                    <Battery className="h-4 w-4 mr-2" />
                    State of Charge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#FF8C00]">
                    {asset.performance.stateOfCharge.toFixed(1)}%
                  </div>
                  <Progress value={asset.performance.stateOfCharge} className="mt-2" />
                  <p className="text-xs text-[#6B7280] mt-2">
                    {asset.performance.energy.toFixed(1)} MWh stored
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#6B7280] flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Power Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${
                    asset.performance.power > 0 ? 'text-green-600' :
                    asset.performance.power < 0 ? 'text-blue-600' : 'text-[#6B7280]'
                  }`}>
                    {asset.performance.power > 0 ? '+' : ''}{asset.performance.power.toFixed(1)} MW
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">
                    {asset.performance.power > 0 ? 'Discharging' : asset.performance.power < 0 ? 'Charging' : 'Idle'}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Max: {asset.power} MW
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#6B7280] flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {asset.health.stateOfHealth.toFixed(1)}%
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">
                    Efficiency: {asset.performance.efficiency.toFixed(1)}%
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Cycles: {asset.performance.cycleCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#6B7280] flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#1A1D23]">
                    {asset.capacity} MWh
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">
                    Available: {(asset.capacity * asset.performance.stateOfCharge / 100).toFixed(1)} MWh
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Power: {asset.power} MW
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">State of Charge - Last 24 Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                        />
                        <Area type="monotone" dataKey="soc" stroke="#FF8C00" fill="#FF8C00" fillOpacity={0.3} name="SOC %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Power Flow - Last 24 Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                        />
                        <Line type="monotone" dataKey="power" stroke="#10B981" strokeWidth={2} dot={false} name="Power (MW)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Efficiency & Voltage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" strokeWidth={2} dot={false} name="Efficiency %" />
                        <Line type="monotone" dataKey="voltage" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Voltage (V)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Current Draw</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                        />
                        <Bar dataKey="current" fill="#FF8C00" name="Current (A)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Model</span>
                      <span className="text-[#1A1D23] font-medium">{asset.model}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Capacity</span>
                      <span className="text-[#1A1D23] font-medium">{asset.capacity} MWh</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Rated Power</span>
                      <span className="text-[#1A1D23] font-medium">{asset.power} MW</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Voltage</span>
                      <span className="text-[#1A1D23] font-medium">{asset.performance.voltage.toFixed(0)} V</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Current</span>
                      <span className="text-[#1A1D23] font-medium">{asset.performance.current.toFixed(0)} A</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Round-trip Efficiency</span>
                      <span className="text-[#1A1D23] font-medium">{asset.performance.efficiency.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280]">Cycle Count</span>
                      <span className="text-[#1A1D23] font-medium">{asset.performance.cycleCount}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#6B7280]">State of Health</span>
                      <span className="text-green-600 font-medium">{asset.health.stateOfHealth.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[#6B7280] text-sm">Address</p>
                      <p className="text-[#1A1D23] font-medium">{asset.location}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] text-sm">Coordinates</p>
                      <p className="text-[#1A1D23] font-medium">
                        {asset.lat.toFixed(4)}°, {asset.lng.toFixed(4)}°
                      </p>
                    </div>
                    <div className="h-48 rounded-lg overflow-hidden border border-[#E5E7EB]">
                      <AssetLocationMap asset={asset} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Section */}
            {asset.alerts.length > 0 && (
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Active Alerts ({asset.alerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {asset.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-[#F8F9FA] rounded-lg hover:bg-[#E5E7EB] transition-colors"
                      >
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[#1A1D23] font-medium">{alert.message}</span>
                            <Badge variant={alert.severity === 'high' ? 'error' : 'warning'}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#6B7280] capitalize">{alert.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </GoogleMapProvider>
  );
}