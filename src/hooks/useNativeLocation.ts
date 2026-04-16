import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { useState, useCallback } from 'react';

interface LocationResult {
  lat: number | null;
  lon: number | null;
  error: string | null;
  loading: boolean;
}

const DEFAULT_LAT = 16.3067; // Guntur
const DEFAULT_LON = 80.4365;

export const useNativeLocation = () => {
  const [location, setLocation] = useState<LocationResult>({ lat: null, lon: null, error: null, loading: false });
  const isNative = Capacitor.isNativePlatform();

  const getLocation = useCallback(async (): Promise<{ lat: number; lon: number }> => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    try {
      if (isNative) {
        const perm = await Geolocation.checkPermissions();
        if (perm.location === 'denied') {
          const req = await Geolocation.requestPermissions();
          if (req.location === 'denied') throw new Error('Location permission denied');
        }
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLocation({ ...coords, error: null, loading: false });
        return coords;
      } else {
        // Web fallback
        return new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                setLocation({ ...coords, error: null, loading: false });
                resolve(coords);
              },
              () => {
                setLocation({ lat: DEFAULT_LAT, lon: DEFAULT_LON, error: null, loading: false });
                resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
              }
            );
          } else {
            setLocation({ lat: DEFAULT_LAT, lon: DEFAULT_LON, error: null, loading: false });
            resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
          }
        });
      }
    } catch (e: any) {
      setLocation({ lat: DEFAULT_LAT, lon: DEFAULT_LON, error: e?.message || 'Location failed', loading: false });
      return { lat: DEFAULT_LAT, lon: DEFAULT_LON };
    }
  }, [isNative]);

  return { ...location, getLocation };
};
