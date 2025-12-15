import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,

  },
  button:{
    padding:10,margin:20,borderColor:"#bfbfbf",borderWidth:1,borderRadius:12,paddingLeft:30,borderColor:"black"
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  header: {
    paddingVertical: 12,
    marginBottom: 10,
  },

  container: {
    paddingBottom: 20,
  },
// styles/layout.js (add inside StyleSheet.create)
profileContent: {
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 20,
  justifyContent: "center",
},
profileCard: {
  backgroundColor: theme.colors.card,
  borderRadius: 20,
  padding: 18,
  borderWidth: 1,
  borderColor: theme.colors.border,
},
avatarWrap: {
  height: 120,
  width: 120,
  borderRadius: 999,
  alignSelf: "center",
  backgroundColor: theme.colors.background,
  borderWidth: 1,
  borderColor: theme.colors.border,
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  marginBottom: 14,
},
avatar: {
  height: 86,
  width: 86,
  resizeMode: "contain",
},
profileTitle: {
  textAlign: "center",
  fontSize: 20,
  fontWeight: "800",
  color: theme.colors.text,
  marginBottom: 6,
},
profileSubtitle: {
  textAlign: "center",
  fontSize: 13,
  color: theme.colors.mutedText,
  lineHeight: 18,
  marginBottom: 16,
},
profileMetaRow: {
  marginBottom: 14,
  padding: 12,
  borderRadius: 14,
  backgroundColor: theme.colors.background,
  borderWidth: 1,
  borderColor: theme.colors.border,
},
profileMetaLabel: {
  fontSize: 12,
  fontWeight: "700",
  color: theme.colors.mutedText,
  marginBottom: 6,
},
profileMetaValue: {
  fontSize: 12,
  color: theme.colors.text,
},
profilePrimaryButton: {
  backgroundColor: theme.colors.primary,
  paddingVertical: 12,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
},
profilePrimaryButtonText: {
  color: theme.colors.primaryText,
  fontWeight: "800",
},
profileDangerButton: {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: theme.colors.danger,
  paddingVertical: 12,
  borderRadius: 999,
  alignItems: "center",
  justifyContent: "center",
},
profileDangerButtonText: {
  color: theme.colors.danger,
  fontWeight: "800",
},

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },

  primaryButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineTextBox: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 6,
  },
});
