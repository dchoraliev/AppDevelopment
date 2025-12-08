// app/workouts/new.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";

export default function NewWorkoutScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [exercises, setExercises] = useState([{ name: "", sets: "", reps: "" }]);
  const [loading, setLoading] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "" }]);
  };

  const updateExercise = (index, field, value) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      )
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in to create workouts.");
        return;
      }

      const payload = {
        title,
        description,
        muscleGroup,
        duration: Number(duration) || 0,
        difficulty,
        exercises: exercises
          .filter((e) => e.name.trim())
          .map((e) => ({
            name: e.name,
            sets: Number(e.sets) || 0,
            reps: e.reps,
          })),
      };

      const res = await fetch(`${BASE_URL}/workouts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create workout");
      }

      const created = await res.json(); // expect { id, ... }
      Alert.alert("Success", "Workout created.", [
        {
          text: "OK",
          onPress: () =>
            router.replace(`/workouts/${encodeURIComponent(created.id)}`),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.formScroll}>
        <Text style={textStyles.screenTitle}>New workout</Text>

        <Text style={textStyles.label}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Push day"
          placeholderTextColor={theme.colors.muted}
          style={layout.input}
        />

        <Text style={textStyles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Short description"
          placeholderTextColor={theme.colors.muted}
          style={[layout.input, layout.textarea]}
          multiline
        />

        <Text style={textStyles.label}>Muscle group</Text>
        <TextInput
          value={muscleGroup}
          onChangeText={setMuscleGroup}
          placeholder="Chest, Back, Legs..."
          placeholderTextColor={theme.colors.muted}
          style={layout.input}
        />

        <Text style={textStyles.label}>Duration (minutes)</Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="45"
          placeholderTextColor={theme.colors.muted}
          style={layout.input}
        />

        <Text style={textStyles.label}>Difficulty</Text>
        <TextInput
          value={difficulty}
          onChangeText={setDifficulty}
          placeholder="Beginner / Intermediate / Advanced"
          placeholderTextColor={theme.colors.muted}
          style={layout.input}
        />

        <Text style={[textStyles.label, { marginTop: theme.spacing.lg }]}>
          Exercises
        </Text>

        {exercises.map((ex, index) => (
          <View key={index} style={layout.exerciseCard}>
            <Text style={textStyles.smallLabel}>Name</Text>
            <TextInput
              value={ex.name}
              onChangeText={(v) => updateExercise(index, "name", v)}
              placeholder="Bench Press"
              placeholderTextColor={theme.colors.muted}
              style={layout.input}
            />

            <View style={layout.row}>
              <View style={layout.rowItem}>
                <Text style={textStyles.smallLabel}>Sets</Text>
                <TextInput
                  value={ex.sets}
                  onChangeText={(v) => updateExercise(index, "sets", v)}
                  keyboardType="numeric"
                  style={layout.input}
                />
              </View>
              <View style={layout.rowItem}>
                <Text style={textStyles.smallLabel}>Reps</Text>
                <TextInput
                  value={ex.reps}
                  onChangeText={(v) => updateExercise(index, "reps", v)}
                  placeholder="8-10"
                  placeholderTextColor={theme.colors.muted}
                  style={layout.input}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={addExercise}
          style={layout.linkButton}
        >
          <Text style={textStyles.linkText}>+ Add exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[layout.primaryButton, { marginTop: theme.spacing.lg }]}
        >
          <Text style={textStyles.primaryButtonText}>
            {loading ? "Saving..." : "Create workout"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
