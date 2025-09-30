'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMap } from '../GoogleMapProvider';

interface PowerFlow {
  id: string;
  fromAsset: string;
  toAsset: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  powerMW: number;
  direction: 'forward' | 'reverse' | 'bidirectional';
  status: 'normal' | 'congested' | 'overloaded';
}

interface PowerFlowLayerProps {
  enabled: boolean;
  assets: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    status: string;
    performance: {
      power: number;
      stateOfCharge: number;
    };
  }>;
}

export const PowerFlowLayer: React.FC<PowerFlowLayerProps> = ({
  enabled,
  assets
}) => {
  const { mapInstance } = useGoogleMap();
  const [powerFlows, setPowerFlows] = useState<PowerFlow[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const animationRef = useRef<number | null>(null);

  // Generate simulated power flows between nearby assets
  useEffect(() => {
    if (!enabled || !assets.length) {
      setPowerFlows([]);
      return;
    }

    const flows: PowerFlow[] = [];

    // Create power flows between nearby assets (for demo purposes)
    for (let i = 0; i < assets.length; i++) {
      for (let j = i + 1; j < assets.length; j++) {
        const asset1 = assets[i];
        const asset2 = assets[j];

        // Calculate distance between assets
        const distance = calculateDistance(
          asset1.lat, asset1.lng,
          asset2.lat, asset2.lng
        );

        // Only connect assets within reasonable distance (< 500km for demo)
        if (distance < 500) { // Always connect for POC demo
          const power1 = Math.abs(asset1.performance?.power || 0);
          const power2 = Math.abs(asset2.performance?.power || 0);

          // Determine flow direction based on power
          let direction: PowerFlow['direction'] = 'bidirectional';
          const powerMW = Math.abs(power1 - power2) * 0.1; // Simplified flow

          if (power1 > power2 + 10) {
            direction = 'forward';
          } else if (power2 > power1 + 10) {
            direction = 'reverse';
          }

          // Determine status based on power level
          let status: PowerFlow['status'] = 'normal';
          if (powerMW > 50) status = 'congested';
          if (powerMW > 100) status = 'overloaded';

          flows.push({
            id: `${asset1.id}-${asset2.id}`,
            fromAsset: asset1.id,
            toAsset: asset2.id,
            fromLat: asset1.lat,
            fromLng: asset1.lng,
            toLat: asset2.lat,
            toLng: asset2.lng,
            powerMW,
            direction,
            status
          });
        }
      }
    }

    console.log(`Generated ${flows.length} power flows for ${assets.length} assets`);
    setPowerFlows(flows);
  }, [enabled, assets]);

  // Create and manage polylines on the map
  useEffect(() => {
    if (!mapInstance || !enabled) {
      // Clean up existing polylines
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      return;
    }

    // Clear existing polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (powerFlows.length === 0) {
      console.log('No power flows to display');
      return;
    }

    console.log(`Creating ${powerFlows.length} polylines on map`);

    // Create new polylines for each power flow
    powerFlows.forEach((flow, index) => {
      const path = [
        { lat: flow.fromLat, lng: flow.fromLng },
        { lat: flow.toLat, lng: flow.toLng }
      ];

      // Determine line color based on status
      let strokeColor = '#10B981'; // green - normal
      if (flow.status === 'congested') strokeColor = '#F59E0B'; // yellow
      if (flow.status === 'overloaded') strokeColor = '#EF4444'; // red

      // Line thickness based on power level
      const strokeWeight = Math.max(2, Math.min(8, flow.powerMW / 10));

      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor,
        strokeOpacity: 0.8,
        strokeWeight,
        map: mapInstance,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            strokeColor: strokeColor,
            fillColor: strokeColor,
            fillOpacity: 1
          },
          offset: '50%'
        }]
      });

      // Add info window on click
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: black; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px;">Power Flow</h3>
            <div style="font-size: 12px;">
              <div><strong>Power:</strong> ${flow.powerMW.toFixed(1)} MW</div>
              <div><strong>Direction:</strong> ${flow.direction}</div>
              <div><strong>Status:</strong> ${flow.status}</div>
              <div><strong>From:</strong> ${flow.fromAsset}</div>
              <div><strong>To:</strong> ${flow.toAsset}</div>
            </div>
          </div>
        `
      });

      polyline.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          infoWindow.setPosition(event.latLng);
          infoWindow.open(mapInstance);
        }
      });

      polylinesRef.current.push(polyline);

      if (index === 0) {
        console.log(`First polyline created with path:`, path, `color: ${strokeColor}, weight: ${strokeWeight}`);
      }
    });

    console.log(`Total polylines created: ${polylinesRef.current.length}`);

    // Start animation
    startFlowAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mapInstance, enabled, powerFlows]);

  const startFlowAnimation = () => {
    let offset = 0;

    const animate = () => {
      offset = (offset + 2) % 100;

      polylinesRef.current.forEach((polyline, index) => {
        const flow = powerFlows[index];
        if (!flow) return;

        // Create animated dashed line effect
        const icons = polyline.get('icons');
        if (icons && icons[0]) {
          icons[0].offset = `${offset}%`;
          polyline.set('icons', icons);
        }
      });

      if (enabled) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (enabled) {
      animate();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything directly
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export default PowerFlowLayer;