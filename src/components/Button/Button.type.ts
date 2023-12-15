import type { TouchableOpacityProps } from 'react-native';
export type ButtonColorMode =
  | 'light'
  | 'primary'
  | 'outlineLight'
  | 'outlinePrimary';

export interface ButtonProps extends TouchableOpacityProps {
  color?: ButtonColorMode;
  toBottom?: boolean;
  loading?: boolean;
}
