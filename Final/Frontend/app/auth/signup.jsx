// app/auth/signup.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Signup failed");
      }

      Alert.alert("Account created", "You can now log in.", [
        { text: "OK", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layout.screenCentered}>
      <Text style={textStyles.authTitle}>Create account</Text>
      <Text style={textStyles.authSubtitle}>
        Sign up to start planning workouts.
      </Text>

      <View style={layout.form}>
        <Text style={textStyles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={layout.input}
        />

        <Text style={textStyles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={theme.colors.muted}
          secureTextEntry
          style={layout.input}
        />

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={[layout.primaryButton, { marginTop: theme.spacing.lg }]}
        >
          <Text style={textStyles.primaryButtonText}>
            {loading ? "Signing up..." : "Create account"}
          </Text>
        </TouchableOpacity>

        <View style={layout.authFooterRow}>
          <Text style={textStyles.authFooterText}>Already registered?</Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text style={textStyles.authFooterLink}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
