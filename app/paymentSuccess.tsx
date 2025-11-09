import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"; // 👈 ADDED
import React, { useState } from "react"; // 👈 ADDED
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"; // 👈 ADDED
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../AuthContext/AuthContext"; // 👈 ADDED

// ---------------------------------------------------
// This screen now replaces the 'bookingSuccess' screen
// You can delete `app/bookingSuccess/[id].tsx`
// ---------------------------------------------------

const API_URL = "http://192.168.43.117:5000"; // Your API URL

// -----------------------
const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  darkText: "#3A5A5A",
  white: "#FFFFFF",
  gold: "#D4B25E",
  successGreen: "#4CAF50", 
};
// -----------------------

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { session } = useAuth(); // 👈 ADDED
  const { id, type } = useLocalSearchParams(); // 👈 ADDED

  const [loading, setLoading] = useState(false); // 👈 ADDED

  const goToHome = () => {
    router.replace("/(tabs)/home");
  };
  
  const viewBookings = () => {
    // Navigate to the notifications tab
    router.replace("/(tabs)/notifications");
  };
  
  const handleViewDetails = () => {
    // Navigate to the "edit" screen
    router.push(`/editBooking/${id}`);
  };

  // --- THIS IS THE FIX ---
  // Conditionally set text based on the 'type' param
  const isAdvanceSuccess = type === 'advance';
  const titleText = isAdvanceSuccess ? "Advance Verified!" : "Payment Complete!";
  const messageText = isAdvanceSuccess 
    ? "Your advance payment has been approved. Your booking is now confirmed and active."
    : "Your final payment has been verified. This booking is now complete. Thank you!";
  // -----------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primaryTeal} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle-outline" size={120} color={colors.successGreen} />
        </View>
        <Text style={styles.title}>{titleText}</Text>
        <Text style={styles.message}>
          {messageText}
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
          <Text style={styles.buttonText}>View Booking Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={goToHome}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 70,
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.darkText,
    textAlign: "center",
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: colors.darkText,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  successText: { // This style is no longer needed but kept
    fontWeight: 'bold',
    color: colors.successGreen,
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: '90%',
    marginBottom: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: '90%',
  },
  secondaryButtonText: {
    color: colors.darkTeal,
    fontSize: 16,
    fontWeight: "bold",
  },
});