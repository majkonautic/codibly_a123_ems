// Google Maps configuration for EMS/SCADA dark theme
export const GOOGLE_MAPS_CONFIG = {
  // Development API key - replace with production key
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key',

  // Default map options
  defaultOptions: {
    zoom: 4,
    center: { lat: 39.8283, lng: -98.5795 }, // Geographic center of US
    mapTypeId: 'hybrid', // Hybrid works well with light styling
    styles: [
      // Light dark theme that works with all map types
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#e5e7eb' }] // Light text
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#1f2937' }] // Dark outline
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#93c5fd' }] // Light blue for water labels
      }
    ],
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: true,
    gestureHandling: 'cooperative'
  },

  // Map type options for EMS/SCADA
  mapTypes: [
    { id: 'satellite', name: 'Satellite' },
    { id: 'roadmap', name: 'Road' },
    { id: 'hybrid', name: 'Hybrid' },
    { id: 'terrain', name: 'Terrain' }
  ],

  // Clustering options
  clusterOptions: {
    minimumClusterSize: 3,
    maxZoom: 15,
    averageCenter: true,
    zoomOnClick: false,
    gridSize: 60,
    styles: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23059669' stroke='%23ffffff' stroke-width='2'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3ETEXT%3C/text%3E%3C/svg%3E",
        width: 40,
        height: 40,
        textColor: '#ffffff',
        textSize: 12,
        fontWeight: 'bold'
      },
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='23' fill='%23dc2626' stroke='%23ffffff' stroke-width='2'/%3E%3Ctext x='25' y='31' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3ETEXT%3C/text%3E%3C/svg%3E",
        width: 50,
        height: 50,
        textColor: '#ffffff',
        textSize: 14,
        fontWeight: 'bold'
      },
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='28' fill='%237c3aed' stroke='%23ffffff' stroke-width='2'/%3E%3Ctext x='30' y='36' text-anchor='middle' fill='white' font-size='16' font-weight='bold'%3ETEXT%3C/text%3E%3C/svg%3E",
        width: 60,
        height: 60,
        textColor: '#ffffff',
        textSize: 16,
        fontWeight: 'bold'
      }
    ]
  },

  // Asset marker icons (SVG data URLs)
  assetIcons: {
    solar: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cline x1='12' y1='1' x2='12' y2='3'/%3E%3Cline x1='12' y1='21' x2='12' y2='23'/%3E%3Cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'/%3E%3Cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'/%3E%3Cline x1='1' y1='12' x2='3' y2='12'/%3E%3Cline x1='21' y1='12' x2='23' y2='12'/%3E%3Cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'/%3E%3Cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'/%3E%3C/svg%3E",
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    },
    wind: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2'%3E%3Cpath d='M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2'/%3E%3Cpath d='M9.6 4.6A2 2 0 1 1 11 8H2'/%3E%3Cpath d='M12.6 19.4A2 2 0 1 0 14 16H2'/%3E%3C/svg%3E",
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    },
    battery: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2'%3E%3Crect x='1' y='6' width='18' height='12' rx='2' ry='2'/%3E%3Cline x1='23' y1='13' x2='23' y2='11'/%3E%3C/svg%3E",
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    },
    substation: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2'%3E%3Cpolygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/%3E%3C/svg%3E",
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    },
    default: {
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/%3E%3C/svg%3E",
      scaledSize: { width: 32, height: 32 },
      anchor: { x: 16, y: 16 }
    }
  }
};

// Helper functions
export const getAssetIcon = (type: string, status: string) => {
  const baseIcon = GOOGLE_MAPS_CONFIG.assetIcons[type as keyof typeof GOOGLE_MAPS_CONFIG.assetIcons] ||
                   GOOGLE_MAPS_CONFIG.assetIcons.default;

  // Modify icon color based on status
  let color = '%236b7280'; // default gray
  switch (status) {
    case 'exporting':
      color = '%2310b981'; // green
      break;
    case 'curtailing':
      color = '%23f59e0b'; // yellow
      break;
    case 'offline':
      color = '%23ef4444'; // red
      break;
    case 'charging':
      color = '%233b82f6'; // blue
      break;
  }

  return {
    ...baseIcon,
    url: baseIcon.url.replace(/%23[0-9a-f]{6}/i, color)
  };
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'exporting': return '#10B981'; // green
    case 'curtailing': return '#F59E0B'; // yellow
    case 'offline': return '#EF4444'; // red
    case 'charging': return '#3B82F6'; // blue
    default: return '#6B7280'; // gray
  }
};

// Map type specific styles that work well with each map type
export const getMapTypeStyles = (mapType: string) => {
  switch (mapType) {
    case 'roadmap':
      // Full dark theme for roadmap
      return [
        {
          elementType: 'geometry',
          stylers: [{ color: '#1f2937' }] // Dark gray
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#1f2937' }]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca3af' }] // Light gray text
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#374151' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0f172a' }]
        }
      ];

    case 'satellite':
    case 'hybrid':
      // Light styling that doesn't interfere with satellite imagery
      return [
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#ffffff' }] // White text
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#000000', weight: 2 }] // Black outline
        }
      ];

    case 'terrain':
      // Minimal styling for terrain
      return [
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#2d3748' }] // Dark gray text
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }] // White outline
        }
      ];

    default:
      // Default minimal styling
      return [
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#e5e7eb' }] // Light text
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#1f2937' }] // Dark outline
        }
      ];
  }
};