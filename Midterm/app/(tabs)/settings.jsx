// app/(tabs)/settings.jsx
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Card, Switch, Divider, useTheme, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as React from "react"; 

export default function SettingsScreen() {
  const theme = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text
          variant="titleLarge"
          style={{ marginBottom: 20, color: theme.colors.primary, fontFamily: "ComicRelief-Bold" }}
        >
          Settings
        </Text>

        {/* Notifications */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceContainer }]}>
          <Card.Title title="Notifications" titleStyle={{ fontFamily: "ComicRelief-Bold", color: theme.colors.onSurface }} />
          <Card.Content>
            <View style={styles.row}>
              <Text style={{ fontFamily: "ComicRelief-Regular", color: theme.colors.onSurfaceVariant }}>
                Enable Notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        <Divider style={{ marginVertical: 12 }} />

        {/* Appearance */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceContainer }]}>
          <Card.Title title="Appearance" titleStyle={{ fontFamily: "ComicRelief-Bold", color: theme.colors.onSurface }} />
          <Card.Content>
            <View style={styles.row}>
              <Text style={{ fontFamily: "ComicRelief-Regular", color: theme.colors.onSurfaceVariant }}>
                Dark Mode
              </Text>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={theme.colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        <Divider style={{ marginVertical: 12 }} />

        {/* Placeholder Buttons */}
        <Button
          mode="outlined"
          onPress={() => {}}
          style={{ marginVertical: 8 }}
          textColor={theme.colors.primary}
        >
          Account Settings
        </Button>

        <Button
          mode="outlined"
          onPress={() => {}}
          style={{ marginVertical: 8 }}
          textColor={theme.colors.primary}
        >
          Privacy
        </Button>

        <Button
          mode="outlined"
          onPress={() => {}}
          style={{ marginVertical: 8 }}
          textColor={theme.colors.primary}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
