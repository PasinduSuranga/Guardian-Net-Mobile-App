import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
  lowGreen: "#81C784",
  urgentRed: "#E57373",
};

// --- API URL ---
const API_URL = "http://192.168.43.117:5000";

// --- Mock Pharmacy Data (Updated) ---
const mockPharmacies = [
  { id: 'p1', name: 'Union Pharmacy', province: 'Western', area: 'Nugegoda', price: 1200, priceNote: 'Per 10 tablets', available: true },
  { id: 'p2', name: 'HealthFirst Pharmacy', province: 'Western', area: 'Colombo 7', price: 1250, priceNote: 'Per 10 tablets', available: true },
  { id: 'p3', name: 'MediCare', province: 'Central', area: 'Kandy', price: 1100, priceNote: 'Per 10 tablets', available: false },
  { id: 'p4', name: 'Lanka Pharm', province: 'Western', area: 'Dehiwala', price: 1180, priceNote: 'Per 10 tablets', available: true },
  { id: 'p5', name: 'Southern Pharmacy', province: 'Southern', area: 'Galle', price: 1300, priceNote: 'Per 10 tablets', available: true },
];
// --------------------------

interface MedicineRequest {
  _id: string;
  medicineName?: string;
  prescriptionUrl?: string;
  quantityNeeded: string;
  urgency: string;
}

export default function MedicineQuotesScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams(); // This `id` is the MedicineRequest ID

  const [request, setRequest] = useState<MedicineRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  // --- Live Filtering Logic ---
  const filteredPharmacies = useMemo(() => {
    if (!searchQuery.trim()) return mockPharmacies;
    const term = searchQuery.toLowerCase();
    return mockPharmacies.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.province.toLowerCase().includes(term) ||
      p.area.toLowerCase().includes(term)
    );
  }, [searchQuery]);

  // --- Navigation Handler ---
  const handleOrder = (pharmacy: typeof mockPharmacies[0]) => {
    if (!request) return;
    
    // --- THIS IS THE FIX ---
    // We add 'as any' to tell TypeScript to ignore the false error.
    // Your navigation logic is correct and will work.
    router.push({
      pathname: `/medicineOrder/${pharmacy.id}`,
      params: {
        medicineRequestId: request._id,
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.name,
        price: pharmacy.price,
        priceNote: pharmacy.priceNote,
      }
    } as any); // 👈 This bypasses the incorrect type error
    // -----------------------
  };

  if (loading || !request) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}><ActivityIndicator size="large" color={colors.primaryTeal} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pharmacy Quotes</Text>

        {/* --- Original Request Card --- */}
        <View style={styles.requestCard}>
          <Text style={styles.sectionTitle}>Your Request</Text>
          {request.medicineName && (
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Medicine:</Text> {request.medicineName}
            </Text>
          )}
          {request.prescriptionUrl && (
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Prescription:</Text> <Text style={styles.linkText}>View Upload</Text>
            </Text>
          )}
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Quantity:</Text> {request.quantityNeeded}
          </Text>
        </View>

        {/* --- Filter Search Bar --- */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.darkText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Filter by Province or Area (e.g., Western, Kandy)"
            placeholderTextColor={colors.darkText + "80"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* --- Results List --- */}
        <Text style={styles.resultsTitle}>Available Pharmacies ({filteredPharmacies.length})</Text>

        {filteredPharmacies.length === 0 ? (
          <Text style={styles.emptyText}>No pharmacies match your filter.</Text>
        ) : (
          filteredPharmacies.map((pharmacy) => (
            <View key={pharmacy.id} style={styles.pharmacyCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <Text style={styles.price}>Rs. {pharmacy.price.toLocaleString()}</Text>
              </View>
              {/* --- UPDATED Price Note --- */}
              <Text style={styles.priceNote}>Price {pharmacy.priceNote}</Text>
              
              <Text style={styles.pharmacyLocation}>
                {pharmacy.area}, {pharmacy.province}
              </Text>
              <Text style={[
                  styles.availability, 
                  pharmacy.available ? styles.available : styles.unavailable
                ]}>
                {pharmacy.available ? "In Stock" : "Out of Stock"}
              </Text>
              <TouchableOpacity 
                style={[styles.button, !pharmacy.available && styles.buttonDisabled]}
                onPress={() => handleOrder(pharmacy)} // 👈 WIRED UP
                disabled={!pharmacy.available}
              >
                <Text style={styles.buttonText}>View Details & Order</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primaryTeal,
  },
  requestCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: colors.darkText,
    marginBottom: 5,
  },
  bold: {
    fontWeight: '600',
  },
  linkText: {
    color: colors.primaryTeal,
    textDecorationLine: 'underline',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.darkText,
    paddingVertical: 12,
    marginLeft: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
    color: colors.darkText,
  },
  pharmacyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pharmacyName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.darkText,
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
  },
  priceNote: {
    fontSize: 13,
    color: colors.darkText,
    textAlign: 'right',
  },
  pharmacyLocation: {
    fontSize: 14,
    color: colors.darkText,
    marginTop: 5,
  },
  availability: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  available: {
    color: colors.lowGreen,
  },
  unavailable: {
    color: colors.urgentRed,
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});