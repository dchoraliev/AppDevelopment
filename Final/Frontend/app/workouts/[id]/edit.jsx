// app/workouts/[id]/edit.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../assets/config";
import { layout } from "../../../styles/layout";
import { colors } from "../../../styles/theme";

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const workoutId = Array.isArray(id) ? id[0] : id;

  const fetchWorkout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/workouts/${encodeURIComponent(workoutId)}`);
      if (!res.ok) throw new Error("Failed to load workout");
      const data = await res.json();
      setForm({
        title: data.title || "",
        description: data.description || "",
        muscleGroup: data.muscleGroup || "",
        duration: String(data.duration ?? ""),
        difficulty: data.difficulty || "",
        exercises:
          data.exercises?.map((e) => ({
            name: e.name,
            sets: String(e.sets),
            reps: e.reps,
          })) || [],
      });
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

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setExercise = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e, i) =>
        i === index ? { ...e, [key]: value } : e
      ),
    }));
  };

  const addExercise = () => {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: "3", reps: "10" }],
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert("Error", "Title is required.");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You must be logged in to edit workouts.");
        return;
      }

      const body = {
        title: form.title,
        description: form.description,
        muscleGroup: form.muscleGroup,
        duration: Number(form.duration) || 0,
        difficulty: form.difficulty,
        exercises: form.exercises
          .filter((e) => e.name.trim())
          .map((e) => ({
            name: e.name,
            sets: Number(e.sets) || 0,
            reps: e.reps,
          })),
      };

      const res = await fetch(
        `${BASE_URL}/workouts/${encodeURIComponent(workoutId)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Update failed");
      }

      Alert.alert("Saved", "Workout updated.", [
        {
          text: "OK",
          onPress: () => router.replace(`/workouts/${encodeURIComponent(workoutId)}`),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
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
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Edit workout
        </Text>

        <Label text="Title" />
        <TextInput
          value={form.title}
          onChangeText={(v) => setField("title", v)}
          style={inputStyle}
        />

        <Label text="Description" />
        <TextInput
          value={form.description}
          onChangeText={(v) => setField("description", v)}
          style={[inputStyle, { height: 80, textAlignVertical: "top" }]}
          multiline
        />

        <Label text="Muscle group" />
        <TextInput
          value={form.muscleGroup}
          onChangeText={(v) => setField("muscleGroup", v)}
          style={inputStyle}
        />

        <Label text="Duration (min)" />
        <TextInput
          value={form.duration}
          onChangeText={(v) => setField("duration", v)}
          keyboardType="numeric"
          style={inputStyle}
        />

        <Label text="Difficulty" />
        <TextInput
          value={form.difficulty}
          onChangeText={(v) => setField("difficulty", v)}
          style={inputStyle}
        />

        <Text
          style={{
            color: colors.primaryText,
            fontWeight: "600",
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Exercises
        </Text>

        {form.exercises.map((ex, index) => (
          <View
            key={index}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <Label text="Name" />
            <TextInput
              value={ex.name}
              onChangeText={(v) => setExercise(index, "name", v)}
              style={inputStyle}
            />

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Label text="Sets" />
                <TextInput
                  value={ex.sets}
                  onChangeText={(v) => setExercise(index, "sets", v)}
                  keyboardType="numeric"
                  style={inputStyle}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Label text="Reps" />
                <TextInput
                  value={ex.reps}
                  onChangeText={(v) => setExercise(index, "reps", v)}
                  style={inputStyle}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={addExercise} style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.primary }}>+ Add exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 12,
            borderRadius: 999,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#0b1120",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            {saving ? "Saving..." : "Save changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Label({ text }) {
  return (
    <Text
      style={{
        color: colors.primaryText,
        marginTop: 8,
        marginBottom: 4,
      }}
    >
      {text}
    </Text>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 8,
  color: colors.primaryText,
  fontSize: 14,
};
