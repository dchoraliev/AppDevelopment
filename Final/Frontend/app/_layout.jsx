// app/_layout.jsx
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const iconName =
              route.name === "index"
                ? focused
                  ? "barbell"
                  : "barbell-outline"
                : route.name === "profile"
                  ? focused
                    ? "person"
                    : "person-outline"
                : focused
                ? "settings"
                : "settings-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        {/* ONLY these two are visible tabs */}
        <Tabs.Screen name="index" options={{ title: "Workouts" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />


        {/* Hide everything else (including subfolders) from the tab bar */}
        <Tabs.Screen name="auth/login" options={{ href: null }} />
        <Tabs.Screen name="auth/token" options={{ href: null }} />
        <Tabs.Screen name="auth/signup" options={{ href: null }} />
        <Tabs.Screen name="workouts/[id]/edit" options={{ href: null }} />
        <Tabs.Screen name="workouts/new" options={{ href: null }} />
        <Tabs.Screen name="workouts/join" options={{ href: null }} />
      </Tabs>
    </SafeAreaProvider>
  );
}
