import { StyleSheet } from 'react-native';
import * as theme from '~/constants/theme';

export const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  light: {
    backgroundColor: theme.colors.light,
  },
  outlinePrimary: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  outlineLight: {
    borderWidth: 2,
    borderColor: theme.colors.light,
  },
  toBottom: {
    marginTop: 'auto',
  },
  loader: {
    position: 'absolute',
    right: 24,
    top: 18,
  },
});
