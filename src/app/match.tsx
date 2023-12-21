import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Loading } from '~/components/Loading';
import { TensorCamera } from '~/components/TensorCamera';
import { usePoseDetectionModel } from '~/hooks/usePoseDetectionModel';
import { useTensorSize } from '~/hooks/useTensorSize';
import { useOrientation } from '~/hooks/useOrientation';
import { Pose } from '~/components/Pose';
import { addOpacity, colors, sidesGap } from '~/constants/theme';
import { base as BASE_POSE } from '~/constants/poses';
import { applyNoseOffset, findKeypointByName } from '~/utils/keypoints.handler';
import { KeyPointName } from '~/types';
import { MatchPose } from '~/page/match/MatchPose';

export default function App() {
  const {
    isLoading,
    poses = [],
    onCameraStream,
    handleCameraReady,
    isStreamRunning,
    runStream,
    stopStream,
  } = usePoseDetectionModel({
    autostart: true,
  });
  const { isPortrait } = useOrientation();
  const { tensorWidth, tensorHeight } = useTensorSize({ isPortrait });

  if (isLoading) {
    return <Loading />;
  }

  const nose = poses.length
    ? findKeypointByName(poses[0], KeyPointName.nose)
    : null;

  return (
    <View style={styles.container}>
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
        {!!nose && (
          <MatchPose
            isBackCamera={false}
            isPortrait={isPortrait}
            basePose={applyNoseOffset(BASE_POSE, nose.x, nose.y)}
            poses={poses}
            tensorWidth={tensorWidth}
            tensorHeight={tensorHeight}
          />
        )}
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
