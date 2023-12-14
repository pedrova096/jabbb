import { CameraType } from 'expo-camera';
import { useState } from 'react';

export const useCameraType = () => {
  const [cameraType, setCameraType] = useState(CameraType.front);

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.front ? CameraType.back : CameraType.front
    );
  };

  return {
    cameraType,
    toggleCameraType,
  };
};
