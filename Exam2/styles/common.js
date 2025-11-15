import { StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from './theme';

export const common = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: font.title,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.m,
  },

  subtitle: {
    fontSize: font.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },

  box: {
    flex: 1,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.m,
  },

  boxText: {
    color: colors.boxText,
    textAlign: 'center',
    paddingHorizontal: spacing.l,
  },

  footer: {
    paddingVertical: spacing.s,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },

  footerText: {
    fontSize: font.footer,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
