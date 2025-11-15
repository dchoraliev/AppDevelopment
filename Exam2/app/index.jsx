// app/index.jsx
import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { Link } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

import { common } from "../styles/common";
import { indexStyles } from "../styles/indexStyles";

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [mediaError, setMediaError] = useState(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [lastPhotoUri, setLastPhotoUri] = useState(null);

  const [isViewingPhoto, setIsViewingPhoto] = useState(false);

  const cameraRef = useRef(null);

  // Request media library permission (for saving photos)
  useEffect(() => {
    (async () => {
      try {
        const result = await MediaLibrary.requestPermissionsAsync(false, [
          "photo",
          "video",
        ]);
        setHasMediaPermission(result.status === "granted");
      } catch (e) {
        console.warn("Media library permission error:", e);
        setHasMediaPermission(false);
        setMediaError(
          "Saving to gallery is limited in Expo Go on Android. " +
            "The app will still run, but saving to the device library may not fully work here."
        );
      }
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);

      // Basic call – avoids API mismatch issues
      const photo = await cameraRef.current.takePictureAsync();

      // Try to save to gallery if allowed
      if (hasMediaPermission) {
        try {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        } catch (e) {
          console.warn("Error saving photo:", e);
          setMediaError(
            "Saving to gallery failed in Expo Go. " +
              "This should work in a development build / real APK."
          );
        }
      }

      setLastPhotoUri(photo.uri);
    } catch (error) {
      console.warn("Error taking photo:", error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  // --- CAMERA PERMISSIONS UI ---

  if (!cameraPermission) {
    return (
      <View style={common.container}>
        <Text style={common.title}>Exam 2 - Camera App</Text>
        <Text style={common.subtitle}>Checking camera permissions…</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={common.container}>
        <Text style={common.title}>Camera Permission Needed</Text>
        <Text style={common.subtitle}>
          We need camera access to take photos for this exam.
        </Text>

        <TouchableOpacity
          style={indexStyles.button}
          onPress={requestCameraPermission}
        >
          <Text style={indexStyles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MAIN SCREEN ---

  return (
    <View style={common.container}>
      <Text style={common.title}>Exam 2 - Camera App</Text>
      <Text style={common.subtitle}>Screen 1: Photo Capture &amp; Storage</Text>

      {/* Camera preview */}
      <View style={indexStyles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={indexStyles.camera}
          facing="back"
          onCameraReady={() => setIsCameraReady(true)}
        />
        {!isCameraReady && (
          <View style={indexStyles.cameraOverlay}>
            <ActivityIndicator size="large" />
            <Text style={common.boxText}>Preparing camera…</Text>
          </View>
        )}
      </View>

      <View style={indexStyles.buttonsRow}>
        {/* Take photo */}
        <TouchableOpacity
          style={[
            indexStyles.button,
            (!isCameraReady || isTakingPhoto) && indexStyles.buttonDisabled,
          ]}
          onPress={handleTakePhoto}
          disabled={!isCameraReady || isTakingPhoto}
        >
          <Text style={indexStyles.buttonText}>
            {isTakingPhoto ? "Taking Photo…" : "Take Photo"}
          </Text>
        </TouchableOpacity>

        {/* View last photo */}
        <TouchableOpacity
          style={[
            indexStyles.secondaryButton,
            !lastPhotoUri && indexStyles.buttonDisabled,
          ]}
          onPress={() => setIsViewingPhoto(true)}
          disabled={!lastPhotoUri}
        >
          <Text
            style={indexStyles.secondaryButtonText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            View Last Photo
          </Text>
        </TouchableOpacity>

        {/* Go to tracking */}
        <Link href="/tracking" asChild>
          <TouchableOpacity style={indexStyles.secondaryButton}>
            <Text style={indexStyles.secondaryButtonText}>Go to Tracking</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Last photo thumbnail */}
      {lastPhotoUri && (
        <View style={indexStyles.thumbnailContainer}>
          <Text style={common.subtitle}>Last captured photo</Text>
          <Image source={{ uri: lastPhotoUri }} style={indexStyles.thumbnail} />
        </View>
      )}

      {/* Full-screen last photo viewer */}
      <Modal
        visible={isViewingPhoto}
        transparent
        animationType="slide"
        onRequestClose={() => setIsViewingPhoto(false)}
      >
        <View style={indexStyles.modalBackdrop}>
          <View style={indexStyles.modalContent}>
            {lastPhotoUri ? (
              <Image
                source={{ uri: lastPhotoUri }}
                style={indexStyles.modalImage}
              />
            ) : (
              <Text style={common.boxText}>No photo available.</Text>
            )}

            <TouchableOpacity
              style={indexStyles.modalCloseButton}
              onPress={() => setIsViewingPhoto(false)}
            >
              <Text style={indexStyles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Media warning (Expo Go limitation) */}
      {mediaError && (
        <Text
          style={[common.footerText, { textAlign: "center", marginBottom: 8 }]}
        >
          {mediaError}
        </Text>
      )}

      {/* Footer */}
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
