'use client';

import React, { useEffect, useState } from 'react';
import { OverlayView } from '@react-google-maps/api';
import type { SimulatedAsset } from '../utils/dataSimulator';

interface TelemetryLayerProps {
  enabled: boolean;
  assets: SimulatedAsset[];
}

interface TelemetryData {
  voltage: number;
  frequency: number;
  temperature: number;
  generation: number;
}

const TelemetryLayer: React.FC<TelemetryLayerProps> = ({ enabled, assets }) => {
  const [telemetryData, setTelemetryData] = useState<Map<string, TelemetryData>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    // Update telemetry data from assets
    const newTelemetryData = new Map<string, TelemetryData>();

    assets.forEach(asset => {
      if (asset.telemetry && asset.performances.length > 0) {
        const latest = asset.performances[0];
        newTelemetryData.set(asset.id, {
          voltage: asset.telemetry.voltage,
          frequency: asset.telemetry.frequency,
          temperature: asset.telemetry.temperature,
          generation: latest.generation
        });
      }
    });

    setTelemetryData(newTelemetryData);
  }, [enabled, assets]);

  if (!enabled) return null;

  return (
    <>
      {assets.map(asset => {
        const telemetry = telemetryData.get(asset.id);
        if (!telemetry) return null;

        return (
          <OverlayView
            key={`telemetry-${asset.id}`}
            position={{ lat: asset.lat, lng: asset.lng }}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height + 60) // Position above the marker
            })}
          >
            <div className="telemetry-overlay">
              <div
                style={{
                  background: 'rgba(31, 41, 55, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  minWidth: '120px',
                  animation: 'telemetryFadeIn 0.3s ease-out'
                }}
              >
                <div style={{
                  marginBottom: '4px',
                  fontWeight: '600',
                  color: '#60a5fa',
                  fontSize: '10px',
                  textAlign: 'center'
                }}>
                  TELEMETRY
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>V:</span>
                    <span style={{ color: '#10b981', fontWeight: '500' }}>
                      {telemetry.voltage.toFixed(1)}kV
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>Hz:</span>
                    <span style={{ color: '#3b82f6', fontWeight: '500' }}>
                      {telemetry.frequency.toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>°C:</span>
                    <span style={{
                      color: telemetry.temperature > 35 ? '#ef4444' :
                             telemetry.temperature > 25 ? '#f59e0b' : '#10b981',
                      fontWeight: '500'
                    }}>
                      {telemetry.temperature.toFixed(1)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9ca3af' }}>MW:</span>
                    <span style={{ color: '#8b5cf6', fontWeight: '500' }}>
                      {telemetry.generation.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '6px',
                  paddingTop: '4px',
                  borderTop: '1px solid rgba(75, 85, 99, 0.5)',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '9px'
                }}>
                  LIVE DATA
                </div>
              </div>

              {/* Subtle animation styles */}
              <style jsx>{`
                @keyframes telemetryFadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                .telemetry-overlay {
                  pointer-events: none;
                  user-select: none;
                }

                .telemetry-overlay > div {
                  animation: telemetryPulse 3s ease-in-out infinite;
                }

                @keyframes telemetryPulse {
                  0%, 100% {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                  }
                  50% {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 20px rgba(59, 130, 246, 0.2);
                  }
                }
              `}</style>
            </div>
          </OverlayView>
        );
      })}
    </>
  );
};

export default TelemetryLayer;