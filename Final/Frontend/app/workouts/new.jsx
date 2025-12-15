import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../../assets/config";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";
import AppHeader from "../../components/AppHeader";

export default function NewWorkoutScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    muscleGroup: "",
    difficulty: "",
    duration: "",
    exercises: [{ name: "", sets: "", reps: "", weight: "" }],
  });

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setExercise = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e, i) =>
        i === index ? { ...e, [key]: value } : e
      ),
    }));
  };

  const addExercise = () =>
    setForm((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", sets: "", reps: "", weight: "" },
      ],
    }));

  const removeExercise = (index) =>
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));

  const isValidWholeNumber = (value) => {
    // must be digits only, no spaces, no dashes
    return /^\d+$/.test(value.trim());
  };

  const validate = () => {
    if (
      !form.title.trim() ||
      !form.muscleGroup.trim() ||
      !form.difficulty.trim() ||
      !form.duration.trim()
    ) {
      return "All fields except description are required.";
    }

    if (Number.isNaN(Number(form.duration))) {
      return "Duration must be a number.";
    }

    if (form.exercises.length === 0) {
      return "At least one exercise is required.";
    }

    for (let i = 0; i < form.exercises.length; i++) {
      const e = form.exercises[i];

      if (
        !e.name.trim() ||
        !e.sets.trim() ||
        !e.reps.trim() ||
        !e.weight.trim()
      ) {
        return "Each exercise must have name, sets, reps, and weight.";
      }

      if (!isValidWholeNumber(e.sets)) {
        return `Sets must be a whole number (exercise ${i + 1}).`;
      }

      if (!isValidWholeNumber(e.reps)) {
        return `Reps must be ONE number, not a range (exercise ${i + 1}).`;
      }

      if (!isValidWholeNumber(e.weight)) {
        return `Weight must be a whole number (exercise ${i + 1}).`;
      }
    }

    return null;
  };

  const handleCreate = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Error", error);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in.");
        return;
      }

      const body = {
        title: form.title,
        description: form.description,
        muscleGroup: form.muscleGroup,
        difficulty: form.difficulty,
        duration: Number(form.duration),
        exercises: form.exercises.map((e) => ({
          name: e.name,
          sets: Number(e.sets),
          reps: Number(e.reps),
          weight: Number(e.weight),
        })),
      };

      const res = await fetch(`${BASE_URL}/workouts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Create failed");
      }

      router.replace("/");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <SafeAreaView style={layout.safeArea} edges={["top", "left", "right"]}>
      <View style={layout.content}>
        <AppHeader />

        <ScrollView contentContainerStyle={{ gap: 12 }}>
          <Text style={textStyles.sectionTitle}>New Workout</Text>

          <TextInput
            placeholder="Workout title"
            value={form.title}
            onChangeText={(v) => setField("title", v)}
            style={layout.outlineTextBox}
          />

          <TextInput
            placeholder="Description (optional)"
            value={form.description}
            onChangeText={(v) => setField("description", v)}
            style={layout.outlineTextBox}
            multiline
          />

          <TextInput
            placeholder="Muscle group"
            value={form.muscleGroup}
            onChangeText={(v) => setField("muscleGroup", v)}
            style={layout.outlineTextBox}
          />

          <TextInput
            placeholder="Difficulty"
            value={form.difficulty}
            onChangeText={(v) => setField("difficulty", v)}
            style={layout.outlineTextBox}
          />

          <TextInput
            placeholder="Duration (minutes)"
            value={form.duration}
            onChangeText={(v) => setField("duration", v)}
            keyboardType="numeric"
            style={layout.outlineTextBox}
          />

          <Text style={textStyles.sectionTitle}>Exercises</Text>

          {form.exercises.map((ex, index) => (
            <View
              key={index}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                padding: 12,
                gap: 8,
              }}
            >
              <TextInput
                placeholder="Exercise name"
                value={ex.name}
                onChangeText={(v) => setExercise(index, "name", v)}
                style={layout.outlineTextBox}
              />
              <TextInput
                placeholder="Sets"
                value={ex.sets}
                onChangeText={(v) => setExercise(index, "sets", v)}
                keyboardType="numeric"
                style={layout.outlineTextBox}
              />
              <TextInput
                placeholder="Reps"
                value={ex.reps}
                onChangeText={(v) => setExercise(index, "reps", v)}
                keyboardType="numeric"
                style={layout.outlineTextBox}
              />
              <TextInput
                placeholder="Weight"
                value={ex.weight}
                onChangeText={(v) => setExercise(index, "weight", v)}
                keyboardType="numeric"
                style={layout.outlineTextBox}
              />

              {form.exercises.length > 1 && (
                <TouchableOpacity onPress={() => removeExercise(index)}>
                  <Text style={{backgroundColor:'#be0505',padding:10, color: "white" ,width:'40%',borderRadius:12,borderWidth:1}}>Remove exercise</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity onPress={addExercise} style={layout.outlineButton}>
            <Text style={textStyles.outlineButtonText}>+ Add exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCreate} style={layout.primaryButton}>
            <Text style={textStyles.primaryButtonText}>Create workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/")}
            style={layout.outlineButton}
          >
            <Text style={textStyles.outlineButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
