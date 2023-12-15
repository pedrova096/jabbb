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
/*
const styles = StyleSheet.create({
  containerPortrait: {
    position: 'relative',
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
    marginTop: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  containerLandscape: {
    position: 'relative',
    width: CAM_PREVIEW_HEIGHT,
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get('window').height / 2 - CAM_PREVIEW_HEIGHT / 2,
  },
  loadingMsg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  svg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 30,
  },
  fpsContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 80,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
  cameraTypeSwitcher: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderRadius: 2,
    padding: 8,
    zIndex: 20,
  },
});
*/
