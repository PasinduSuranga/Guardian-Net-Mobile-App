import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../AuthContext/AuthContext";

// --- Colors ---
const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  gold: "#D4B25E",
  darkText: "#3A5A5A",
  white: "#FFFFFF",
  lightBackground: "#A8D1D133",
  cardBackground: "#E0F2F2",
  lightGray: "#CBCAC8",
};

// --- API URL ---
const API_URL = "http://192.168.43.117:5000";

interface MedicineRequest {
  _id: string;
  medicineName?: string;
  prescriptionUrl?: string;
  quantityNeeded: string;
  urgency: 'urgent' | 'medium' | 'low';
  location: string;
  additionalNotes?: string;
  includeDelivery: boolean;
  status: 'pending' | 'quoted' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export default function MedicineRequestPendingScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams(); // This `id` is the MedicineRequest ID

  const [request, setRequest] = useState<MedicineRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch EXISTING Request Data On Load ---
  useEffect(() => {
    const requestId = Array.isArray(id) ? id[0] : id;
    if (!requestId || !session) return;

    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const authConfig = { headers: { Authorization: `Bearer ${session}` } };
        const response = await axios.get(`${API_URL}/api/medicine-requests/${requestId}`, authConfig);
        setRequest(response.data);
      } catch (err: any) {
        console.error("Failed to fetch request:", err.response?.data?.message || err.message);
        Alert.alert("Error", "Could not load medicine request details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, session]);

  if (loading || !request) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryTeal} />
          <Text>Loading Request...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="hourglass-outline" size={80} color={colors.darkTeal} />
        </View>
        <Text style={styles.title}>Request Sent!</Text>
        <Text style={styles.message}>
          Your request has been sent to nearby pharmacies. You will receive notifications
          with quotes and updates shortly.
        </Text>

        {/* --- Request Details Card --- */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Your Request Details</Text>
          
          {request.medicineName && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Medicine:</Text>
              <Text style={styles.valueText}>{request.medicineName}</Text>
            </View>
          )}
          
          {request.prescriptionUrl && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Prescription:</Text>
              <Text style={[styles.valueText, styles.linkText]}>View Uploaded File</Text>
            </View>
          )}

          {/* --- REMOVED Quantity, Urgency, and Location --- */}

          {request.additionalNotes && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Notes:</Text>
              <Text style={styles.valueText}>{request.additionalNotes}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: 60,
    backgroundColor: colors.lightBackground,
    padding: 20,
    borderRadius: 60,
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
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightTeal,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
    borderBottomWidth: 1,
    borderColor: colors.lightTeal,
    paddingBottom: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.darkText,
  },
  valueText: {
    fontSize: 15,
    color: colors.darkText,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  linkText: {
    color: colors.primaryTeal,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: '90%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});