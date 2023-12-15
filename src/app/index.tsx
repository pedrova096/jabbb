import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/Button';
import { sidesGap } from '~/constants/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sidesGap,
  },
  mt10: {
    marginTop: 10,
  },
});

export default function Home() {
  return (
    <View style={styles.container}>
      <Button color="primary">Detect</Button>
      <Link href="/capture_pose" asChild>
        <Button color="primary" style={styles.mt10}>
          Capture Pose
        </Button>
      </Link>
      <Link href="/saved_poses" asChild>
        <Button color="primary" style={styles.mt10}>
          Saved Poses
        </Button>
      </Link>
    </View>
  );
}
