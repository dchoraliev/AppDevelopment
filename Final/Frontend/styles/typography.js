import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const textStyles = StyleSheet.create({
  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },

  appSubtitle: {
    fontSize: 12,
    color: theme.colors.mutedText,
    marginTop: 2,
    textAlign: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },

  primaryButtonText: {
    color: "#ffffff", // ✅ white text
    fontWeight: "800",
    fontSize: 13,
  },

  outlineButtonText: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 13,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },

  emptySubtitle: {
    fontSize: 12,
    color: theme.colors.mutedText,
    textAlign: "center",
  },
});
