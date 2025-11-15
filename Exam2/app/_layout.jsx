// app/_layout.jsx
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
