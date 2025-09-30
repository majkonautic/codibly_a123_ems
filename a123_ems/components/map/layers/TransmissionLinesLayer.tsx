'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMap } from '../GoogleMapProvider';

interface TransmissionLine {
  id: string;
  name: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  voltage: number; // kV
  capacity: number; // MW
  status: 'operational' | 'maintenance' | 'overloaded' | 'offline';
  utilization: number; // percentage 0-100
}

interface TransmissionLinesLayerProps {
  enabled: boolean;
  assets: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    capacity: number;
  }>;
}

export const TransmissionLinesLayer: React.FC<TransmissionLinesLayerProps> = ({
  enabled,
  assets
}) => {
  const { mapInstance } = useGoogleMap();
  const [transmissionLines, setTransmissionLines] = useState<TransmissionLine[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Generate simulated transmission lines based on assets
  useEffect(() => {
    if (!enabled || !assets.length) {
      console.log(`Transmission lines layer disabled or no assets. Enabled: ${enabled}, Assets: ${assets.length}`);
      setTransmissionLines([]);
      return;
    }

    console.log(`Generating transmission lines for ${assets.length} assets`);
    console.log('Assets capacities:', assets.map(a => `${a.type}:${a.capacity}MW`));

    // Filter for major assets that would have transmission lines
    const majorAssets = assets.filter(asset =>
      asset.type === 'substation' ||
      asset.capacity > 50 // MW - only larger assets get transmission lines
    );

    console.log(`Found ${majorAssets.length} major assets for transmission lines:`, majorAssets.map(a => `${a.id}(${a.capacity}MW)`));

    const lines: TransmissionLine[] = [];

    // Create transmission lines between major assets
    for (let i = 0; i < majorAssets.length; i++) {
      for (let j = i + 1; j < majorAssets.length; j++) {
        const asset1 = majorAssets[i];
        const asset2 = majorAssets[j];

        // Calculate distance between assets
        const distance = calculateDistance(
          asset1.lat, asset1.lng,
          asset2.lat, asset2.lng
        );

        // Connect assets within reasonable transmission distance (< 300km)
        if (distance < 300) { // Always connect nearby assets for POC
          const voltage = distance > 100 ? 500 : distance > 50 ? 230 : 138; // kV based on distance
          const capacity = Math.min(asset1.capacity, asset2.capacity) * 1.5; // MW
          const utilization = 30 + Math.random() * 50; // 30-80% utilization

          let status: TransmissionLine['status'] = 'operational';
          if (utilization > 85) status = 'overloaded';

          lines.push({
            id: `transmission-${asset1.id}-${asset2.id}`,
            name: `${voltage}kV Line`,
            fromLat: asset1.lat,
            fromLng: asset1.lng,
            toLat: asset2.lat,
            toLng: asset2.lng,
            voltage,
            capacity,
            status,
            utilization
          });
        }
      }
    }

    console.log(`Generated ${lines.length} transmission lines`);
    setTransmissionLines(lines);
  }, [enabled, assets]);

  // Create and manage polylines on the map
  useEffect(() => {
    console.log(`Transmission lines map effect - mapInstance: ${!!mapInstance}, enabled: ${enabled}, lines: ${transmissionLines.length}`);

    if (!mapInstance || !enabled) {
      console.log('Cleaning up transmission lines - mapInstance or enabled is false');
      // Clean up existing polylines
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];
      return;
    }

    // Clear existing polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (transmissionLines.length === 0) {
      console.log('No transmission lines to display');
      return;
    }

    console.log(`Creating ${transmissionLines.length} transmission line polylines on map`);

    // Create new polylines for each transmission line
    transmissionLines.forEach((line, index) => {
      const path = [
        { lat: line.fromLat, lng: line.fromLng },
        { lat: line.toLat, lng: line.toLng }
      ];

      // Determine line color and style based on status and voltage
      let strokeColor = '#00ff00'; // green - operational
      let strokeOpacity = 0.8;
      let strokeWeight = 3;

      if (line.status === 'overloaded') {
        strokeColor = '#ff4444'; // red
        strokeOpacity = 0.9;
      } else if (line.status === 'maintenance') {
        strokeColor = '#ffaa00'; // orange
        strokeOpacity = 0.7;
      } else if (line.status === 'offline') {
        strokeColor = '#666666'; // gray
        strokeOpacity = 0.5;
      }

      // Line thickness based on voltage level
      if (line.voltage >= 500) strokeWeight = 5;
      else if (line.voltage >= 230) strokeWeight = 4;
      else strokeWeight = 3;

      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        map: mapInstance,
        // Add dashed pattern for transmission lines
        icons: line.status === 'offline' ? [{
          icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 2
          },
          offset: '0',
          repeat: '10px'
        }] : undefined
      });

      // Add info window on click
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: black; font-family: Arial, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${line.name}</h3>
            <div style="font-size: 12px;">
              <div style="margin: 4px 0;"><strong>Voltage:</strong> ${line.voltage} kV</div>
              <div style="margin: 4px 0;"><strong>Capacity:</strong> ${line.capacity.toFixed(0)} MW</div>
              <div style="margin: 4px 0;"><strong>Status:</strong>
                <span style="color: ${getStatusColor(line.status)}; font-weight: bold;">
                  ${line.status.toUpperCase()}
                </span>
              </div>
              <div style="margin: 4px 0;"><strong>Utilization:</strong> ${line.utilization.toFixed(1)}%</div>
              <div style="margin: 4px 0;"><strong>Line ID:</strong> ${line.id}</div>
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
        console.log(`First transmission line created with path:`, path, `${line.voltage}kV, status: ${line.status}`);
      }
    });

    console.log(`Total transmission line polylines created: ${polylinesRef.current.length}`);
  }, [mapInstance, enabled, transmissionLines]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
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

function getStatusColor(status: string): string {
  switch (status) {
    case 'operational': return '#00aa00';
    case 'overloaded': return '#cc0000';
    case 'maintenance': return '#ff8800';
    case 'offline': return '#666666';
    default: return '#666666';
  }
}

export default TransmissionLinesLayer;