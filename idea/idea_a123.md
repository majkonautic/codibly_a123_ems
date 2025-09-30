A123 SYSTEMS EMS STRUCTURE
1. ASSET DATA STRUCTURE
System-Level Information:
Asset Hierarchy: ├── Site Information │ ├── Site ID / Name │ ├── Location (Address, GPS Coordinates) │ ├── Installation Date │ ├── Commissioning Date │ └── Site Contact Information │ ├── Container Details │ ├── Product Model (40ft/20ft-A/20ft-B/A-Power 800/AEnergy 850/5000) │ ├── Container Serial Number │ ├── Firmware Version │ ├── Voltage Class (1500V/800V) │ ├── Rated Capacity (MWh) │ ├── Rated Power (MW) │ └── Warranty Information │ ├── Battery System │ ├── Battery Chemistry (Nanophosphate LFP) │ ├── Number of Battery Racks │ ├── Total Cell Count │ ├── Pack Configuration │ ├── Cell Voltage Range (Min/Nom/Max) │ └── Operating Temperature Range (-20°C to +50°C) │ ├── BMS (Battery Management System) │ ├── BMS Model/Version │ ├── Communication Protocol (CAN/RS485) │ ├── Number of CMUs (Cell Management Units) │ └── Last Calibration Date │ ├── PCS (Power Conversion System) │ ├── PCS Manufacturer/Model │ ├── Rated Power │ ├── Efficiency Rating │ └── Grid Connection Type │ ├── Thermal Management │ ├── Cooling System Type (Liquid-Cooled) │ ├── Coolant Type │ ├── Number of Cooling Loops │ ├── Pump Status │ └── Heat Exchanger Status │ └── Safety Systems ├── Fire Suppression System (3-Level) ├── Gas Detection Sensors ├── Emergency Shutdown System ├── HVAC Status └── Access Control Status
Real-Time Operational Data:
Performance Metrics: ├── State of Charge (SOC) % ├── State of Health (SOH) % ├── Current Power (MW) - Charging/Discharging ├── Energy Throughput (MWh) ├── Round-Trip Efficiency (%) ├── Current (A) ├── Voltage (V) │ ├── Pack Voltage │ ├── Cell Voltage (Min/Max/Avg) │ └── Voltage Imbalance ├── Frequency (Hz) ├── Temperature (°C) │ ├── Cell Temperature (Min/Max/Avg) │ ├── Ambient Temperature │ ├── Coolant Temperature (Inlet/Outlet) │ └── PCS Temperature └── Operating Mode ├── Charging ├── Discharging ├── Standby ├── Maintenance └── Offline
Battery Health Metrics:
Health & Lifecycle: ├── Total Cycle Count ├── Equivalent Full Cycles (EFC) ├── Cycles Remaining (to 80% SOH) ├── Estimated Remaining Life (years) ├── Capacity Fade Rate (%/year) ├── Internal Resistance Trend ├── Cell Balancing Status ├── Calendar Aging Factor └── Degradation Rate
2. ASSET ALERTS STRUCTURE
Alert Categories & Severity Levels:
CRITICAL (Red) - Immediate Action Required:

Safety Alerts: ├── Fire Detection Activated ├── Gas Leak Detected (H2, CO) ├── Emergency Shutdown Triggered ├── Thermal Runaway Warning ├── Cell Voltage Outside Safe Limits (>4.2V or <2.5V) ├── Over Temperature (>55°C) ├── Coolant Leak Detected └── Door/Access Breach System Failure: ├── BMS Communication Lost ├── PCS Fault/Trip ├── Grid Connection Lost ├── Multiple Cell Failures └── Cooling System Failure
HIGH (Orange) - Urgent Attention:

Performance Degradation: ├── Efficiency Below Threshold (<85%) ├── SOH Drop >5% in 30 days ├── High Internal Resistance ├── Voltage Imbalance >100mV └── Capacity Loss Detected Operational Issues: ├── Cell Temperature Warning (45-50°C) ├── Charging/Discharging Current Limit Exceeded ├── BMS Warning Codes ├── PCS Derate Active ├── Cooling System Degraded Performance └── Single Cell/Module Offline
MEDIUM (Yellow) - Monitor & Schedule:

Maintenance Needed: ├── Firmware Update Available ├── Calibration Due ├── Filter Replacement Due ├── Inspection Overdue └── Warranty Expiring Soon Performance Monitoring: ├── Efficiency Trending Down ├── Cell Imbalance Increasing ├── Temperature Differential High ├── Cycle Count Milestone Reached └── Unusual Operating Pattern Detected
LOW (Blue) - Informational:

Status Updates: ├── Mode Change (Charge/Discharge/Standby) ├── Scheduled Maintenance Completed ├── Firmware Updated ├── Communication Restored └── Performance Report Generated
Alert Data Fields:
Alert Structure: ├── Alert ID (Unique) ├── Timestamp (Creation) ├── Asset ID / Container ID ├── Location ├── Severity Level ├── Alert Type/Category ├── Status (Active/Acknowledged/Resolved) ├── Message/Description ├── Root Cause Analysis ├── Recommended Action ├── Assigned To ├── Acknowledgment Time ├── Resolution Time ├── Related Alerts (if cascading) └── Historical Occurrence Count
3. MAP DISPLAY ELEMENTS
Main Map View - Asset Markers:
Marker Information: ├── Color-Coded Status Indicators: │ ├── Green: Online & Healthy (SOH >90%) │ ├── Yellow: Warning/Degraded (SOH 80-90%) │ ├── Orange: Critical Alert Active │ ├── Red: Offline/Fault │ └── Gray: Maintenance Mode │ ├── Marker Icon: Battery/Container symbol with A123 logo │ ├── Size: Proportional to capacity (Small: <1MWh, Medium: 1-4MWh, Large: >4MWh) │ └── Hover Tooltip (Quick View): ├── Asset Name ├── Location ├── Product Model ├── Capacity (MWh) ├── Current SOC % ├── SOH % ├── Current Mode (Charging/Discharging/Standby) ├── Active Power (MW) └── Active Alerts Count
Map Overlays & Layers:
Visualization Layers: ├── Transmission Lines │ └── High-voltage transmission network │ ├── Power Flow Animation │ ├── Animated arrows showing power direction │ ├── Line thickness = power magnitude │ └── Color: Charging (blue), Discharging (orange/green) │ ├── Grid Connection Points │ └── Interconnection substations │ ├── Geofencing Zones │ ├── Service territories │ └── ISO/RTO boundaries │ ├── Environmental Data │ ├── Temperature overlay │ ├── Solar irradiance (if paired with solar) │ └── Weather conditions │ └── Real-time Data Layer ├── Total Active Power by Region ├── Aggregated SOC by Fleet └── Alert Density Heatmap
Clustering for Multi-Asset Sites:
When zoomed out: ├── Cluster markers showing: │ ├── Number of assets in cluster │ ├── Total capacity (MWh) │ ├── Average SOC % │ ├── Number of active alerts │ └── Overall health status (color-coded) │ └── Click to zoom & separate individual markers
4. REPORTS & ANALYTICS
A. Performance Reports
Daily Operations Report:

├── Energy Metrics │ ├── Total Energy Charged (MWh) │ ├── Total Energy Discharged (MWh) │ ├── Net Energy (MWh) │ ├── Peak Power Charge (MW) │ ├── Peak Power Discharge (MW) │ └── Energy Throughput │ ├── Efficiency Metrics │ ├── Daily Round-Trip Efficiency (%) │ ├── Charge Efficiency (%) │ ├── Discharge Efficiency (%) │ ├── PCS Efficiency (%) │ └── System Losses (kWh) │ ├── Operating Profile │ ├── Time in Charge Mode (hrs) │ ├── Time in Discharge Mode (hrs) │ ├── Time in Standby (hrs) │ ├── Number of Cycles Completed │ └── Average Cycle Depth (%) │ └── Financial Metrics (if applicable) ├── Revenue Generated ($) ├── Energy Cost Savings ($) ├── Demand Charge Reduction ($) └── Grid Services Revenue ($)
Weekly Performance Summary:

├── Availability & Uptime │ ├── System Availability (%) │ ├── Planned Downtime (hrs) │ ├── Unplanned Downtime (hrs) │ └── Mean Time Between Failures (MTBF) │ ├── Energy & Efficiency Trends │ ├── Week-over-week energy comparison │ ├── Average efficiency trend │ ├── Performance vs. baseline │ └── Capacity fade analysis │ ├── Alerts & Incidents │ ├── Total alerts by severity │ ├── Alert response time (avg) │ ├── Alert resolution time (avg) │ └── Recurring alert analysis │ └── Cycle Analysis ├── Total cycles completed ├── Average cycle depth ├── Cycle efficiency └── Projected remaining cycles
Monthly Health Report:

├── Battery Health Assessment │ ├── Current SOH (%) │ ├── SOH Change from previous month (%) │ ├── Capacity retention (MWh) │ ├── Internal resistance trend │ ├── Cell voltage distribution │ ├── Temperature profile analysis │ └── Degradation rate (%/month) │ ├── Lifecycle Tracking │ ├── Cumulative EFC │ ├── Calendar age vs. cycle age │ ├── Estimated remaining life (years) │ ├── Warranty utilization (%) │ └── Replacement forecast │ ├── Thermal Performance │ ├── Temperature distribution (min/max/avg) │ ├── Cooling system efficiency │ ├── Thermal events count │ └── Temperature correlation with performance │ └── Predictive Maintenance ├── Components requiring attention ├── Maintenance schedule adherence ├── Parts replacement forecast └── Maintenance cost projection
B. Operational Reports
Energy Throughput Analysis:

├── Historical energy flow (charge/discharge) ├── Time-of-day analysis ├── Seasonal patterns ├── Peak demand periods ├── Load profile optimization suggestions └── Energy arbitrage opportunities
Financial Performance Report (C&I Focus):

├── Demand Charge Avoidance │ ├── Peak demand reduction (kW) │ ├── Cost savings per month ($) │ └── Annual projected savings ($) │ ├── Energy Arbitrage │ ├── Buy low/sell high analysis │ ├── Price spread captured ($/MWh) │ └── Arbitrage revenue ($) │ ├── Grid Services Revenue │ ├── Frequency regulation │ ├── Demand response │ ├── Capacity payments │ └── Ancillary services │ ├── Total Cost of Ownership │ ├── Capital amortization │ ├── O&M costs │ ├── Energy costs │ └── ROI calculation │ └── Payback Analysis ├── Cumulative savings vs. investment ├── Payback period progress └── IRR calculation
C. Fleet Management Reports
Fleet Overview Dashboard:

├── Total Fleet Capacity (MWh) ├── Total Assets Count (by model) ├── Average Fleet SOH (%) ├── Total Energy Stored (MWh) ├── Total Active Power (MW) ├── Fleet Availability (%) ├── Active Alerts (by severity) └── Fleet Efficiency (%)
Comparative Asset Performance:

├── Performance ranking table │ ├── Asset name │ ├── Efficiency ranking │ ├── Availability ranking │ ├── SOH ranking │ └── Alert frequency ranking │ ├── Outlier detection │ ├── Underperforming assets │ ├── High-alert assets │ └── Assets requiring attention │ └── Benchmarking ├── Performance vs. fleet average ├── Performance vs. product specification └── Performance vs. similar deployments
D. Compliance & Certification Reports
Safety & Compliance Report:

├── Safety Incidents Log ├── Fire Suppression System Tests ├── Gas Detection Calibration Records ├── NFPA 855 Compliance Checklist ├── UL 9540A Test Results ├── Emergency Shutdown Tests └── Access/Security Logs
Regulatory Reporting:

├── Grid Interconnection Compliance ├── ISO/RTO Performance Metrics ├── Environmental Impact Report │ ├── Carbon emissions avoided │ ├── Renewable energy integration │ └── Grid decarbonization contribution └── Utility Performance Reports
E. Custom Reports
Battery Degradation Forecast:

├── SOH projection (1/5/10 years) ├── Capacity fade model ├── Cycle life consumption rate ├── Expected end-of-life date ├── Second-life opportunities analysis └── Replacement planning timeline
Optimization Recommendations:

├── Operating strategy suggestions ├── Charge/discharge schedule optimization ├── Temperature management improvements ├── Efficiency enhancement opportunities └── Cost reduction strategies
5. A123 SYSTEMS BRAND COLORS & DESIGN
Based on analyzing A123 Systems' website and branding:

Primary Brand Colors:
/* Primary Orange - A123 Signature Color */
--a123-primary-orange: #FF8C00;  /* Main brand orange */
--a123-orange-light: #FFA500;    /* Lighter orange for hover */
--a123-orange-dark: #E67E00;     /* Darker orange for active states */
--a123-orange-glow: rgba(255, 140, 0, 0.3);  /* Glow effect */

/* Secondary Gray/Dark Tones */
--a123-dark-bg: #1A1D23;         /* Main dark background */
--a123-card-bg: #252932;         /* Card/panel background */
--a123-card-hover: #2D323C;      /* Card hover state */
--a123-border: #3A3F4B;          /* Border color */

/* Text Colors */
--a123-text-primary: #FFFFFF;    /* Primary text */
--a123-text-secondary: #A0A4B1;  /* Secondary text */
--a123-text-muted: #6B7280;      /* Muted/disabled text */

/* Accent Colors for Data Visualization */
--a123-blue: #4A90E2;            /* Info/neutral data */
--a123-green: #10B981;           /* Success/positive/charging */
--a123-teal: #14B8A6;            /* Alternative positive */
--a123-yellow: #F59E0B;          /* Warning */
--a123-red: #EF4444;             /* Error/critical */
--a123-purple: #8B5CF6;          /* Alternative data series */
Design System for EMS:
Status Indicators:

/* Operational Status Colors */
--status-online: #10B981;        /* Healthy/Online - Green */
--status-charging: #4A90E2;      /* Charging - Blue */
--status-discharging: #FF8C00;   /* Discharging - A123 Orange */
--status-standby: #6B7280;       /* Standby - Gray */
--status-warning: #F59E0B;       /* Warning - Yellow */
--status-critical: #EF4444;      /* Critical - Red */
--status-offline: #4B5563;       /* Offline - Dark Gray */
--status-maintenance: #8B5CF6;   /* Maintenance - Purple */
Chart Colors (for A123 EMS):

/* Primary Chart Palette */
--chart-primary: #10B981;        /* Main data line - teal/green */
--chart-secondary: #4A90E2;      /* Secondary data - blue */
--chart-accent: #FF8C00;         /* A123 orange for highlights */
--chart-tertiary: #8B5CF6;       /* Purple for third series */
--chart-quaternary: #F59E0B;     /* Yellow-orange for fourth series */

/* Area/Fill Colors (with transparency) */
--chart-fill-green: rgba(16, 185, 129, 0.3);
--chart-fill-orange: rgba(255, 140, 0, 0.3);
--chart-fill-blue: rgba(74, 144, 226, 0.3);

/* Grid & Axes */
--chart-grid: #3A3F4B;
--chart-axis: #6B7280;
Component Styling:

/* Cards & Panels */
.a123-card {
  background: #252932;
  border: 1px solid #3A3F4B;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.a123-card:hover {
  background: #2D323C;
  border-color: #FF8C00;
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.2);
}

/* Primary Button */
.a123-btn-primary {
  background: linear-gradient(135deg, #FF8C00, #FFA500);
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.a123-btn-primary:hover {
  background: linear-gradient(135deg, #FFA500, #FFB84D);
  box-shadow: 0 6px 20px rgba(255, 140, 0, 0.4);
  transform: translateY(-2px);
}

/* Status Badge */
.a123-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.a123-badge-charging {
  background: rgba(74, 144, 226, 0.2);
  color: #4A90E2;
  border: 1px solid #4A90E2;
}

.a123-badge-discharging {
  background: rgba(255, 140, 0, 0.2);
  color: #FF8C00;
  border: 1px solid #FF8C00;
}

/* Progress Bars */
.a123-progress {
  background: #3A3F4B;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.a123-progress-bar {
  background: linear-gradient(90deg, #10B981, #14B8A6);
  height: 100%;
  transition: width 0.5s ease;
}

.a123-progress-bar-orange {
  background: linear-gradient(90deg, #FF8C00, #FFA500);
}
Typography:

/* Font Stack (matching A123 website feel) */
font-family: 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;

/* Headings */
h1 { font-size: 32px; font-weight: 700; color: #FFFFFF; }
h2 { font-size: 24px; font-weight: 600; color: #FFFFFF; }
h3 { font-size: 20px; font-weight: 600; color: #FFFFFF; }
h4 { font-size: 16px; font-weight: 600; color: #A0A4B1; }

/* Body Text */
body { font-size: 14px; color: #A0A4B1; line-height: 1.6; }

/* Data Values - Large */
.data-value-large {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1;
}

/* Data Labels */
.data-label {
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
Icons & Accents:

- Use A123 Systems logo in header (white or orange version) - Orange accent bars on left side of active cards - Orange glow effects for interactive elements - Subtle animations with orange highlights - Status icons with colored backgrounds (circular badges)
Map Marker Design:

/* A123 Battery Container Marker */
- Base shape: Rounded rectangle (representing container)
- Color: Status-based (green/yellow/orange/red)
- Icon: Battery symbol or A123 logo mark
- Border: 2px solid white
- Shadow: 0 4px 8px rgba(0, 0, 0, 0.3)
- Active state: Pulsing orange glow animation
- Size: 40x50px (standard), 60x75px (selected)
This design system aligns with A123 Systems' professional, technology-focused brand while maintaining clarity and usability for an industrial EMS platform. The signature orange creates brand recognition while the dark theme with high contrast ensures excellent readability for operational monitoring.