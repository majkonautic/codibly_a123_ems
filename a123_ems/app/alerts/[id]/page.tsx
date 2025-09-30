'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, AlertTriangle, Info, CheckCircle, Battery, Zap, TrendingUp, BarChart3, Thermometer } from 'lucide-react';

interface AlertDetailPageProps {
  params: {
    id: string;
  };
}

import { energyDataSimulator } from '../../../components/map/utils/dataSimulator';

// Function to find alert and corresponding asset from the actual data simulator
const getAlertById = (id: string) => {
  const assets = energyDataSimulator.getCurrentAssets();

  // Find the asset that has this alert
  for (const asset of assets) {
    if (asset.alerts && asset.alerts.length > 0) {
      // Generate alert IDs based on asset ID and alert index for consistency
      const alertsWithIds = asset.alerts.map((alert, index) => ({
        ...alert,
        id: `ALT-${asset.id.toUpperCase().replace('-', '')}-${(index + 1).toString().padStart(2, '0')}`,
        assetId: asset.id,
        assetName: asset.name,
        status: 'active',
        category: getAlertCategory(alert.type),
        priority: alert.severity === 'critical' ? 'High' : alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Low',
        estimatedResolution: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        affectedSystems: getAffectedSystems(alert.type),
        recommendedActions: getRecommendedActions(alert.type),
        technicalDetails: getTechnicalDetails(alert.type, asset),
        description: getDetailedDescription(alert.type, alert.message)
      }));

      const foundAlert = alertsWithIds.find(alert => alert.id === id);
      if (foundAlert) return foundAlert;
    }
  }

  // Fallback for unknown alert ID
  const fallbackMatch = id.match(/ALT-(.+)-(\d+)/);
  if (fallbackMatch) {
    const assetIdPart = fallbackMatch[1].toLowerCase();
    const assetId = assetIdPart.includes('battery') ? `battery-${assetIdPart.replace('battery', '').padStart(3, '0')}` : assetIdPart;

    const asset = assets.find(a => a.id === assetId || a.id.includes(assetIdPart));
    if (asset) {
      return {
        id,
        type: 'maintenance',
        severity: 'medium',
        message: 'Scheduled maintenance required',
        description: getDetailedDescription('maintenance', 'Scheduled maintenance required'),
        assetId: asset.id,
        assetName: asset.name,
        timestamp: new Date().toISOString(),
        status: 'active',
        category: 'Preventive Maintenance',
        priority: 'Medium',
        estimatedResolution: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        affectedSystems: getAffectedSystems('maintenance'),
        recommendedActions: getRecommendedActions('maintenance'),
        technicalDetails: getTechnicalDetails('maintenance', asset)
      };
    }
  }

  // Ultimate fallback
  return {
    id,
    type: 'maintenance',
    severity: 'medium',
    message: 'Alert details not found',
    description: 'This alert could not be found in the current system data.',
    assetId: 'unknown',
    assetName: 'Unknown Battery',
    timestamp: new Date().toISOString(),
    status: 'active',
    category: 'System',
    priority: 'Medium',
    estimatedResolution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    affectedSystems: ['System Monitoring'],
    recommendedActions: ['Check system logs', 'Contact support'],
    technicalDetails: {
      alertId: id,
      status: 'Not Found',
      lastUpdated: new Date().toISOString()
    }
  };
};

const getAlertCategory = (type: string) => {
  switch (type) {
    case 'maintenance': return 'Preventive Maintenance';
    case 'performance': return 'Performance Degradation';
    case 'temperature': return 'Thermal Management';
    case 'voltage': return 'Electrical System';
    case 'soc': return 'State of Charge';
    case 'soh': return 'State of Health';
    case 'power': return 'Power Management';
    case 'cycle_count': return 'Battery Lifecycle';
    default: return 'Battery System Alert';
  }
};

const getAffectedSystems = (type: string) => {
  switch (type) {
    case 'maintenance': return ['Energy Storage', 'Operations'];
    case 'performance': return ['Energy Storage', 'Monitoring'];
    case 'temperature': return ['Thermal Management', 'BMS'];
    case 'voltage': return ['Electrical System', 'BMS'];
    case 'soc': return ['Charge Management', 'BMS'];
    case 'soh': return ['Battery Health', 'Lifecycle Management'];
    case 'power': return ['Power Electronics', 'Inverter'];
    case 'cycle_count': return ['Battery Lifecycle', 'Maintenance Planning'];
    default: return ['Energy Storage'];
  }
};

const getRecommendedActions = (type: string) => {
  switch (type) {
    case 'maintenance':
      return [
        'Schedule maintenance window during low-demand hours',
        'Coordinate with operations team for load management',
        'Prepare backup battery systems if available',
        'Notify stakeholders of planned maintenance'
      ];
    case 'performance':
      return [
        'Investigate root cause of performance degradation',
        'Check BMS sensors and monitoring systems',
        'Review recent operational changes',
        'Consider reducing charge/discharge rates'
      ];
    case 'temperature':
      return [
        'Monitor temperature trends closely',
        'Check HVAC and thermal management systems',
        'Reduce power output if temperature continues to rise',
        'Schedule thermal system inspection'
      ];
    case 'voltage':
      return [
        'Check voltage regulation equipment',
        'Monitor inverter and BMS',
        'Verify grid connection quality',
        'Prepare for potential isolation if needed'
      ];
    case 'soc':
      return [
        'Adjust charge/discharge schedule',
        'Monitor battery state closely',
        'Avoid deep discharge if SOC is low',
        'Review energy management strategy'
      ];
    case 'soh':
      return [
        'Conduct detailed battery health assessment',
        'Review maintenance history',
        'Consider capacity testing',
        'Plan for potential battery replacement'
      ];
    case 'cycle_count':
      return [
        'Review battery warranty and lifecycle expectations',
        'Plan for preventive maintenance',
        'Consider optimizing charge/discharge cycles',
        'Schedule detailed battery inspection'
      ];
    default:
      return [
        'Monitor situation closely',
        'Follow standard operating procedures',
        'Contact A123 technical support if needed'
      ];
  }
};

const getTechnicalDetails = (type: string, asset: any) => {
  const baseDetails = {
    assetId: asset.id,
    model: asset.model,
    capacity: `${asset.capacity} MWh`,
    power: `${asset.power} MW`,
    location: asset.location
  };

  if (asset.performance) {
    return {
      ...baseDetails,
      soc: `${asset.performance.stateOfCharge?.toFixed(1)}%`,
      efficiency: `${asset.performance.efficiency?.toFixed(1)}%`,
      cycles: asset.performance.cycleCount,
      currentPower: `${asset.performance.power?.toFixed(1)} MW`,
      lastUpdate: new Date().toISOString()
    };
  }

  if (asset.health) {
    return {
      ...baseDetails,
      soh: `${asset.health.stateOfHealth?.toFixed(1)}%`,
      lastUpdate: new Date().toISOString()
    };
  }

  return baseDetails;
};

const getDetailedDescription = (type: string, message: string) => {
  switch (type) {
    case 'maintenance':
      return `The A123 battery system requires scheduled maintenance to ensure continued reliable operation. This maintenance addresses routine component checks, BMS calibration, and preventive care to maintain system reliability and efficiency.`;
    case 'performance':
      return `The battery system is experiencing performance issues that may impact energy storage or discharge efficiency. Immediate investigation is recommended to identify and resolve the underlying cause.`;
    case 'temperature':
      return `Temperature readings at the battery system are outside normal operating parameters. This could indicate thermal management system issues or ambient conditions that require attention.`;
    case 'voltage':
      return `Voltage regulation issues detected in the battery system. This may affect power quality and grid connection stability, requiring BMS and electrical system inspection.`;
    case 'soc':
      return `State of Charge is outside optimal operating range. This may impact battery performance and lifespan if not addressed promptly.`;
    case 'soh':
      return `State of Health has degraded below optimal levels. This indicates battery aging and may require capacity assessment or replacement planning.`;
    case 'power':
      return `Power management or efficiency issues detected. This may affect the battery's ability to charge or discharge at rated capacity.`;
    case 'cycle_count':
      return `Battery cycle count is approaching or has exceeded recommended thresholds. Consider scheduling detailed inspection and maintenance.`;
    default:
      return message || `System alert detected at the battery storage system. Please review current operational status and take appropriate action as needed.`;
  }
};

const AlertDetailPage: React.FC<AlertDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const alert = getAlertById(params.id);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <Info className="h-5 w-5" />;
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-6 w-6 text-[#FF8C00]" />;
      case 'voltage':
      case 'power':
        return <Zap className="h-6 w-6 text-[#FF8C00]" />;
      case 'soc':
      case 'soh':
        return <Battery className="h-6 w-6 text-[#FF8C00]" />;
      case 'cycle_count':
        return <BarChart3 className="h-6 w-6 text-[#FF8C00]" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-[#FF8C00]" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/alerts')}
                  className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Alerts
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-[#1A1D23] flex items-center">
                    <Battery className="h-7 w-7 mr-2 text-[#FF8C00]" />
                    Alert Details
                  </h1>
                  <p className="text-[#6B7280]">Alert ID: {alert.id}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${getSeverityColor(alert.severity)}`}>
                {getSeverityIcon(alert.severity)}
                <span className="font-semibold capitalize">{alert.severity} Priority</span>
              </div>
            </div>

            {/* Alert Overview */}
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-[#1A1D23]">
                  {getAlertIcon(alert.type)}
                  <span className="ml-3">{alert.message}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#6B7280] text-lg leading-relaxed">
                  {alert.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Battery System:</span>
                      <button
                        onClick={() => router.push(`/assets/${alert.assetId}`)}
                        className="text-[#FF8C00] hover:text-[#E67D00] underline font-medium"
                      >
                        {alert.assetName}
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Category:</span>
                      <span className="text-[#1A1D23] font-medium">{alert.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Reported:</span>
                      <span className="text-[#1A1D23] flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Est. Resolution:</span>
                      <span className="text-[#1A1D23]">{formatDate(alert.estimatedResolution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Priority:</span>
                      <span className={`font-semibold ${
                        alert.priority === 'High' ? 'text-red-600' :
                        alert.priority === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affected Systems */}
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Affected Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {alert.affectedSystems.map((system, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#FF8C00]/10 text-[#FF8C00] rounded-full text-sm border border-[#FF8C00]/20 font-medium"
                    >
                      {system}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alert.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-[#FF8C00] text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-[#6B7280] flex-1">{action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#1A1D23]">Technical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(alert.technicalDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-[#E5E7EB] last:border-b-0">
                      <span className="text-[#6B7280] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="text-[#1A1D23] text-right max-w-[200px] truncate font-medium">
                        {typeof value === 'string' && value.includes('T') && value.includes('Z')
                          ? formatDate(value)
                          : value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pb-6">
              <Button
                variant="outline"
                onClick={() => router.push(`/assets/${alert.assetId}`)}
                className="border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#1A1D23]"
              >
                View Battery Details
              </Button>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Acknowledge Alert
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Resolved
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlertDetailPage;