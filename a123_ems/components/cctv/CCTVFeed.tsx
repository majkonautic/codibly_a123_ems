'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Camera, Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';

interface CCTVFeedProps {
  title: string;
  url: string;
  type: 'youtube' | 'rtsp' | 'http';
  className?: string;
}

export const CCTVFeed: React.FC<CCTVFeedProps> = ({
  title,
  url,
  type,
  className = "w-full h-64"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePlay = () => {
    if (type === 'youtube') {
      setIsPlaying(true);
      setIsLoading(true);
    } else {
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch((error) => {
            console.error('Error playing video:', error);
            setHasError(true);
          });
      }
    }
  };

  const handlePause = () => {
    if (type === 'youtube') {
      setIsPlaying(false);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = () => {
    const element = type === 'youtube' ? iframeRef.current : videoRef.current;
    if (element && element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract channel ID from YouTube URL
    const channelMatch = url.match(/channel\/(UC[\w-]+)/);
    if (channelMatch) {
      const channelId = channelMatch[1];
      return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`;
    }
    return url;
  };

  const renderYouTubeFeed = () => (
    <div className={`relative ${className}`}>
      {!isPlaying ? (
        <div
          className="w-full h-full bg-gray-800 border-2 border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
          onClick={handlePlay}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">Click to start YouTube live stream</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl(url)}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2 mx-auto"></div>
                Loading stream...
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleFullscreen}
              className="bg-black/50 hover:bg-black/70 text-white border-none"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDirectFeed = () => (
    <div className={`relative ${className}`}>
      {!isPlaying ? (
        <div
          className="w-full h-full bg-gray-800 border-2 border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors"
          onClick={handlePlay}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">Click to connect to camera feed</p>
          </div>
        </div>
      ) : hasError ? (
        <div className="w-full h-full bg-gray-800 border-2 border-red-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Connection Failed</h3>
            <p className="text-gray-400 text-sm mb-4">Unable to connect to camera feed</p>
            <Button
              size="sm"
              onClick={() => {
                setHasError(false);
                setIsPlaying(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full bg-black rounded-lg object-cover"
            autoPlay
            muted={isMuted}
            controls={false}
            onError={() => setHasError(true)}
          >
            <source src={url} type="application/x-mpegURL" />
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Custom Controls */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={isPlaying ? handlePause : handlePlay}
                className="bg-black/50 hover:bg-black/70 text-white border-none"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white border-none"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleFullscreen}
              className="bg-black/50 hover:bg-black/70 text-white border-none"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return type === 'youtube' ? renderYouTubeFeed() : renderDirectFeed();
};

export default CCTVFeed;