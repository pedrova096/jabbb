import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import type { Pose } from '@tensorflow-models/pose-detection';
import { useEffect, useState } from 'react';

enum StoreStatus {
  LOADING,
  LOADED,
}

type CapturedPose = {
  pose: Pose;
  capturedAt: Date;
  isBackCamera: boolean;
  isPortrait: boolean;
};

export const useCapturedPoses = () => {
  const [capturedPoses, setCapturedPoses] = useState<CapturedPose[]>();
  const [status, setStatus] = useState(StoreStatus.LOADING);
  const { getItem, setItem } = useAsyncStorage('capturedPoses');

  useEffect(() => {
    getItem().then((value) => {
      try {
        if (value) {
          const _capturedPoses = JSON.parse(value);
          if (Array.isArray(_capturedPoses)) {
            setCapturedPoses(_capturedPoses);
          }
        } else {
          setCapturedPoses([]);
        }
      } catch {
      } finally {
        setStatus(StoreStatus.LOADED);
      }
    });
  }, []);

  useEffect(() => {
    if (capturedPoses && status === StoreStatus.LOADED) {
      setItem(JSON.stringify(capturedPoses));
    }
  }, [capturedPoses]);

  function addCapturedPose(
    capturedPose: Pose[],
    isBackCamera: boolean,
    isPortrait: boolean
  ) {
    setCapturedPoses([
      ...capturedPoses!,
      {
        pose: capturedPose[0],
        isBackCamera,
        isPortrait,
        capturedAt: new Date(),
      },
    ]);
  }

  return {
    capturedPoses,
    addCapturedPose,
    isLoading: status === StoreStatus.LOADING,
    isLoaded: status === StoreStatus.LOADED,
  };
};
