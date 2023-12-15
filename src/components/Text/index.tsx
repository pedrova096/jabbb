import { Text as RNText } from 'react-native';
import type { TextProps } from './Text.type';
import { styles } from './Text.styles';

export const Text: React.FC<TextProps> = ({
  children,
  center,
  style,
  color = 'dark',
  fontMode = 'regular',
  ...props
}) => {
  const textModeStyle = {
    regular: null,
    bold: styles.fontBold,
    medium: styles.fontMedium,
  }[fontMode];
  const textColorStyle = {
    primary: styles.primary,
    light: styles.light,
    dark: styles.dark,
  }[color];

  return (
    <RNText
      style={[
        styles.base,
        textModeStyle,
        textColorStyle,
        center && styles.center,
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};
