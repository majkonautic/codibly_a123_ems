// Real-time data simulation for A123 Battery Management System
import type {
  EnhancedBatteryMetrics,
  DemandResponseData,
  AncillaryServices,
  RevenueTracking,
  SafetySystemStatus
} from '../../../lib/drTypes';

export interface BatteryPerformanceData {
  power: number; // Current power (MW) - positive for discharge, negative for charge
  stateOfCharge: number; // SOC percentage (0-100)
  energy: number; // Energy stored (MWh)
  voltage: number; // Battery voltage (V)
  current: number; // Battery current (A)
  efficiency: number; // Round-trip efficiency percentage
  cycleCount: number; // Total charge/discharge cycles
  timestamp: string;
}

export interface BatteryHealthData {
  stateOfHealth: number; // SOH percentage (0-100)
  cellBalance: number; // Cell balance percentage
  temperature: number; // Average temperature (°C)
  maxCellTemp: number; // Maximum cell temperature
  minCellTemp: number; // Minimum cell temperature
  impedance: number; // Internal impedance (mΩ)
  capacity: number; // Current usable capacity (MWh)
  degradation: number; // Degradation rate (%/year)
}

export interface AlertData {
  type: 'temperature' | 'voltage' | 'current' | 'soc' | 'maintenance' | 'communication' | 'safety';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  code: string; // A123-specific error codes
}

export interface TelemetryData {
  voltage: number;
  current: number;
  frequency: number;
  powerFactor: number;
  temperature: number;
  humidity: number;
  lastUpdate: string;
}

export interface SimulatedAsset {
  id: string;
  name: string;
  type: 'battery'; // Only battery type now
  model: string; // A123 model designation
  capacity: number; // Total capacity in MWh
  power: number; // Maximum power in MW
  location: string;
  lat: number;
  lng: number;
  status: 'idle' | 'charging' | 'discharging' | 'maintenance' | 'offline' | 'standby';
  performance: BatteryPerformanceData;
  health: BatteryHealthData;
  alerts: AlertData[];
  telemetry: TelemetryData;
  configuration: {
    modules: number;
    strings: number;
    cellsPerModule: number;
    chemistry: string; // LFP, NMC, etc.
    coolingType: 'air' | 'liquid';
    installDate: string;
    warrantyExpiry: string;
  };

  // Enhanced BMS monitoring
  enhancedMetrics: EnhancedBatteryMetrics;

  // Demand Response & Grid Services
  demandResponse: DemandResponseData;
  ancillaryServices: AncillaryServices;

  // Financial tracking
  revenue: RevenueTracking;

  // Safety systems
  safety: SafetySystemStatus;
}

export interface HistoricalData {
  assetId: string;
  period: TimePeriod;
  performances: BatteryPerformanceData[];
  health: BatteryHealthData[];
  alerts: AlertData[];
  telemetry: TelemetryData[];
  summary: {
    totalEnergyCharged: number; // MWh
    totalEnergyDischarged: number; // MWh
    averageEfficiency: number;
    peakPower: number;
    averageSOC: number;
    cycleCount: number;
    uptimePercentage: number;
    alertCount: number;
  };
}

export type TimePeriod = 'today' | '7days' | '30days' | 'month' | 'quarter' | 'year';

// A123 specific models
const A123_MODELS = {
  'GRID-250': { capacity: 250, power: 125, chemistry: 'LFP' },
  'GRID-500': { capacity: 500, power: 250, chemistry: 'LFP' },
  'GRID-1000': { capacity: 1000, power: 500, chemistry: 'LFP' },
  'FLEX-100': { capacity: 100, power: 100, chemistry: 'NMC' },
  'FLEX-200': { capacity: 200, power: 200, chemistry: 'NMC' },
  'ULTRA-50': { capacity: 50, power: 100, chemistry: 'LTO' },
  'MEGA-2000': { capacity: 2000, power: 800, chemistry: 'LFP' },
};

export class EnergyDataSimulator {
  private assets: SimulatedAsset[] = [];
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private subscribers: Array<(assets: SimulatedAsset[]) => void> = [];

  constructor() {
    this.initializeAssets();
  }

  private initializeAssets() {
    // A123 Battery Storage Systems across strategic US locations
    this.assets = [
      {
        id: 'a123-ca-001',
        name: 'California Grid Storage Alpha',
        type: 'battery',
        model: 'GRID-1000',
        capacity: 1000,
        power: 500,
        location: 'San Diego, California',
        lat: 32.7157,
        lng: -117.1611,
        status: 'discharging',
        performance: this.generateBatteryPerformance('GRID-1000', 75),
        health: this.generateBatteryHealth(98, 1500),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 250,
          strings: 10,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2022-03-15',
          warrantyExpiry: '2032-03-15'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-1000', 75, 400, 1000),
        demandResponse: this.generateDemandResponseData('a123-ca-001', 1000, 500, 75),
        ancillaryServices: this.generateAncillaryServices(500, 75),
        revenue: this.generateRevenueTracking('a123-ca-001', 1000),
        safety: this.generateSafetyStatus('a123-ca-001')
      },
      {
        id: 'a123-tx-001',
        name: 'Texas ERCOT Reserve',
        type: 'battery',
        model: 'MEGA-2000',
        capacity: 2000,
        power: 800,
        location: 'Houston, Texas',
        lat: 29.7604,
        lng: -95.3698,
        status: 'charging',
        performance: this.generateBatteryPerformance('MEGA-2000', 45),
        health: this.generateBatteryHealth(97, 800),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 500,
          strings: 20,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2023-01-10',
          warrantyExpiry: '2033-01-10'
        },
        enhancedMetrics: this.generateEnhancedMetrics('MEGA-2000', 45, -640, 2000),
        demandResponse: this.generateDemandResponseData('a123-tx-001', 2000, 800, 45),
        ancillaryServices: this.generateAncillaryServices(800, 45),
        revenue: this.generateRevenueTracking('a123-tx-001', 2000),
        safety: this.generateSafetyStatus('a123-tx-001')
      },
      {
        id: 'a123-ny-001',
        name: 'New York City Backup',
        type: 'battery',
        model: 'GRID-500',
        capacity: 500,
        power: 250,
        location: 'Brooklyn, New York',
        lat: 40.6782,
        lng: -73.9442,
        status: 'idle',
        performance: this.generateBatteryPerformance('GRID-500', 95),
        health: this.generateBatteryHealth(99, 200),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 125,
          strings: 5,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2023-06-20',
          warrantyExpiry: '2033-06-20'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-500', 95, 0, 500),
        demandResponse: this.generateDemandResponseData('a123-ny-001', 500, 250, 95),
        ancillaryServices: this.generateAncillaryServices(250, 95),
        revenue: this.generateRevenueTracking('a123-ny-001', 500),
        safety: this.generateSafetyStatus('a123-ny-001')
      },
      {
        id: 'a123-fl-001',
        name: 'Miami Hurricane Reserve',
        type: 'battery',
        model: 'GRID-250',
        capacity: 250,
        power: 125,
        location: 'Miami, Florida',
        lat: 25.7617,
        lng: -80.1918,
        status: 'standby',
        performance: this.generateBatteryPerformance('GRID-250', 100),
        health: this.generateBatteryHealth(100, 50),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 63,
          strings: 3,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2024-02-01',
          warrantyExpiry: '2034-02-01'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-250', 100, 0, 250),
        demandResponse: this.generateDemandResponseData('a123-fl-001', 250, 125, 100),
        ancillaryServices: this.generateAncillaryServices(125, 100),
        revenue: this.generateRevenueTracking('a123-fl-001', 250),
        safety: this.generateSafetyStatus('a123-fl-001')
      },
      {
        id: 'a123-az-001',
        name: 'Phoenix Solar Integration',
        type: 'battery',
        model: 'GRID-1000',
        capacity: 1000,
        power: 500,
        location: 'Phoenix, Arizona',
        lat: 33.4484,
        lng: -112.0740,
        status: 'discharging',
        performance: this.generateBatteryPerformance('GRID-1000', 60),
        health: this.generateBatteryHealth(96, 2200),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 250,
          strings: 10,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2021-11-15',
          warrantyExpiry: '2031-11-15'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-1000', 60, 300, 1000),
        demandResponse: this.generateDemandResponseData('a123-az-001', 1000, 500, 60),
        ancillaryServices: this.generateAncillaryServices(500, 60),
        revenue: this.generateRevenueTracking('a123-az-001', 1000),
        safety: this.generateSafetyStatus('a123-az-001')
      },
      {
        id: 'a123-il-001',
        name: 'Chicago Grid Stabilization',
        type: 'battery',
        model: 'FLEX-200',
        capacity: 200,
        power: 200,
        location: 'Chicago, Illinois',
        lat: 41.8781,
        lng: -87.6298,
        status: 'discharging',
        performance: this.generateBatteryPerformance('FLEX-200', 55),
        health: this.generateBatteryHealth(98, 600),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 50,
          strings: 4,
          cellsPerModule: 240,
          chemistry: 'NMC',
          coolingType: 'air',
          installDate: '2023-04-10',
          warrantyExpiry: '2033-04-10'
        },
        enhancedMetrics: this.generateEnhancedMetrics('FLEX-200', 55, 110, 200),
        demandResponse: this.generateDemandResponseData('a123-il-001', 200, 200, 55),
        ancillaryServices: this.generateAncillaryServices(200, 55),
        revenue: this.generateRevenueTracking('a123-il-001', 200),
        safety: this.generateSafetyStatus('a123-il-001')
      },
      {
        id: 'a123-wa-001',
        name: 'Seattle Renewable Buffer',
        type: 'battery',
        model: 'GRID-500',
        capacity: 500,
        power: 250,
        location: 'Seattle, Washington',
        lat: 47.6062,
        lng: -122.3321,
        status: 'charging',
        performance: this.generateBatteryPerformance('GRID-500', 30),
        health: this.generateBatteryHealth(99, 150),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 125,
          strings: 5,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2023-09-01',
          warrantyExpiry: '2033-09-01'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-500', 30, -175, 500),
        demandResponse: this.generateDemandResponseData('a123-wa-001', 500, 250, 30),
        ancillaryServices: this.generateAncillaryServices(250, 30),
        revenue: this.generateRevenueTracking('a123-wa-001', 500),
        safety: this.generateSafetyStatus('a123-wa-001')
      },
      {
        id: 'a123-co-001',
        name: 'Denver Mountain Reserve',
        type: 'battery',
        model: 'FLEX-100',
        capacity: 100,
        power: 100,
        location: 'Denver, Colorado',
        lat: 39.7392,
        lng: -104.9903,
        status: 'idle',
        performance: this.generateBatteryPerformance('FLEX-100', 85),
        health: this.generateBatteryHealth(97, 450),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 25,
          strings: 2,
          cellsPerModule: 240,
          chemistry: 'NMC',
          coolingType: 'air',
          installDate: '2023-03-20',
          warrantyExpiry: '2033-03-20'
        },
        enhancedMetrics: this.generateEnhancedMetrics('FLEX-100', 85, 0, 100),
        demandResponse: this.generateDemandResponseData('a123-co-001', 100, 100, 85),
        ancillaryServices: this.generateAncillaryServices(100, 85),
        revenue: this.generateRevenueTracking('a123-co-001', 100),
        safety: this.generateSafetyStatus('a123-co-001')
      },
      {
        id: 'a123-ma-001',
        name: 'Boston Critical Infrastructure',
        type: 'battery',
        model: 'ULTRA-50',
        capacity: 50,
        power: 100,
        location: 'Boston, Massachusetts',
        lat: 42.3601,
        lng: -71.0589,
        status: 'standby',
        performance: this.generateBatteryPerformance('ULTRA-50', 90),
        health: this.generateBatteryHealth(100, 100),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 20,
          strings: 2,
          cellsPerModule: 120,
          chemistry: 'LTO',
          coolingType: 'air',
          installDate: '2024-01-05',
          warrantyExpiry: '2034-01-05'
        },
        enhancedMetrics: this.generateEnhancedMetrics('ULTRA-50', 90, 0, 50),
        demandResponse: this.generateDemandResponseData('a123-ma-001', 50, 100, 90),
        ancillaryServices: this.generateAncillaryServices(100, 90),
        revenue: this.generateRevenueTracking('a123-ma-001', 50),
        safety: this.generateSafetyStatus('a123-ma-001')
      },
      {
        id: 'a123-nv-001',
        name: 'Las Vegas Peak Shaving',
        type: 'battery',
        model: 'GRID-500',
        capacity: 500,
        power: 250,
        location: 'Las Vegas, Nevada',
        lat: 36.1699,
        lng: -115.1398,
        status: 'discharging',
        performance: this.generateBatteryPerformance('GRID-500', 40),
        health: this.generateBatteryHealth(95, 1800),
        alerts: [{
          type: 'temperature',
          severity: 'medium',
          message: 'Elevated temperature detected in module 42',
          timestamp: new Date().toISOString(),
          code: 'A123-TEMP-001'
        }],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 125,
          strings: 5,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2022-07-15',
          warrantyExpiry: '2032-07-15'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-500', 40, 100, 500),
        demandResponse: this.generateDemandResponseData('a123-nv-001', 500, 250, 40),
        ancillaryServices: this.generateAncillaryServices(250, 40),
        revenue: this.generateRevenueTracking('a123-nv-001', 500),
        safety: this.generateSafetyStatus('a123-nv-001')
      },
      {
        id: 'a123-or-001',
        name: 'Portland Wind Integration',
        type: 'battery',
        model: 'GRID-250',
        capacity: 250,
        power: 125,
        location: 'Portland, Oregon',
        lat: 45.5152,
        lng: -122.6784,
        status: 'charging',
        performance: this.generateBatteryPerformance('GRID-250', 65),
        health: this.generateBatteryHealth(98, 320),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 63,
          strings: 3,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2023-05-10',
          warrantyExpiry: '2033-05-10'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-250', 65, -81, 250),
        demandResponse: this.generateDemandResponseData('a123-or-001', 250, 125, 65),
        ancillaryServices: this.generateAncillaryServices(125, 65),
        revenue: this.generateRevenueTracking('a123-or-001', 250),
        safety: this.generateSafetyStatus('a123-or-001')
      },
      {
        id: 'a123-ga-001',
        name: 'Atlanta Data Center Backup',
        type: 'battery',
        model: 'ULTRA-50',
        capacity: 50,
        power: 100,
        location: 'Atlanta, Georgia',
        lat: 33.7490,
        lng: -84.3880,
        status: 'standby',
        performance: this.generateBatteryPerformance('ULTRA-50', 100),
        health: this.generateBatteryHealth(100, 25),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 20,
          strings: 2,
          cellsPerModule: 120,
          chemistry: 'LTO',
          coolingType: 'air',
          installDate: '2024-03-01',
          warrantyExpiry: '2034-03-01'
        },
        enhancedMetrics: this.generateEnhancedMetrics('ULTRA-50', 100, 0, 50),
        demandResponse: this.generateDemandResponseData('a123-ga-001', 50, 100, 100),
        ancillaryServices: this.generateAncillaryServices(100, 100),
        revenue: this.generateRevenueTracking('a123-ga-001', 50),
        safety: this.generateSafetyStatus('a123-ga-001')
      },
      {
        id: 'a123-mi-001',
        name: 'Detroit Auto Plant Storage',
        type: 'battery',
        model: 'FLEX-200',
        capacity: 200,
        power: 200,
        location: 'Detroit, Michigan',
        lat: 42.3314,
        lng: -83.0458,
        status: 'idle',
        performance: this.generateBatteryPerformance('FLEX-200', 70),
        health: this.generateBatteryHealth(97, 550),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 50,
          strings: 4,
          cellsPerModule: 240,
          chemistry: 'NMC',
          coolingType: 'air',
          installDate: '2023-02-15',
          warrantyExpiry: '2033-02-15'
        },
        enhancedMetrics: this.generateEnhancedMetrics('FLEX-200', 70, 0, 200),
        demandResponse: this.generateDemandResponseData('a123-mi-001', 200, 200, 70),
        ancillaryServices: this.generateAncillaryServices(200, 70),
        revenue: this.generateRevenueTracking('a123-mi-001', 200),
        safety: this.generateSafetyStatus('a123-mi-001')
      },
      {
        id: 'a123-oh-001',
        name: 'Columbus Grid Support',
        type: 'battery',
        model: 'GRID-250',
        capacity: 250,
        power: 125,
        location: 'Columbus, Ohio',
        lat: 39.9612,
        lng: -82.9988,
        status: 'charging',
        performance: this.generateBatteryPerformance('GRID-250', 50),
        health: this.generateBatteryHealth(99, 180),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 63,
          strings: 3,
          cellsPerModule: 288,
          chemistry: 'LFP',
          coolingType: 'liquid',
          installDate: '2023-08-01',
          warrantyExpiry: '2033-08-01'
        },
        enhancedMetrics: this.generateEnhancedMetrics('GRID-250', 50, -62.5, 250),
        demandResponse: this.generateDemandResponseData('a123-oh-001', 250, 125, 50),
        ancillaryServices: this.generateAncillaryServices(125, 50),
        revenue: this.generateRevenueTracking('a123-oh-001', 250),
        safety: this.generateSafetyStatus('a123-oh-001')
      },
      {
        id: 'a123-nc-001',
        name: 'Charlotte Banking Backup',
        type: 'battery',
        model: 'FLEX-100',
        capacity: 100,
        power: 100,
        location: 'Charlotte, North Carolina',
        lat: 35.2271,
        lng: -80.8431,
        status: 'standby',
        performance: this.generateBatteryPerformance('FLEX-100', 95),
        health: this.generateBatteryHealth(99, 120),
        alerts: [],
        telemetry: this.generateTelemetry(),
        configuration: {
          modules: 25,
          strings: 2,
          cellsPerModule: 240,
          chemistry: 'NMC',
          coolingType: 'air',
          installDate: '2023-10-15',
          warrantyExpiry: '2033-10-15'
        },
        enhancedMetrics: this.generateEnhancedMetrics('FLEX-100', 95, 0, 100),
        demandResponse: this.generateDemandResponseData('a123-nc-001', 100, 100, 95),
        ancillaryServices: this.generateAncillaryServices(100, 95),
        revenue: this.generateRevenueTracking('a123-nc-001', 100),
        safety: this.generateSafetyStatus('a123-nc-001')
      }
    ];
  }

  private generateBatteryPerformance(model: string, currentSOC: number): BatteryPerformanceData {
    const modelSpecs = A123_MODELS[model as keyof typeof A123_MODELS];
    const currentHour = new Date().getHours();

    // Simulate charge/discharge based on time of day and grid demand
    let power = 0;
    if (currentHour >= 6 && currentHour <= 9) {
      // Morning ramp - discharge
      power = modelSpecs.power * (0.3 + Math.random() * 0.4);
    } else if (currentHour >= 17 && currentHour <= 21) {
      // Evening peak - discharge
      power = modelSpecs.power * (0.5 + Math.random() * 0.5);
    } else if (currentHour >= 0 && currentHour <= 5) {
      // Night charging
      power = -modelSpecs.power * (0.3 + Math.random() * 0.3);
    } else {
      // Variable throughout the day
      power = modelSpecs.power * (Math.random() - 0.5) * 0.6;
    }

    // Prevent overcharge/overdischarge
    if (currentSOC >= 95 && power < 0) power = 0;
    if (currentSOC <= 10 && power > 0) power = power * 0.5;

    const voltage = 480 + (currentSOC / 100) * 20 + (Math.random() - 0.5) * 5;
    const current = power > 0 ? (power * 1000 / voltage) : -(Math.abs(power) * 1000 / voltage);
    const efficiency = 92 + Math.random() * 6; // 92-98% round-trip efficiency

    return {
      power: Math.round(power * 10) / 10,
      stateOfCharge: Math.round(currentSOC * 10) / 10,
      energy: Math.round(modelSpecs.capacity * currentSOC / 100 * 10) / 10,
      voltage: Math.round(voltage * 10) / 10,
      current: Math.round(current * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10,
      cycleCount: Math.floor(Math.random() * 3000),
      timestamp: new Date().toISOString()
    };
  }

  private generateBatteryHealth(baseSOH: number, cycles: number): BatteryHealthData {
    const temperature = 20 + Math.random() * 20; // 20-40°C
    const tempVariation = Math.random() * 5;

    return {
      stateOfHealth: baseSOH - (cycles * 0.002), // Degrade 0.002% per cycle
      cellBalance: 95 + Math.random() * 5, // 95-100%
      temperature: Math.round(temperature * 10) / 10,
      maxCellTemp: Math.round((temperature + tempVariation) * 10) / 10,
      minCellTemp: Math.round((temperature - tempVariation) * 10) / 10,
      impedance: 0.5 + Math.random() * 0.3, // 0.5-0.8 mΩ
      capacity: 95 + Math.random() * 5, // 95-100% of rated
      degradation: 2 + Math.random() * 1 // 2-3% per year
    };
  }

  private generateTelemetry(): TelemetryData {
    return {
      voltage: 480 + (Math.random() - 0.5) * 20,
      current: (Math.random() - 0.5) * 1000,
      frequency: 60 + (Math.random() - 0.5) * 0.1,
      powerFactor: 0.95 + Math.random() * 0.05,
      temperature: 25 + Math.random() * 15,
      humidity: 40 + Math.random() * 20,
      lastUpdate: new Date().toISOString()
    };
  }

  private generateEnhancedMetrics(model: string, soc: number, power: number, capacity: number): EnhancedBatteryMetrics {
    const modelSpecs = A123_MODELS[model as keyof typeof A123_MODELS];

    // Calculate SOP and SOE
    const sop = Math.min(100, soc * 1.1); // Available power slightly dependent on SOC
    const soe = (capacity * soc / 100); // Available energy in MWh

    // Generate cell voltages (simulating a pack)
    const cellCount = 288; // Example cell count
    const avgCellVoltage = 3.2 + (soc / 100) * 0.4; // 3.2-3.6V typical for LFP
    const cellVoltages = Array.from({ length: cellCount }, () =>
      avgCellVoltage + (Math.random() - 0.5) * 0.05
    );

    // Generate module temperatures
    const moduleCount = 32;
    const baseTemp = 25 + Math.abs(power) / modelSpecs.power * 15; // Temp rises with power
    const moduleTemperatures = Array.from({ length: moduleCount }, () =>
      baseTemp + (Math.random() - 0.5) * 5
    );

    // Generate cell balance data (sample of cells)
    const sampleCells = 20;
    const cellBalanceStatus = Array.from({ length: sampleCells }, (_, i) => ({
      cellId: `CELL-${String(i + 1).padStart(3, '0')}`,
      voltage: cellVoltages[i],
      balanceStatus: (Math.abs(cellVoltages[i] - avgCellVoltage) < 0.02 ? 'balanced' : 'balancing') as 'balanced' | 'balancing' | 'unbalanced',
      balanceCurrent: Math.random() * 50,
      deviation: (cellVoltages[i] - avgCellVoltage) * 1000 // mV
    }));

    // Generate cell health status
    const cellHealth = Array.from({ length: sampleCells }, (_, i) => ({
      cellId: `CELL-${String(i + 1).padStart(3, '0')}`,
      impedance: 0.5 + Math.random() * 0.3,
      capacity: 95 + Math.random() * 5,
      health: 95 + Math.random() * 5,
      cycleCount: Math.floor(1000 + Math.random() * 2000),
      temperature: moduleTemperatures[Math.floor(i / (sampleCells / moduleCount))]
    }));

    return {
      sop,
      soe,
      maxDischargeRate: modelSpecs.power * (soc / 100),
      maxChargeRate: modelSpecs.power * ((100 - soc) / 100),
      rampRate: modelSpecs.power / 10, // 10 seconds to full power

      coolingSystemStatus: power > modelSpecs.power * 0.7 ? 'active' : 'standby',
      coolantTemp: 20 + Math.abs(power) / modelSpecs.power * 25,
      coolantFlow: 100 + Math.abs(power) / modelSpecs.power * 150,
      coolantPressure: 200 + Math.random() * 50,
      coolantLevel: 95 + Math.random() * 5,

      fireProtectionStatus: {
        level1: true,
        level2: true,
        level3: true,
        systemArmed: true,
        lastTest: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },

      gasDetection: {
        hydrogen: Math.random() * 10,
        smoke: false,
        co2: 400 + Math.random() * 200,
        co: Math.random() * 5,
        lastCalibration: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },

      cellVoltages,
      moduleTemperatures,
      cellBalanceStatus,
      cellHealth
    };
  }

  private generateDemandResponseData(assetId: string, capacity: number, power: number, soc: number): DemandResponseData {
    const now = new Date();

    // Generate enrolled programs
    const programs: DRProgram[] = [
      {
        id: 'caiso-dram-001',
        name: 'CAISO DRAM',
        iso: 'CAISO',
        serviceType: 'peak-shaving',
        enrollmentDate: new Date(2023, 0, 1).toISOString(),
        expirationDate: new Date(2025, 11, 31).toISOString(),
        compensationRate: 150,
        compensationType: 'capacity',
        minimumCapacity: 50,
        maximumCapacity: capacity * 1000,
        responseTimeRequired: 600,
        minimumDuration: 60,
        maximumDuration: 240,
        noticeTime: 120,
        status: 'active',
        performanceMetrics: {
          minAccuracy: 95,
          penaltyRate: 25,
          bonusRate: 50
        },
        revenueToDate: 125000 + Math.random() * 50000,
        penaltiesIncurred: Math.random() * 5000,
        netRevenue: 120000 + Math.random() * 45000
      },
      {
        id: 'ercot-reg-001',
        name: 'ERCOT Regulation Up',
        iso: 'ERCOT',
        serviceType: 'frequency-regulation',
        enrollmentDate: new Date(2023, 5, 15).toISOString(),
        expirationDate: new Date(2024, 11, 31).toISOString(),
        compensationRate: 35,
        compensationType: 'performance',
        minimumCapacity: 10,
        maximumCapacity: power * 1000,
        responseTimeRequired: 1,
        minimumDuration: 5,
        maximumDuration: 60,
        noticeTime: 0,
        status: 'active',
        performanceMetrics: {
          minAccuracy: 98,
          penaltyRate: 50,
          bonusRate: 75
        },
        revenueToDate: 450000 + Math.random() * 100000,
        penaltiesIncurred: Math.random() * 10000,
        netRevenue: 440000 + Math.random() * 95000
      }
    ];

    // Generate upcoming events
    const upcomingEvents: DREvent[] = [
      {
        id: `evt-${Date.now() + 1}`,
        programId: 'caiso-dram-001',
        programName: 'CAISO DRAM',
        type: 'scheduled',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        noticeTime: 120,
        requestedCapacity: power * 0.8,
        committedCapacity: power * 0.8,
        actualPerformance: 0,
        responseTime: 0,
        peakPerformance: 0,
        averagePerformance: 0,
        accuracy: 0,
        baselineCompensation: 0,
        performanceCompensation: 0,
        bonusCompensation: 0,
        penalties: 0,
        totalCompensation: 0,
        status: 'scheduled',
        completionStatus: null,
        socBefore: soc,
        socAfter: 0,
        socDelta: 0,
        energyDelivered: 0
      }
    ];

    return {
      enrolledPrograms: programs,
      availableForDR: soc > 20 && soc < 95,
      drCapacity: power * (soc / 100),
      maxEventDuration: (capacity * soc / 100) / power,
      responseTime: 150 + Math.random() * 100,

      preChargeEnabled: true,
      preChargeTarget: 85,
      estimatedPreChargeTime: Math.max(0, (85 - soc) / 100 * capacity / power * 60),

      activeEvents: [],
      upcomingEvents,
      eventHistory: [],

      baselineLoad: {
        assetId,
        calculationMethod: '10-of-10',
        baselinePeriod: 'last 10 non-event days',
        baselineValues: [],
        calculatedBaseline: power * 0.3,
        lastUpdated: new Date().toISOString()
      },

      historicalPerformance: {
        totalEvents: 45 + Math.floor(Math.random() * 20),
        successfulEvents: 42 + Math.floor(Math.random() * 15),
        failedEvents: Math.floor(Math.random() * 3),
        successRate: 95 + Math.random() * 5,
        avgResponseTime: 200 + Math.random() * 100,
        avgAccuracy: 96 + Math.random() * 3,
        totalEnergyDelivered: 500 + Math.random() * 200,
        totalCompensation: 450000 + Math.random() * 150000,
        totalPenalties: Math.random() * 15000,
        netRevenue: 435000 + Math.random() * 145000,
        availabilityRate: 97 + Math.random() * 3
      },

      gridConnection: {
        connected: true,
        protocol: 'OpenADR',
        signalQuality: 'excellent',
        latency: 15 + Math.random() * 10,
        lastHeartbeat: new Date().toISOString(),
        signalSource: 'CAISO SCADA',
        ipAddress: '10.0.0.100',
        port: 8080
      }
    };
  }

  private generateAncillaryServices(power: number, soc: number): AncillaryServices {
    const currentHour = new Date().getHours();
    const isRegulationActive = currentHour >= 6 && currentHour <= 22;

    return {
      frequencyRegulation: {
        enabled: true,
        regUp: power * 0.5,
        regDown: power * 0.5,
        currentSignal: (Math.random() - 0.5) * 0.8,
        signalFollowing: 96 + Math.random() * 3,
        responseTime: 80 + Math.random() * 40,
        events24h: isRegulationActive ? 145 + Math.floor(Math.random() * 50) : 0,
        revenue24h: isRegulationActive ? 12000 + Math.random() * 5000 : 0,
        mileage: isRegulationActive ? 850 + Math.random() * 300 : 0,
        performance: {
          accuracy: 97 + Math.random() * 2,
          correlation: 0.95 + Math.random() * 0.04,
          delays: Math.floor(Math.random() * 3)
        }
      },

      spinningReserve: {
        enabled: soc > 30,
        capacity: soc > 30 ? power * 0.7 : 0,
        deployments: 2 + Math.floor(Math.random() * 5),
        avgResponseTime: 5 + Math.random() * 3,
        revenue: 8000 + Math.random() * 4000,
        availability: 95 + Math.random() * 5
      },

      nonSpinningReserve: {
        enabled: soc > 20,
        capacity: soc > 20 ? power * 0.5 : 0,
        deployments: 1 + Math.floor(Math.random() * 3),
        avgResponseTime: 15 + Math.random() * 10,
        revenue: 3000 + Math.random() * 2000
      },

      loadFollowing: {
        enabled: true,
        capacity: power * 0.6,
        trackingAccuracy: 94 + Math.random() * 5,
        rampCapability: power / 5,
        revenue: 6000 + Math.random() * 3000,
        dispatches: 8 + Math.floor(Math.random() * 12)
      },

      voltageSupport: {
        enabled: true,
        reactiveCapacity: power * 0.4,
        activations: 3 + Math.floor(Math.random() * 7),
        revenue: 4000 + Math.random() * 2000,
        powerFactor: 0.95 + Math.random() * 0.05
      },

      blackStart: {
        enabled: true,
        capacity: power * 0.3,
        timeToStart: 5 + Math.random() * 5,
        revenue: 15000 + Math.random() * 5000
      }
    };
  }

  private generateRevenueTracking(assetId: string, capacity: number): RevenueTracking {
    const dailyRevenue = 15000 + Math.random() * 10000;

    return {
      assetId,

      drProgramRevenue: {
        total: 575000 + Math.random() * 150000,
        byProgram: {
          'caiso-dram-001': 125000 + Math.random() * 50000,
          'ercot-reg-001': 450000 + Math.random() * 100000
        },
        byServiceType: {
          'frequency-regulation': 450000 + Math.random() * 100000,
          'peak-shaving': 125000 + Math.random() * 50000
        },
        byISO: {
          'CAISO': 125000 + Math.random() * 50000,
          'ERCOT': 450000 + Math.random() * 100000
        }
      },

      energyArbitrage: {
        totalProfit: 85000 + Math.random() * 35000,
        totalCost: 120000 + Math.random() * 40000,
        totalRevenue: 205000 + Math.random() * 75000,
        transactions: [],
        efficiency: 92 + Math.random() * 6
      },

      peakShaving: {
        savingsTotal: 45000 + Math.random() * 20000,
        demandReduction: 15 + Math.random() * 10,
        events: 12 + Math.floor(Math.random() * 8),
        avgSavingsPerEvent: 3750 + Math.random() * 1500
      },

      capacityPayments: {
        annual: 180000 + Math.random() * 60000,
        monthly: 15000 + Math.random() * 5000,
        ratePerMW: 150 + Math.random() * 50
      },

      performanceIncentives: {
        total: 35000 + Math.random() * 15000,
        penalties: Math.random() * 8000,
        net: 30000 + Math.random() * 12000,
        byProgram: {}
      },

      timePeriods: {
        today: dailyRevenue,
        yesterday: dailyRevenue * 0.95,
        thisWeek: dailyRevenue * 7,
        lastWeek: dailyRevenue * 6.8,
        thisMonth: dailyRevenue * 30,
        lastMonth: dailyRevenue * 28,
        thisQuarter: dailyRevenue * 90,
        thisYear: dailyRevenue * 365
      },

      costs: {
        operationalCost: 35000 + Math.random() * 15000,
        degradationCost: 25000 + Math.random() * 10000,
        totalCost: 60000 + Math.random() * 25000
      },

      roi: {
        netRevenue: 640000 + Math.random() * 200000,
        revenuePerMWh: 85 + Math.random() * 35,
        revenuePerCycle: 350 + Math.random() * 150,
        paybackPeriod: 7 + Math.random() * 3
      }
    };
  }

  private generateSafetyStatus(assetId: string): SafetySystemStatus {
    return {
      assetId,

      fireProtection: {
        level1CellProtection: {
          level: 1,
          enabled: true,
          sensors: 288,
          healthyDevices: 286 + Math.floor(Math.random() * 2),
          faultedDevices: Math.floor(Math.random() * 2),
          lastAlarm: null,
          testStatus: 'passed',
          lastTest: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        level2ModuleProtection: {
          level: 2,
          enabled: true,
          sensors: 32,
          healthyDevices: 32,
          faultedDevices: 0,
          lastAlarm: null,
          testStatus: 'passed',
          lastTest: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        level3PackProtection: {
          level: 3,
          enabled: true,
          sensors: 8,
          healthyDevices: 8,
          faultedDevices: 0,
          lastAlarm: null,
          testStatus: 'passed',
          lastTest: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        suppressionSystem: {
          type: 'aerosol',
          armed: true,
          lastTest: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          pressure: 200 + Math.random() * 50,
          agentLevel: 95 + Math.random() * 5
        }
      },

      gasDetectors: [
        {
          id: 'H2-001',
          type: 'hydrogen',
          location: 'Main Pack - North',
          reading: Math.random() * 10,
          threshold: 1000,
          status: 'normal',
          lastCalibration: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          nextCalibration: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'SMOKE-001',
          type: 'smoke',
          location: 'Main Pack - South',
          reading: 0,
          threshold: 1,
          status: 'normal',
          lastCalibration: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          nextCalibration: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],

      coolingSystem: {
        systemType: 'liquid',
        operational: true,
        mode: 'active',
        coolantTemp: 25 + Math.random() * 10,
        coolantTempTarget: 30,
        coolantFlow: 150 + Math.random() * 50,
        coolantFlowTarget: 180,
        coolantPressure: 200 + Math.random() * 50,
        coolantLevel: 95 + Math.random() * 5,
        pumpsActive: 2,
        pumpsTotal: 2,
        fansActive: 4,
        fansTotal: 4,
        efficiency: 92 + Math.random() * 6,
        powerConsumption: 15 + Math.random() * 10,
        lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        nextMaintenance: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        filterStatus: 'clean'
      },

      emergencyShutdown: {
        armed: true,
        triggers: ['High temperature', 'Gas detection', 'Fire alarm', 'Manual button'],
        lastTest: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        manualOverride: false
      },

      safetyEvents: [],

      lastSafetyInspection: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextSafetyInspection: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(),
      certificationsValid: true
    };
  }

  private updateAssetData() {
    this.assets = this.assets.map(asset => {
      const updatedAsset = { ...asset };

      // Update SOC based on power flow
      let newSOC = asset.performance.stateOfCharge;
      const deltaTime = 1 / 60; // Assume 1-minute updates
      const energyChange = (asset.performance.power * deltaTime) / asset.capacity * 100;
      newSOC -= energyChange; // Negative power charges, positive discharges
      newSOC = Math.max(5, Math.min(100, newSOC)); // Keep between 5-100%

      // Update performance data
      updatedAsset.performance = this.generateBatteryPerformance(asset.model, newSOC);

      // Update health data slowly
      if (Math.random() < 0.01) {
        updatedAsset.health = this.generateBatteryHealth(
          asset.health.stateOfHealth - 0.001,
          asset.performance.cycleCount + 1
        );
      }

      // Update telemetry
      updatedAsset.telemetry = this.generateTelemetry();

      // Update status based on power flow
      if (Math.abs(updatedAsset.performance.power) < 1) {
        updatedAsset.status = 'idle';
      } else if (updatedAsset.performance.power > 0) {
        updatedAsset.status = 'discharging';
      } else {
        updatedAsset.status = 'charging';
      }

      // Simulate alerts (2% chance)
      if (Math.random() < 0.02) {
        const alertTypes = [
          { type: 'temperature' as const, severity: 'low' as const, message: 'Module temperature above normal', code: 'A123-TEMP-002' },
          { type: 'voltage' as const, severity: 'medium' as const, message: 'Cell voltage imbalance detected', code: 'A123-VOLT-001' },
          { type: 'maintenance' as const, severity: 'low' as const, message: 'Scheduled maintenance reminder', code: 'A123-MAINT-001' },
          { type: 'soc' as const, severity: 'low' as const, message: 'State of charge approaching limits', code: 'A123-SOC-001' }
        ];

        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        updatedAsset.alerts = [{
          ...randomAlert,
          timestamp: new Date().toISOString()
        }];
      } else if (Math.random() < 0.1) {
        // Clear alerts
        updatedAsset.alerts = [];
      }

      return updatedAsset;
    });

    // Notify subscribers
    this.subscribers.forEach(callback => callback([...this.assets]));
  }

  public subscribe(callback: (assets: SimulatedAsset[]) => void): () => void {
    this.subscribers.push(callback);
    callback([...this.assets]);

    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  public start(intervalMs: number = 5000) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updateAssetData();
    }, intervalMs);

    console.log('A123 Battery Management System Simulator started');
  }

  public stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('A123 Battery Management System Simulator stopped');
  }

  public getCurrentAssets(): SimulatedAsset[] {
    return [...this.assets];
  }

  public isSimulationRunning(): boolean {
    return this.isRunning;
  }

  public triggerUpdate() {
    this.updateAssetData();
  }

  // Simulate specific battery events
  public simulateEmergencyDischarge(assetId: string) {
    const asset = this.assets.find(a => a.id === assetId);
    if (asset) {
      asset.status = 'discharging';
      asset.performance.power = asset.power * 0.9; // 90% of max power
      asset.alerts = [{
        type: 'safety',
        severity: 'high',
        message: 'Emergency discharge initiated - grid support mode',
        timestamp: new Date().toISOString(),
        code: 'A123-EMER-001'
      }];
      this.subscribers.forEach(callback => callback([...this.assets]));
    }
  }

  public simulateMaintenanceMode(assetId: string) {
    const asset = this.assets.find(a => a.id === assetId);
    if (asset) {
      asset.status = 'maintenance';
      asset.performance.power = 0;
      asset.alerts = [{
        type: 'maintenance',
        severity: 'medium',
        message: 'System in maintenance mode - offline',
        timestamp: new Date().toISOString(),
        code: 'A123-MAINT-002'
      }];
      this.subscribers.forEach(callback => callback([...this.assets]));
    }
  }

  // Get historical data for a specific asset
  public getHistoricalData(assetId: string, period: TimePeriod): HistoricalData {
    const asset = this.assets.find(a => a.id === assetId);
    if (!asset) {
      throw new Error(`Asset with id ${assetId} not found`);
    }

    const now = new Date();
    const performances: BatteryPerformanceData[] = [];
    const health: BatteryHealthData[] = [];
    const alerts: AlertData[] = [];
    const telemetry: TelemetryData[] = [];

    const { startDate, dataPoints } = this.getPeriodInfo(period);
    const intervalMs = (now.getTime() - startDate.getTime()) / dataPoints;

    let simulatedSOC = 50; // Start at 50% SOC
    let totalCharged = 0;
    let totalDischarged = 0;
    let cycleCount = asset.performance.cycleCount - Math.floor(dataPoints / 24);

    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(startDate.getTime() + (i * intervalMs));
      const hour = timestamp.getHours();

      // Generate realistic charge/discharge pattern
      const modelSpecs = A123_MODELS[asset.model as keyof typeof A123_MODELS];
      let power = 0;

      if (hour >= 6 && hour <= 9 || hour >= 17 && hour <= 21) {
        // Peak hours - discharge
        power = modelSpecs.power * (0.4 + Math.random() * 0.4);
        totalDischarged += power * (intervalMs / 3600000); // Convert to MWh
      } else if (hour >= 0 && hour <= 5) {
        // Off-peak - charge
        power = -modelSpecs.power * (0.3 + Math.random() * 0.3);
        totalCharged += Math.abs(power) * (intervalMs / 3600000);
      } else {
        power = modelSpecs.power * (Math.random() - 0.5) * 0.4;
        if (power > 0) totalDischarged += power * (intervalMs / 3600000);
        else totalCharged += Math.abs(power) * (intervalMs / 3600000);
      }

      // Update SOC
      simulatedSOC -= (power * (intervalMs / 3600000) / asset.capacity * 100);
      simulatedSOC = Math.max(10, Math.min(95, simulatedSOC));

      performances.push({
        power: Math.round(power * 10) / 10,
        stateOfCharge: Math.round(simulatedSOC * 10) / 10,
        energy: Math.round(asset.capacity * simulatedSOC / 100 * 10) / 10,
        voltage: 480 + (simulatedSOC / 100) * 20,
        current: power > 0 ? (power * 1000 / 500) : -(Math.abs(power) * 1000 / 500),
        efficiency: 92 + Math.random() * 6,
        cycleCount: cycleCount + Math.floor(i / 24),
        timestamp: timestamp.toISOString()
      });

      // Add health data periodically
      if (i % Math.max(1, Math.floor(dataPoints / 30)) === 0) {
        health.push(this.generateBatteryHealth(
          asset.health.stateOfHealth - (i * 0.0001),
          cycleCount + Math.floor(i / 24)
        ));
      }

      // Add telemetry data
      if (i % Math.max(1, Math.floor(dataPoints / 100)) === 0) {
        telemetry.push({
          ...this.generateTelemetry(),
          lastUpdate: timestamp.toISOString()
        });
      }

      // Generate random alerts
      if (Math.random() < 0.01) {
        alerts.push({
          type: 'maintenance',
          severity: 'low',
          message: 'Routine check completed',
          timestamp: timestamp.toISOString(),
          code: 'A123-CHECK-001'
        });
      }
    }

    // Calculate summary
    const averageEfficiency = performances.reduce((sum, p) => sum + p.efficiency, 0) / performances.length;
    const peakPower = Math.max(...performances.map(p => Math.abs(p.power)));
    const averageSOC = performances.reduce((sum, p) => sum + p.stateOfCharge, 0) / performances.length;
    const uptimePercentage = performances.filter(p => Math.abs(p.power) > 0).length / performances.length * 100;

    return {
      assetId,
      period,
      performances,
      health,
      alerts,
      telemetry,
      summary: {
        totalEnergyCharged: Math.round(totalCharged * 10) / 10,
        totalEnergyDischarged: Math.round(totalDischarged * 10) / 10,
        averageEfficiency: Math.round(averageEfficiency * 10) / 10,
        peakPower: Math.round(peakPower * 10) / 10,
        averageSOC: Math.round(averageSOC * 10) / 10,
        cycleCount: Math.floor(dataPoints / 24),
        uptimePercentage: Math.round(uptimePercentage * 10) / 10,
        alertCount: alerts.length
      }
    };
  }

  private getPeriodInfo(period: TimePeriod): { startDate: Date; dataPoints: number } {
    const now = new Date();

    switch (period) {
      case 'today':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          dataPoints: 24 // Hourly data
        };
      case '7days':
        return {
          startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          dataPoints: 168 // Hourly data
        };
      case '30days':
        return {
          startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          dataPoints: 720 // Hourly data
        };
      case 'month':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          dataPoints: 720 // Hourly data
        };
      case 'quarter':
        return {
          startDate: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
          dataPoints: 2160 // Hourly data
        };
      case 'year':
        return {
          startDate: new Date(now.getFullYear(), 0, 1),
          dataPoints: 8760 // Hourly data
        };
      default:
        throw new Error(`Unknown period: ${period}`);
    }
  }
}

// Singleton instance
export const energyDataSimulator = new EnergyDataSimulator();