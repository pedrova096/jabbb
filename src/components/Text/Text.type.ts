import type { TextProps as RNTextProps } from 'react-native';

export type TextFontMode = 'regular' | 'medium' | 'bold';
export type TextColorMode = 'primary' | 'dark' | 'light';

export interface TextProps extends RNTextProps {
  center?: boolean;
  fontMode?: TextFontMode;
  color?: TextColorMode;
}
