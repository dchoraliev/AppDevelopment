import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";
import AppHeader from "../../components/AppHeader";

export default function JoinWorkoutScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  const handleJoin = async () => {
    const joinCode = code.trim().toUpperCase();
    if (joinCode.length !== 6) {
      Alert.alert("Error", "Join code must be 6 characters.");
      return;
    }

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      // NOTE: This assumes your backend join endpoint exists.
      // If your backend uses a different route, update here.
      const res = await fetch(`${BASE_URL}/workouts/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ join_code: joinCode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Join failed");
      }

      Alert.alert("Joined", "Workout joined.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={layout.safeArea} edges={["top", "left", "right"]}>
      <View style={layout.content}>
        <AppHeader />

        <View style={{ gap: 10 }}>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: "800" }}>
            Join workout
          </Text>

          <Text style={{ color: theme.colors.mutedText, fontSize: 12 }}>
            Enter the 6-character join code.
          </Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="ABC123"
            placeholderTextColor={theme.colors.mutedText}
            autoCapitalize="characters"
            maxLength={6}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.colors.text,
              letterSpacing: 2,
              fontWeight: "800",
            }}
          />

          <TouchableOpacity
            onPress={handleJoin}
            disabled={saving}
            style={[layout.primaryButton, { opacity: saving ? 0.85 : 1 }]}
          >
            <Text style={textStyles.primaryButtonText}>
              {saving ? "Joining..." : "Join"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/")} style={layout.outlineButton}>
            <Text style={textStyles.outlineButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
