'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { energyDataSimulator } from '../../components/map/utils/dataSimulator';
import type { SimulatedAsset } from '../../components/map/utils/dataSimulator';
import {
  Activity,
  Zap,
  TrendingUp,
  DollarSign,
  Timer,
  Radio,
  Gauge,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Circle
} from 'lucide-react';

export default function AncillaryServicesPage() {
  const [assets, setAssets] = useState<SimulatedAsset[]>([]);

  useEffect(() => {
    const unsubscribe = energyDataSimulator.subscribe((updatedAssets) => {
      setAssets(updatedAssets);
    });

    return unsubscribe;
  }, []);

  // Aggregate portfolio-level ancillary services
  const portfolioMetrics = {
    frequencyRegulation: {
      totalRegUp: 0,
      totalRegDown: 0,
      avgSignalFollowing: 0,
      avgResponseTime: 0,
      totalEvents24h: 0,
      totalRevenue24h: 0,
      activeAssets: 0
    },
    spinningReserve: {
      totalCapacity: 0,
      totalDeployments: 0,
      avgResponseTime: 0,
      totalRevenue: 0,
      activeAssets: 0
    },
    nonSpinningReserve: {
      totalCapacity: 0,
      totalDeployments: 0,
      totalRevenue: 0,
      activeAssets: 0
    },
    loadFollowing: {
      totalCapacity: 0,
      avgAccuracy: 0,
      totalRevenue: 0,
      activeAssets: 0
    },
    voltageSupport: {
      totalCapacity: 0,
      totalActivations: 0,
      totalRevenue: 0,
      activeAssets: 0
    },
    blackStart: {
      totalCapacity: 0,
      totalRevenue: 0,
      activeAssets: 0
    }
  };

  assets.forEach(asset => {
    const services = asset.ancillaryServices;

    // Frequency Regulation
    if (services.frequencyRegulation.enabled) {
      portfolioMetrics.frequencyRegulation.totalRegUp += services.frequencyRegulation.regUp;
      portfolioMetrics.frequencyRegulation.totalRegDown += services.frequencyRegulation.regDown;
      portfolioMetrics.frequencyRegulation.avgSignalFollowing += services.frequencyRegulation.signalFollowing;
      portfolioMetrics.frequencyRegulation.avgResponseTime += services.frequencyRegulation.responseTime;
      portfolioMetrics.frequencyRegulation.totalEvents24h += services.frequencyRegulation.events24h;
      portfolioMetrics.frequencyRegulation.totalRevenue24h += services.frequencyRegulation.revenue24h;
      portfolioMetrics.frequencyRegulation.activeAssets++;
    }

    // Spinning Reserve
    if (services.spinningReserve.enabled) {
      portfolioMetrics.spinningReserve.totalCapacity += services.spinningReserve.capacity;
      portfolioMetrics.spinningReserve.totalDeployments += services.spinningReserve.deployments;
      portfolioMetrics.spinningReserve.avgResponseTime += services.spinningReserve.avgResponseTime;
      portfolioMetrics.spinningReserve.totalRevenue += services.spinningReserve.revenue;
      portfolioMetrics.spinningReserve.activeAssets++;
    }

    // Non-Spinning Reserve
    if (services.nonSpinningReserve.enabled) {
      portfolioMetrics.nonSpinningReserve.totalCapacity += services.nonSpinningReserve.capacity;
      portfolioMetrics.nonSpinningReserve.totalDeployments += services.nonSpinningReserve.deployments;
      portfolioMetrics.nonSpinningReserve.totalRevenue += services.nonSpinningReserve.revenue;
      portfolioMetrics.nonSpinningReserve.activeAssets++;
    }

    // Load Following
    if (services.loadFollowing.enabled) {
      portfolioMetrics.loadFollowing.totalCapacity += services.loadFollowing.capacity;
      portfolioMetrics.loadFollowing.avgAccuracy += services.loadFollowing.trackingAccuracy;
      portfolioMetrics.loadFollowing.totalRevenue += services.loadFollowing.revenue;
      portfolioMetrics.loadFollowing.activeAssets++;
    }

    // Voltage Support
    if (services.voltageSupport.enabled) {
      portfolioMetrics.voltageSupport.totalCapacity += services.voltageSupport.reactiveCapacity;
      portfolioMetrics.voltageSupport.totalActivations += services.voltageSupport.activations;
      portfolioMetrics.voltageSupport.totalRevenue += services.voltageSupport.revenue;
      portfolioMetrics.voltageSupport.activeAssets++;
    }

    // Black Start
    if (services.blackStart.enabled) {
      portfolioMetrics.blackStart.totalCapacity += services.blackStart.capacity;
      portfolioMetrics.blackStart.totalRevenue += services.blackStart.revenue;
      portfolioMetrics.blackStart.activeAssets++;
    }
  });

  // Calculate averages
  if (portfolioMetrics.frequencyRegulation.activeAssets > 0) {
    portfolioMetrics.frequencyRegulation.avgSignalFollowing /= portfolioMetrics.frequencyRegulation.activeAssets;
    portfolioMetrics.frequencyRegulation.avgResponseTime /= portfolioMetrics.frequencyRegulation.activeAssets;
  }
  if (portfolioMetrics.spinningReserve.activeAssets > 0) {
    portfolioMetrics.spinningReserve.avgResponseTime /= portfolioMetrics.spinningReserve.activeAssets;
  }
  if (portfolioMetrics.loadFollowing.activeAssets > 0) {
    portfolioMetrics.loadFollowing.avgAccuracy /= portfolioMetrics.loadFollowing.activeAssets;
  }

  // Total revenue across all services
  const totalRevenue =
    portfolioMetrics.frequencyRegulation.totalRevenue24h +
    portfolioMetrics.spinningReserve.totalRevenue +
    portfolioMetrics.nonSpinningReserve.totalRevenue +
    portfolioMetrics.loadFollowing.totalRevenue +
    portfolioMetrics.voltageSupport.totalRevenue +
    portfolioMetrics.blackStart.totalRevenue;

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center mb-2">
              <Radio className="h-8 w-8 mr-3 text-[#FF8C00]" />
              Ancillary Services
            </h1>
            <p className="text-[#6B7280]">
              Real-time grid service performance and revenue tracking
            </p>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border-[#E5E7EB] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#FF8C00]">
                      ${(totalRevenue / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-[#9CA3AF]">Across all services</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-[#FF8C00]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Freq Regulation</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {portfolioMetrics.frequencyRegulation.totalRegUp.toFixed(0)} MW
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {portfolioMetrics.frequencyRegulation.avgSignalFollowing.toFixed(1)}% accuracy
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Spinning Reserve</p>
                    <p className="text-2xl font-bold text-green-600">
                      {portfolioMetrics.spinningReserve.totalCapacity.toFixed(0)} MW
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {portfolioMetrics.spinningReserve.totalDeployments} deployments
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] text-xs uppercase tracking-wide">Response Time</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {portfolioMetrics.frequencyRegulation.avgResponseTime.toFixed(0)}ms
                    </p>
                    <p className="text-xs text-[#9CA3AF]">Avg freq regulation</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Timer className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Frequency Regulation - Premium Service */}
          <Card className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-blue-900">
                  <Activity className="h-5 w-5 mr-2" />
                  Frequency Regulation (Millisecond Response)
                </span>
                <Badge className="bg-blue-600 text-white">
                  Premium Service
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-xs text-[#6B7280] mb-1">Regulation Up</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {portfolioMetrics.frequencyRegulation.totalRegUp.toFixed(1)} MW
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-xs text-[#6B7280] mb-1">Regulation Down</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {portfolioMetrics.frequencyRegulation.totalRegDown.toFixed(1)} MW
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-xs text-[#6B7280] mb-1">Signal Following</p>
                  <p className="text-2xl font-bold text-green-600">
                    {portfolioMetrics.frequencyRegulation.avgSignalFollowing.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-xs text-[#6B7280] mb-1">24h Revenue</p>
                  <p className="text-2xl font-bold text-[#FF8C00]">
                    ${(portfolioMetrics.frequencyRegulation.totalRevenue24h / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm font-semibold text-[#1A1D23] mb-3">Response Performance</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7280]">Avg Response Time</span>
                        <span className="font-semibold">{portfolioMetrics.frequencyRegulation.avgResponseTime.toFixed(0)}ms</span>
                      </div>
                      <Progress value={Math.min(100, (200 - portfolioMetrics.frequencyRegulation.avgResponseTime) / 2)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7280]">Signal Accuracy</span>
                        <span className="font-semibold">{portfolioMetrics.frequencyRegulation.avgSignalFollowing.toFixed(1)}%</span>
                      </div>
                      <Progress value={portfolioMetrics.frequencyRegulation.avgSignalFollowing} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm font-semibold text-[#1A1D23] mb-3">Activity (24h)</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6B7280]">Total Events</span>
                      <span className="text-lg font-bold text-blue-600">
                        {portfolioMetrics.frequencyRegulation.totalEvents24h}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#6B7280]">Active Assets</span>
                      <span className="text-lg font-bold text-blue-600">
                        {portfolioMetrics.frequencyRegulation.activeAssets}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Ancillary Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {/* Spinning Reserve */}
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-green-500" />
                  Spinning Reserve
                </CardTitle>
                <p className="text-xs text-[#6B7280]">10-minute response time</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Capacity</span>
                    <span className="text-lg font-bold text-green-600">
                      {portfolioMetrics.spinningReserve.totalCapacity.toFixed(1)} MW
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Deployments</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.spinningReserve.totalDeployments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Avg Response</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.spinningReserve.avgResponseTime.toFixed(0)}s
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6B7280]">Revenue</span>
                      <span className="text-lg font-bold text-[#FF8C00]">
                        ${(portfolioMetrics.spinningReserve.totalRevenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Non-Spinning Reserve */}
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Circle className="h-4 w-4 mr-2 text-yellow-500" />
                  Non-Spinning Reserve
                </CardTitle>
                <p className="text-xs text-[#6B7280]">30-minute response time</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Capacity</span>
                    <span className="text-lg font-bold text-yellow-600">
                      {portfolioMetrics.nonSpinningReserve.totalCapacity.toFixed(1)} MW
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Deployments</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.nonSpinningReserve.totalDeployments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Active Assets</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.nonSpinningReserve.activeAssets}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6B7280]">Revenue</span>
                      <span className="text-lg font-bold text-[#FF8C00]">
                        ${(portfolioMetrics.nonSpinningReserve.totalRevenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Load Following */}
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                  Load Following
                </CardTitle>
                <p className="text-xs text-[#6B7280]">5-minute dispatch</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Capacity</span>
                    <span className="text-lg font-bold text-purple-600">
                      {portfolioMetrics.loadFollowing.totalCapacity.toFixed(1)} MW
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Tracking Accuracy</span>
                    <span className="text-sm font-semibold text-green-600">
                      {portfolioMetrics.loadFollowing.avgAccuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Active Assets</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.loadFollowing.activeAssets}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6B7280]">Revenue</span>
                      <span className="text-lg font-bold text-[#FF8C00]">
                        ${(portfolioMetrics.loadFollowing.totalRevenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voltage Support */}
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Gauge className="h-4 w-4 mr-2 text-indigo-500" />
                  Voltage Support
                </CardTitle>
                <p className="text-xs text-[#6B7280]">Reactive power control</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Capacity</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {portfolioMetrics.voltageSupport.totalCapacity.toFixed(1)} MVAR
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Activations</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.voltageSupport.totalActivations}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Active Assets</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.voltageSupport.activeAssets}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6B7280]">Revenue</span>
                      <span className="text-lg font-bold text-[#FF8C00]">
                        ${(portfolioMetrics.voltageSupport.totalRevenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Black Start */}
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Radio className="h-4 w-4 mr-2 text-red-500" />
                  Black Start
                </CardTitle>
                <p className="text-xs text-[#6B7280]">Grid restoration capability</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Capacity</span>
                    <span className="text-lg font-bold text-red-600">
                      {portfolioMetrics.blackStart.totalCapacity.toFixed(1)} MW
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Certified Assets</span>
                    <span className="text-sm font-semibold text-[#1A1D23]">
                      {portfolioMetrics.blackStart.activeAssets}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#6B7280]">Type</span>
                    <Badge variant="outline" className="text-xs">
                      Capacity Payment
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6B7280]">Annual Revenue</span>
                      <span className="text-lg font-bold text-[#FF8C00]">
                        ${(portfolioMetrics.blackStart.totalRevenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset-Level Performance */}
          <div>
            <h2 className="text-xl font-bold text-[#1A1D23] mb-4">Asset Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {assets.map((asset) => {
                const freqReg = asset.ancillaryServices.frequencyRegulation;
                const isActive = freqReg.enabled && freqReg.events24h > 0;

                return (
                  <Card key={asset.id} className={`border-[#E5E7EB] ${isActive ? 'bg-blue-50' : 'bg-white'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm">{asset.name}</CardTitle>
                          <p className="text-xs text-[#6B7280]">{asset.location}</p>
                        </div>
                        {isActive && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {freqReg.enabled && (
                          <div className="p-2 bg-white rounded border border-blue-200">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-semibold text-blue-900">Frequency Reg</span>
                              <span className="text-xs font-bold text-blue-600">
                                ${(freqReg.revenue24h / 1000).toFixed(1)}K
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[#6B7280]">Accuracy</span>
                              <span className="font-semibold text-green-600">
                                {freqReg.signalFollowing.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {asset.ancillaryServices.spinningReserve.enabled && (
                            <div className="text-center p-2 bg-white rounded">
                              <p className="text-[#6B7280]">Spin Res</p>
                              <p className="font-semibold text-green-600">
                                {asset.ancillaryServices.spinningReserve.capacity.toFixed(0)} MW
                              </p>
                            </div>
                          )}
                          {asset.ancillaryServices.loadFollowing.enabled && (
                            <div className="text-center p-2 bg-white rounded">
                              <p className="text-[#6B7280]">Load Follow</p>
                              <p className="font-semibold text-purple-600">
                                {asset.ancillaryServices.loadFollowing.capacity.toFixed(0)} MW
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}