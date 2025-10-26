import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useTheme, Text, Card } from "react-native-paper";

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const textColor =
    theme.dark || theme.colors.surfaceContainer?.startsWith("#") === "#1"
      ? "#fff"
      : "#000";

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = require("../assets/workouts.json");
        setWorkouts(data);
      } catch (err) {
        console.error("Error loading workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const renderWorkout = ({ item }) => (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surfaceContainer }]}
    >
      <Card.Content>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          {item.name}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen options={{ title: "Workouts" }} />
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWorkout}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
    gap: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
});
