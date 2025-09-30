'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Camera, Wind } from 'lucide-react';
import CCTVFeed from './CCTVFeed';

interface WindFarmCCTVProps {
  assetId: string;
  assetName: string;
  className?: string;
}

// CCTV feed configurations for wind farms
const WIND_FARM_FEEDS = {
  'wind-001': [
    {
      id: 'wind-001-youtube',
      title: 'Wind Farm Overview - Live Stream',
      url: 'https://www.youtube.com/channel/UCyi9IC6SAxU0aOPrkTYbz1g/live',
      type: 'youtube' as const,
      description: 'Live overview of wind turbine operations'
    }
  ],
  'wind-002': [
    {
      id: 'wind-002-direct',
      title: 'Turbine Monitoring Camera',
      url: 'http://Friend:Friend123@107.1.228.34/stw-cgi/video.cgi?msubmenu=stream&action=view&Profile=1',
      type: 'http' as const,
      description: 'Direct feed from turbine monitoring system'
    }
  ],
  'wind-003': [
    {
      id: 'wind-003-youtube',
      title: 'Prairie Wind Farm Live',
      url: 'https://www.youtube.com/channel/UCyi9IC6SAxU0aOPrkTYbz1g/live',
      type: 'youtube' as const,
      description: 'Live monitoring of prairie wind operations'
    }
  ],
  // Add more wind farms as needed
  'default': [
    {
      id: 'wind-demo-youtube',
      title: 'Wind Farm Demo Feed',
      url: 'https://www.youtube.com/channel/UCyi9IC6SAxU0aOPrkTYbz1g/live',
      type: 'youtube' as const,
      description: 'Demo wind farm monitoring feed'
    }
  ]
};

export const WindFarmCCTV: React.FC<WindFarmCCTVProps> = ({
  assetId,
  assetName,
  className = ""
}) => {
  // Get feeds for this specific wind farm or use default
  const feeds = WIND_FARM_FEEDS[assetId as keyof typeof WIND_FARM_FEEDS] || WIND_FARM_FEEDS.default;

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Camera className="h-5 w-5 mr-2 text-blue-400" />
          CCTV Monitoring - {assetName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {feeds.map((feed, index) => (
            <div key={feed.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Wind className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{feed.title}</h3>
                    <p className="text-gray-400 text-xs">{feed.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">LIVE</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden">
                <CCTVFeed
                  title={feed.title}
                  url={feed.url}
                  type={feed.type}
                  className="w-full h-80"
                />
              </div>

              {feed.type === 'http' && (
                <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <p className="text-yellow-200 text-xs">
                      Direct IP camera feed - Connection may require network access permissions
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Camera Status Info */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium text-sm mb-3">Camera System Status</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Cameras:</span>
                <span className="text-green-400">{feeds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recording:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Night Vision:</span>
                <span className="text-blue-400">Auto</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Motion Detection:</span>
                <span className="text-green-400">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WindFarmCCTV;