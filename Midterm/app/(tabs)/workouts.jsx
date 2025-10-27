import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ActivityIndicator, StyleSheet, View } from "react-native";
import { useEffect, useState, useMemo } from "react";
import { Stack } from "expo-router";
import {
  useTheme,
  Text,
  Card,
  Button,
  Dialog,
  TextInput,
  Portal,
} from "react-native-paper";

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    title: "",
    muscleGroups: "",
    difficulty: "",
    duration: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = require("../../assets/workouts.json");
        setWorkouts(data);
      } catch (err) {
        console.error("Error loading workouts:", err);
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }, []);

  const handleAddWorkout = () => {
    if (
      !newWorkout.title.trim() ||
      !newWorkout.muscleGroups.trim() ||
      !newWorkout.difficulty.trim() ||
      !newWorkout.duration.trim()
    ) {
      return;
    }

    const newItem = {
      id: workouts.length + 1,
      ...newWorkout,
    };

    setWorkouts((prev) => [...prev, newItem]);
    setDialogVisible(false);
    setNewWorkout({ title: "", muscleGroups: "", difficulty: "", duration: "" });
  };

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) =>
      w.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workouts, searchQuery]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const renderWorkout = ({ item }) => {
    if (item.isAddButton) {
      return (
        <Button
          mode="contained"
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
          style={styles.addButton}
          onPress={() => setDialogVisible(true)}
        >
          + Add Workout
        </Button>
      );
    }

    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceContainer || theme.colors.surface },
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
              Muscle Groups: {item.muscleGroups}
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                fontFamily: "ComicRelief-Regular",
              }}
            >
              Difficulty: {item.difficulty}
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                fontFamily: "ComicRelief-Regular",
              }}
            >
              Duration: {item.duration} minutes
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const listData = [...filteredWorkouts, { id: "add-button", isAddButton: true }];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: "Workouts" }} />

      <TextInput
        placeholder="Search workouts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={styles.searchInput}
      />

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWorkout}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Add Workout</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newWorkout.title}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, title: text })}
              style={styles.input}
            />
            <TextInput
              label="Muscle Groups"
              value={newWorkout.muscleGroups}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, muscleGroups: text })}
              style={styles.input}
            />
            <TextInput
              label="Difficulty"
              value={newWorkout.difficulty}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, difficulty: text })}
              style={styles.input}
            />
            <TextInput
              label="Duration (minutes)"
              keyboardType="numeric"
              value={newWorkout.duration}
              onChangeText={(text) => setNewWorkout({ ...newWorkout, duration: text })}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddWorkout}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  searchInput: {
    marginBottom: 12,
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
  input: {
    marginBottom: 10,
  },
  addButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 10,
  },
});
