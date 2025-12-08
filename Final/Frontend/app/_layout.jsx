import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { theme } from "../styles/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style={theme.statusBarStyle || "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
