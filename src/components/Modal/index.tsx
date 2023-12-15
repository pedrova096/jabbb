import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, Modal as RNModal } from 'react-native';
import { Text } from '../Text';
import { addOpacity, colors } from '~/constants/theme';
import { MotiView } from 'moti';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
});

export const Modal: React.FC<{
  children?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
}> = ({ children, open = false, onClose }) => {
  return (
    <RNModal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={onClose}>
      <MotiView
        style={styles.container}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'timing', duration: 300 }}>
        <LinearGradient
          end={{ x: 0, y: 0.85 }}
          colors={[addOpacity(colors.primaryDark, 0.85), colors.dark]}
          style={styles.gradient}
        />
        <View style={styles.content}>{children}</View>
      </MotiView>
    </RNModal>
  );
};
