import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
  },
  screenCentered: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  form: {
    marginTop: theme.spacing.lg,
  },
  formScroll: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.card,
  },
  textarea: {
    borderRadius: theme.radius.md,
    minHeight: 80,
    textAlignVertical: "top",
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  rowItem: {
    flex: 1,
  },
  linkButton: {
    marginTop: theme.spacing.sm,
  },
  emptyState: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },
  authFooterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
});
