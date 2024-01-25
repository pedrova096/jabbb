import { View } from 'moti';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '~/components/Button';
import { Text } from '~/components/Text';
import { sidesGap } from '~/constants/theme';

export interface CameraActionsProps {
  secondsList: number[];
  onStart: (number: number) => void;
}

export const CameraActions: React.FC<CameraActionsProps> = ({
  secondsList,
  onStart,
}) => {
  const [seconds, setSeconds] = useState(0);

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.buttonRow}>
        {secondsList.map((value, i) => {
          const isSelected = seconds === value;
          const textColors = isSelected ? 'primary' : 'light';
          const isInfinite = value === Infinity;
          return (
            <Button
              key={value}
              color={isSelected ? 'light' : 'outlineLight'}
              style={[styles.button, i === 0 && styles.buttonFirst]}
              onPress={() => setSeconds(value)}>
              {isInfinite ? (
                <Text
                  color={isSelected ? 'primary' : 'light'}
                  style={styles.buttonText}>
                  ∞
                </Text>
              ) : (
                <>
                  <Text color={textColors} style={styles.buttonText}>
                    {value}
                  </Text>
                  <Text color={textColors} style={styles.buttonTextSmall}>
                    sec
                  </Text>
                </>
              )}
            </Button>
          );
        })}
      </View>
      <Button
        color="primary"
        onPress={() => onStart(seconds)}
        disabled={!seconds}>
        Capture
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
