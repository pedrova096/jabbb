import { StyleSheet } from 'react-native';
import * as theme from '~/constants/theme';

export const styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
  center: {
    textAlign: 'center',
  },
  fontBold: {
    fontWeight: 'bold',
  },
  fontMedium: {
    fontWeight: '500',
  },
  primary: {
    color: theme.colors.primary,
  },
  light: {
    color: theme.colors.light,
  },
  dark: {
    color: theme.colors.primaryDark,
  },
});
