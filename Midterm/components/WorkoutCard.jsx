import { View, Text, StyleSheet } from "react-native";

export default function WorkoutCard({ workout }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{workout.title}</Text>
      <Text style={styles.detail}>Muscle Groups: {workout.muscleGroups}</Text>
      <Text style={styles.detail}>Difficulty: {workout.difficulty}</Text>
      <Text style={styles.detail}>Duration: {workout.duration} mins</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: "#444",
  },
});
