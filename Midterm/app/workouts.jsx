// app/workouts.jsx
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ActivityIndicator, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useTheme, Text, Card } from "react-native-paper";

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
      style={[
        styles.card,
        {
          backgroundColor:
            theme.colors.surfaceContainer || theme.colors.surface,
        },
      ]}
    >
      <Card.Content>
        <Text
          variant="titleLarge"
          style={{
            color: theme.colors.onSurface,
            fontFamily: "ComicRelief-Bold",
          }}
        >
          {item.title}
        </Text>

        <View style={{ marginTop: 6 }}>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontFamily: "ComicRelief-Regular",
            }}
          >
            💪 Muscle Groups: {item.muscleGroups}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontFamily: "ComicRelief-Regular",
            }}
          >
            ⚙️ Difficulty: {item.difficulty}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontFamily: "ComicRelief-Regular",
            }}
          >
            ⏱ Duration: {item.duration} minutes
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
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
    padding: 12,
  },
  list: {
    paddingBottom: 20,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    padding: 8,
  },
});
