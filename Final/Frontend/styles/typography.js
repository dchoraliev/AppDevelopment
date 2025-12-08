import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const textStyles = StyleSheet.create({
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  appSubtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 4,
  },
  smallLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: 2,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primaryText,
  },
  outlineButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
    textAlign: "center",
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  authSubtitle: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: 4,
  },
  authFooterText: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  authFooterLink: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  monoLabel: {
    fontFamily: "monospace",
    fontSize: 12,
    color: theme.colors.text,
  },
});
