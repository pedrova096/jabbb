import { AnimatePresence, MotiView } from 'moti';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Modal } from '~/components/Modal';
import { Text } from '~/components/Text';
import { useCountDown } from '~/hooks/useCountDown';

export interface ModalCountDownProps {
  execute: boolean;
  seconds: number;
  onEnd: () => void;
}

export const ModalCountDown: React.FC<ModalCountDownProps> = ({
  execute,
  seconds,
  onEnd,
}) => {
  const { count, isPlaying, startCountDown } = useCountDown({
    seconds,
    onEnd,
  });

  useEffect(() => {
    if (execute) {
      startCountDown();
    }
  }, [execute]);

  return (
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
  );
};

const styles = StyleSheet.create({
  countdownText: {
    fontSize: 80,
  },
});
