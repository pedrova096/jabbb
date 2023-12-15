import { StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { Loading } from '~/components/Loading';
import { TensorCamera } from '~/components/TensorCamera';
import { usePoseDetectionModel } from '~/hooks/usePoseDetectionModel';
import { useTensorSize } from '~/hooks/useTensorSize';
import { useOrientation } from '~/hooks/useOrientation';
import type { Camera } from 'expo-camera';
import { Pose } from '~/components/Pose';
import { colors, sidesGap } from '~/constants/theme';
import { Button } from '~/components/Button';
import { Text } from '~/components/Text';
import { useCountDown } from '~/hooks/useCountDown';
import { Modal } from '~/components/Modal';
import { AnimatePresence, MotiView } from 'moti';
import { useCapturedPoses } from '~/hooks/useCapturedPoses';

export default function CapturePose() {
  const cameraRef = useRef<{ camera: Camera }>(null);
  const [seconds, setSeconds] = useState(0);
  const { addCapturedPose } = useCapturedPoses();
  const {
    isLoading,
    poses = [],
    onCameraStream,
    handleCameraReady,
    runStream,
    stopStream,
  } = usePoseDetectionModel({
    autostart: false,
  });
  const { isPortrait } = useOrientation();
  const { tensorWidth, tensorHeight } = useTensorSize({
    isPortrait,
  });
  const isBackCamera = false;
  const { count, startCountDown, isPlaying } = useCountDown({
    seconds,
    onEnd: () => {
      addCapturedPose(poses, isBackCamera, isPortrait);
      stopStream();
    },
  });

  const handleStart = () => {
    runStream();
    startCountDown();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Modal open={isPlaying}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={count}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300 }}
            exit={{ opacity: 0, translateY: -10 }}>
            <Text color="light" style={styles.countdownText}>
              {count}
            </Text>
          </MotiView>
        </AnimatePresence>
      </Modal>
      <View style={styles.cameraContainer}>
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
      <View style={styles.buttonContainer}>
        <View style={styles.buttonRow}>
          {[3, 5, 10].map((value, i) => (
            <Button
              key={value}
              color={seconds === value ? 'light' : 'outlineLight'}
              style={[styles.button, i === 0 && styles.buttonFirst]}
              onPress={() => setSeconds(value)}>
              <Text
                color={seconds === value ? 'primary' : 'light'}
                style={styles.buttonText}>
                {value}
              </Text>
              <Text
                color={seconds === value ? 'primary' : 'light'}
                style={styles.buttonTextSmall}>
                sec
              </Text>
            </Button>
          ))}
        </View>
        <Button color="primary" onPress={handleStart} disabled={!seconds}>
          Capture
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  cameraContainer: {
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    overflow: 'hidden',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: sidesGap,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  buttonFirst: {
    marginLeft: 0,
  },
  buttonText: {
    fontSize: 20,
    textAlignVertical: 'bottom',
  },
  buttonTextSmall: {
    fontSize: 12,
    lineHeight: 22,
    marginLeft: 2,
    textAlignVertical: 'bottom',
    opacity: 0.6,
  },
  countdownText: {
    fontSize: 80,
  },
});
