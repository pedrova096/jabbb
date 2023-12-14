import type { ExpoWebGLRenderingContext } from 'expo-gl';
import type { Tensor3D } from '@tensorflow/tfjs';
import type {
  CameraProps as ExpoCameraProps,
  Camera as ExpoCamera,
} from 'expo-camera';

export declare type Rotation = 0 | 90 | 180 | 270 | 360 | -80 | -180 | -270;

export interface TensorCameraBaseProps {
  resizeWidth: number;
  resizeHeight: number;
  useCustomShadersToResize?: boolean;
  cameraTextureWidth?: number;
  cameraTextureHeight?: number;
  resizeDepth?: number;
  autorender?: boolean;
  rotation?: Rotation;
  ref?: React.RefObject<{ camera: ExpoCamera }>;
  onReady: (
    images: IterableIterator<Tensor3D>,
    updateCameraPreview: () => void,
    gl: ExpoWebGLRenderingContext,
    cameraTexture: WebGLTexture
  ) => void;
  // TODO: make style required
}

export interface TensorCameraProps
  extends ExpoCameraProps,
    TensorCameraBaseProps {
  cameraRef?: TensorCameraBaseProps['ref'];
}
