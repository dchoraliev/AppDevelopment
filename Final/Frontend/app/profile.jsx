import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { layout } from "../styles/layout";
import { theme } from "../styles/theme";

export default function Profile() {
  const [token, setToken] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        const t = await AsyncStorage.getItem("token");
        if (mounted) setToken(t);
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  const signin = () => router.push("/auth/login");

  const signout = async () => {
    Alert.alert("Sign out?", "You'll need to log in again to see your workouts.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          setToken(null);
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={layout.safeArea} edges={["top", "left", "right"]}>
      <View style={layout.profileContent}>
        <View style={layout.profileCard}>
          <View style={layout.avatarWrap}>
            <Image
              source={require("../assets/logo.png")}
              style={layout.avatar}
            />
          </View>

          <Text style={layout.profileTitle}>
            {token ? "You're signed in" : "Not signed in"}
          </Text>

          <Text style={layout.profileSubtitle}>
            {token
              ? "You can view workouts, join sessions, and track progress."
              : "Log in to view your workouts and manage your account."}
          </Text>

          {token ? (
            <>
              <View style={layout.profileMetaRow}>
                <Text style={layout.profileMetaLabel}>Token</Text>
                <Text style={layout.profileMetaValue} numberOfLines={1}>
                  {token}
                </Text>
              </View>

              <TouchableOpacity onPress={signout} style={layout.profileDangerButton}>
                <Text style={layout.profileDangerButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={signin} style={layout.profilePrimaryButton}>
              <Text style={layout.profilePrimaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
