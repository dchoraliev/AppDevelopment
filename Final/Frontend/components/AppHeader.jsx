import React from "react";
import { View, Text, Image } from "react-native";
import { textStyles } from "../styles/typography";
import { theme } from "../styles/theme";

export default function AppHeader({
  title = "GymSync",
  subtitle = "Create and track your custom workouts.",
}) {
  return (
    <View
      style={{
        position: "relative",
        paddingVertical: 12,
        marginBottom: 10,

        // gives the header a stable box so centering works every time
        minHeight: 64,

        // centers the text block vertically/horizontally
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* logo pinned left, vertically centered within header box */}
      <Image
        source={require("../assets/logo.png")}
        style={{
          position: "absolute",
          left: 16,
          width: 40,
          height: 40,
          resizeMode: "contain",
          alignSelf: "center", // ✅ vertical centering without top calculations
        }}
      />

      {/* text truly centered on the screen */}
      <View style={{ alignItems: "center" }}>
        <Text style={textStyles.appTitle}>{title}</Text>
        <Text style={[textStyles.appSubtitle, { textAlign: "center" }]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
