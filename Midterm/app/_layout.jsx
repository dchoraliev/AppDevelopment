import * as React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  Text,
} from "react-native-paper";
import { useFonts } from "expo-font";
// 1) Import your Material Theme Builder export (colors)
import themeJSON from "../assets/theme/material-theme.json";
// 2) Build color objects for light/dark from the JSON
const lightColors = themeJSON.schemes?.light ?? {};
const darkColors = themeJSON.schemes?.dark ?? {};
// 3) Create Paper themes by merging defaults with your JSON roles
const baseLight = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, ...lightColors },
};
const baseDark = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, ...darkColors },
};
// 4) Define MD3 typography mapping with your two fonts
// MD3 keys: display*, headline*, title*, body*, label*
const fontConfig = {
  displayLarge: { fontFamily: "ComicRelief-Bold" },
  displayMedium: { fontFamily: "ComicRelief-Bold" },
  displaySmall: { fontFamily: "ComicRelief-Bold" },
  headlineLarge: { fontFamily: "ComicRelief-Bold" },
  headlineMedium: { fontFamily: "ComicRelief-Bold" },
  headlineSmall: { fontFamily: "ComicRelief-Bold" },
  titleLarge: { fontFamily: "ComicRelief-Bold" },
  titleMedium: { fontFamily: "ComicRelief-Bold" },
  titleSmall: { fontFamily: "ComicRelief-Bold" },
  bodyLarge: { fontFamily: "ComicRelief-Regular" },
  bodyMedium: { fontFamily: "ComicRelief-Regular" },
  bodySmall: { fontFamily: "ComicRelief-Regular" },
  labelLarge: { fontFamily: "ComicRelief-Regular" },
  labelMedium: { fontFamily: "ComicRelief-Regular" },
  labelSmall: { fontFamily: "ComicRelief-Regular" },
};
const paperFonts = configureFonts({ config: fontConfig });
export default function RootLayout() {
  // 5) Load the font files
  const [fontsLoaded] = useFonts({
    "ComicRelief-Regular": require("../assets/fonts/ComicRelief-Regular.ttf"),
    "ComicRelief-Bold": require("../assets/fonts/ComicRelief-Bold.ttf"),
  });
  // 6) Respect system light/dark for the demo (you can add a Settings toggle later)
  const scheme = useColorScheme(); // "light" | "dark"
  // 7) Attach fonts to your theme
  const theme = React.useMemo(() => {
    const base = scheme === "dark" ? baseDark : baseLight;
    return { ...base, fonts: paperFonts };
  }, [scheme]);

  if (!fontsLoaded) return null; // keep it simple for class
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
      {/* Tiny on-screen proof for class: */}
      <Text variant="titleLarge" style={{ margin: 16 }}>
        Custom MD3 Theme + ComicRelief
      </Text>
    </PaperProvider>
  );
}
