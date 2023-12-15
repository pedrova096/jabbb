import { ActivityIndicator, TouchableOpacity } from 'react-native';
import type { ButtonProps } from './Button.type';
import { Text } from '../Text';
import { styles } from './Button.styles';
import { colors } from '~/constants/theme';

export const Button: React.FC<ButtonProps> = ({
  children,
  color = 'default',
  style,
  toBottom,
  activeOpacity = 0.7,
  loading,
  ...props
}) => {
  const styleByMode = { primary: styles.primary, light: styles.light }[color];
  const textColorByMode = ({ primary: 'light', light: 'primary' } as const)[
    color
  ];
  const loaderColor = (
    { primary: colors.light, light: colors.primary } as const
  )[color];
  return (
    <TouchableOpacity
      style={[styles.base, styleByMode, toBottom && styles.toBottom, style]}
      activeOpacity={activeOpacity}
      {...props}>
      {typeof children === 'string' ? (
        <Text center fontMode="bold" color={textColorByMode}>
          {children}
        </Text>
      ) : (
        children
      )}
      {loading && (
        <ActivityIndicator color={loaderColor} style={styles.loader} />
      )}
    </TouchableOpacity>
  );
};
