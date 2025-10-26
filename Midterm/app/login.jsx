import { SafeAreaView } from "react-native-safe-area-context";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import styles from "../styles/loginStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();
  const router = useRouter();

  const handleLogin = () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill out all fields.");
    }
    if (!email.includes("@")) {
      return Alert.alert("Error", "Please enter a valid email.");
    }

    // Navigate to workouts after successful login
    router.push("/workouts");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Login" }} />

      <View style={styles.formContainer}>
        <Text
          variant="titleLarge"
          style={{ textAlign: "center", marginBottom: 20, color: theme.colors.primary }}
        >
          Login
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          onPress={handleLogin}
        >
          Submit
        </Button>
      </View>
    </SafeAreaView>
  );
}
