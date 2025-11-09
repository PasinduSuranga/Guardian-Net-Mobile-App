import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"; // 👈 ADDED
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  darkText: "#3A5A5A",
  white: "#FFFFFF",
  gold: "#D4B25E",
};

export default function PaymentPendingScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams(); // 👈 ADDED (will be 'advance' or 'final')

  const goToHome = () => {
    router.replace("/(tabs)/home");
  };
  
  const viewBookings = () => {
    // Navigate to the notifications tab
    router.replace("/(tabs)/notifications");
  };

  // --- THIS IS THE FIX ---
  // Conditionally set the text
  const isAdvance = type === 'advance';
  const titleText = isAdvance ? "Advance Payment Submitted!" : "Final Payment Submitted!";
  const messageText = isAdvance 
    ? "Your advance payment receipt has been submitted and is now"
    : "Your final payment receipt has been submitted and is now";
  // -----------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="hourglass-outline" size={120} color={colors.darkTeal} />
        </View>
        <Text style={styles.title}>{titleText}</Text>
        <Text style={styles.message}>
          {messageText}
          <Text style={styles.pendingText}> pending verification</Text>.
          You will receive a final confirmation notification once our team has
          approved the payment.
        </Text>

        <TouchableOpacity style={styles.button} onPress={viewBookings}>
          <Text style={styles.buttonText}>View My Notifications</Text>
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
  pendingText: {
    fontWeight: 'bold',
    color: colors.gold,
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