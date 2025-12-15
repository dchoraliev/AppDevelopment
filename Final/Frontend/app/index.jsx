import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,

} from "react-native";
import { Link, useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import { BASE_URL } from "../assets/config";
import { layout } from "../styles/layout";
import { textStyles } from "../styles/typography";
import { theme } from "../styles/theme";
import AppHeader from "../components/AppHeader";

function usernameFromEmail(email) {
  if (!email) return "Unknown";
  const at = email.indexOf("@");
  return at === -1 ? email : email.slice(0, at);
}

function normalizeWeight(weight) {
  if (weight === null || weight === undefined) return null;
  if (typeof weight === "string" && weight.trim() === "") return null;

  const num = Number(weight);
  if (!Number.isFinite(num)) return null;
  if (num <= 0) return null;
  return num;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export default function WorkoutsListScreen() {
  const router = useRouter();
  //const theme = useTheme();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const logout = () =>{
    router.push('auth/login')
  }
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setHasToken(false);
        setWorkouts([]);
        return;
      }

      setHasToken(true);

      const res = await fetch(`${BASE_URL}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to load workouts");
      }

      const data = await res.json();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message == "Token expired"){
        Alert.alert("Session Expired","Please log in again")
        logout();
      }
      else{
        console.error(err.message);
      }
      setWorkouts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const handleDeleteWorkout = (workoutIdRaw) => {
    Alert.alert(
      "Delete workout?",
      "This action cannot be undone. If you are not the owner, you will leave the workout.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert("Error", "You must be logged in.");
                return;
              }

              const workoutId = encodeURIComponent(String(workoutIdRaw));
              const res = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Delete failed");
              }

              fetchWorkouts();
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  function flattenExercisesByUser(rawMap) {
    const out = {};
  
    const walk = (node, prefix) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) return;
  
      for (const [k, v] of Object.entries(node)) {
        const nextKey = prefix ? `${prefix}.${k}` : k;
  
        if (Array.isArray(v)) {
          const existing = out[nextKey];
          if (!existing || existing.length < v.length) out[nextKey] = v;
        } else if (v && typeof v === "object") {
          walk(v, nextKey);
        }
      }
    };
  
    walk(rawMap, "");
    return out;
  }
  const renderExercisesByUser = (workout) => {
    const rawMap = workout?.exercises_by_user;
  
    const flat = flattenExercisesByUser(rawMap);
  
    const entries = Object.entries(flat);
    if (entries.length === 0) {
      return (
        <Text style={{ color: theme.colors.mutedText, fontSize: 12 }}>
          No exercises yet.
        </Text>
      );
    }
  
    return (
      <View style={{ gap: 12 }}>
        {entries.map(([email, exercisesRaw]) => {
          const exercises = toArray(exercisesRaw);
  
          return (
            <View key={email} style={{ gap: 8 }}>
              <Text style={{ color: theme.colors.text, fontWeight: "800", fontSize: 13 }}>
                {usernameFromEmail(email)}
              </Text>
  
              {exercises.length === 0 ? (
                <Text style={{ color: theme.colors.mutedText, fontSize: 12 }}>
                  No exercises added.
                </Text>
              ) : (
                <View style={{ gap: 8 }}>
                  {exercises.map((ex, idx) => {
                    const w = normalizeWeight(ex?.weight);
                    const metaParts = [
                      `${Number(ex?.sets ?? 0)} x ${Number(ex?.reps ?? 0)}`,
                      w !== null ? `@ ${w} lb` : null,
                    ].filter(Boolean);
  
                    return (
                      <View
                        key={`${email}-${idx}`}
                        style={{
                          backgroundColor: theme.colors.background,
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: theme.colors.border,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <Text style={{ color: theme.colors.text, flex: 1 }}>
                          {ex?.name || ""}
                        </Text>
                        <Text style={{ color: theme.colors.mutedText }}>
                          {metaParts.join("  ")}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };
  

  const renderItem = ({ item }) => {
    const workoutId = encodeURIComponent(String(item._id));

    return (
      <View
        style={{
          backgroundColor: theme.colors.card,
          padding: 16,
          borderRadius: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <Text style={textStyles.title}>{item.title}</Text>

          <TouchableOpacity onPress={() => router.push(`/workouts/${workoutId}/edit`)} hitSlop={10}>
            <Text style={{ fontSize: 18, color: theme.colors.mutedText }}>⋮</Text>
          </TouchableOpacity>
        </View>

        {!!item.description && (
          <Text style={{ color: theme.colors.mutedText, marginBottom: 10 }}>
            {item.description}
          </Text>
        )}

        <Text style={{ color: theme.colors.mutedText, fontSize: 12, marginBottom: 12 }}>
          {item.muscleGroup} · {item.duration} min · {item.difficulty}
        </Text>

        {renderExercisesByUser(item)}

        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => handleDeleteWorkout(item._id)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#b91c1c",
            }}
          >
            <Text style={{ color: "#b91c1c", fontWeight: "700", fontSize: 12 }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={layout.safeArea} edges={["top", "left", "right"]}>
      <View style={layout.content}>
        <AppHeader />

        

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : !hasToken ? (
          <View style={layout.emptyState}>
            {/*<Text style={textStyles.emptyTitle}>Not logged in</Text>
            <Text style={textStyles.emptySubtitle}>
              Please log in to see your workouts.
            </Text>*/}
          </View>
        ) : workouts.length === 0 ? (
          <View style={layout.emptyState}>
            <Text style={textStyles.emptyTitle}>No workouts yet</Text>
            <Text style={textStyles.emptySubtitle}>
              Create your first workout to get started.
            </Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => String(item._id)}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        <View style={[layout.navRow, { gap: theme.spacing.sm,paddingTop:10,borderWidth:0}]}>
          {hasToken ? (
            <>
              <Link href="/workouts/new" asChild>
                <TouchableOpacity style={layout.outlineButton}>
                  <Text style={textStyles.outlineButtonText}>+ New workout</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/workouts/join" asChild>
                <TouchableOpacity style={layout.outlineButton}>
                  <Text style={textStyles.outlineButtonText}>Join workout</Text>
                </TouchableOpacity>
              </Link>
            </>
          ):
          <>
  <View
    style={{
      marginTop: 32,
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      alignItems: "center",
      gap: theme.spacing.md,
    }}
  >
    <Text
      style={{
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.text,
      }}
    >
      Welcome to GymSync!
    </Text>

    <Text
      style={{
        fontSize: 13,
        color: theme.colors.mutedText,
        textAlign: "center",
        marginBottom: theme.spacing.sm,
      }}
    >
      Sign in to view your workouts, track progress, and join sessions.
    </Text>

    <View style={{ width: "100%", gap: theme.spacing.sm }}>
      <Link href="/auth/login" asChild>
        <TouchableOpacity style={layout.primaryButton}>
          <Text
            style={{
              color: theme.colors.primaryText,
              fontWeight: "800",
            }}
          >
            Log In
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/auth/signup" asChild>
        <TouchableOpacity style={layout.outlineButton}>
          <Text style={textStyles.outlineButtonText}>Create Account</Text>
        </TouchableOpacity>
      </Link>
    </View>
  </View>
</>
}

          
        </View>
      </View>
    </SafeAreaView>
  );
}
