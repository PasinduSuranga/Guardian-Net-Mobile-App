import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../AuthContext/AuthContext";

const API_URL = "http://192.168.43.117:5000"; // Your API URL

const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  darkText: "#3A5A5A",
  white: "#FFFFFF",
  successGreen: "#4CAF50",
  successBackground: "rgba(106, 190, 131, 0.2)",
  gold: "#D4B25E",     // 👈 ADDED
  lightTeal: "#A8D1D1", // 👈 ADDED
};

// --- ADDED MOCK DATA (to find the caregiver) ---
const allCaregivers = [
  { id: "600000000000000000000001", name: "Kamal Perera", rating: 4.8, age: 32, contact: "0718746267", location: "Nugegoda", area: "Embuldeniya", gender: "Male", languages: ["Sinhala", "English"], careType: ["Home care"], availability: [] },
  { id: "600000000000000000000002", name: "Lexa", rating: 4.4, age: 29, contact: "0717556517", location: "General Hospital, Colombo", area: "Colombo 10", gender: "Female", languages: ["English"], careType: ["Hospital care"], availability: [] },
  { id: "600000000000000000000003", name: "Latha", rating: 4.0, age: 30, contact: "0711111111", location: "Grandpass", area: "Colombo 14", gender: "Female", languages: ["Sinhala", "Tamil"], careType: ["Home care", "Hospital care"], availability: [] },
  { id: "600000000000000000000004", name: "Renuka", rating: 3.4, age: 34, contact: "0712223334", location: "Kelaniya", area: "Kiribathgoda", gender: "Female", languages: ["Sinhala"], careType: ["Home care"], availability: [] },
];
type Caregiver = (typeof allCaregivers)[0];
// ---------------------------------------------

interface Booking {
  _id: string;
  // --- THIS IS THE FIX (Part 1) ---
  // The caregiver field is a string ID from the backend
  caregiver: string; 
  // --------------------------------
  status: string;
  // ... other fields
}

export default function BookingSuccessfulScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // This is the BOOKING ID
  const { session } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null); // 👈 ADDED
  const [loading, setLoading] = useState(true);

  // --- All animations from your original file ---
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [checkmarkAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fetch booking details
    const fetchBooking = async () => {
      const bookingId = Array.isArray(id) ? id[0] : id;
      if (!bookingId || !session) return;

      try {
        const authConfig = { headers: { Authorization: `Bearer ${session}` } };
        // 1. Fetch the booking
        const response = await axios.get(`${API_URL}/api/bookings/${bookingId}`, authConfig);
        const bookingData: Booking = response.data;
        setBooking(bookingData);

        // --- THIS IS THE FIX (Part 2) ---
        // 2. Use the caregiver ID from the booking to find the caregiver
        const foundCaregiver = allCaregivers.find(c => c.id === bookingData.caregiver);
        
        if (foundCaregiver) {
          // 3. Set the found caregiver to state
          setCaregiver(foundCaregiver);
        } else {
          console.error("Could not find caregiver in mock data for ID:", bookingData.caregiver);
        }
        // --------------------------------

      } catch (err: any) {
        console.error("Failed to fetch booking:", err.message);
        Alert.alert("Error", "Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();

    // --- Start animations ---
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.timing(checkmarkAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [id, session]);

  const rotateInterpolate = checkmarkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });

  // --- Button Handlers ---
  const bookingId = Array.isArray(id) ? id[0] : id;

  const handleProceedToPayment = () => {
    // Navigate to your payment screen, passing the booking ID
    router.push(`/payment/${bookingId}`);
  };

  const handleViewDetails = () => {
    // Navigate to the "edit" screen we built
    router.push(`/editBooking/${bookingId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primaryTeal} />
        <Text style={{ color: colors.darkText, marginTop: 10 }}>Loading Confirmation...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.iconContainer}>
        <Animated.Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png" }}
          style={[
            styles.image,
            { transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }] },
          ]}
        />
      </View>

      <Text style={styles.title}>Booking Confirmed!</Text>

      <View style={styles.statusBadge}>
        <View style={styles.successDot} />
        <Text style={styles.statusText}>Accepted by Caregiver</Text>
      </View>

      <Text style={styles.message}>
        Your request has been accepted.{"\n"}
        Please review your booking details and complete payment.
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👤</Text>
          <View>
            <Text style={styles.infoLabel}>Caregiver Assigned</Text>
            {/* --- THIS IS THE FIX (Part 3) --- */}
            <Text style={styles.infoValue}>
              {caregiver?.name || 'Professional Caregiver'}
            </Text>
            {/* ------------------------------- */}
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏰</Text>
          <View>
            <Text style={styles.infoLabel}>Next Step</Text>
            <Text style={styles.infoValue}>Complete Payment</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleProceedToPayment} // 👈 WIRED UP
        >
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={handleViewDetails} // 👈 WIRED UP
        >
          <Text style={styles.secondaryButtonText}>View Full Details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.helpLink}>
        <Text style={styles.helpText}>Questions? Contact Support</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// --- Styles (from your original file, with color variable updates) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8D1D1",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    backgroundColor: "rgba(111, 173, 176, 0.2)",
    borderRadius: 70,
    padding: 15,
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    tintColor: "#6FADB0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginBottom: 12,
    textAlign: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  successDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.successGreen,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#3A5A5A",
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    color: "#3A5A5A",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#3A5A5A",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
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
    width: "90%",
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6FADB0",
    width: "90%",
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