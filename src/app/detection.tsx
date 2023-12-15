import { View } from 'react-native';
import { useRef } from 'react';
import { Loading } from '~/components/Loading';
import { TensorCamera } from '~/components/TensorCamera';
import { usePoseDetectionModel } from '~/hooks/usePoseDetectionModel';
import { useTensorSize } from '~/hooks/useTensorSize';
import { useOrientation } from '~/hooks/useOrientation';
import type { Camera } from 'expo-camera';
import { Pose } from '~/components/Pose';

export default function App() {
  const cameraRef = useRef<{ camera: Camera }>(null);
  const {
    isLoading,
    poses = [],
    onCameraStream,
    handleCameraReady,
  } = usePoseDetectionModel();
  const { isPortrait } = useOrientation();
  const { tensorWidth, tensorHeight } = useTensorSize({
    isPortrait,
  });
  if (isLoading) {
    return <Loading />;
  }
  return (
    <View
      style={{ flex: 1 }}
      onTouchEnd={() => {
        console.log('onTouchEnd');
      }}>
      <TensorCamera
        cameraRef={cameraRef}
        onReady={onCameraStream}
        onCameraReady={handleCameraReady}
        resizeWidth={tensorWidth}
        resizeHeight={tensorHeight}
      />
      <Pose
        isBackCamera={false}
        isPortrait={isPortrait}
        poses={poses}
        tensorWidth={tensorWidth}
        tensorHeight={tensorHeight}
      />
    </View>
  );
}
