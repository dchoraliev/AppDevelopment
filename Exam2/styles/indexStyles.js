import { StyleSheet } from "react-native";
import { colors, spacing, radius } from "./theme";

export const indexStyles = StyleSheet.create({
  // Camera preview container
  cameraContainer: {
    flex: 1,
    borderRadius: radius.m,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.m,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Buttons row (centered, equal spacing)
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.s,
    marginBottom: spacing.m,
  },

  // Main button (Take Photo)
  button: {
    flex: 1,
    maxWidth: 150,
    height: 48, // fixed height for perfect alignment
    backgroundColor: colors.button,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 16,
  },

  // Secondary buttons (View Last Photo, Go to Tracking)
  secondaryButton: {
    flex: 1,
    maxWidth: 150,
    height: 48, // same fixed height
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.button,
    borderRadius: radius.round,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: colors.button,
    fontWeight: "600",
    fontSize: 14, // slightly smaller so "View Last Photo" fits in one line
  },

  // Thumbnail
  thumbnailContainer: {
    alignItems: "center",
    marginBottom: spacing.m,
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: radius.m,
    marginTop: spacing.s,
  },

  // Modal (View Last Photo)
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.m,
  },
  modalContent: {
    width: "100%",
    borderRadius: radius.m,
    backgroundColor: "#020617",
    padding: spacing.m,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.s,
    marginBottom: spacing.m,
  },
  modalCloseButton: {
    backgroundColor: colors.button,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: radius.round,
  },
  modalCloseButtonText: {
    color: colors.buttonText,
    fontWeight: "600",
  },
});
