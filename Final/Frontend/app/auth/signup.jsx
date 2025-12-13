import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";

import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";
import AppHeader from "../../components/AppHeader";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Signup failed");
      }

      Alert.alert("Success", "Account created. Please log in.", [
        { text: "OK", onPress: () => router.replace("/auth/login") },
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
            Sign up
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.colors.mutedText}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.colors.text,
            }}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.colors.mutedText}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.colors.text,
            }}
          />

          <TouchableOpacity
            onPress={handleSignup}
            disabled={saving}
            style={[layout.primaryButton, { opacity: saving ? 0.85 : 1 }]}
          >
            <Text style={textStyles.primaryButtonText}>
              {saving ? "Creating..." : "Create account"}
            </Text>
          </TouchableOpacity>

          <Link href="/auth/login" asChild>
            <TouchableOpacity style={layout.outlineButton}>
              <Text style={textStyles.outlineButtonText}>Back to login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
