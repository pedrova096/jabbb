import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Loading } from '~/components/Loading';
import { TensorCamera } from '~/components/TensorCamera';
import { usePoseDetectionModel } from '~/hooks/usePoseDetectionModel';
import { useTensorSize } from '~/hooks/useTensorSize';
import { useOrientation } from '~/hooks/useOrientation';
import { Pose } from '~/components/Pose';
import { addOpacity, colors, sidesGap } from '~/constants/theme';
import { useCountDown } from '~/hooks/useCountDown';
import { usePoseCounter } from '~/hooks/usePoseCounter';
import {
  CameraActions,
  ModalCountDown,
  StreamingActions,
} from '~/page/detection';

export default function App() {
  const [trainingSeconds, setTrainingSeconds] = useState(0);

  const {
    isLoading,
    poses = [],
    onCameraStream,
    handleCameraReady,
    isStreamRunning,
    runStream,
    stopStream,
  } = usePoseDetectionModel({
    autostart: false,
  });
  const { isPortrait } = useOrientation();
  const { tensorWidth, tensorHeight } = useTensorSize({ isPortrait });
  const { count: training, startCountDown: startTrainingTimer } = useCountDown({
    seconds: trainingSeconds,
    onEnd: stopStream,
  });
  const { count: repsCount, status: poseStatus } = usePoseCounter(
    poses,
    isStreamRunning
  );

  const handleStart = (time: number) => {
    runStream();
    setTrainingSeconds(time);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ModalCountDown
        execute={isStreamRunning}
        seconds={5}
        onEnd={startTrainingTimer}
      />
      <View style={styles.cameraContainer}>
        <TensorCamera
          onReady={onCameraStream}
          onCameraReady={handleCameraReady}
          resizeWidth={tensorWidth}
          resizeHeight={tensorHeight}
        />
        {/* {indexs.map((item, i) => (
          <MotiView
            key={item.id}
            style={{
              position: 'absolute',
              left: 10,
              bottom: 10,
              zIndex: 30,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              backgroundColor: 'rgb(4 120 87)',
            }}
            from={{ opacity: 0, translateY: 0 }}
            animate={{ opacity: 1, translateY: -40 * i }}
            transition={{ type: 'timing', duration: 300 }}
            exit={{ opacity: 0, translateX: -50 * i }}>
            <Text color="light">{item.name}</Text>
          </MotiView>
        ))} */}
        <Pose
          isBackCamera={false}
          isPortrait={isPortrait}
          poses={poses}
          tensorWidth={tensorWidth}
          tensorHeight={tensorHeight}
        />
      </View>
      {!isStreamRunning ? (
        <CameraActions
          secondsList={[30, 40, 60, Infinity]}
          onStart={handleStart}
        />
      ) : (
        <StreamingActions
          isInfinite={trainingSeconds === Infinity}
          timerCount={training}
          onStreamStop={stopStream}
          repsCount={repsCount}
          poseStatus={poseStatus}
        />
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
  poseValue: {
    fontSize: 32,
  },
  actionButtonContainer: {
    flexGrow: 0.1,
    marginLeft: 10,
  },
});
