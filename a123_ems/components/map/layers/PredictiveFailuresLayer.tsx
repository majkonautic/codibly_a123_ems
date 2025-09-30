'use client';

import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '../GoogleMapProvider';

interface PredictiveFailuresLayerProps {
  enabled: boolean;
  assets: Array<{
    id: string;
    lat: number;
    lng: number;
    name: string;
    type: string;
    capacity: number;
    performances: Array<{ generation: number; efficiency: number; availability: number }>;
    alerts: Array<{ type: string; severity: string; message: string }>;
  }>;
}

export const PredictiveFailuresLayer: React.FC<PredictiveFailuresLayerProps> = ({
  enabled,
  assets
}) => {
  const { mapInstance } = useGoogleMap();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  useEffect(() => {
    if (!mapInstance || !enabled) {
      // Clean up existing overlays
      markersRef.current.forEach(marker => marker.setMap(null));
      circlesRef.current.forEach(circle => circle.setMap(null));
      markersRef.current = [];
      circlesRef.current = [];
      return;
    }

    // Generate predictive failure data
    const predictions = generateFailurePredictions(assets);

    predictions.forEach(prediction => {
      // Create warning circle around asset
      const circle = new google.maps.Circle({
        center: { lat: prediction.asset.lat, lng: prediction.asset.lng },
        radius: prediction.radius,
        strokeColor: prediction.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: prediction.color,
        fillOpacity: 0.2,
        map: mapInstance
      });

      circlesRef.current.push(circle);

      // Create warning marker
      const marker = new google.maps.Marker({
        position: { lat: prediction.asset.lat, lng: prediction.asset.lng },
        icon: {
          url: createWarningIcon(prediction.risk),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        },
        title: `${prediction.asset.name} - ${prediction.risk} Risk`,
        map: mapInstance,
        zIndex: 1000
      });

      markersRef.current.push(marker);

      // Add info window with prediction details
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="
              background-color: white;
              color: #1f2937;
              font-family: system-ui, -apple-system, sans-serif;
              padding: 16px;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              max-width: 280px;
              min-width: 250px;
            ">
              <h4 style="
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
                color: ${prediction.color};
                display: flex;
                align-items: center;
                gap: 6px;
              ">⚠️ Predictive Alert</h4>

              <div style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">
                  ${prediction.asset.name}
                </p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0;">
                  <div>
                    <strong style="color: #6b7280; font-size: 12px;">Risk Level:</strong>
                    <p style="margin: 2px 0; color: ${prediction.color}; font-weight: 600;">
                      ${prediction.risk}
                    </p>
                  </div>
                  <div>
                    <strong style="color: #6b7280; font-size: 12px;">Probability:</strong>
                    <p style="margin: 2px 0; font-weight: 600;">
                      ${prediction.probability}%
                    </p>
                  </div>
                </div>

                <div style="margin: 8px 0;">
                  <strong style="color: #6b7280; font-size: 12px;">Failure Type:</strong>
                  <p style="margin: 2px 0;">${prediction.failureType}</p>
                </div>

                <div style="margin: 8px 0;">
                  <strong style="color: #6b7280; font-size: 12px;">Time to Failure:</strong>
                  <p style="margin: 2px 0;">${prediction.timeToFailure}</p>
                </div>

                <div style="margin: 8px 0;">
                  <strong style="color: #6b7280; font-size: 12px;">Recommendation:</strong>
                  <p style="margin: 2px 0; color: #059669; font-weight: 500;">
                    ${prediction.recommendation}
                  </p>
                </div>
              </div>

              <div style="
                border-top: 1px solid #e5e7eb;
                padding-top: 8px;
                font-size: 12px;
                color: #6b7280;
                line-height: 1.4;
              ">
                Based on performance degradation, maintenance history, and environmental factors.
              </div>
            </div>
          `,
          position: { lat: prediction.asset.lat, lng: prediction.asset.lng }
        });
        infoWindow.open(mapInstance);
      });
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      circlesRef.current.forEach(circle => circle.setMap(null));
      markersRef.current = [];
      circlesRef.current = [];
    };
  }, [mapInstance, enabled, assets]);

  return null;
};

function generateFailurePredictions(assets: any[]) {
  const predictions: Array<{
    asset: any;
    risk: 'High' | 'Medium' | 'Low';
    failureType: string;
    probability: number;
    timeToFailure: string;
    recommendation: string;
    color: string;
    radius: number;
  }> = [];

  assets.forEach(asset => {
    const latest = asset.performances[0];
    if (!latest) return;

    // Calculate risk factors
    const efficiency = latest.efficiency || 0;
    const availability = latest.availability || 0;
    const generation = latest.generation || 0;
    const utilization = asset.capacity > 0 ? (generation / asset.capacity) * 100 : 0;
    const hasAlerts = asset.alerts.length > 0;

    // Risk calculation based on multiple factors
    let riskScore = 0;

    // Low efficiency indicates potential issues
    if (efficiency < 70) riskScore += 3;
    else if (efficiency < 80) riskScore += 2;
    else if (efficiency < 90) riskScore += 1;

    // Low availability indicates maintenance issues
    if (availability < 80) riskScore += 3;
    else if (availability < 90) riskScore += 2;
    else if (availability < 95) riskScore += 1;

    // High utilization can cause wear
    if (utilization > 95) riskScore += 2;
    else if (utilization > 85) riskScore += 1;

    // Active alerts indicate current issues
    if (hasAlerts) {
      const highSeverityAlerts = asset.alerts.filter((a: any) => a.severity === 'high');
      riskScore += highSeverityAlerts.length * 2 + (asset.alerts.length - highSeverityAlerts.length);
    }

    // Asset age factor (simulated)
    const ageRisk = Math.random() * 2; // Simulated age-based risk
    riskScore += ageRisk;

    // Only include assets with some risk
    if (riskScore > 1) {
      let risk: 'High' | 'Medium' | 'Low';
      let color: string;
      const failureType: string = getFailureType(asset.type, efficiency, availability, hasAlerts);
      let timeToFailure: string;
      let recommendation: string;

      if (riskScore >= 6) {
        risk = 'High';
        color = '#dc2626';
        timeToFailure = '2-4 weeks';
        recommendation = 'Schedule immediate maintenance';
      } else if (riskScore >= 3) {
        risk = 'Medium';
        color = '#ea580c';
        timeToFailure = '1-3 months';
        recommendation = 'Plan preventive maintenance';
      } else {
        risk = 'Low';
        color = '#ca8a04';
        timeToFailure = '3-6 months';
        recommendation = 'Monitor closely';
      }

      // Failure type determined at declaration

      predictions.push({
        asset,
        risk,
        failureType,
        probability: Math.min(95, Math.round(riskScore * 12 + Math.random() * 10)),
        timeToFailure,
        recommendation,
        color,
        radius: risk === 'High' ? 8000 : risk === 'Medium' ? 6000 : 4000
      });
    }
  });

  return predictions;
}

function getFailureType(assetType: string, efficiency: number, availability: number, hasAlerts: boolean): string {
  const failureTypes = {
    solar: ['Inverter failure', 'Panel degradation', 'DC combiner issues', 'Tracking system failure'],
    wind: ['Gearbox failure', 'Generator issues', 'Blade damage', 'Control system failure'],
    battery: ['Cell degradation', 'Thermal runaway', 'BMS failure', 'Cooling system issues'],
    substation: ['Transformer failure', 'Switchgear issues', 'Protection relay failure', 'Insulation breakdown']
  };

  const typeFailures = failureTypes[assetType as keyof typeof failureTypes] ||
                      ['Equipment failure', 'Control system issues', 'Maintenance required', 'Performance degradation'];

  // Select failure type based on symptoms
  if (efficiency < 60) {
    return assetType === 'solar' ? 'Panel degradation' :
           assetType === 'wind' ? 'Gearbox failure' :
           assetType === 'battery' ? 'Cell degradation' :
           'Equipment failure';
  }

  if (availability < 80) {
    return assetType === 'solar' ? 'Inverter failure' :
           assetType === 'wind' ? 'Control system failure' :
           assetType === 'battery' ? 'BMS failure' :
           'Protection relay failure';
  }

  if (hasAlerts) {
    return typeFailures[1]; // Second most common failure type
  }

  // Random selection for demonstration
  return typeFailures[Math.floor(Math.random() * typeFailures.length)];
}

function createWarningIcon(risk: string): string {
  const color = risk === 'High' ? '%23dc2626' :
                risk === 'Medium' ? '%23ea580c' : '%23ca8a04';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2" opacity="0.9"/>
      <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold">⚠</text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default PredictiveFailuresLayer;