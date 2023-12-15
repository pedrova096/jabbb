import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Pose } from '~/components/Pose';
import { Text } from '~/components/Text';
import { useCapturedPoses } from '~/hooks/useCapturedPoses';
import { useTensorSize } from '~/hooks/useTensorSize';

export default function PoseView() {
  const { pose: poseIdx = '0' } = useLocalSearchParams();
  const { capturedPoses = [], isLoading } = useCapturedPoses();
  const pose = capturedPoses[parseInt(poseIdx.toString())];
  const isPortrait = true;
  const { tensorHeight, tensorWidth } = useTensorSize({
    isPortrait,
  });

  if (isLoading) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <Text>{poseIdx}</Text>
      <View style={{ flex: 1 }}>
        <Pose
          poses={[pose.pose]}
          isBackCamera={false}
          isPortrait={isPortrait}
          tensorHeight={tensorHeight}
          tensorWidth={tensorWidth}
        />
      </View>
    </View>
  );
}
