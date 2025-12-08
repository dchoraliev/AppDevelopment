// app/workouts/[id].jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { colors } from "../../styles/theme";

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const workoutId = Array.isArray(id) ? id[0] : id;

  const fetchWorkout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/workouts/${encodeURIComponent(workoutId)}`);
      if (!res.ok) {
        throw new Error("Failed to load workout");
      }
      const data = await res.json();
      setWorkout(data);
    } catch (err) {
      Alert.alert("Error", err.message, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete", "Delete this workout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Error", "You must be logged in to delete.");
              return;
            }

            const res = await fetch(
              `${BASE_URL}/workouts/${encodeURIComponent(workoutId)}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.detail || "Delete failed");
            }

            Alert.alert("Deleted", "Workout deleted.", [
              {
                text: "OK",
                onPress: () => router.replace("/"),
              },
            ]);
          } catch (err) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  if (loading || !workout) {
    return (
      <View
        style={[
          layout.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.container}>
        <Text
          style={{
            color: colors.primaryText,
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 4,
          }}
        >
          {workout.title}
        </Text>
        <Text
          style={{
            color: colors.mutedText,
            marginBottom: 8,
          }}
        >
          {workout.description}
        </Text>
        <Text
          style={{
            color: colors.mutedText,
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          {workout.muscleGroup} · {workout.duration} min ·{" "}
          {workout.difficulty}
        </Text>

        {workout.exercises?.length > 0 && (
          <>
            <Text
              style={{
                color: colors.primaryText,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Exercises
            </Text>
            {workout.exercises.map((ex, index) => (
              <View
                key={`${ex.name}-${index}`}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 4,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ color: colors.primaryText }}>
                  {ex.name}
                </Text>
                <Text style={{ color: colors.mutedText }}>
                  {ex.sets} x {ex.reps}
                </Text>
              </View>
            ))}
          </>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push(`/workouts/${encodeURIComponent(workoutId)}/edit`)
            }
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ color: colors.primary }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: "#b91c1c",
            }}
          >
            <Text style={{ color: "#fff" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
