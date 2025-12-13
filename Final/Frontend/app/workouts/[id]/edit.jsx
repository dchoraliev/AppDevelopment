import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../../../assets/config";
import { layout } from "../../../styles/layout";
import { textStyles } from "../../../styles/typography";
import { theme } from "../../../styles/theme";
import AppHeader from "../../../components/AppHeader";

const emptyExercise = { name: "", sets: "", reps: "", weight: "" };

const toString = (v) => (v === null || v === undefined ? "" : String(v));

const normalizeExercise = (e) => ({
  name: toString(e?.name).trim(),
  sets: toString(e?.sets),
  reps: toString(e?.reps),
  weight: toString(e?.weight),
});

const isValidWholeNumber = (value) => /^\d+$/.test(String(value).trim());

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const workoutId = Array.isArray(id) ? id[0] : id;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optional: show join code on edit if it exists
  const joinCode = useMemo(() => form?.join_code || form?.joinCode || null, [form]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setExercise = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      exercises: (prev.exercises || []).map((e, i) =>
        i === index ? { ...e, [key]: value } : e
      ),
    }));
  };

  const addExercise = () =>
    setForm((prev) => ({
      ...prev,
      exercises: [...(prev.exercises || []), { ...emptyExercise }],
    }));

  const removeExercise = (index) =>
    setForm((prev) => ({
      ...prev,
      exercises: (prev.exercises || []).filter((_, i) => i !== index),
    }));

  const validate = () => {
    if (!form?.title?.trim() || !form?.muscleGroup?.trim() || !form?.difficulty?.trim() || !toString(form?.duration).trim()) {
      return "All fields except description are required.";
    }

    if (!isValidWholeNumber(form.duration)) {
      return "Duration must be a whole number.";
    }

    const exs = Array.isArray(form?.exercises) ? form.exercises : [];
    if (exs.length === 0) {
      return "At least one exercise is required.";
    }

    for (let i = 0; i < exs.length; i++) {
      const e = exs[i];
      if (!toString(e?.name).trim() || !toString(e?.sets).trim() || !toString(e?.reps).trim() || !toString(e?.weight).trim()) {
        return `Each exercise must have name, sets, reps, and weight (exercise ${i + 1}).`;
      }
      if (!isValidWholeNumber(e.sets)) return `Sets must be a whole number (exercise ${i + 1}).`;
      if (!isValidWholeNumber(e.reps)) return `Reps must be ONE number, not a range (exercise ${i + 1}).`;
      if (!isValidWholeNumber(e.weight)) return `Weight must be a whole number (exercise ${i + 1}).`;
    }

    return null;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "You must be logged in.", [
            { text: "OK", onPress: () => router.replace("/") },
          ]);
          return;
        }

        const res = await fetch(`${BASE_URL}/workouts/${encodeURIComponent(workoutId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = await res.text();
        const data = raw ? JSON.parse(raw) : null;

        if (!res.ok) {
          let msg = data?.detail || "Failed to load workout";
          if (Array.isArray(msg)) {
            msg = msg.map((d) => `${(d.loc || []).join(".")}: ${d.msg}`).join("\n");
          } else if (typeof msg !== "string") {
            msg = JSON.stringify(msg);
          }
          throw new Error(msg);
        }

        // ✅ Exercises can be in either place depending on your backend
        // Priority:
        // 1) data.exercises (classic schema)
        // 2) first entry of data.exercises_by_user (fallback)
        // 3) []
        let exercises = Array.isArray(data?.exercises) ? data.exercises : null;

        if (!exercises) {
          const byUser = data?.exercises_by_user;
          if (byUser && typeof byUser === "object" && !Array.isArray(byUser)) {
            const firstKey = Object.keys(byUser)[0];
            if (firstKey && Array.isArray(byUser[firstKey])) {
              exercises = byUser[firstKey];
            }
          }
        }

        const normalizedExercises =
          Array.isArray(exercises) && exercises.length > 0
            ? exercises.map(normalizeExercise)
            : [{ ...emptyExercise }];

        setForm({
          ...data,
          title: toString(data?.title),
          description: toString(data?.description),
          muscleGroup: toString(data?.muscleGroup),
          difficulty: toString(data?.difficulty),
          duration: toString(data?.duration),
          exercises: normalizedExercises,
        });
      } catch (err) {
        Alert.alert("Error", err?.message ? String(err.message) : "Failed to load workout", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (workoutId) load();
  }, [workoutId]);

  const handleSave = async () => {
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

      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || null,
        muscleGroup: form.muscleGroup.trim(),
        difficulty: form.difficulty.trim(),
        duration: Number(form.duration),
        exercises: (form.exercises || []).map((e) => ({
          name: e.name.trim(),
          sets: Number(e.sets),
          reps: Number(e.reps),
          weight: Number(e.weight),
        })),
      };

      const res = await fetch(`${BASE_URL}/workouts/${encodeURIComponent(workoutId)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : null;

      if (!res.ok) {
        let msg = data?.detail || "Update failed";
        if (Array.isArray(msg)) {
          msg = msg.map((d) => `${(d.loc || []).join(".")}: ${d.msg}`).join("\n");
        } else if (typeof msg !== "string") {
          msg = JSON.stringify(msg);
        }
        throw new Error(msg);
      }

      // ✅ go back home (your desired behavior)
      router.replace("/");
    } catch (err) {
      Alert.alert("Error", err?.message ? String(err.message) : "Update failed");
    }
  };

  if (loading || !form) {
    return (
      <SafeAreaView style={layout.safeArea} edges={["top", "left", "right"]}>
        <View style={[layout.content, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.safeArea} edges={["top", "left", "right"]}>
      <View style={layout.content}>
        <AppHeader />

        <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
          <Text style={textStyles.sectionTitle}>Edit Workout</Text>

          {joinCode ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                padding: 12,
                backgroundColor: theme.colors.card,
              }}
            >
              <Text style={{ color: theme.colors.mutedText, fontSize: 12 }}>
                Join Code
              </Text>
              <Text style={{ color: theme.colors.text, fontWeight: "900", letterSpacing: 2 }}>
                {String(joinCode).toUpperCase()}
              </Text>
            </View>
          ) : null}

          <TextInput
            value={form.title}
            onChangeText={(v) => setField("title", v)}
            placeholder="Workout title"
            placeholderTextColor={theme.colors.mutedText}
            style={layout.outlineButton}
          />

          <TextInput
            value={form.description}
            onChangeText={(v) => setField("description", v)}
            placeholder="Description (optional)"
            placeholderTextColor={theme.colors.mutedText}
            style={layout.outlineButton}
            multiline
          />

          <TextInput
            value={form.muscleGroup}
            onChangeText={(v) => setField("muscleGroup", v)}
            placeholder="Muscle group"
            placeholderTextColor={theme.colors.mutedText}
            style={layout.outlineButton}
          />

          <TextInput
            value={form.difficulty}
            onChangeText={(v) => setField("difficulty", v)}
            placeholder="Difficulty"
            placeholderTextColor={theme.colors.mutedText}
            style={layout.outlineButton}
          />

          <TextInput
            value={form.duration}
            onChangeText={(v) => setField("duration", v)}
            placeholder="Duration (minutes)"
            placeholderTextColor={theme.colors.mutedText}
            keyboardType="numeric"
            style={layout.outlineButton}
          />

          <Text style={textStyles.sectionTitle}>Exercises</Text>

          {(form.exercises || []).map((ex, index) => (
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
                value={ex.name}
                onChangeText={(v) => setExercise(index, "name", v)}
                placeholder="Exercise name"
                placeholderTextColor={theme.colors.mutedText}
                style={layout.outlineButton}
              />
              <TextInput
                value={toString(ex.sets)}
                onChangeText={(v) => setExercise(index, "sets", v)}
                placeholder="Sets"
                placeholderTextColor={theme.colors.mutedText}
                keyboardType="numeric"
                style={layout.outlineButton}
              />
              <TextInput
                value={toString(ex.reps)}
                onChangeText={(v) => setExercise(index, "reps", v)}
                placeholder="Reps"
                placeholderTextColor={theme.colors.mutedText}
                keyboardType="numeric"
                style={layout.outlineButton}
              />
              <TextInput
                value={toString(ex.weight)}
                onChangeText={(v) => setExercise(index, "weight", v)}
                placeholder="Weight"
                placeholderTextColor={theme.colors.mutedText}
                keyboardType="numeric"
                style={layout.outlineButton}
              />

              {(form.exercises || []).length > 1 && (
                <TouchableOpacity onPress={() => removeExercise(index)}>
                  <Text style={{ color: "#b91c1c", fontWeight: "700" }}>Remove exercise</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity onPress={addExercise} style={layout.outlineButton}>
            <Text style={textStyles.outlineButtonText}>+ Add exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} style={layout.primaryButton}>
            <Text style={textStyles.primaryButtonText}>Save changes</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/")} style={layout.outlineButton}>
            <Text style={textStyles.outlineButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
