import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme(); // access custom theme colors

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Home", headerShown: false }} />

      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
          Team 1 Fitness Tracker
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
          CS3720 - Mobile App Development
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onBackground }}>
          Dimitar Choraliev & Devin Hall
        </Text>
      </View>

      <View style={styles.body}>
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onBackground,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Welcome to your fitness tracking app!
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            onPress={() => router.push("/login")}
          >
            Login
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9faef", // can also use theme.colors.background dynamically
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  body: {
    alignItems: "center",
  },
  buttonContainer: {
    width: "80%",
    gap: 10, // for vertical spacing on modern RN
  },
});
