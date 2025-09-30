/**
 * A123 Systems Battery Storage Product Catalog
 * Maps battery models to their product images and specifications
 */

export interface BatteryProduct {
  model: string;
  name: string;
  category: 'utility' | 'ci'; // Utility Scale or Commercial & Industrial
  capacity: number; // MWh
  capacityUnit: string;
  configuration: string;
  chemistry: string;
  voltage: {
    nominal: number;
    range: { min: number; max: number };
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight: number;
  weightUnit: string;
  image: string;
  thumbnail: string;
  features: string[];
  applications: string[];
  certifications: string[];
  coolingType: string;
  temperatureRange: { min: number; max: number };
}

export const BATTERY_PRODUCTS: Record<string, BatteryProduct> = {
  // Utility Scale Products
  'GRID-1000': {
    model: 'GRID-1000',
    name: '20ft Liquid-Cooled Container-A 1500V',
    category: 'utility',
    capacity: 3.07,
    capacityUnit: 'MWh',
    configuration: '8×4P384S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 1228.8,
      range: { min: 960, max: 1401.6 }
    },
    dimensions: {
      length: 6058,
      width: 2438,
      height: 2896,
      unit: 'mm'
    },
    weight: 35000,
    weightUnit: 'kg',
    image: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    thumbnail: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    features: [
      'Long life lithium iron phosphate battery',
      'Intelligent BMS system',
      'Level 3 fire safety protection (Pack Level)',
      'Easy to maintain for external operation',
      'Space-efficient design',
      'Liquid cooling thermal management'
    ],
    applications: [
      'User side energy storage',
      'Grid side stabilization',
      'Power supply side buffering'
    ],
    certifications: ['IEC 62619', 'UN38.3', 'GB/T36276', 'UL9540', 'UL9540A', 'UL1973'],
    coolingType: 'Liquid Cooling',
    temperatureRange: { min: -10, max: 55 }
  },

  'MEGA-2000': {
    model: 'MEGA-2000',
    name: '20ft Liquid-Cooled Container-B 1500V',
    category: 'utility',
    capacity: 3.44,
    capacityUnit: 'MWh',
    configuration: '8×4P416S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 1331.2,
      range: { min: 1040, max: 1497.6 }
    },
    dimensions: {
      length: 6058,
      width: 2438,
      height: 2896,
      unit: 'mm'
    },
    weight: 38000,
    weightUnit: 'kg',
    image: '/images/battery-storage/utility/20ft-container-a-1500v.png', // Using same image as placeholder
    thumbnail: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    features: [
      'High capacity configuration',
      'Intelligent BMS system',
      'Level 3 fire safety protection',
      'Optimized for large-scale deployments',
      'Liquid cooling thermal management',
      'Extended cycle life'
    ],
    applications: [
      'Utility-scale energy storage',
      'Grid stabilization',
      'Renewable integration',
      'Frequency regulation'
    ],
    certifications: ['IEC 62619', 'UN38.3', 'UL9540', 'UL9540A', 'UL1973'],
    coolingType: 'Liquid Cooling',
    temperatureRange: { min: -10, max: 55 }
  },

  'GRID-500': {
    model: 'GRID-500',
    name: 'Mid-Range Utility Container',
    category: 'utility',
    capacity: 1.5,
    capacityUnit: 'MWh',
    configuration: '4×4P384S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 1228.8,
      range: { min: 960, max: 1401.6 }
    },
    dimensions: {
      length: 4000,
      width: 2438,
      height: 2896,
      unit: 'mm'
    },
    weight: 18000,
    weightUnit: 'kg',
    image: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    thumbnail: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    features: [
      'Compact utility-scale solution',
      'Intelligent BMS',
      'Fire safety protection',
      'Liquid cooling',
      'Flexible deployment'
    ],
    applications: [
      'Medium-scale grid support',
      'Renewable buffering',
      'Peak shaving'
    ],
    certifications: ['IEC 62619', 'UN38.3', 'UL9540'],
    coolingType: 'Liquid Cooling',
    temperatureRange: { min: -10, max: 55 }
  },

  'GRID-250': {
    model: 'GRID-250',
    name: 'Compact Utility Container',
    category: 'utility',
    capacity: 0.75,
    capacityUnit: 'MWh',
    configuration: '2×4P384S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 1228.8,
      range: { min: 960, max: 1401.6 }
    },
    dimensions: {
      length: 3000,
      width: 2200,
      height: 2600,
      unit: 'mm'
    },
    weight: 9000,
    weightUnit: 'kg',
    image: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    thumbnail: '/images/battery-storage/utility/20ft-container-a-1500v.png',
    features: [
      'Small footprint',
      'Quick deployment',
      'Intelligent monitoring',
      'Fire protection',
      'Liquid cooling'
    ],
    applications: [
      'Distributed energy storage',
      'Microgrid support',
      'Commercial grid tie-in'
    ],
    certifications: ['IEC 62619', 'UN38.3', 'UL9540'],
    coolingType: 'Liquid Cooling',
    temperatureRange: { min: -10, max: 55 }
  },

  // Commercial & Industrial Products
  'FLEX-200': {
    model: 'FLEX-200',
    name: 'A-Power I 800 Liquid-Cooled Container',
    category: 'ci',
    capacity: 0.836,
    capacityUnit: 'MWh',
    configuration: '2×1P416S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 1331.2,
      range: { min: 1040, max: 1497.6 }
    },
    dimensions: {
      length: 2438,
      width: 1492,
      height: 2896,
      unit: 'mm'
    },
    weight: 8000,
    weightUnit: 'kg',
    image: '/images/battery-storage/ci/a-power-i-800-container.jpg',
    thumbnail: '/images/battery-storage/ci/a-power-i-800-container.jpg',
    features: [
      'Ultimate safety performance with 3-level fire protection',
      'Intelligent and efficient operation',
      'Flexible deployment',
      'Reliable operation and easy maintenance',
      'Liquid cooling thermal management',
      'Compact C&I design'
    ],
    applications: [
      'Uninterruptible Power Supply',
      'Peak shaving',
      'Energy arbitrage',
      'Frequency regulation'
    ],
    certifications: ['IEC61000', 'IEC 62477', 'IEC 62933', 'UL 9540A', 'UN38.3'],
    coolingType: 'Liquid Cooling',
    temperatureRange: { min: -20, max: 55 }
  },

  'FLEX-100': {
    model: 'FLEX-100',
    name: 'Compact C&I Container',
    category: 'ci',
    capacity: 0.4,
    capacityUnit: 'MWh',
    configuration: '1×1P416S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 1331.2,
      range: { min: 1040, max: 1497.6 }
    },
    dimensions: {
      length: 2000,
      width: 1400,
      height: 2500,
      unit: 'mm'
    },
    weight: 4000,
    weightUnit: 'kg',
    image: '/images/battery-storage/ci/a-power-i-800-container.jpg',
    thumbnail: '/images/battery-storage/ci/a-power-i-800-container.jpg',
    features: [
      '3-level fire protection',
      'Intelligent operation',
      'Easy installation',
      'Liquid cooling',
      'Wide temperature range'
    ],
    applications: [
      'Commercial buildings',
      'Small industrial facilities',
      'Peak demand management',
      'Backup power'
    ],
    certifications: ['IEC61000', 'IEC 62933', 'UL 9540A', 'UN38.3'],
    coolingType: 'Liquid Cooling',
    temperatureRange: { min: -20, max: 55 }
  },

  'ULTRA-50': {
    model: 'ULTRA-50',
    name: 'Ultra-Compact C&I Unit',
    category: 'ci',
    capacity: 0.2,
    capacityUnit: 'MWh',
    configuration: '1×1P208S',
    chemistry: 'LFP (Lithium Iron Phosphate)',
    voltage: {
      nominal: 665.6,
      range: { min: 520, max: 748.8 }
    },
    dimensions: {
      length: 1500,
      width: 1200,
      height: 2200,
      unit: 'mm'
    },
    weight: 2000,
    weightUnit: 'kg',
    image: '/images/battery-storage/ci/a-power-i-800-container.jpg',
    thumbnail: '/images/battery-storage/ci/a-power-i-800-container.jpg',
    features: [
      'Minimal footprint',
      'Fire safety protection',
      'Simple installation',
      'Air/Liquid hybrid cooling',
      'Indoor/outdoor capable'
    ],
    applications: [
      'Critical infrastructure backup',
      'Small commercial facilities',
      'Emergency power',
      'Load balancing'
    ],
    certifications: ['IEC61000', 'UL 9540A', 'UN38.3'],
    coolingType: 'Hybrid Cooling',
    temperatureRange: { min: -10, max: 50 }
  }
};

/**
 * Get product information by model name
 */
export function getProductByModel(model: string): BatteryProduct | undefined {
  return BATTERY_PRODUCTS[model];
}

/**
 * Get product image path by model name
 */
export function getProductImage(model: string): string {
  const product = BATTERY_PRODUCTS[model];
  return product?.image || '/images/battery-storage.jpg'; // Fallback image
}

/**
 * Get product thumbnail by model name
 */
export function getProductThumbnail(model: string): string {
  const product = BATTERY_PRODUCTS[model];
  return product?.thumbnail || '/images/battery-storage.jpg'; // Fallback image
}

/**
 * Get all products by category
 */
export function getProductsByCategory(category: 'utility' | 'ci'): BatteryProduct[] {
  return Object.values(BATTERY_PRODUCTS).filter(p => p.category === category);
}

/**
 * Get all products
 */
export function getAllProducts(): BatteryProduct[] {
  return Object.values(BATTERY_PRODUCTS);
}

/**
 * Format capacity for display
 */
export function formatCapacity(capacity: number, unit: string = 'MWh'): string {
  if (capacity >= 1) {
    return `${capacity.toFixed(2)} ${unit}`;
  }
  return `${(capacity * 1000).toFixed(0)} kWh`;
}

/**
 * Get product category display name
 */
export function getCategoryName(category: 'utility' | 'ci'): string {
  return category === 'utility' ? 'Utility Scale' : 'Commercial & Industrial';
}