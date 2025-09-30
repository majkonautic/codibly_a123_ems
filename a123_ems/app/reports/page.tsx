'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { energyDataSimulator, type SimulatedAsset } from '../../components/map/utils/dataSimulator';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Battery
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Use SimulatedAsset type from the data simulator
type Asset = SimulatedAsset;

interface ReportData {
  totalPowerFlow: number;
  averageEfficiency: number;
  totalCapacity: number;
  averageSOC: number;
  statusByType: Array<{ type: string; count: number; color: string }>;
  dailyPowerFlow: Array<{ date: string; charging: number; discharging: number }>;
  batteryPerformance: Array<{ id: string; name: string; efficiency: number; soc: number; power: number; cycles: number }>;
  statusDistribution: Array<{ status: string; count: number; color: string }>;
}

export default function ReportsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Subscribe to the data simulator (consistent with other pages)
    const unsubscribe = energyDataSimulator.subscribe((simulatedAssets) => {
      setAssets(simulatedAssets);

      // Generate report data from simulated assets
      const report = generateReportData(simulatedAssets);
      setReportData(report);
      setLoading(false);
    });

    // Start simulation automatically
    energyDataSimulator.start(3000);

    return () => {
      unsubscribe();
      energyDataSimulator.stop();
    };
  }, [timeRange]);

  const generateReportData = (assets: Asset[]): ReportData => {
    const totalCapacity = assets.reduce((sum, asset) => sum + asset.capacity, 0);
    const totalPowerFlow = assets.reduce((sum, asset) => {
      return sum + Math.abs(asset.performance?.power || 0);
    }, 0);

    const averageEfficiency = assets.reduce((sum, asset) => {
      return sum + (asset.performance?.efficiency || 0);
    }, 0) / assets.length;

    const averageSOC = assets.reduce((sum, asset) => {
      return sum + (asset.performance?.stateOfCharge || 50);
    }, 0) / assets.length;

    // Status by battery model type
    const modelCounts = assets.reduce((acc, asset) => {
      const modelType = asset.model.split('-')[0]; // GRID, FLEX, ULTRA, MEGA
      acc[modelType] = (acc[modelType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusByType = Object.entries(modelCounts).map(([type, count]) => ({
      type: type,
      count,
      color: type === 'GRID' ? '#FF8C00' : type === 'FLEX' ? '#10B981' : type === 'ULTRA' ? '#3B82F6' : '#8B5CF6'
    }));

    // Generate daily data for the last 7 days
    const dailyPowerFlow = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const charging = Math.random() * totalCapacity * 0.3;
      const discharging = Math.random() * totalCapacity * 0.35;

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        charging,
        discharging
      };
    });

    // Battery performance summary
    const batteryPerformance = assets.map(asset => {
      return {
        id: asset.id,
        name: asset.name,
        efficiency: asset.performance?.efficiency || 0,
        soc: asset.performance?.stateOfCharge || 50,
        power: asset.performance?.power || 0,
        cycles: asset.performance?.cycleCount || 0
      };
    });

    // Status distribution
    const statusCounts = assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      color: status === 'discharging' ? '#10B981' :
             status === 'charging' ? '#3B82F6' :
             status === 'idle' ? '#F59E0B' :
             status === 'standby' ? '#8B5CF6' :
             status === 'maintenance' ? '#EF4444' : '#6B7280'
    }));

    return {
      totalPowerFlow,
      averageEfficiency,
      totalCapacity,
      averageSOC,
      statusByType,
      dailyPowerFlow,
      batteryPerformance,
      statusDistribution
    };
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    // In a real application, this would generate and download the actual report
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B7280]">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                <Battery className="h-8 w-8 mr-3 text-[#FF8C00]" />
                A123 Battery Reports & Analytics
              </h1>
              <p className="text-[#6B7280]">
                Battery performance insights and operational metrics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-[#E5E7EB] text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent rounded-md px-3 py-2"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport('csv')}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport('pdf')}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Total Power Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1A1D23]">
                  {reportData?.totalPowerFlow.toFixed(1)} MW
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Active battery power
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Avg Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1A1D23]">
                  {reportData?.averageEfficiency.toFixed(1)}%
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Round-trip efficiency
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <Battery className="h-4 w-4 mr-2" />
                  Average SOC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1A1D23]">
                  {reportData?.averageSOC.toFixed(1)}%
                </div>
                <p className="text-xs text-[#FF8C00] mt-1">
                  State of charge
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Total Batteries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1A1D23]">
                  {assets.length}
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  {reportData?.totalCapacity.toFixed(1)} MWh capacity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Power Flow Trends Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1D23] mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-[#FF8C00]" />
              Power Flow Trends
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Daily Charge/Discharge Cycles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData?.dailyPowerFlow}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="discharging"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                          name="Discharging"
                        />
                        <Line
                          type="monotone"
                          dataKey="charging"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          name="Charging"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Battery Systems by Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={reportData?.statusByType}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {reportData?.statusByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                          formatter={(value: number) => [`${value} systems`, 'Count']}
                        />
                        <Legend wrapperStyle={{ color: '#6B7280' }} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Battery Performance Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1D23] mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-[#FF8C00]" />
              Battery Performance
            </h2>
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Battery Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E7EB]">
                        <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Battery Name</th>
                        <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Power Flow</th>
                        <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">SOC</th>
                        <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Efficiency</th>
                        <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Cycles</th>
                        <th className="text-left py-3 px-4 text-[#6B7280] font-semibold">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData?.batteryPerformance.map((battery, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#E5E7EB] hover:bg-[#F8F9FA] cursor-pointer transition-colors"
                          onClick={() => router.push(`/assets/${battery.id}`)}
                        >
                          <td className="py-3 px-4 text-[#1A1D23] font-medium">{battery.name}</td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${
                              battery.power > 0 ? 'text-green-600' :
                              battery.power < 0 ? 'text-blue-600' : 'text-[#6B7280]'
                            }`}>
                              {battery.power > 0 ? '↑' : battery.power < 0 ? '↓' : ''}
                              {Math.abs(battery.power).toFixed(1)} MW
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#1A1D23]">{battery.soc.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-[#1A1D23]">{battery.efficiency.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-[#1A1D23]">{battery.cycles}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                battery.efficiency > 85 ? 'success' :
                                battery.efficiency > 70 ? 'warning' : 'error'
                              }
                            >
                              {battery.efficiency > 85 ? 'Excellent' :
                               battery.efficiency > 70 ? 'Good' : 'Poor'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1D23] mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-3 text-[#FF8C00]" />
              System Status & Distribution
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Battery Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData?.statusDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="status" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            color: '#1A1D23'
                          }}
                        />
                        <Bar dataKey="count">
                          {reportData?.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23]">Key Battery Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Total Power Flow</span>
                    <span className="text-[#1A1D23] font-medium">
                      {reportData?.totalPowerFlow.toFixed(1)} MW
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Average SOC</span>
                    <span className="text-[#1A1D23] font-medium">
                      {reportData?.averageSOC.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">System Efficiency</span>
                    <span className="text-[#1A1D23] font-medium">
                      {reportData?.averageEfficiency.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Online Systems</span>
                    <span className="text-[#1A1D23] font-medium">
                      {assets.filter(a => a.status !== 'offline' && a.status !== 'maintenance').length} / {assets.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Total Capacity</span>
                    <span className="text-[#1A1D23] font-medium">
                      {reportData?.totalCapacity.toFixed(1)} MWh
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Active Batteries</span>
                    <span className="text-[#1A1D23] font-medium">
                      {assets.filter(a => a.status === 'charging' || a.status === 'discharging').length} systems
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}