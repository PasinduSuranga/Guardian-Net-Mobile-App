import { useLocalSearchParams, useRouter } from "expo-router"; // 👈 ADDED
import React, { useEffect, useState } from "react";
import {
    Animated, // 👈 REMOVED Image, we use Animated.Image
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function BookingPendingScreen({ }) {
  const router = useRouter(); // 👈 ADDED
  const { id } = useLocalSearchParams(); // 👈 ADDED - This gets the booking ID from the URL

  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [dots, setDots] = useState("");

  // Pulse animation for the image
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animated dots for "processing" effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // --- ADDED Button Handlers ---
  const handleBackToHome = () => {
    // We use 'replace' to clear the stack, so the user can't go "back"
    router.replace("/(tabs)/home");
  };

  const handleViewBooking = () => {
    // This will navigate to the "edit" screen for this specific booking
    // This assumes your file is at `app/editBooking/[id].tsx`
    const bookingId = Array.isArray(id) ? id[0] : id;
    router.push(`/editBooking/${bookingId}`);
  };
  // ---------------------------

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        }}
        style={[
          styles.image,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      <Text style={styles.title}>Booking Request Sent!</Text>

      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Processing{dots}</Text>
      </View>

      <Text style={styles.message}>
        Your booking request has been submitted.{"\n"}
        A qualified caregiver will review and confirm your appointment shortly.
      </Text>

      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>⏱️ Estimated response time:</Text>
        <Text style={styles.time}>5–15 minutes</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleBackToHome} // 👈 WIRED UP
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={handleViewBooking} // 👈 WIRED UP
        >
          <Text style={styles.secondaryButtonText}>View Booking Details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.helpLink}>
        <Text style={styles.helpText}>Need help? Contact Support</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8D1D1",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: "#6FADB0",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginBottom: 15,
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(111, 173, 176, 0.2)",
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D4B25E",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#3A5A5A",
    fontWeight: "600",
    minWidth: 90,
  },
  message: {
    fontSize: 16,
    color: "#3A5A5A",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  timeContainer: {
    backgroundColor: "rgba(212, 178, 94, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 35,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 13,
    color: "#3A5A5A",
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    color: "#D4B25E",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6FADB0",
    width: "85%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#6FADB0",
    fontSize: 15,
    fontWeight: "600",
  },
  helpLink: {
    marginTop: 10,
  },
  helpText: {
    color: "#3A5A5A",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});