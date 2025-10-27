// app/(tabs)/_layout.jsx
import * as React from "react";
import { useTheme } from "react-native-paper";
import { Tabs } from "expo-router";
import WorkoutsScreen from "./workouts";
import SettingsScreen from "./settings";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
  screenOptions={{
    headerShown: true,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarStyle: { backgroundColor: theme.colors.surface, height: 60 },
    contentStyle: { paddingTop: 0 }, 
  }}
>

      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dumbbell" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
