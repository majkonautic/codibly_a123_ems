/**
 * Enhanced BMS Monitoring & Demand Response Data Structures
 * A123 Battery Energy Management System
 */

// ============================================================================
// ENHANCED BMS METRICS
// ============================================================================

export interface EnhancedBatteryMetrics {
  // State metrics (enhanced)
  sop: number; // State of Power (0-100%) - Available power capability
  soe: number; // State of Energy (MWh available) - Available energy reserves
  maxDischargeRate: number; // MW - Maximum discharge capability
  maxChargeRate: number; // MW - Maximum charge capability
  rampRate: number; // MW/second - Fast response capability

  // Thermal management
  coolingSystemStatus: 'active' | 'standby' | 'fault' | 'maintenance';
  coolantTemp: number; // °C
  coolantFlow: number; // L/min
  coolantPressure: number; // kPa
  coolantLevel: number; // % of capacity

  // Safety systems (3-level fire protection)
  fireProtectionStatus: {
    level1: boolean; // Cell level - Individual cell protection
    level2: boolean; // Module level - Module-level protection
    level3: boolean; // Pack level - System-level protection
    systemArmed: boolean;
    lastTest: string; // ISO timestamp
  };

  // Gas detection for fire prevention
  gasDetection: {
    hydrogen: number; // ppm - Hydrogen concentration
    smoke: boolean; // Smoke detector status
    co2: number; // ppm - CO2 concentration
    co: number; // ppm - Carbon monoxide
    lastCalibration: string; // ISO timestamp
  };

  // Cell/Module granularity
  cellVoltages: number[]; // Individual cell voltages (V)
  moduleTemperatures: number[]; // Module temps (°C)
  cellBalanceStatus: CellBalanceData[];
  cellHealth: CellHealthStatus[];
}

export interface CellBalanceData {
  cellId: string;
  voltage: number; // V
  balanceStatus: 'balanced' | 'balancing' | 'unbalanced';
  balanceCurrent: number; // mA
  deviation: number; // mV from average
}

export interface CellHealthStatus {
  cellId: string;
  impedance: number; // mΩ
  capacity: number; // Ah
  health: number; // % (0-100)
  cycleCount: number;
  temperature: number; // °C
}

// ============================================================================
// DEMAND RESPONSE PROGRAM SUPPORT
// ============================================================================

export interface DemandResponseData {
  // Program enrollment
  enrolledPrograms: DRProgram[];

  // Real-time availability
  availableForDR: boolean;
  drCapacity: number; // MW available for DR event
  maxEventDuration: number; // Hours based on current SOC
  responseTime: number; // Milliseconds - actual response capability

  // Pre-charging capability
  preChargeEnabled: boolean;
  preChargeTarget: number; // % SOC
  estimatedPreChargeTime: number; // minutes

  // Event tracking
  activeEvents: DREvent[];
  upcomingEvents: DREvent[];
  eventHistory: DREvent[];

  // Baseline tracking (for DR compensation calculation)
  baselineLoad: LoadBaseline;

  // Historical performance
  historicalPerformance: DRPerformanceMetrics;

  // Grid signal integration
  gridConnection: GridConnectionStatus;
}

export interface DRProgram {
  id: string;
  name: string; // e.g., 'CAISO DRAM', 'ERCOT Regulation Up'
  iso: 'CAISO' | 'ERCOT' | 'PJM' | 'NYISO' | 'ISO-NE' | 'MISO' | 'SPP';
  serviceType: 'frequency-regulation' | 'spinning-reserve' |
               'non-spinning-reserve' | 'load-following' |
               'voltage-support' | 'peak-shaving' | 'energy-arbitrage';
  enrollmentDate: string; // ISO timestamp
  expirationDate: string; // ISO timestamp
  compensationRate: number; // $/MW or $/MWh
  compensationType: 'capacity' | 'energy' | 'performance' | 'availability';
  minimumCapacity: number; // MW - Minimum participation requirement
  maximumCapacity: number; // MW - Maximum allowed participation
  responseTimeRequired: number; // seconds
  minimumDuration: number; // minutes
  maximumDuration: number; // minutes
  noticeTime: number; // minutes - How much advance notice for events
  status: 'active' | 'paused' | 'pending' | 'expired';

  // Performance requirements
  performanceMetrics: {
    minAccuracy: number; // % - Minimum signal following accuracy
    penaltyRate: number; // $/MW - Penalty for non-performance
    bonusRate: number; // $/MW - Bonus for over-performance
  };

  // Financial tracking
  revenueToDate: number; // $ earned from this program
  penaltiesIncurred: number; // $ penalties
  netRevenue: number; // $ net after penalties
}

export interface DREvent {
  id: string;
  programId: string;
  programName: string;
  type: 'scheduled' | 'emergency' | 'test' | 'day-ahead' | 'real-time';
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  duration: number; // minutes
  noticeTime: number; // minutes before event
  requestedCapacity: number; // MW
  committedCapacity: number; // MW - What we committed to deliver
  actualPerformance: number; // MW - What we actually delivered
  responseTime: number; // milliseconds - How fast we responded
  peakPerformance: number; // MW - Peak power delivered
  averagePerformance: number; // MW - Average during event
  accuracy: number; // % - Signal following accuracy (for freq regulation)

  // Financial
  baselineCompensation: number; // $ for participation
  performanceCompensation: number; // $ for actual delivery
  bonusCompensation: number; // $ for over-performance
  penalties: number; // $ for underperformance
  totalCompensation: number; // $ net compensation

  // Status
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'failed';
  completionStatus: 'success' | 'partial-success' | 'failure' | null;

  // SOC impact
  socBefore: number; // % SOC before event
  socAfter: number; // % SOC after event
  socDelta: number; // % SOC change
  energyDelivered: number; // MWh

  // Notes
  failureReason?: string;
  notes?: string;
}

export interface LoadBaseline {
  assetId: string;
  calculationMethod: '10-of-10' | '5-of-10' | 'high-5-of-10' | 'mid-peak' | 'custom';
  baselinePeriod: string; // e.g., "last 10 non-event days"
  baselineValues: {
    timestamp: string;
    load: number; // MW
  }[];
  calculatedBaseline: number; // MW - Current baseline
  lastUpdated: string; // ISO timestamp
}

export interface DRPerformanceMetrics {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  successRate: number; // %
  avgResponseTime: number; // milliseconds
  avgAccuracy: number; // % for frequency regulation
  totalEnergyDelivered: number; // MWh
  totalCompensation: number; // $
  totalPenalties: number; // $
  netRevenue: number; // $
  availabilityRate: number; // % of time available for DR
}

export interface GridConnectionStatus {
  connected: boolean;
  protocol: 'DNP3' | 'Modbus' | 'OpenADR' | 'IEEE2030.5' | 'proprietary';
  signalQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';
  latency: number; // milliseconds
  lastHeartbeat: string; // ISO timestamp
  signalSource: string; // e.g., "CAISO SCADA", "Utility DR Portal"
  ipAddress: string;
  port: number;
}

// ============================================================================
// ANCILLARY SERVICES TRACKING
// ============================================================================

export interface AncillaryServices {
  // Frequency Regulation (most valuable service - millisecond response)
  frequencyRegulation: {
    enabled: boolean;
    regUp: number; // MW capacity for upward regulation
    regDown: number; // MW capacity for downward regulation
    currentSignal: number; // Current regulation signal (-1 to +1)
    signalFollowing: number; // % accuracy in following AGC signal
    responseTime: number; // milliseconds
    events24h: number;
    revenue24h: number; // $ earned in last 24 hours
    mileage: number; // Total MW moved (up + down)
    performance: {
      accuracy: number; // %
      correlation: number; // Signal correlation
      delays: number; // Count of delayed responses
    };
  };

  // Spinning Reserve (10-minute response)
  spinningReserve: {
    enabled: boolean;
    capacity: number; // MW available
    deployments: number; // Count of activations
    avgResponseTime: number; // seconds
    revenue: number; // $ earned
    availability: number; // % of time qualified
  };

  // Non-Spinning Reserve (30-minute response)
  nonSpinningReserve: {
    enabled: boolean;
    capacity: number; // MW
    deployments: number;
    avgResponseTime: number; // seconds
    revenue: number;
  };

  // Load Following (5-minute dispatch)
  loadFollowing: {
    enabled: boolean;
    capacity: number; // MW
    trackingAccuracy: number; // %
    rampCapability: number; // MW/min
    revenue: number;
    dispatches: number;
  };

  // Voltage Support (reactive power)
  voltageSupport: {
    enabled: boolean;
    reactiveCapacity: number; // MVAR
    activations: number;
    revenue: number;
    powerFactor: number; // Current power factor
  };

  // Black Start Capability
  blackStart: {
    enabled: boolean;
    capacity: number; // MW
    timeToStart: number; // minutes
    revenue: number; // Capacity payment
  };
}

// ============================================================================
// REVENUE TRACKING & FINANCIAL ANALYTICS
// ============================================================================

export interface RevenueTracking {
  assetId: string;

  // Revenue streams
  drProgramRevenue: {
    total: number; // $ total from all DR programs
    byProgram: Record<string, number>; // $ per program
    byServiceType: Record<string, number>; // $ per service type
    byISO: Record<string, number>; // $ per ISO/RTO
  };

  // Energy arbitrage
  energyArbitrage: {
    totalProfit: number; // $ net profit
    totalCost: number; // $ cost of charging
    totalRevenue: number; // $ revenue from discharging
    transactions: ArbitrageTransaction[];
    efficiency: number; // % round-trip efficiency impact on profit
  };

  // Peak shaving
  peakShaving: {
    savingsTotal: number; // $ total demand charge savings
    demandReduction: number; // MW peak demand reduced
    events: number; // Count of peak shaving events
    avgSavingsPerEvent: number; // $
  };

  // Capacity payments
  capacityPayments: {
    annual: number; // $ annual capacity payment
    monthly: number; // $ monthly capacity payment
    ratePerMW: number; // $/MW-month
  };

  // Performance incentives & penalties
  performanceIncentives: {
    total: number; // $ total incentives earned
    penalties: number; // $ total penalties incurred
    net: number; // $ net after penalties
    byProgram: Record<string, {incentives: number; penalties: number}>;
  };

  // Time-based aggregation
  timePeriods: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    thisQuarter: number;
    thisYear: number;
  };

  // Cost tracking
  costs: {
    operationalCost: number; // $ O&M costs
    degradationCost: number; // $ estimated degradation from cycling
    totalCost: number; // $ total costs
  };

  // ROI metrics
  roi: {
    netRevenue: number; // $ revenue - costs
    revenuePerMWh: number; // $/MWh cycled
    revenuePerCycle: number; // $ per charge/discharge cycle
    paybackPeriod: number; // years (if system cost known)
  };
}

export interface ArbitrageTransaction {
  id: string;
  chargeStartTime: string; // ISO timestamp
  chargeEndTime: string;
  dischargeStartTime: string;
  dischargeEndTime: string;
  energyCharged: number; // MWh
  energyDischarged: number; // MWh
  chargeCost: number; // $ (price * energy)
  dischargeRevenue: number; // $
  profit: number; // $
  efficiency: number; // % round-trip
  lmpCharge: number; // $/MWh - Locational Marginal Price during charge
  lmpDischarge: number; // $/MWh - LMP during discharge
  spread: number; // $/MWh - Price difference
}

// ============================================================================
// SAFETY SYSTEM MONITORING
// ============================================================================

export interface SafetySystemStatus {
  assetId: string;

  // Fire protection systems
  fireProtection: {
    level1CellProtection: FireProtectionLevel;
    level2ModuleProtection: FireProtectionLevel;
    level3PackProtection: FireProtectionLevel;
    suppressionSystem: {
      type: 'water' | 'aerosol' | 'gas' | 'foam';
      armed: boolean;
      lastTest: string;
      pressure: number; // psi or bar
      agentLevel: number; // %
    };
  };

  // Gas detection
  gasDetectors: GasDetector[];

  // Cooling system
  coolingSystem: CoolingSystemStatus;

  // Emergency systems
  emergencyShutdown: {
    armed: boolean;
    triggers: string[]; // List of conditions that trigger ESD
    lastTest: string;
    manualOverride: boolean;
  };

  // Safety events
  safetyEvents: SafetyEvent[];

  // Compliance
  lastSafetyInspection: string;
  nextSafetyInspection: string;
  certificationsValid: boolean;
}

export interface FireProtectionLevel {
  level: 1 | 2 | 3;
  enabled: boolean;
  sensors: number; // Count of sensors at this level
  healthyDevices: number;
  faultedDevices: number;
  lastAlarm: string | null;
  testStatus: 'passed' | 'failed' | 'due' | 'overdue';
  lastTest: string;
}

export interface GasDetector {
  id: string;
  type: 'hydrogen' | 'smoke' | 'co2' | 'co';
  location: string; // Physical location in system
  reading: number; // ppm or boolean for smoke
  threshold: number; // ppm alarm threshold
  status: 'normal' | 'warning' | 'alarm' | 'fault';
  lastCalibration: string;
  nextCalibration: string;
}

export interface CoolingSystemStatus {
  systemType: 'air' | 'liquid' | 'hybrid';
  operational: boolean;
  mode: 'active' | 'standby' | 'maintenance' | 'fault';

  // Liquid cooling specific
  coolantTemp: number; // °C
  coolantTempTarget: number; // °C
  coolantFlow: number; // L/min
  coolantFlowTarget: number; // L/min
  coolantPressure: number; // kPa
  coolantLevel: number; // % of capacity

  // Pumps & fans
  pumpsActive: number;
  pumpsTotal: number;
  fansActive: number;
  fansTotal: number;

  // Performance
  efficiency: number; // %
  powerConsumption: number; // kW

  // Maintenance
  lastMaintenance: string;
  nextMaintenance: string;
  filterStatus: 'clean' | 'dirty' | 'replace';
}

export interface SafetyEvent {
  id: string;
  timestamp: string;
  type: 'fire-alarm' | 'gas-detection' | 'over-temp' | 'cooling-fault' |
        'emergency-shutdown' | 'manual-intervention';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  description: string;
  location: string; // Cell, module, or system location
  resolved: boolean;
  resolvedAt: string | null;
  actionsTaken: string[];
}