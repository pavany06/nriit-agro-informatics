import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useState } from 'react';

interface CameraResult {
  base64: string | null;
  error: string | null;
  loading: boolean;
}

export const useNativeCamera = () => {
  const [result, setResult] = useState<CameraResult>({ base64: null, error: null, loading: false });
  const isNative = Capacitor.isNativePlatform();

  const takePhoto = async (source: CameraSource = CameraSource.Camera) => {
    setResult({ base64: null, error: null, loading: true });
    try {
      if (isNative) {
        const image = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source,
          width: 1024,
          height: 1024,
        });
        const base64 = `data:image/${image.format};base64,${image.base64String}`;
        setResult({ base64, error: null, loading: false });
        return base64;
      } else {
        // Web fallback: trigger file input
        return null;
      }
    } catch (e: any) {
      const msg = e?.message || 'Camera failed';
      setResult({ base64: null, error: msg, loading: false });
      return null;
    }
  };

  const openCamera = () => takePhoto(CameraSource.Camera);
  const openGallery = () => takePhoto(CameraSource.Photos);

  const reset = () => setResult({ base64: null, error: null, loading: false });

  return { ...result, isNative, openCamera, openGallery, reset };
};
