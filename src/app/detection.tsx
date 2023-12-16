import { StyleSheet, View } from 'react-native';
import { useRef, useState } from 'react';
import { Loading } from '~/components/Loading';
import { TensorCamera } from '~/components/TensorCamera';
import { usePoseDetectionModel } from '~/hooks/usePoseDetectionModel';
import { useTensorSize } from '~/hooks/useTensorSize';
import { useOrientation } from '~/hooks/useOrientation';
import type { Camera } from 'expo-camera';
import { Pose } from '~/components/Pose';
import { addOpacity, colors, sidesGap } from '~/constants/theme';
import { Button } from '~/components/Button';
import { Text } from '~/components/Text';
import { useCountDown } from '~/hooks/useCountDown';
import { Modal } from '~/components/Modal';
import { AnimatePresence, MotiView } from 'moti';
import { useCapturedPoses } from '~/hooks/useCapturedPoses';
import { usePoseCounter } from '~/hooks/usePoseCounter';

export default function App() {
  const [trainingSeconds, setTrainingSeconds] = useState(0);
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
  const {
    count: training,
    startCountDown: startTrainingTimer,
    isPlaying: isTraining,
  } = useCountDown({
    seconds: trainingSeconds,
    onEnd: () => {},
  });
  const { count, isPlaying, startCountDown } = useCountDown({
    seconds: 5,
    onEnd: () => {
      startTrainingTimer();
    },
  });

  const { count: reps, status: poseStatus } = usePoseCounter(poses, isTraining);

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
      {!isTraining ? (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            {[30, 40, 60].map((value, i) => (
              <Button
                key={value}
                color={trainingSeconds === value ? 'light' : 'outlineLight'}
                style={[styles.button, i === 0 && styles.buttonFirst]}
                onPress={() => setTrainingSeconds(value)}>
                <Text
                  color={trainingSeconds === value ? 'primary' : 'light'}
                  style={styles.buttonText}>
                  {value}
                </Text>
                <Text
                  color={trainingSeconds === value ? 'primary' : 'light'}
                  style={styles.buttonTextSmall}>
                  sec
                </Text>
              </Button>
            ))}
          </View>
          <Button
            color="primary"
            onPress={handleStart}
            disabled={!trainingSeconds}>
            Capture
          </Button>
        </View>
      ) : (
        <View style={styles.actionContainer}>
          <View style={styles.actionLeftContainer}>
            <View style={styles.actionSubContainer}>
              <Text color="light" style={styles.timeLabel}>
                Training:
              </Text>
              <Text color="light" style={styles.timeValue}>
                {training}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.actionSubContainer}>
              <Text color="light" style={styles.timeLabel}>
                Reps:
              </Text>
              <Text color="light" style={styles.timeValue}>
                {reps}/{poseStatus}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtonContainer}>
            <Button color="outlinePrimary" onPress={stopStream}>
              Stop
            </Button>
          </View>
        </View>
      )}
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

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: sidesGap,
  },
  actionLeftContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  actionSubContainer: {
    flex: 1,
  },

  divider: {
    borderLeftWidth: 1,
    borderLeftColor: addOpacity(colors.light, 0.2),
    marginRight: 20,
    marginLeft: -20,
  },
  timeLabel: {
    position: 'absolute',
    top: -5,
    fontSize: 14,
    opacity: 0.6,
  },
  timeValue: {
    fontSize: 64,
  },
  actionButtonContainer: {
    flexGrow: 0.1,
    marginLeft: 10,
  },
});
