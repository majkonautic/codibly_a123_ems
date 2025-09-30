'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // For demo purposes, we'll use a simulated connection
    const mockSocket = {
      connected: true,
      on: (event: string, callback: Function) => {
        // Simulate periodic updates
        if (event === 'assetUpdate') {
          const interval = setInterval(() => {
            // Generate mock data update
            callback({
              assets: [],
              portfolio: null,
              timestamp: new Date()
            });
          }, 30000);

          return () => clearInterval(interval);
        }
      },
      emit: (event: string, data: any) => {
        console.log('Socket emit:', event, data);
      },
      disconnect: () => {
        console.log('Socket disconnected');
      }
    };

    socketRef.current = mockSocket as any;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}