import type { TouchableOpacityProps } from 'react-native';
export type ButtonColorMode = 'light' | 'primary';

export interface ButtonProps extends TouchableOpacityProps {
  color?: ButtonColorMode;
  toBottom?: boolean;
  loading?: boolean;
}
