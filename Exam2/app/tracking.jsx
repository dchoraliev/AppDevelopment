// app/tracking.jsx
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { common } from '../styles/common';
import { trackingStyles } from '../styles/trackingStyles';

export default function TrackingScreen() {
  return (
    <View style={common.container}>
      <Text style={common.title}>Screen 2: Object / Color Tracking</Text>
      <Text style={trackingStyles.highlightText}>
        (Tracking engine will run here)
      </Text>

      <View style={common.box}>
        <Text style={common.boxText}>
          Camera preview + tracking overlay will go here.
        </Text>
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={{ marginBottom: 16, alignItems: 'center' }}
        onPress={() => router.back()}
      >
        <Text style={trackingStyles.highlightText}>⬅ Back to Camera</Text>
      </TouchableOpacity>

      <View style={common.footer}>
        <Text style={common.footerText}>
          CS3720 Mobile Applications Development - UW-Platteville - Fall 2025
        </Text>
        <Text style={common.footerText}>
          Dimitar Choraliev, Devin Hall - Professor: Dr. Abraham Aldaco
        </Text>
      </View>
    </View>
  );
}
