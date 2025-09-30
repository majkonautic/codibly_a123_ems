'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { useGoogleMap } from './GoogleMapProvider';
import { GOOGLE_MAPS_CONFIG } from './utils/mapConfig';

interface Asset {
  id: string;
  name: string;
  type: string;
  model: string;
  capacity: number;
  location: string;
  lat: number;
  lng: number;
  status: string;
  performance: {
    power: number;
    stateOfCharge: number;
    efficiency: number;
    voltage: number;
    current: number;
    temperature: number;
  };
  health: {
    stateOfHealth: number;
    cycleCount: number;
    degradation: number;
  };
}

interface AssetLocationMapProps {
  asset: Asset;
  className?: string;
}

export const AssetLocationMap: React.FC<AssetLocationMapProps> = ({
  asset,
  className = "w-full h-64"
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMap();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(`asset-map-${asset.id}`);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('AssetLocationMap render:', {
      isLoaded,
      loadError: loadError?.message,
      assetId: asset.id,
      mapInstance: !!map
    });
  }, [isLoaded, loadError, asset.id, map]);

  // Force re-render when asset changes by resetting map state and generating new key
  useEffect(() => {
    setMap(null);
    setMapError(null);
    setShowInfoWindow(false);
    setMapKey(`asset-map-${asset.id}-${Math.random().toString(36).substr(2, 9)}`);
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, [asset.id]);

  // Helper function to create custom marker icon
  const createMarkerIcon = (type: string, status: string): google.maps.Icon => {
    const statusColor = getStatusColor(status);
    const typeIcon = getTypeIcon(type);

    // Create SVG marker
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="${statusColor}" stroke="white" stroke-width="3"/>
        <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${typeIcon}</text>
      </svg>
    `;

    return {
      url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20)
    };
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'discharging': return '#10B981'; // green
      case 'charging': return '#3B82F6'; // blue
      case 'idle': return '#F59E0B'; // yellow
      case 'standby': return '#8B5CF6'; // purple
      case 'maintenance': return '#EF4444'; // red
      case 'offline': return '#6B7280'; // gray
      default: return '#6B7280'; // gray
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'solar': return '☀';
      case 'wind': return '💨';
      case 'battery': return '🔋';
      case 'substation': return '⚡';
      default: return '⚡';
    }
  };

  // Map options - centered on the asset with closer zoom
  const mapOptions = {
    ...GOOGLE_MAPS_CONFIG.defaultOptions,
    center: { lat: asset.lat, lng: asset.lng },
    zoom: 10, // Closer zoom for individual asset view
    mapTypeId: 'satellite' as google.maps.MapTypeId // Better for asset location
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    try {
      console.log('AssetLocationMap onLoad called for asset:', asset.id);
      setMap(map);
      setMapInstance(map);
      setMapError(null);

      // Clean up existing marker if any
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }

      // Create marker for this asset
      const marker = new google.maps.Marker({
        position: { lat: asset.lat, lng: asset.lng },
        icon: createMarkerIcon(asset.type, asset.status),
        title: asset.name,
        map: map
      });

      // Add click listener to show info window
      marker.addListener('click', () => {
        setShowInfoWindow(true);
      });

      markerRef.current = marker;
      console.log('AssetLocationMap marker created successfully');
    } catch (error) {
      console.error('Error in AssetLocationMap onLoad:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
    }

    // Style the map controls to match dark theme
    const styleMapControls = () => {
      // Check if styles are already applied to avoid duplicates
      if (!document.getElementById('google-maps-dark-controls-asset')) {
        const style = document.createElement('style');
        style.id = 'google-maps-dark-controls-asset';
        style.textContent = `
          /* Dark theme for Google Maps controls */
          .gm-control-active {
            background-color: #374151 !important;
            border: 1px solid #4b5563 !important;
            color: #e5e7eb !important;
          }
          .gm-control-active:hover {
            background-color: #4b5563 !important;
          }
          /* Zoom controls */
          .gm-control-active > div {
            background-color: #374151 !important;
            border-color: #4b5563 !important;
          }
          .gm-control-active > div:hover {
            background-color: #4b5563 !important;
          }
          /* Map type controls */
          .gm-style .gm-control-active {
            background-color: #374151 !important;
            border: 1px solid #4b5563 !important;
          }
          .gm-style .gm-control-active > div {
            filter: invert(1) hue-rotate(180deg) !important;
          }
          /* Fullscreen and other controls */
          .gm-bundled-control .gm-control-active {
            background-color: #374151 !important;
            border: 1px solid #4b5563 !important;
          }
          .gm-bundled-control .gm-control-active:hover {
            background-color: #4b5563 !important;
          }
          /* Style the map/satellite toggle buttons */
          .gm-style-mtc > div {
            background-color: #374151 !important;
            border: 1px solid #4b5563 !important;
            color: #e5e7eb !important;
          }
          .gm-style-mtc > div:hover {
            background-color: #4b5563 !important;
          }
          /* Make zoom control icons more visible */
          .gm-control-active img {
            filter: invert(1) !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    // Apply styles after map loads
    setTimeout(styleMapControls, 100);
  }, [asset.lat, asset.lng, asset.type, asset.status, asset.name, setMapInstance]);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMapInstance(null);
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, [setMapInstance]);

  // Update marker position and icon when asset changes (but not map center to prevent zoom resets)
  useEffect(() => {
    if (map && markerRef.current) {
      // Update marker position and icon
      markerRef.current.setPosition({ lat: asset.lat, lng: asset.lng });
      markerRef.current.setIcon(createMarkerIcon(asset.type, asset.status));
      markerRef.current.setTitle(asset.name);

      // Only center the map on initial load, not on every asset change
      // This prevents the map from resetting position when user is interacting with it
    }
  }, [map, asset.lat, asset.lng, asset.type, asset.status, asset.name]);

  // Handle loading states
  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-800 rounded-lg`}>
        <div className="text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-2 mx-auto"></div>
          Loading map...
        </div>
      </div>
    );
  }

  if (loadError || mapError) {
    const errorMessage = loadError?.message || mapError || 'Unknown error';
    console.error('AssetLocationMap - Error:', { loadError, mapError });
    return (
      <div className={`${className} flex items-center justify-center bg-gray-800 rounded-lg`}>
        <div className="text-gray-400 text-center">
          <p>Error loading map</p>
          <p className="text-sm mt-1">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        key={mapKey}
        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '8px' }}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Info Window for the asset */}
        {showInfoWindow && (
          <InfoWindow
            position={{ lat: asset.lat, lng: asset.lng }}
            onCloseClick={() => setShowInfoWindow(false)}
            options={{
              pixelOffset: new google.maps.Size(0, -150),
              disableAutoPan: false,
              maxWidth: 350
            }}
          >
            <div style={{
              backgroundColor: '#ffffff',
              color: '#1f2937',
              borderRadius: '16px',
              minWidth: '300px',
              maxWidth: '340px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden'
            }}>
              {/* Header with A123 Orange gradient */}
              <div style={{
                background: 'linear-gradient(135deg, #FF8C00 0%, #D97706 100%)',
                color: 'white',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    🔋
                  </div>
                  <h3 style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>{asset.name}</h3>
                </div>
                <span style={{
                  backgroundColor: asset.status === 'discharging' ? '#10b981' :
                                   asset.status === 'charging' ? '#3b82f6' :
                                   asset.status === 'idle' ? '#f59e0b' :
                                   asset.status === 'maintenance' ? '#ef4444' :
                                   asset.status === 'offline' ? '#6b7280' : '#8b5cf6',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {asset.status}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                {/* Model and Capacity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{asset.model}</div>
                  </div>
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{asset.capacity} MWh</div>
                  </div>
                </div>

                {/* State of Charge */}
                <div style={{
                  backgroundColor: asset.performance.stateOfCharge > 80 ? '#dcfce7' :
                                   asset.performance.stateOfCharge > 50 ? '#dbeafe' :
                                   asset.performance.stateOfCharge > 20 ? '#fef3c7' : '#fee2e2',
                  padding: '16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  border: asset.performance.stateOfCharge > 80 ? '1px solid #bbf7d0' :
                          asset.performance.stateOfCharge > 50 ? '1px solid #bfdbfe' :
                          asset.performance.stateOfCharge > 20 ? '1px solid #fde68a' : '1px solid #fecaca'
                }}>
                  <div style={{
                    fontSize: '10px',
                    color: asset.performance.stateOfCharge > 80 ? '#15803d' :
                           asset.performance.stateOfCharge > 50 ? '#1e40af' :
                           asset.performance.stateOfCharge > 20 ? '#92400e' : '#991b1b',
                    fontWeight: '600',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>State of Charge</div>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: asset.performance.stateOfCharge > 80 ? '#15803d' :
                           asset.performance.stateOfCharge > 50 ? '#1e40af' :
                           asset.performance.stateOfCharge > 20 ? '#92400e' : '#991b1b',
                    marginBottom: '4px'
                  }}>
                    {asset.performance.stateOfCharge.toFixed(1)}%
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: asset.performance.stateOfCharge > 80 ? '#15803d' :
                           asset.performance.stateOfCharge > 50 ? '#1e40af' :
                           asset.performance.stateOfCharge > 20 ? '#92400e' : '#991b1b',
                    fontWeight: '500'
                  }}>
                    Power: {Math.abs(asset.performance.power).toFixed(1)} MW {asset.performance.power > 0 ? '(Discharging)' : asset.performance.power < 0 ? '(Charging)' : '(Idle)'}
                  </div>
                </div>

                {/* Battery Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    backgroundColor: '#ecfeff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #a5f3fc'
                  }}>
                    <div style={{ fontSize: '10px', color: '#0891b2', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Voltage</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0891b2' }}>{asset.performance.voltage.toFixed(1)} V</div>
                  </div>
                  <div style={{
                    backgroundColor: '#fff7ed',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #fed7aa'
                  }}>
                    <div style={{ fontSize: '10px', color: '#ea580c', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temperature</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ea580c' }}>{asset.performance.temperature.toFixed(1)}°C</div>
                  </div>
                </div>

                {/* Health Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                  }}>
                    <div style={{ fontSize: '10px', color: '#15803d', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803d' }}>{asset.health.stateOfHealth.toFixed(1)}%</div>
                  </div>
                  <div style={{
                    backgroundColor: '#faf5ff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e9d5ff'
                  }}>
                    <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cycles</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#7c3aed' }}>{asset.health.cycleCount}</div>
                  </div>
                </div>

                {/* Location */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coordinates</div>
                  <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace', fontWeight: '500' }}>
                    {asset.lat.toFixed(6)}, {asset.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default AssetLocationMap;