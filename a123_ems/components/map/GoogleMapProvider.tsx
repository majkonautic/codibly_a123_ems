'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from './utils/mapConfig';

const libraries: ("places" | "geometry" | "drawing" | "visualization" | "marker")[] = ["places", "geometry", "visualization", "marker"];

interface GoogleMapContextType {
  isLoaded: boolean;
  loadError: Error | null;
  mapInstance: google.maps.Map | null;
  setMapInstance: (map: google.maps.Map | null) => void;
}

const GoogleMapContext = createContext<GoogleMapContextType | null>(null);

export const useGoogleMap = () => {
  const context = useContext(GoogleMapContext);
  if (!context) {
    throw new Error('useGoogleMap must be used within a GoogleMapProvider');
  }
  return context;
};

interface GoogleMapProviderProps {
  children: React.ReactNode;
}

export const GoogleMapProvider: React.FC<GoogleMapProviderProps> = ({ children }) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
  console.log('🔑 GoogleMapProvider - API key status:', apiKey ? 'PRESENT' : 'MISSING', apiKey ? `(${apiKey.length} chars)` : '');

  if (!apiKey) {
    console.error('❌ Google Maps API key is required');
    return <div>Google Maps API key is required</div>;
  }

  // Use useJsApiLoader hook instead of LoadScript component
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
    version: 'weekly',
    preventGoogleFontsLoading: true
  });

  // Debug state changes
  React.useEffect(() => {
    console.log('📊 GoogleMapProvider useJsApiLoader state - isLoaded:', isLoaded, 'loadError:', loadError?.message);
    if (isLoaded) {
      console.log('🗺️ Google Maps API loaded successfully via useJsApiLoader');
    }
    if (loadError) {
      console.error('❌ Google Maps API load error:', loadError);
    }
  }, [isLoaded, loadError]);

  const contextValue: GoogleMapContextType = {
    isLoaded,
    loadError,
    mapInstance,
    setMapInstance
  };

  // Show loading state while Google Maps is loading
  if (!isLoaded && !loadError) {
    return (
      <GoogleMapContext.Provider value={contextValue}>
        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2 mx-auto"></div>
            Loading Google Maps...
          </div>
        </div>
      </GoogleMapContext.Provider>
    );
  }

  // Show error state if loading failed
  if (loadError) {
    return (
      <GoogleMapContext.Provider value={contextValue}>
        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-red-400">
            Failed to load Google Maps: {loadError.message}
          </div>
        </div>
      </GoogleMapContext.Provider>
    );
  }

  // Render children when Google Maps is loaded
  return (
    <GoogleMapContext.Provider value={contextValue}>
      {children}
    </GoogleMapContext.Provider>
  );
};

export default GoogleMapProvider;