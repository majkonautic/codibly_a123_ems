'use client';

import React, { useEffect, useState } from 'react';
import { OverlayView } from '@react-google-maps/api';
import type { SimulatedAsset } from '../utils/dataSimulator';

interface WindSpeedLayerProps {
  enabled: boolean;
  assets: SimulatedAsset[];
}

interface WindData {
  speed: number; // m/s
  direction: number; // degrees (0-360)
  lat: number;
  lng: number;
  id: string;
}

const WindSpeedLayer: React.FC<WindSpeedLayerProps> = ({ enabled, assets }) => {
  const [windData, setWindData] = useState<WindData[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Generate wind data for each asset location and surrounding area
    const newWindData: WindData[] = [];

    assets.forEach((asset, index) => {
      // Base wind data for the asset location
      const baseWindSpeed = 3 + Math.sin(Date.now() / 10000 + index) * 2 + Math.random() * 4; // 1-9 m/s
      const baseDirection = (180 + Math.sin(Date.now() / 15000 + index) * 60 + Math.random() * 30) % 360;

      // Add main wind vector at asset location
      newWindData.push({
        id: `wind-${asset.id}`,
        speed: baseWindSpeed,
        direction: baseDirection,
        lat: asset.lat,
        lng: asset.lng
      });

      // Add surrounding wind vectors for better visualization
      const numSurrounding = 4;
      for (let i = 0; i < numSurrounding; i++) {
        const offsetLat = (Math.random() - 0.5) * 0.1; // ~5.5km radius
        const offsetLng = (Math.random() - 0.5) * 0.1;
        const speedVariation = (Math.random() - 0.5) * 2;
        const directionVariation = (Math.random() - 0.5) * 30;

        newWindData.push({
          id: `wind-${asset.id}-${i}`,
          speed: Math.max(0.5, baseWindSpeed + speedVariation),
          direction: (baseDirection + directionVariation + 360) % 360,
          lat: asset.lat + offsetLat,
          lng: asset.lng + offsetLng
        });
      }
    });

    setWindData(newWindData);

    // Update wind data periodically
    const interval = setInterval(() => {
      setWindData(prev => prev.map(wind => ({
        ...wind,
        speed: Math.max(0.5, wind.speed + (Math.random() - 0.5) * 0.5),
        direction: (wind.direction + (Math.random() - 0.5) * 10 + 360) % 360
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [enabled, assets]);

  const getWindSpeedColor = (speed: number) => {
    if (speed < 2) return '#10b981'; // green - light breeze
    if (speed < 4) return '#3b82f6'; // blue - gentle breeze
    if (speed < 6) return '#f59e0b'; // yellow - moderate breeze
    if (speed < 8) return '#ef4444'; // red - fresh breeze
    return '#8b5cf6'; // purple - strong breeze
  };

  const getArrowSize = (speed: number) => {
    return Math.max(20, Math.min(40, speed * 4)); // Scale arrow size with wind speed
  };

  if (!enabled) return null;

  return (
    <>
      {windData.map(wind => {
        const color = getWindSpeedColor(wind.speed);
        const size = getArrowSize(wind.speed);

        return (
          <OverlayView
            key={wind.id}
            position={{ lat: wind.lat, lng: wind.lng }}
            mapPaneName={OverlayView.OVERLAY_LAYER}
            getPixelPositionOffset={(width, height) => ({
              x: -(width / 2),
              y: -(height / 2)
            })}
          >
            <div className="wind-vector">
              <div
                style={{
                  position: 'relative',
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: `rotate(${wind.direction}deg)`,
                  animation: 'windFloat 3s ease-in-out infinite',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                }}
              >
                {/* Wind arrow */}
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 24 24"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  {/* Arrow body */}
                  <path
                    d="M12 2 L12 18 M12 2 L8 6 M12 2 L16 6"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {/* Arrow feathers for speed indication */}
                  {wind.speed > 4 && (
                    <path
                      d="M12 10 L10 12 M12 14 L10 16"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.8"
                    />
                  )}
                  {wind.speed > 6 && (
                    <path
                      d="M12 6 L10 8 M12 8 L10 10"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                    />
                  )}
                </svg>

                {/* Speed label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-18px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-' + wind.direction + 'deg)',
                    background: 'rgba(31, 41, 55, 0.9)',
                    backdropFilter: 'blur(4px)',
                    border: `1px solid ${color}`,
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    color: color,
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {wind.speed.toFixed(1)}m/s
                </div>
              </div>

              {/* Wind flow animation */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '60px',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent 0%, ${color}30 50%, transparent 100%)`,
                  transform: `translate(-50%, -50%) rotate(${wind.direction}deg)`,
                  animation: 'windFlow 1.5s linear infinite',
                  pointerEvents: 'none'
                }}
              />

              {/* Animation styles */}
              <style jsx>{`
                .wind-vector {
                  pointer-events: none;
                  user-select: none;
                  position: relative;
                }

                @keyframes windFloat {
                  0%, 100% {
                    transform: rotate(${wind.direction}deg) translateY(0px);
                  }
                  50% {
                    transform: rotate(${wind.direction}deg) translateY(-2px);
                  }
                }

                @keyframes windFlow {
                  0% {
                    opacity: 0;
                    transform: translate(-70%, -50%) rotate(${wind.direction}deg) scaleX(0);
                  }
                  50% {
                    opacity: 0.6;
                    transform: translate(-50%, -50%) rotate(${wind.direction}deg) scaleX(1);
                  }
                  100% {
                    opacity: 0;
                    transform: translate(-30%, -50%) rotate(${wind.direction}deg) scaleX(0);
                  }
                }
              `}</style>
            </div>
          </OverlayView>
        );
      })}

      {/* Wind legend overlay */}
      <OverlayView
        position={{
          lat: assets[0]?.lat || 39.8283,
          lng: assets[0]?.lng || -98.5795
        }}
        mapPaneName={OverlayView.OVERLAY_LAYER}
        getPixelPositionOffset={() => ({ x: 20, y: 20 })}
      >
        <div
          style={{
            background: 'rgba(31, 41, 55, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '11px',
            color: '#e5e7eb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minWidth: '140px',
            pointerEvents: 'none'
          }}
        >
          <div style={{
            fontSize: '10px',
            fontWeight: '600',
            color: '#60a5fa',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            WIND SPEED LEGEND
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '2px', background: '#10b981' }} />
              <span style={{ fontSize: '9px' }}>0-2 m/s Light</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '2px', background: '#3b82f6' }} />
              <span style={{ fontSize: '9px' }}>2-4 m/s Gentle</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '2px', background: '#f59e0b' }} />
              <span style={{ fontSize: '9px' }}>4-6 m/s Moderate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '2px', background: '#ef4444' }} />
              <span style={{ fontSize: '9px' }}>6-8 m/s Fresh</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '2px', background: '#8b5cf6' }} />
              <span style={{ fontSize: '9px' }}>8+ m/s Strong</span>
            </div>
          </div>
        </div>
      </OverlayView>
    </>
  );
};

export default WindSpeedLayer;