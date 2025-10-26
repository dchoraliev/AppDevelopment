// app/_layout.jsx
import * as React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from "react-native-paper";
import { useFonts } from "expo-font";
import themeJSON from "../assets/theme/material-theme.json";

const lightColors = themeJSON.schemes?.light ?? {};
const darkColors = themeJSON.schemes?.dark ?? {};

const baseLight = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...lightColors } };
const baseDark = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...darkColors } };

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
  const [fontsLoaded] = useFonts({
    "ComicRelief-Regular": require("../assets/fonts/ComicRelief-Regular.ttf"),
    "ComicRelief-Bold": require("../assets/fonts/ComicRelief-Bold.ttf"),
  });

  const scheme = useColorScheme();

  const theme = React.useMemo(() => {
    const base = scheme === "dark" ? baseDark : baseLight;
    return { ...base, fonts: paperFonts };
  }, [scheme]);

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
