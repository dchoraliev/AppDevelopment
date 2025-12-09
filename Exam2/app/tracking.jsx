// app/tracking.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { router } from "expo-router";

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = 500;

export default function TrackingScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [faces, setFaces] = useState([]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "cyan" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onFacesDetected = (event) => {
    if (!event?.faces) return;
    setFaces(event.faces);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Tracking (Expo Dev Build)</Text>

      <View style={styles.cameraBox}>
        <CameraView
          style={{ flex: 1 }}
          facing="front"
          mode="video"
          onFacesDetected={onFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
          }}
        />

        {faces.map((face) => {
          const box = face.bounds;

          return (
            <View
              key={face.faceID || Math.random()}
              style={[
                styles.faceBox,
                {
                  left: box.origin.x,
                  top: box.origin.y,
                  width: box.size.width,
                  height: box.size.height,
                },
              ]}
            />
          );
        })}
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
  },
  cameraBox: {
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  faceBox: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "lime",
    borderRadius: 5,
    zIndex: 10,
  },
  back: {
    color: "white",
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
