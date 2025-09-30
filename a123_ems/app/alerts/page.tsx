'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { energyDataSimulator, type SimulatedAsset } from '../../components/map/utils/dataSimulator';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Download,
  Bell,
  BellOff,
  User,
  MessageSquare,
  Zap,
  Battery,
  TrendingUp,
  BarChart3,
  PieChart,
  Thermometer
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Alert severity levels following ISA 18.2 standard
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'diagnostic';
type AlertStatus = 'active' | 'acknowledged' | 'in_progress' | 'resolved' | 'suppressed';
type AlertType = 'temperature' | 'voltage' | 'soc' | 'soh' | 'power' | 'cycle_count' | 'communication' | 'maintenance';

interface Alert {
  id: string;
  assetId: string;
  assetName: string;
  assetType: 'battery';
  location: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  type: AlertType;
  message: string;
  description: string;
  value?: number;
  unit?: string;
  threshold?: number;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notes?: string[];
  relatedAlerts?: string[];
}

export default function AlertsPage() {
  const [assets, setAssets] = useState<SimulatedAsset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertStates, setAlertStates] = useState<Map<string, { status: AlertStatus; acknowledgedBy?: string; acknowledgedAt?: string; resolvedBy?: string; resolvedAt?: string; notes?: string[] }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState({
    severity: 'all',
    status: 'all',
    alertType: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(true);

  // localStorage functions for alert state persistence
  const saveAlertStates = (states: Map<string, { status: AlertStatus; acknowledgedBy?: string; acknowledgedAt?: string; resolvedBy?: string; resolvedAt?: string; notes?: string[] }>) => {
    try {
      const statesObj = Object.fromEntries(states);
      localStorage.setItem('alertStates', JSON.stringify(statesObj));
    } catch (error) {
      console.warn('Failed to save alert states to localStorage:', error);
    }
  };

  const loadAlertStates = (): Map<string, { status: AlertStatus; acknowledgedBy?: string; acknowledgedAt?: string; resolvedBy?: string; resolvedAt?: string; notes?: string[] }> => {
    try {
      const saved = localStorage.getItem('alertStates');
      if (saved) {
        const statesObj = JSON.parse(saved);
        // Clean up old resolved alerts (older than 7 days)
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const cleanedStates = Object.fromEntries(
          Object.entries(statesObj).filter(([_, state]: [string, any]) => {
            if (state.status === 'resolved' && state.resolvedAt) {
              return new Date(state.resolvedAt) > oneWeekAgo;
            }
            return true;
          })
        );
        return new Map(Object.entries(cleanedStates));
      }
    } catch (error) {
      console.warn('Failed to load alert states from localStorage:', error);
    }
    return new Map();
  };

  // Function to merge generated alerts with existing alert states
  const mergeAlertsWithStates = (
    generatedAlerts: Alert[],
    states: Map<string, { status: AlertStatus; acknowledgedBy?: string; acknowledgedAt?: string; resolvedBy?: string; resolvedAt?: string; notes?: string[] }>,
    previousAlerts: Alert[]
  ): Alert[] => {
    // Create a map of existing alerts by their stable ID (based on asset + alert type)
    const existingAlertsMap = new Map<string, Alert>();
    previousAlerts.forEach(alert => {
      const stableId = `${alert.assetId}-${alert.type}-${alert.message}`;
      existingAlertsMap.set(stableId, alert);
    });

    const mergedAlerts: Alert[] = [];

    // Process generated alerts
    generatedAlerts.forEach(newAlert => {
      const stableId = `${newAlert.assetId}-${newAlert.type}-${newAlert.message}`;
      const existingAlert = existingAlertsMap.get(stableId);
      const savedState = states.get(stableId);

      if (savedState) {
        // Use saved state
        mergedAlerts.push({
          ...newAlert,
          id: existingAlert?.id || newAlert.id,
          status: savedState.status,
          acknowledgedBy: savedState.acknowledgedBy,
          acknowledgedAt: savedState.acknowledgedAt,
          resolvedBy: savedState.resolvedBy,
          resolvedAt: savedState.resolvedAt,
          notes: savedState.notes
        });
      } else if (existingAlert) {
        // Keep existing alert with updated data
        mergedAlerts.push({
          ...newAlert,
          id: existingAlert.id,
          status: existingAlert.status,
          acknowledgedBy: existingAlert.acknowledgedBy,
          acknowledgedAt: existingAlert.acknowledgedAt,
          resolvedBy: existingAlert.resolvedBy,
          resolvedAt: existingAlert.resolvedAt,
          notes: existingAlert.notes
        });
      } else {
        // New alert
        mergedAlerts.push(newAlert);
      }
    });

    // Add any resolved alerts that are still in saved states but not in current generation
    states.forEach((state, stableId) => {
      if (state.status === 'resolved' || state.status === 'acknowledged') {
        const existsInMerged = mergedAlerts.some(alert => `${alert.assetId}-${alert.type}-${alert.message}` === stableId);
        if (!existsInMerged) {
          const previousAlert = previousAlerts.find(alert => `${alert.assetId}-${alert.type}-${alert.message}` === stableId);
          if (previousAlert) {
            mergedAlerts.push({
              ...previousAlert,
              status: state.status,
              acknowledgedBy: state.acknowledgedBy,
              acknowledgedAt: state.acknowledgedAt,
              resolvedBy: state.resolvedBy,
              resolvedAt: state.resolvedAt,
              notes: state.notes
            });
          }
        }
      }
    });

    return mergedAlerts;
  };

  // Load saved alert states on component mount
  useEffect(() => {
    const savedStates = loadAlertStates();
    setAlertStates(savedStates);
  }, []);

  // Save alert states to localStorage whenever they change
  useEffect(() => {
    if (alertStates.size > 0) {
      saveAlertStates(alertStates);
    }
  }, [alertStates]);

  useEffect(() => {
    // Subscribe to the data simulator
    const unsubscribe = energyDataSimulator.subscribe((simulatedAssets) => {
      setAssets(simulatedAssets);

      // Generate alerts based on asset data, merging with existing states
      setAlerts(prevAlerts => {
        const generatedAlerts = generateAlertsFromAssets(simulatedAssets);
        return mergeAlertsWithStates(generatedAlerts, alertStates, prevAlerts);
      });
      setLoading(false);
    });

    // Start simulation
    energyDataSimulator.start(3000);

    return () => {
      unsubscribe();
      energyDataSimulator.stop();
    };
  }, [alertStates]);

  const generateAlertsFromAssets = (assets: SimulatedAsset[]): Alert[] => {
    const alerts: Alert[] = [];
    const now = new Date();

    assets.forEach((asset, index) => {
      // Generate alerts based on battery conditions
      const assetAlerts = asset.alerts.map((alert, alertIndex) => ({
        id: `alert-${asset.id}-${alertIndex}`,
        assetId: asset.id,
        assetName: asset.name,
        assetType: 'battery' as const,
        location: asset.location,
        timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        severity: alert.severity as AlertSeverity,
        status: Math.random() > 0.7 ? 'acknowledged' : 'active' as AlertStatus,
        type: alert.type as AlertType,
        message: alert.message,
        description: `${alert.message} detected on ${asset.name}. Battery system requires attention.`,
        value: asset.performance?.power,
        unit: 'MW',
        threshold: asset.power * 0.9
      }));

      alerts.push(...assetAlerts);

      // Generate additional battery-specific alerts based on performance
      const performance = asset.performance;
      const health = asset.health;

      if (performance) {
        // Low SOC alert
        if (performance.stateOfCharge < 20) {
          alerts.push({
            id: `soc-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            assetType: 'battery',
            location: asset.location,
            timestamp: new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
            severity: performance.stateOfCharge < 10 ? 'high' : 'medium',
            status: 'active',
            type: 'soc',
            message: `Low State of Charge: ${performance.stateOfCharge.toFixed(1)}%`,
            description: `Battery state of charge has dropped below safe operating threshold. Consider charging to prevent deep discharge.`,
            value: performance.stateOfCharge,
            unit: '%',
            threshold: 20
          });
        }

        // High SOC alert
        if (performance.stateOfCharge > 95) {
          alerts.push({
            id: `soc-high-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            assetType: 'battery',
            location: asset.location,
            timestamp: new Date(now.getTime() - Math.random() * 1 * 60 * 60 * 1000).toISOString(),
            severity: 'low',
            status: 'active',
            type: 'soc',
            message: `High State of Charge: ${performance.stateOfCharge.toFixed(1)}%`,
            description: `Battery is nearly fully charged. Consider reducing charge rate or switching to discharge mode.`,
            value: performance.stateOfCharge,
            unit: '%',
            threshold: 95
          });
        }

        // Low efficiency alert
        if (performance.efficiency < 85) {
          alerts.push({
            id: `efficiency-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            assetType: 'battery',
            location: asset.location,
            timestamp: new Date(now.getTime() - Math.random() * 3 * 60 * 60 * 1000).toISOString(),
            severity: performance.efficiency < 75 ? 'high' : 'medium',
            status: 'active',
            type: 'power',
            message: `Low round-trip efficiency: ${performance.efficiency.toFixed(1)}%`,
            description: `Battery efficiency has dropped below optimal levels. Performance monitoring indicates potential maintenance required.`,
            value: performance.efficiency,
            unit: '%',
            threshold: 85
          });
        }

        // High cycle count alert
        if (performance.cycleCount > 4500) {
          alerts.push({
            id: `cycles-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            assetType: 'battery',
            location: asset.location,
            timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
            severity: performance.cycleCount > 4800 ? 'high' : 'medium',
            status: 'active',
            type: 'cycle_count',
            message: `High cycle count: ${performance.cycleCount} cycles`,
            description: `Battery has completed ${performance.cycleCount} charge/discharge cycles. Approaching end of rated cycle life. Schedule maintenance inspection.`,
            value: performance.cycleCount,
            unit: 'cycles',
            threshold: 5000
          });
        }
      }

      // SOH alerts
      if (health && health.stateOfHealth < 90) {
        alerts.push({
          id: `soh-${asset.id}`,
          assetId: asset.id,
          assetName: asset.name,
          assetType: 'battery',
          location: asset.location,
          timestamp: new Date(now.getTime() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
          severity: health.stateOfHealth < 80 ? 'critical' : 'high',
          status: 'active',
          type: 'soh',
          message: `Degraded State of Health: ${health.stateOfHealth.toFixed(1)}%`,
          description: `Battery health has degraded significantly. Capacity retention is below optimal. Consider replacement or refurbishment.`,
          value: health.stateOfHealth,
          unit: '%',
          threshold: 90
        });
      }
    });

    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-blue-600 text-white';
      case 'diagnostic': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'suppressed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (alertType: AlertType) => {
    switch (alertType) {
      case 'temperature': return <Thermometer className="h-4 w-4 text-[#FF8C00]" />;
      case 'voltage': return <Zap className="h-4 w-4 text-[#FF8C00]" />;
      case 'soc': return <Battery className="h-4 w-4 text-[#FF8C00]" />;
      case 'soh': return <TrendingUp className="h-4 w-4 text-[#FF8C00]" />;
      case 'power': return <Zap className="h-4 w-4 text-[#FF8C00]" />;
      case 'cycle_count': return <BarChart3 className="h-4 w-4 text-[#FF8C00]" />;
      default: return <Battery className="h-4 w-4 text-[#FF8C00]" />;
    }
  };

  // Filter alerts based on current filter settings
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filter.severity === 'all' || alert.severity === filter.severity;
    const matchesStatus = filter.status === 'all' || alert.status === filter.status;
    const matchesAlertType = filter.alertType === 'all' || alert.type === filter.alertType;
    const matchesSearch = filter.search === '' ||
      alert.message.toLowerCase().includes(filter.search.toLowerCase()) ||
      alert.assetName.toLowerCase().includes(filter.search.toLowerCase()) ||
      alert.location.toLowerCase().includes(filter.search.toLowerCase());

    return matchesSeverity && matchesStatus && matchesAlertType && matchesSearch;
  });

  // Calculate summary statistics
  const alertStats = {
    active: alerts.filter(a => a.status === 'active').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length
  };

  // Data for charts
  const severityData = [
    { name: 'Critical', value: alertStats.critical, color: '#dc2626' },
    { name: 'High', value: alertStats.high, color: '#ea580c' },
    { name: 'Medium', value: alertStats.medium, color: '#ca8a04' },
    { name: 'Low', value: alertStats.low, color: '#2563eb' }
  ].filter(item => item.value > 0);

  const statusData = [
    { name: 'Active', value: alertStats.active, color: '#dc2626' },
    { name: 'Acknowledged', value: alertStats.acknowledged, color: '#ca8a04' },
    { name: 'Resolved', value: alertStats.resolved, color: '#16a34a' }
  ].filter(item => item.value > 0);

  const handleAcknowledge = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      const stableId = `${alert.assetId}-${alert.type}-${alert.message}`;
      const newState = {
        status: 'acknowledged' as AlertStatus,
        acknowledgedBy: 'operator@a123systems.com',
        acknowledgedAt: new Date().toISOString()
      };

      setAlertStates(prev => new Map(prev.set(stableId, newState)));

      setAlerts(prev => prev.map(a =>
        a.id === alertId
          ? { ...a, ...newState }
          : a
      ));
    }
  };

  const handleResolve = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      const stableId = `${alert.assetId}-${alert.type}-${alert.message}`;
      const newState = {
        status: 'resolved' as AlertStatus,
        resolvedBy: 'operator@a123systems.com',
        resolvedAt: new Date().toISOString()
      };

      setAlertStates(prev => new Map(prev.set(stableId, newState)));

      setAlerts(prev => prev.map(a =>
        a.id === alertId
          ? { ...a, ...newState }
          : a
      ));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F9FA]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6B7280]">Loading alerts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Alert Banner */}
        {(alertStats.critical + alertStats.high) > 0 && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  {alertStats.critical + alertStats.high} Critical & High Priority Battery Alerts Active
                </span>
              </div>
              <div className="text-red-600 text-sm">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D23] flex items-center">
                <Battery className="h-8 w-8 mr-3 text-[#FF8C00]" />
                A123 Battery Alert Management
              </h1>
              <p className="text-[#6B7280]">
                Comprehensive alert monitoring and management for A123 battery systems
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{alertStats.active}</div>
                <p className="text-xs text-[#6B7280] mt-1">
                  {alertStats.critical} critical, {alertStats.high} high priority
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                  Acknowledged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{alertStats.acknowledged}</div>
                <p className="text-xs text-[#6B7280] mt-1">Being investigated</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Resolved Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{alertStats.resolved}</div>
                <p className="text-xs text-[#6B7280] mt-1">Issues resolved</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-[#6B7280] flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-[#FF8C00]" />
                  Total Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#FF8C00]">{alerts.length}</div>
                <p className="text-xs text-[#6B7280] mt-1">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="text-sm text-[#6B7280] mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-[#6B7280]" />
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        className="w-full pl-10 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent placeholder-gray-400"
                        value={filter.search}
                        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Severity Filter */}
                  <div>
                    <label className="text-sm text-[#6B7280] mb-2 block">Severity</label>
                    <select
                      value={filter.severity}
                      onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
                      className="w-full p-2 bg-white border border-[#E5E7EB] rounded-md text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm text-[#6B7280] mb-2 block">Status</label>
                    <select
                      value={filter.status}
                      onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 bg-white border border-[#E5E7EB] rounded-md text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Alert Type Filter */}
                  <div>
                    <label className="text-sm text-[#6B7280] mb-2 block">Alert Type</label>
                    <select
                      value={filter.alertType}
                      onChange={(e) => setFilter(prev => ({ ...prev, alertType: e.target.value }))}
                      className="w-full p-2 bg-white border border-[#E5E7EB] rounded-md text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="temperature">Temperature</option>
                      <option value="voltage">Voltage</option>
                      <option value="soc">State of Charge</option>
                      <option value="soh">State of Health</option>
                      <option value="power">Power/Efficiency</option>
                      <option value="cycle_count">Cycle Count</option>
                      <option value="communication">Communication</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Quick Filters */}
                  <div className="border-t border-[#E5E7EB] pt-4">
                    <label className="text-sm text-[#6B7280] mb-2 block">Quick Filters</label>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                        onClick={() => setFilter({ severity: 'critical', status: 'active', alertType: 'all', search: '' })}
                      >
                        Critical Active
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                        onClick={() => setFilter({ severity: 'all', status: 'active', alertType: 'all', search: '' })}
                      >
                        Unacknowledged
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                        onClick={() => setFilter({ severity: 'all', status: 'all', alertType: 'soc', search: '' })}
                      >
                        SOC Alerts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* Alert List */}
              <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 mb-6">
                <CardHeader>
                  <CardTitle className="text-[#1A1D23] flex items-center justify-between">
                    <span>Battery Alerts ({filteredAlerts.length})</span>
                    <Badge variant="secondary" className="bg-[#F8F9FA] text-[#6B7280]">
                      {filteredAlerts.filter(a => a.status === 'active').length} Active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredAlerts.length === 0 ? (
                      <div className="text-center py-8 text-[#6B7280]">
                        No alerts match your current filters
                      </div>
                    ) : (
                      filteredAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-4 bg-[#F8F9FA] rounded-lg hover:bg-[#E5E7EB] cursor-pointer transition-colors"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                {getAlertIcon(alert.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-[#1A1D23] font-medium">{alert.assetName}</span>
                                  <Badge className={getSeverityColor(alert.severity)}>
                                    {alert.severity.toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className={getStatusColor(alert.status)}>
                                    {alert.status.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-[#6B7280] mb-1">{alert.message}</p>
                                <div className="flex items-center space-x-4 text-xs text-[#6B7280]">
                                  <span>{alert.location}</span>
                                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                  <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {alert.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAcknowledge(alert.id);
                                  }}
                                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                                >
                                  Acknowledge
                                </Button>
                              )}
                              {(alert.status === 'active' || alert.status === 'acknowledged') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolve(alert.id);
                                  }}
                                  className="border-green-600 text-green-600 hover:bg-green-50"
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Alert Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-[#1A1D23]">Alert Distribution by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={severityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {severityData.map((entry, index) => (
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
                          />
                          <Legend wrapperStyle={{ color: '#6B7280' }} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-[#1A1D23]">Alert Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="name" stroke="#6B7280" />
                          <YAxis stroke="#6B7280" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              color: '#1A1D23'
                            }}
                          />
                          <Bar dataKey="value">
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedAlert(null)}>
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#1A1D23] flex items-center">
                    {getAlertIcon(selectedAlert.type)}
                    <span className="ml-2">Alert Details</span>
                  </h2>
                  <Button variant="ghost" onClick={() => setSelectedAlert(null)} className="text-[#6B7280] hover:text-[#1A1D23]">
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#6B7280]">Battery System</label>
                    <p className="text-[#1A1D23] font-medium">{selectedAlert.assetName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B7280]">Location</label>
                    <p className="text-[#1A1D23]">{selectedAlert.location}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B7280]">Severity</label>
                    <div className="mt-1">
                      <Badge className={getSeverityColor(selectedAlert.severity)}>
                        {selectedAlert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B7280]">Status</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getStatusColor(selectedAlert.status)}>
                        {selectedAlert.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B7280]">Timestamp</label>
                    <p className="text-[#1A1D23]">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B7280]">Type</label>
                    <p className="text-[#1A1D23] capitalize">{selectedAlert.type.replace('_', ' ')}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#6B7280]">Message</label>
                  <p className="text-[#1A1D23] mt-1">{selectedAlert.message}</p>
                </div>

                <div>
                  <label className="text-sm text-[#6B7280]">Description</label>
                  <p className="text-[#6B7280] mt-1">{selectedAlert.description}</p>
                </div>

                {selectedAlert.value !== undefined && (
                  <div>
                    <label className="text-sm text-[#6B7280]">Current Value</label>
                    <p className="text-[#1A1D23] mt-1">
                      {selectedAlert.value.toFixed(2)} {selectedAlert.unit}
                      {selectedAlert.threshold && (
                        <span className="text-[#6B7280] ml-2">
                          (Threshold: {selectedAlert.threshold} {selectedAlert.unit})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {selectedAlert.acknowledgedBy && (
                  <div>
                    <label className="text-sm text-[#6B7280]">Acknowledged By</label>
                    <p className="text-[#1A1D23] mt-1">
                      {selectedAlert.acknowledgedBy} at {new Date(selectedAlert.acknowledgedAt!).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedAlert.resolvedBy && (
                  <div>
                    <label className="text-sm text-[#6B7280]">Resolved By</label>
                    <p className="text-[#1A1D23] mt-1">
                      {selectedAlert.resolvedBy} at {new Date(selectedAlert.resolvedAt!).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex space-x-4 pt-4 border-t border-[#E5E7EB]">
                  {selectedAlert.status === 'active' && (
                    <Button
                      onClick={() => {
                        handleAcknowledge(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Acknowledge Alert
                    </Button>
                  )}
                  {(selectedAlert.status === 'active' || selectedAlert.status === 'acknowledged') && (
                    <Button
                      onClick={() => {
                        handleResolve(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Resolve Alert
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}