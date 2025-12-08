// app/index.jsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { BASE_URL } from "../assets/config";
import { layout } from "../styles/layout";
import { textStyles } from "../styles/typography";
import { theme } from "../styles/theme";
import { images } from "../assets/index.js";

export default function WorkoutsListScreen() {
  const [workouts, setWorkouts] = useState([]); // starts empty
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/workouts`);
      if (!res.ok) {
        throw new Error("Failed to load workouts");
      }
      const data = await res.json();
      setWorkouts(data || []);
    } catch (err) {
      console.error("Error loading workouts:", err.message);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        // Using id returned by Mongo/Backend (you’ll implement that)
        // Route: /workouts/[id]
        // In backend you should expose id as a string field, not raw _id.
      }}
      style={layout.card}
    >
      <Text style={textStyles.cardTitle}>{item.title}</Text>
      {item.description ? (
        <Text style={textStyles.cardSubtitle} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
      <Text style={textStyles.cardMeta}>
        {item.muscleGroup} · {item.duration} min · {item.difficulty}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={layout.screen}>
      {/* Header */}
      <View style={layout.header}>
        <View style={layout.header}>
          <Image
            source={images.logo}
            style={{
              width: 40,
              height: 40,
              resizeMode: "contain",
            }}
          />
        </View>
        <View>
          <Text style={textStyles.appTitle}>GymSync</Text>
          <Text style={textStyles.appSubtitle}>
            Create and track your custom workouts.
          </Text>
        </View>
      </View>

      {/* Top actions row */}
      <View style={layout.navRow}>
        <Link href="/workouts/new" asChild>
          <TouchableOpacity style={layout.primaryButton}>
            <Text style={textStyles.primaryButtonText}>+ New workout</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
          <Link href="/auth/login" asChild>
            <TouchableOpacity style={layout.outlineButton}>
              <Text style={textStyles.outlineButtonText}>Login</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity style={layout.outlineButton}>
              <Text style={textStyles.outlineButtonText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* List / Empty state */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : workouts.length === 0 ? (
        <View style={layout.emptyState}>
          <Text style={textStyles.emptyTitle}>No workouts yet</Text>
          <Text style={textStyles.emptySubtitle}>
            Start by creating your first workout with the button above.
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ marginTop: theme.spacing.md }}
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
