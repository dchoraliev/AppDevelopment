import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";
import { images } from "../../assets/index.js";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Login failed");
      }

      const data = await res.json(); // { token }
      // Store token + email; no context, just storage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("email", email);

      router.replace("/"); // go to home / workouts list
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layout.screenCentered}>
      <Image
        source={images.logo}
        style={{
          width: 120,
          height: 120,
          marginBottom: theme.spacing.xl,
          resizeMode: "contain",
        }}
      />
      <Text style={textStyles.authTitle}>Welcome back</Text>
      <Text style={textStyles.authSubtitle}>
        Log in to manage your workouts.
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
          onPress={handleLogin}
          disabled={loading}
          style={[layout.primaryButton, { marginTop: theme.spacing.lg }]}
        >
          <Text style={textStyles.primaryButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={layout.authFooterRow}>
          <Text style={textStyles.authFooterText}>No account yet?</Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text style={textStyles.authFooterLink}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
