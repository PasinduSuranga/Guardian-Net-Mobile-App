import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  darkText: "#3A5A5A",
  white: "#FFFFFF",
};

export default function MedicineOrderSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle-outline" size={120} color={colors.darkTeal} />
        </View>
        <Text style={styles.title}>Order Request Sent!</Text>
        <Text style={styles.message}>
          Your order has been sent to the pharmacy. You will receive a
          notification when it is ready for pickup and payment.
        </Text>

        {/* --- THIS IS THE NEW SECTION --- */}
        <View style={styles.deliveryNoteContainer}>
          <Text style={styles.deliveryNote}>
            Note: Delivery options will be available soon. For now, all
            orders are for in-store pickup.
          </Text>
        </View>
        {/* ----------------------------- */}

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.replace("/(tabs)/notifications")}
        >
          <Text style={styles.buttonText}>View My Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.replace("/(tabs)/home")}
        >
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
    marginBottom: 30, // 👈 Reduced margin
  },
  // --- ADDED NEW STYLES ---
  deliveryNoteContainer: {
    backgroundColor: 'rgba(111, 173, 176, 0.2)', // lightTeal with opacity
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  deliveryNote: {
    fontSize: 14,
    color: colors.darkText,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  // -------------------------
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