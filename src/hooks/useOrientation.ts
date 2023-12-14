import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';

export const useOrientation = () => {
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation>();

  useEffect(() => {
    const getOrientation = async () => {
      const curOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(curOrientation);

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });
    };

    getOrientation();
  }, []);

  const isPortrait =
    orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
    orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;

  return { orientation, isPortrait };
};
