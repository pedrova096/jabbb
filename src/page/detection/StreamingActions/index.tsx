import { View } from 'moti';
import { StyleSheet } from 'react-native';
import { Button } from '~/components/Button';
import { Text } from '~/components/Text';
import { addOpacity, colors, sidesGap } from '~/constants/theme';

export interface StreamingActionsProps {
  isInfinite?: boolean;
  timerCount: number;
  repsCount: number;
  onStreamStop: () => void;
  poseStatus: string | number;
}

export const StreamingActions: React.FC<StreamingActionsProps> = ({
  repsCount,
  timerCount,
  isInfinite,
  poseStatus,
  onStreamStop,
}) => {
  return (
    <View style={styles.actionContainer}>
      <View style={styles.actionLeftContainer}>
        {!isInfinite && (
          <>
            <View style={styles.actionSubContainer}>
              <Text color="light" style={styles.timeLabel}>
                Training:
              </Text>
              <Text color="light" style={styles.timeValue}>
                {timerCount}
              </Text>
            </View>
            <View style={styles.divider} />
          </>
        )}
        <View style={styles.actionSubContainer}>
          <Text color="light" style={styles.timeLabel}>
            Reps:
          </Text>
          <Text color="light" style={styles.timeValue}>
            {repsCount}
            <Text color="light" style={styles.poseValue}>
              /{poseStatus}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.actionButtonContainer}>
        <Button color="outlinePrimary" onPress={onStreamStop}>
          Stop
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
