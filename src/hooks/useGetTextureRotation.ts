import { CameraType } from 'expo-camera';
import { Orientation } from 'expo-screen-orientation';
import { IS_ANDROID } from '../constants/config';

export const useGetTextureRotation = ({
  cameraType,
  orientation,
}: {
  orientation: Orientation;
  cameraType: CameraType;
}) => {
  const getTextureRotationAngleInDegrees = () => {
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0;
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
      case Orientation.PORTRAIT_DOWN:
        return 180;
      case Orientation.LANDSCAPE_LEFT:
        return cameraType === CameraType.front ? 270 : 90;
      case Orientation.LANDSCAPE_RIGHT:
        return cameraType === CameraType.front ? 90 : 270;
      default:
        return 0;
    }
  };

  const rotation = getTextureRotationAngleInDegrees();

  return { rotation };
};
