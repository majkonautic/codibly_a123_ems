'use client';

import React from 'react';
import { OverlayView } from '@react-google-maps/api';
import type { SimulatedAsset } from '../utils/dataSimulator';

interface AlarmsLayerProps {
  enabled: boolean;
  assets: SimulatedAsset[];
}

const AlarmsLayer: React.FC<AlarmsLayerProps> = ({ enabled, assets }) => {
  if (!enabled) return null;

  // Filter assets that have active alerts
  const assetsWithAlerts = assets.filter(asset => asset.alerts && asset.alerts.length > 0);

  const handleAlarmClick = (asset: SimulatedAsset) => {
    console.log('Alarm clicked for asset:', asset.name, 'Alerts:', asset.alerts);
    // You can add navigation to alerts page or show asset details here
    // For now, just log the alert information
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // yellow
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const getSeverityGlow = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return '0 0 20px rgba(239, 68, 68, 0.6)';
      case 'medium':
        return '0 0 15px rgba(245, 158, 11, 0.6)';
      case 'low':
        return '0 0 10px rgba(16, 185, 129, 0.6)';
      default:
        return '0 0 5px rgba(107, 114, 128, 0.6)';
    }
  };

  const getHighestSeverity = (alerts: any[]) => {
    const severityOrder = ['critical', 'high', 'medium', 'low'];
    for (const severity of severityOrder) {
      if (alerts.some(alert => alert.severity === severity)) {
        return severity;
      }
    }
    return 'low';
  };

  return (
    <>
      {assetsWithAlerts.map(asset => {
        const highestSeverity = getHighestSeverity(asset.alerts);
        const severityColor = getSeverityColor(highestSeverity);
        const severityGlow = getSeverityGlow(highestSeverity);

        return (
          <OverlayView
            key={`alarm-${asset.id}`}
            position={{ lat: asset.lat, lng: asset.lng }}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height / 2)
            })}
          >
            <div
              className="alarm-indicator"
              onClick={() => handleAlarmClick(asset)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulsing ring effect */}
              <div
                style={{
                  position: 'absolute',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: `2px solid ${severityColor}`,
                  animation: 'alarmPulse 2s ease-in-out infinite',
                  opacity: 0.7
                }}
              />

              {/* Main alert icon */}
              <div
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: severityColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: severityGlow,
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  animation: 'alarmBlink 1.5s ease-in-out infinite alternate',
                  transition: 'transform 0.2s ease'
                }}
              >
                <span style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  !
                </span>
              </div>

              {/* Alert count badge */}
              {asset.alerts.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#1f2937',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'white',
                    zIndex: 10
                  }}
                >
                  {asset.alerts.length}
                </div>
              )}

              {/* Alert summary tooltip */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '45px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(31, 41, 55, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${severityColor}`,
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  color: '#e5e7eb',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  opacity: 0,
                  animation: 'alertTooltipShow 3s ease-in-out infinite',
                  pointerEvents: 'none',
                  minWidth: '140px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '9px',
                  color: severityColor,
                  fontWeight: '600',
                  marginBottom: '2px',
                  textTransform: 'uppercase'
                }}>
                  {highestSeverity} ALERT{asset.alerts.length > 1 ? 'S' : ''}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#d1d5db'
                }}>
                  {asset.alerts[0]?.type || 'System Alert'}
                </div>
                {asset.alerts.length > 1 && (
                  <div style={{
                    fontSize: '9px',
                    color: '#9ca3af',
                    marginTop: '2px'
                  }}>
                    +{asset.alerts.length - 1} more
                  </div>
                )}

                {/* Tooltip arrow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: `1px solid ${severityColor}`,
                    borderTop: 'none',
                    borderLeft: 'none',
                    transform: 'translateX(-50%) rotate(45deg)'
                  }}
                />
              </div>

              {/* Animation styles */}
              <style jsx>{`
                .alarm-indicator {
                  position: relative;
                  pointer-events: auto;
                  user-select: none;
                }

                .alarm-indicator:hover > div:nth-child(2) {
                  transform: scale(1.1);
                  animation-play-state: paused;
                }

                @keyframes alarmPulse {
                  0% {
                    transform: scale(1);
                    opacity: 0.7;
                  }
                  50% {
                    transform: scale(1.2);
                    opacity: 0.3;
                  }
                  100% {
                    transform: scale(1.4);
                    opacity: 0;
                  }
                }

                @keyframes alarmBlink {
                  0% {
                    opacity: 1;
                    transform: scale(1);
                  }
                  100% {
                    opacity: 0.8;
                    transform: scale(1.05);
                  }
                }

                @keyframes alertTooltipShow {
                  0%, 70% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(5px);
                  }
                  75%, 95% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                  }
                  100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-5px);
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

export default AlarmsLayer;