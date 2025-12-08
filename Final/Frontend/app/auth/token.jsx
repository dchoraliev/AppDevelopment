// app/auth/token.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { layout } from "../../styles/layout";
import { textStyles } from "../../styles/typography";
import { theme } from "../../styles/theme";

export default function TokenScreen() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const load = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t || "");
    };
    load();
  }, []);

  return (
    <View style={layout.screen}>
      <Text style={[textStyles.appTitle, { marginBottom: theme.spacing.md }]}>
        Stored token
      </Text>
      <ScrollView style={{ flex: 1 }}>
        <Text style={textStyles.monoLabel}>
          {token || "(no token stored)"}
        </Text>
      </ScrollView>
    </View>
  );
}
