'use client';

import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '../GoogleMapProvider';

interface CongestionLayerProps {
  enabled: boolean;
  assets: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    capacity: number;
    performances: Array<{ generation: number }>;
  }>;
}

export const CongestionLayer: React.FC<CongestionLayerProps> = ({
  enabled,
  assets
}) => {
  const { mapInstance } = useGoogleMap();
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!mapInstance || !enabled) {
      // Clean up existing overlays
      polygonsRef.current.forEach(polygon => polygon.setMap(null));
      circlesRef.current.forEach(circle => circle.setMap(null));
      polygonsRef.current = [];
      circlesRef.current = [];
      return;
    }

    // Generate congestion zones around high-capacity asset clusters
    const congestionZones = generateCongestionZones(assets);

    // Create polygon overlays for congestion areas
    congestionZones.forEach(zone => {
      const polygon = new google.maps.Polygon({
        paths: zone.coordinates,
        strokeColor: zone.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: zone.color,
        fillOpacity: 0.3,
        map: mapInstance
      });

      polygonsRef.current.push(polygon);

      // Add info window on click
      polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="
              background-color: white;
              color: #1f2937;
              font-family: system-ui, -apple-system, sans-serif;
              padding: 12px;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              min-width: 200px;
              max-width: 300px;
            ">
              <h4 style="
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 600;
                color: #dc2626;
              ">${zone.severity} Congestion Zone</h4>
              <div style="font-size: 14px; line-height: 1.5;">
                <p style="margin: 4px 0;"><strong>Load:</strong> ${zone.loadPercentage}% of capacity</p>
                <p style="margin: 4px 0;"><strong>Assets affected:</strong> ${zone.assetCount}</p>
                <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
                  Grid congestion may impact power flow
                </p>
              </div>
            </div>
          `,
          position: event.latLng
        });
        infoWindow.open(mapInstance);
      });
    });

    // Create circles for individual congested nodes
    const congestedNodes = generateCongestedNodes(assets);
    congestedNodes.forEach(node => {
      const circle = new google.maps.Circle({
        center: { lat: node.lat, lng: node.lng },
        radius: node.radius,
        strokeColor: node.color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: node.color,
        fillOpacity: 0.4,
        map: mapInstance
      });

      circlesRef.current.push(circle);
    });

    return () => {
      polygonsRef.current.forEach(polygon => polygon.setMap(null));
      circlesRef.current.forEach(circle => circle.setMap(null));
      polygonsRef.current = [];
      circlesRef.current = [];
    };
  }, [mapInstance, enabled, assets]);

  return null;
};

function generateCongestionZones(assets: any[]) {
  const zones: Array<{
    coordinates: google.maps.LatLng[];
    color: string;
    severity: string;
    loadPercentage: number;
    assetCount: number;
  }> = [];

  // Define some congested regions based on asset density and generation
  const congestionAreas = [
    {
      center: { lat: 34.0522, lng: -118.2437 }, // LA area
      radius: 1.5,
      severity: 'High',
      color: '#ef4444',
      loadPercentage: 92
    },
    {
      center: { lat: 40.7128, lng: -74.0060 }, // NYC area
      radius: 1.2,
      severity: 'Medium',
      color: '#f59e0b',
      loadPercentage: 78
    },
    {
      center: { lat: 29.7604, lng: -95.3698 }, // Houston area
      radius: 1.0,
      severity: 'Medium',
      color: '#f59e0b',
      loadPercentage: 84
    }
  ];

  congestionAreas.forEach(area => {
    const assetsInArea = assets.filter(asset => {
      const distance = calculateDistance(
        asset.lat, asset.lng,
        area.center.lat, area.center.lng
      );
      return distance <= area.radius;
    });

    if (assetsInArea.length > 0) {
      // Create hexagonal zone around the area
      const coordinates = createHexagon(area.center.lat, area.center.lng, area.radius);

      zones.push({
        coordinates,
        color: area.color,
        severity: area.severity,
        loadPercentage: area.loadPercentage,
        assetCount: assetsInArea.length
      });
    }
  });

  return zones;
}

function generateCongestedNodes(assets: any[]) {
  const nodes: Array<{
    lat: number;
    lng: number;
    radius: number;
    color: string;
  }> = [];

  // Find assets with high utilization
  assets.forEach(asset => {
    const latest = asset.performances[0];
    if (latest) {
      const utilization = (latest.generation / asset.capacity) * 100;

      if (utilization > 85) {
        nodes.push({
          lat: asset.lat,
          lng: asset.lng,
          radius: Math.max(5000, asset.capacity * 200), // Radius based on capacity
          color: utilization > 95 ? '#dc2626' : '#ea580c'
        });
      }
    }
  });

  return nodes;
}

function createHexagon(centerLat: number, centerLng: number, radiusDegrees: number): google.maps.LatLng[] {
  const coordinates: google.maps.LatLng[] = [];
  const numSides = 6;

  for (let i = 0; i < numSides; i++) {
    const angle = (i * 2 * Math.PI) / numSides;
    const lat = centerLat + radiusDegrees * Math.cos(angle);
    const lng = centerLng + radiusDegrees * Math.sin(angle);
    coordinates.push(new google.maps.LatLng(lat, lng));
  }

  return coordinates;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 0.00872665; // Convert to approximate degrees
}

export default CongestionLayer;