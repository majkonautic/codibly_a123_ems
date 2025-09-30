'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sidebar } from '../../components/layout/sidebar';
import { getProductThumbnail } from '../../lib/productCatalog';
import { MetricsCard } from '../../components/dashboard/metrics-card';
import { StatusChart } from '../../components/dashboard/status-chart';
import { BatterySOCChart } from '../../components/dashboard/battery-soc-chart';
import { PowerFlowChart } from '../../components/dashboard/power-flow-chart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { energyDataSimulator, type SimulatedAsset } from '../../components/map/utils/dataSimulator';
import {
  Battery,
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingDown
} from 'lucide-react';

// Use the same Asset type from the data simulator
type Asset = SimulatedAsset;

interface PortfolioData {
  totalCapacity: number; // Total MWh
  totalPower: number; // Total MW rated power
  currentPowerFlow: number; // Current MW (positive=discharging, negative=charging)
  averageSOC: number; // Average state of charge %
  averageSOH: number; // Average state of health %
  efficiency: number; // Average round-trip efficiency %
  assetCount: number;
  statusCounts: Record<string, number>;
  lastUpdated: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Subscribe to the data simulator (same as map and assets pages)
    const unsubscribe = energyDataSimulator.subscribe((simulatedAssets) => {
      setAssets(simulatedAssets);

      // Calculate portfolio data from simulated battery assets
      const totalCapacity = simulatedAssets.reduce((sum, asset) => sum + asset.capacity, 0);
      const totalPower = simulatedAssets.reduce((sum, asset) => sum + asset.power, 0);
      const currentPowerFlow = simulatedAssets.reduce((sum, asset) =>
        sum + (asset.performance?.power || 0), 0);
      const avgSOC = simulatedAssets.reduce((sum, asset) =>
        sum + (asset.performance?.stateOfCharge || 0), 0) / simulatedAssets.length;
      const avgSOH = simulatedAssets.reduce((sum, asset) =>
        sum + (asset.health?.stateOfHealth || 100), 0) / simulatedAssets.length;
      const avgEfficiency = simulatedAssets.reduce((sum, asset) =>
        sum + (asset.performance?.efficiency || 0), 0) / simulatedAssets.length;

      const statusCounts = simulatedAssets.reduce((counts, asset) => {
        counts[asset.status] = (counts[asset.status] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      setPortfolio({
        totalCapacity,
        totalPower,
        currentPowerFlow,
        averageSOC: avgSOC,
        averageSOH: avgSOH,
        efficiency: avgEfficiency,
        assetCount: simulatedAssets.length,
        statusCounts,
        lastUpdated: new Date().toISOString()
      });

      setLoading(false);
    });

    // Start simulation automatically
    energyDataSimulator.start(3000); // Update every 3 seconds

    return () => {
      unsubscribe();
      energyDataSimulator.stop();
    };
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(assets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = assets.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
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

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B7280]">Loading...</div>
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
                A123 Battery Management Dashboard
              </h1>
              <p className="text-[#6B7280]">
                Welcome back, {session?.user?.username}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
              <Clock className="h-4 w-4" />
              <span>Last updated: {portfolio ? new Date(portfolio.lastUpdated).toLocaleTimeString() : '--'}</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricsCard
              title="Total Capacity"
              value={portfolio?.totalCapacity?.toFixed(0) || '0'}
              unit="MWh"
              icon={<Battery className="h-4 w-4" />}
              change={`${portfolio?.totalPower?.toFixed(0) || '0'} MW power`}
              changeType="neutral"
            />
            <MetricsCard
              title="Power Flow"
              value={Math.abs(portfolio?.currentPowerFlow || 0).toFixed(1)}
              unit="MW"
              icon={portfolio?.currentPowerFlow > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              change={portfolio?.currentPowerFlow > 0 ? 'Discharging' : portfolio?.currentPowerFlow < 0 ? 'Charging' : 'Idle'}
              changeType={portfolio?.currentPowerFlow > 0 ? 'positive' : portfolio?.currentPowerFlow < 0 ? 'neutral' : 'warning'}
            />
            <MetricsCard
              title="Average SOC"
              value={portfolio?.averageSOC?.toFixed(1) || '0'}
              unit="%"
              icon={<Activity className="h-4 w-4" />}
              change={`${portfolio?.efficiency?.toFixed(1) || '0'}% efficiency`}
              changeType="positive"
            />
            <MetricsCard
              title="System Health"
              value={portfolio?.averageSOH?.toFixed(1) || '100'}
              unit="%"
              icon={<Zap className="h-4 w-4" />}
              change={`${assets.reduce((sum, asset) => sum + asset.alerts.length, 0)} active alerts`}
              changeType={assets.reduce((sum, asset) => sum + asset.alerts.length, 0) > 0 ? 'warning' : 'positive'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Status Distribution */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio?.statusCounts ? (
                  <StatusChart data={portfolio.statusCounts} />
                ) : (
                  <div className="h-64 flex items-center justify-center text-[#6B7280]">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Battery SOC Chart */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Average State of Charge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BatterySOCChart assets={assets} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assets
                  .flatMap(asset =>
                    asset.alerts.map((alert, alertIndex) => ({
                      ...alert,
                      assetName: asset.name,
                      assetId: asset.id,
                      alertId: alert.id || `ALT-${asset.id.toUpperCase().replace('-', '')}-${(alertIndex + 1).toString().padStart(2, '0')}`
                    }))
                  )
                  .slice(0, 5)
                  .map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#E5E7EB] cursor-pointer transition-colors"
                      onClick={() => router.push(`/alerts/${alert.alertId}`)}
                    >
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[#1A1D23] font-medium">{alert.assetName}</span>
                          <Badge variant={alert.severity === 'high' ? 'error' : 'warning'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6B7280]">{alert.message}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Click to view details</p>
                      </div>
                    </div>
                  ))}
                {assets.every(asset => asset.alerts.length === 0) && (
                  <div className="text-center py-8 text-[#6B7280]">
                    No active alerts
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Power Flow Analysis */}
          <div className="mb-6">
            <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Battery Power Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PowerFlowChart assets={assets} view="individual" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Summary Table */}
          <Card className="bg-white border-[#E5E7EB] hover:border-[#FF8C00] shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-[#1A1D23]">Battery Container Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Product</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Battery System</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Model</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Capacity</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Power Flow</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">SOC</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAssets.map((asset) => {
                      return (
                        <tr
                          key={asset.id}
                          className="border-b border-[#E5E7EB] hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                          onClick={() => router.push(`/assets/${asset.id}`)}
                        >
                          <td className="py-3 px-4">
                            <div className="relative w-16 h-12 bg-[#F8F9FA] rounded border border-[#E5E7EB]">
                              <Image
                                src={getProductThumbnail(asset.model)}
                                alt={`${asset.model}`}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#1A1D23] font-medium">{asset.name}</td>
                          <td className="py-3 px-4 text-[#6B7280]">{asset.model}</td>
                          <td className="py-3 px-4 text-[#6B7280]">{asset.capacity} MWh</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${
                              asset.performance?.power > 0 ? 'text-green-600' :
                              asset.performance?.power < 0 ? 'text-blue-600' : 'text-[#6B7280]'
                            }`}>
                              {asset.performance?.power > 0 ? '↑' : asset.performance?.power < 0 ? '↓' : ''}
                              {Math.abs(asset.performance?.power || 0).toFixed(1)} MW
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={asset.performance?.stateOfCharge || 0}
                                className="w-16 h-2"
                              />
                              <span className="text-sm text-[#6B7280]">
                                {asset.performance?.stateOfCharge?.toFixed(0) || '0'}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusBadgeVariant(asset.status)}>
                              {asset.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-[#6B7280]">
                            {asset.health?.stateOfHealth?.toFixed(0) || '100'}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E5E7EB]">
                  <div className="text-sm text-[#6B7280]">
                    Showing {startIndex + 1} to {Math.min(endIndex, assets.length)} of {assets.length} containers
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F8F9FA] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#FF8C00] text-white'
                                : 'text-[#6B7280] bg-white border border-[#E5E7EB] hover:bg-[#F8F9FA]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-2 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F8F9FA] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}