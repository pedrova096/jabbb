import { FlashList } from '@shopify/flash-list';
import { Pose as PoseType } from '@tensorflow-models/pose-detection';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '~/components/Text';
import { sidesGap } from '~/constants/theme';
import { useCapturedPoses } from '~/hooks/useCapturedPoses';

export default function SavedPoses() {
  const { capturedPoses = [] } = useCapturedPoses();

  const getAverageScore = (pose: PoseType) => {
    return pose.score!;
  };
  const pointAboveThreshold = (pose: PoseType, threshold: number) => {
    return pose.keypoints.filter((point) => point.score! > threshold);
  };

  return (
    <View style={styles.container}>
      <Text>{capturedPoses.length}</Text>
      <FlashList
        data={capturedPoses}
        estimatedItemSize={112}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => `${item.capturedAt}`}
        renderItem={({ item, index }) => (
          <Link href={`/saved_poses/${index}`} asChild>
            <TouchableOpacity style={styles.cardContainer}>
              <Text fontMode="bold" style={styles.cardTitle}>
                Pose {index}
              </Text>
              <Text>Score: {getAverageScore(item.pose).toFixed(2)}</Text>
              <Text>
                Points above threshold:{' '}
                {pointAboveThreshold(item.pose, 0.4).length}
              </Text>
              <Text style={styles.date}>
                {new Date(item.capturedAt).toISOString()}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    opacity: 0.8,
  },
  listContent: {
    paddingHorizontal: 5,
  },
  cardContainer: {
    flexDirection: 'column',
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: sidesGap - 5,
    width: '100%',
  },
});
