import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { CameraType, Camera as ExpoCamera } from 'expo-camera';
import { TensorCameraProps } from './TensorCamera.types';
import { Dimensions, StyleSheet } from 'react-native';

const TensorCameraBase = cameraWithTensors(
  ExpoCamera
) as unknown as React.ComponentType<TensorCameraProps>;

// TODO: get dynamic ratios

export const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
export const CAM_PREVIEW_ASPECT_RATIO = 9 / 16;
export const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / CAM_PREVIEW_ASPECT_RATIO;

const styles = StyleSheet.create({
  base: {
    zIndex: 1,
    width: '100%',
    aspectRatio: CAM_PREVIEW_ASPECT_RATIO,
  },
});

export const TensorCamera: React.FC<TensorCameraProps> = ({
  cameraRef,
  resizeDepth = 3,
  autorender = true,
  ratio = '16:9',
  type = CameraType.front,
  style,
  ...props
}) => {
  return (
    <TensorCameraBase
      ref={cameraRef}
      autorender={autorender}
      resizeDepth={resizeDepth}
      type={type}
      ratio="16:9"
      style={[styles.base, style]}
      {...props}
    />
  );
};
