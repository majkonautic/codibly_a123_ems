'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGoogleMap } from './GoogleMapProvider';
import { getProductThumbnail, getProductByModel } from '../../lib/productCatalog';
import { GOOGLE_MAPS_CONFIG } from './utils/mapConfig';
import type { SimulatedAsset } from './utils/dataSimulator';
import PowerFlowLayer from './layers/PowerFlowLayer';
import HeatMapLayer from './layers/HeatMapLayer';
import TransmissionLinesLayer from './layers/TransmissionLinesLayer';
import CongestionLayer from './layers/CongestionLayer';
import PredictiveFailuresLayer from './layers/PredictiveFailuresLayer';
import WeatherLayer from './layers/WeatherLayer';
import TelemetryLayer from './layers/TelemetryLayer';
import AlarmsLayer from './layers/AlarmsLayer';
import WindSpeedLayer from './layers/WindSpeedLayer';
import type { MapLayer } from './controls/LayerControl';

interface Asset {
  id: string;
  name: string;
  model: string;
  type: string;
  capacity: number;
  location: string;
  lat: number;
  lng: number;
  status: string;
  performance: {
    power: number;
    stateOfCharge: number;
    efficiency: number;
    energy: number;
  };
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
}

interface MapContainerProps {
  assets: Asset[];
  center: [number, number];
  zoom: number;
  onAssetClick: (asset: SimulatedAsset | Asset) => void;
  selectedAsset: Asset | SimulatedAsset | null;
  layers: MapLayer[];
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  assets,
  center,
  zoom,
  onAssetClick,
  selectedAsset,
  layers,
  className = "w-full h-full"
}) => {
  const { isLoaded, loadError, setMapInstance } = useGoogleMap();

  // Debug logging for Google Maps loading state
  useEffect(() => {
    console.log('MapContainer render - isLoaded:', isLoaded, 'loadError:', loadError?.message);
  }, [isLoaded, loadError]);
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Asset | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const userInteractionRef = useRef(false);
  const lastUserInteractionTime = useRef<number>(0);
  const userZoomLevel = useRef<number | null>(null);
  const userCenter = useRef<google.maps.LatLng | null>(null);
  const lastCenterProp = useRef<[number, number] | null>(null);
  const userHasManuallyMovedMap = useRef(false);

  // Map options
  const mapOptions = {
    ...GOOGLE_MAPS_CONFIG.defaultOptions,
    center: { lat: center[0], lng: center[1] },
    zoom: zoom,
    gestureHandling: 'greedy',
    disableDoubleClickZoom: false,
    restriction: {
      latLngBounds: {
        north: 71.4,
        south: 14.5,
        west: -169,
        east: -52
      },
      strictBounds: false
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapInstance(map);

    // Track user interactions to prevent unwanted resets
    let interactionTimeout: NodeJS.Timeout | null = null;

    const resetUserInteractionWithTimeout = (eventType: string) => {
      const now = Date.now();
      lastUserInteractionTime.current = now;
      userInteractionRef.current = true;

      console.log(`🎯 MapContainer: User interaction detected (${eventType}) at ${new Date(now).toLocaleTimeString()}`);

      // Clear any existing timeout
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }

      // Set new timeout - extended to 10 seconds to completely avoid conflicts with 3-second updates
      interactionTimeout = setTimeout(() => {
        userInteractionRef.current = false;
        console.log('✅ MapContainer: User interaction timeout expired, allowing map updates');
      }, 10000);
    };

    // IMMEDIATE protection - catch user interactions before Google Maps processes them
    const mapDiv = map.getDiv();

    const handleImmediateUserInteraction = (eventType: string) => {
      console.log(`⚡ IMMEDIATE protection triggered: ${eventType}`);
      userHasManuallyMovedMap.current = true;
      userInteractionRef.current = true;
      lastUserInteractionTime.current = Date.now();
      resetUserInteractionWithTimeout(eventType);
    };

    // Wheel events (mouse scroll zoom)
    mapDiv.addEventListener('wheel', () => handleImmediateUserInteraction('wheel'), { passive: true });

    // Touch events (mobile pinch zoom)
    mapDiv.addEventListener('touchstart', () => handleImmediateUserInteraction('touchstart'), { passive: true });
    mapDiv.addEventListener('touchmove', () => handleImmediateUserInteraction('touchmove'), { passive: true });

    // Mouse events (drag)
    mapDiv.addEventListener('mousedown', () => handleImmediateUserInteraction('mousedown'), { passive: true });

    // Google Maps events (secondary protection)
    map.addListener('drag', () => {
      resetUserInteractionWithTimeout('drag');
      userHasManuallyMovedMap.current = true;
    });
    map.addListener('zoom_changed', () => {
      resetUserInteractionWithTimeout('zoom_changed');
      // Store user's current zoom level
      userZoomLevel.current = map.getZoom() || null;
      userHasManuallyMovedMap.current = true;
    });
    map.addListener('dragend', () => {
      resetUserInteractionWithTimeout('dragend');
      // Store user's current center
      userCenter.current = map.getCenter() || null;
      userHasManuallyMovedMap.current = true;
    });
    map.addListener('idle', () => resetUserInteractionWithTimeout('idle'));

    // Initialize marker clusterer
    clustererRef.current = new MarkerClusterer({
      map,
      markers: [],
      ...GOOGLE_MAPS_CONFIG.clusterOptions
    });

    // Style the map controls to match dark theme
    const styleMapControls = () => {
      const style = document.createElement('style');
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
      if (!document.getElementById('google-maps-dark-controls')) {
        style.id = 'google-maps-dark-controls';
        document.head.appendChild(style);
      }
    };

    // Apply styles after map loads
    setTimeout(styleMapControls, 100);
  }, [setMapInstance]);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMapInstance(null);

    // Clean up clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }

    // Clean up markers
    markersRef.current.clear();
  }, [setMapInstance]);

  // Update map center and zoom when props change (but respect user interactions)
  useEffect(() => {
    if (!map) return;

    const now = Date.now();
    const timeSinceLastInteraction = now - lastUserInteractionTime.current;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    // Check if this is a new center prop (from clicking an asset)
    const centerPropChanged = !lastCenterProp.current ||
      lastCenterProp.current[0] !== center[0] ||
      lastCenterProp.current[1] !== center[1];

    if (centerPropChanged) {
      lastCenterProp.current = [center[0], center[1]];
    }

    console.log('🗺️ MapContainer: Map update effect triggered', {
      userInteracting: userInteractionRef.current,
      userHasManuallyMovedMap: userHasManuallyMovedMap.current,
      timeSinceLastInteraction: `${(timeSinceLastInteraction / 1000).toFixed(1)}s`,
      centerPropChanged,
      currentCenter: currentCenter ? [currentCenter.lat().toFixed(4), currentCenter.lng().toFixed(4)] : null,
      currentZoom,
      proposedCenter: [center[0].toFixed(4), center[1].toFixed(4)],
      proposedZoom: zoom,
      userZoomLevel: userZoomLevel.current,
      userCenter: userCenter.current ? [userCenter.current.lat().toFixed(4), userCenter.current.lng().toFixed(4)] : null
    });

    // IMMEDIATE BAILOUT - If user has manually moved the map, NEVER auto-center again
    if (userHasManuallyMovedMap.current) {
      console.log('🔒 MapContainer: IMMEDIATE BAILOUT - User has manually moved map');
      return;
    }

    // IMMEDIATE BAILOUT - If user is currently interacting
    if (userInteractionRef.current) {
      console.log('🚫 MapContainer: IMMEDIATE BAILOUT - User currently interacting');
      return;
    }

    // IMMEDIATE BAILOUT - If recent interaction
    if (timeSinceLastInteraction < 15000) {
      console.log('🚫 MapContainer: IMMEDIATE BAILOUT - Recent interaction protection');
      return;
    }

    // If this is a new center prop from clicking an asset, allow it (but only once)
    if (centerPropChanged) {
      console.log('🎯 MapContainer: New asset selected, centering map once', {
        newCenter: [center[0].toFixed(4), center[1].toFixed(4)],
        newZoom: zoom
      });
      map.setCenter({ lat: center[0], lng: center[1] });
      map.setZoom(zoom);
      return;
    }

    // For any other updates (like regular data refreshes), apply massive thresholds
    const centerChanged = !currentCenter ||
      Math.abs(currentCenter.lat() - center[0]) > 50.0 ||  // Massive threshold - 50 degrees
      Math.abs(currentCenter.lng() - center[1]) > 50.0;
    const zoomChanged = Math.abs((currentZoom || 0) - zoom) > 10;  // Massive threshold - 10 zoom levels

    if (centerChanged) {
      console.log('📍 MapContainer: Massive center change detected, updating', {
        from: currentCenter ? [currentCenter.lat().toFixed(4), currentCenter.lng().toFixed(4)] : null,
        to: [center[0].toFixed(4), center[1].toFixed(4)]
      });
      map.setCenter({ lat: center[0], lng: center[1] });
    }

    if (zoomChanged) {
      console.log('🔍 MapContainer: Massive zoom change detected, updating', {
        from: currentZoom,
        to: zoom
      });
      map.setZoom(zoom);
    }

    if (!centerChanged && !zoomChanged) {
      console.log('✋ MapContainer: No significant changes, map stays where user left it');
    }
  }, [map, center, zoom]);

  // Helper function to create custom marker icon
  const createMarkerIcon = (type: string, status: string): google.maps.Icon => {
    const statusColor = getStatusColor(status);
    const typeIcon = getTypeIcon(type);

    // Create SVG marker
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="${statusColor}" stroke="white" stroke-width="2"/>
        <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${typeIcon}</text>
      </svg>
    `;

    return {
      url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    };
  };

  // Update markers when assets change (optimized to avoid unnecessary recreations)
  useEffect(() => {
    if (!map || !clustererRef.current) return;

    const assetsLayerEnabled = layers.find(l => l.id === 'assets')?.enabled ?? true;

    // If assets layer is disabled, hide all markers
    if (!assetsLayerEnabled) {
      clustererRef.current.clearMarkers();
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current.clear(); // Clear the markers ref so they can be recreated when enabled
      return;
    }

    // Get existing markers from our marker map instead of clusterer
    const existingMarkers = Array.from(markersRef.current.values());
    const existingAssetIds = new Set(Array.from(markersRef.current.keys()));
    const currentAssetIds = new Set(assets.map(asset => asset.id));

    // Find assets that need updates
    const assetsToUpdate = assets.filter(asset => {
      const existingMarker = markersRef.current.get(asset.id);
      if (!existingMarker) return true; // New asset

      // Check if marker needs updating (status or position changed)
      const currentPosition = existingMarker.getPosition();
      const positionChanged = !currentPosition ||
        Math.abs(currentPosition.lat() - asset.lat) > 0.001 ||
        Math.abs(currentPosition.lng() - asset.lng) > 0.001;

      // We can't easily check if icon changed without storing previous state,
      // so we'll update icons less frequently or find another way to track changes
      return positionChanged;
    });

    // Remove markers for assets that no longer exist
    const assetsToRemove = Array.from(existingAssetIds).filter(id => !currentAssetIds.has(id));
    assetsToRemove.forEach(assetId => {
      const marker = markersRef.current.get(assetId);
      if (marker) {
        marker.setMap(null);
        markersRef.current.delete(assetId);
      }
    });

    // Add/update markers only if there are changes
    if (assetsToUpdate.length > 0 || assetsToRemove.length > 0) {
      // For major changes, recreate all markers to maintain consistency
      if (assetsToUpdate.length > assets.length * 0.3) { // If more than 30% need updates
        // Clear all existing markers
        clustererRef.current.clearMarkers();
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current.clear();

        // Create all markers fresh
        const markers = assets.map(asset => {
          const marker = new google.maps.Marker({
            position: { lat: asset.lat, lng: asset.lng },
            icon: createMarkerIcon(asset.type, asset.status),
            title: asset.name,
            map: null
          });

          marker.addListener('click', () => {
            onAssetClick(asset);
            setSelectedMarker(asset);
          });

          markersRef.current.set(asset.id, marker);
          return marker;
        });

        clustererRef.current.addMarkers(markers);
      } else {
        // Update individual markers for small changes
        assetsToUpdate.forEach(asset => {
          const existingMarker = markersRef.current.get(asset.id);
          if (existingMarker) {
            // Update existing marker
            existingMarker.setPosition({ lat: asset.lat, lng: asset.lng });
            existingMarker.setIcon(createMarkerIcon(asset.type, asset.status));
            existingMarker.setTitle(asset.name);
          } else {
            // Create new marker
            const marker = new google.maps.Marker({
              position: { lat: asset.lat, lng: asset.lng },
              icon: createMarkerIcon(asset.type, asset.status),
              title: asset.name,
              map: null
            });

            marker.addListener('click', () => {
              onAssetClick(asset);
              setSelectedMarker(asset);
            });

            markersRef.current.set(asset.id, marker);
            if (clustererRef.current) {
              clustererRef.current.addMarker(marker);
            }
          }
        });
      }
    }
  }, [map, assets, layers, onAssetClick]);

  // Helper functions
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'exporting': return '#10B981'; // green
      case 'curtailing': return '#F59E0B'; // yellow
      case 'offline': return '#EF4444'; // red
      case 'charging': return '#3B82F6'; // blue
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

  // Handle loading states
  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-800 rounded-lg`}>
        <div className="text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2 mx-auto"></div>
          Loading map...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-800 rounded-lg`}>
        <div className="text-gray-400 text-center">
          <p>Error loading Google Maps</p>
          <p className="text-sm mt-2">{loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Map Layers */}
        <TransmissionLinesLayer
          enabled={layers.find(l => l.id === 'transmission-lines')?.enabled || false}
          assets={assets}
        />

        <PowerFlowLayer
          enabled={layers.find(l => l.id === 'power-flow')?.enabled || false}
          assets={assets}
        />

        <HeatMapLayer
          enabled={layers.find(l => l.id === 'demand-heatmap')?.enabled || false}
          type="demand"
          assets={assets}
        />

        <HeatMapLayer
          enabled={layers.find(l => l.id === 'temperature')?.enabled || false}
          type="temperature"
          assets={assets}
        />

        <CongestionLayer
          enabled={layers.find(l => l.id === 'congestion-zones')?.enabled || false}
          assets={assets}
        />

        <PredictiveFailuresLayer
          enabled={layers.find(l => l.id === 'failure-prediction')?.enabled || false}
          assets={assets}
        />

        <WeatherLayer
          enabled={layers.find(l => l.id === 'weather')?.enabled || false}
          assets={assets}
        />

        {/* New Layer Components */}
        <TelemetryLayer
          enabled={layers.find(l => l.id === 'telemetry')?.enabled || false}
          assets={assets}
        />

        <AlarmsLayer
          enabled={layers.find(l => l.id === 'alarms')?.enabled || false}
          assets={assets}
        />

        <WindSpeedLayer
          enabled={layers.find(l => l.id === 'wind-speed')?.enabled || false}
          assets={assets}
        />

        {/* Info Window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -150),
              disableAutoPan: false,
              maxWidth: 350
            }}
          >
            <div style={{
              backgroundColor: '#ffffff',
              color: '#1f2937',
              padding: '16px',
              borderRadius: '12px',
              minWidth: '280px',
              maxWidth: '320px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Header with gradient */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>
                    {selectedMarker.type === 'solar' ? '☀️' :
                     selectedMarker.type === 'wind' ? '💨' :
                     selectedMarker.type === 'battery' ? '🔋' : '⚡'}
                  </span>
                  <h3 style={{ fontWeight: '600', fontSize: '16px', margin: 0 }}>{selectedMarker.name}</h3>
                </div>
                <span style={{
                  backgroundColor: selectedMarker.status === 'exporting' ? '#10b981' :
                                   selectedMarker.status === 'curtailing' ? '#f59e0b' :
                                   selectedMarker.status === 'offline' ? '#ef4444' :
                                   selectedMarker.status === 'charging' ? '#3b82f6' : '#6b7280',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {selectedMarker.status}
                </span>
              </div>

              {/* Product Image */}
              <div style={{
                width: '100%',
                height: '120px',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                marginBottom: '16px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <Image
                  src={getProductThumbnail(selectedMarker.model)}
                  alt={`${selectedMarker.model}`}
                  fill
                  style={{ objectFit: 'contain', padding: '8px' }}
                />
              </div>

              {/* Model Info */}
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>Battery Model</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#FF8C00' }}>{selectedMarker.model}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {getProductByModel(selectedMarker.model)?.name || 'A123 Battery Container'}
                </div>
              </div>

              {/* Content */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>Type</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', textTransform: 'capitalize' }}>{selectedMarker.type}</div>
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>Capacity</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{selectedMarker.capacity} MW</div>
                </div>
              </div>

              {/* Power Flow & Battery Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  backgroundColor: selectedMarker.performance?.power > 0 ? '#dcfce7' : selectedMarker.performance?.power < 0 ? '#dbeafe' : '#f3f4f6',
                  padding: '12px',
                  borderRadius: '6px',
                  border: `1px solid ${selectedMarker.performance?.power > 0 ? '#bbf7d0' : selectedMarker.performance?.power < 0 ? '#bfdbfe' : '#e5e7eb'}`
                }}>
                  <div style={{ fontSize: '11px', color: selectedMarker.performance?.power > 0 ? '#15803d' : selectedMarker.performance?.power < 0 ? '#1e40af' : '#6b7280', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {selectedMarker.performance?.power > 0 ? 'Discharging' : selectedMarker.performance?.power < 0 ? 'Charging' : 'Idle'}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: selectedMarker.performance?.power > 0 ? '#15803d' : selectedMarker.performance?.power < 0 ? '#1e40af' : '#6b7280' }}>
                    {Math.abs(selectedMarker.performance?.power || 0).toFixed(1)} MW
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #fde68a'
                }}>
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>State of Charge</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#92400e' }}>
                    {selectedMarker.performance?.stateOfCharge?.toFixed(1) || '0'}%
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>Location</div>
                <div style={{ fontSize: '13px', color: '#475569' }}>{selectedMarker.location}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                  {selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}
                </div>
              </div>

              {/* Alerts */}
              {selectedMarker.alerts.length > 0 && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  border: '1px solid #fed7aa'
                }}>
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>Active Alerts</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e' }}>⚠️ {selectedMarker.alerts.length} alert{selectedMarker.alerts.length > 1 ? 's' : ''}</div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => {
                  router.push(`/assets/${selectedMarker.id}`);
                  setSelectedMarker(null);
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = '#3b82f6'}
              >
                📊 View Asset Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapContainer;