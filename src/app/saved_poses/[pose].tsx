import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/Button';
import { Pose } from '~/components/Pose';
import { Text } from '~/components/Text';
import { colors } from '~/constants/theme';
import { useCapturedPoses } from '~/hooks/useCapturedPoses';
import { useTensorSize } from '~/hooks/useTensorSize';

export default function PoseView() {
  const { capturedPoses = [], isLoading } = useCapturedPoses();

  if (isLoading) {
    return null;
  }

  const { pose: poseIdxStr = '0' } = useLocalSearchParams();
  const poseIdx = parseInt(poseIdxStr.toString());
  const captured = capturedPoses[poseIdx];
  const { tensorHeight, tensorWidth } = useTensorSize({
    isPortrait: captured?.isPortrait,
  });

  const prevPose = poseIdx - 1;
  const nextPose = poseIdx + 1;

  return (
    <View style={styles.container}>
      <Text style={styles.index}>Pose {poseIdx}</Text>
      <View style={styles.poseContainer}>
        <Pose
          poses={[captured.pose]}
          isBackCamera={captured.isBackCamera}
          isPortrait={captured.isPortrait}
          tensorHeight={tensorHeight}
          tensorWidth={tensorWidth}
          center
        />
      </View>
      <View style={styles.actionContainer}>
        <Link href={`/saved_poses/${prevPose}`} asChild>
          <Button
            style={styles.actionButton}
            color="primary"
            disabled={poseIdx === 0}>
            <Text
              color="light"
              fontMode="bold"
              center
              style={poseIdx === 0 && styles.opacity50}>
              Prev ({prevPose})
            </Text>
          </Button>
        </Link>
        <View style={styles.actionVr} />
        <Link href={`/saved_poses/${nextPose}`} asChild>
          <Button
            style={styles.actionButton}
            color="primary"
            disabled={poseIdx === capturedPoses.length - 1}>
            <Text
              color="light"
              fontMode="bold"
              center
              style={poseIdx === capturedPoses.length - 1 && styles.opacity50}>
              Next ({nextPose})
            </Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  poseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  index: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    overflow: 'hidden',
  },
  actionVr: {
    width: 2,
    backgroundColor: colors.light,
    borderColor: colors.primary,
    borderTopWidth: 10,
    borderBottomWidth: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 0,
  },
  opacity50: {
    opacity: 0.5,
  },
});

/*
const CounterTest: React.FC<{ pose: any }> = ({ pose }) => {
  const memeee = useMemo(() => [pose], [pose]);
  usePoseCounter(memeee, true);
  return null;
};
*/
