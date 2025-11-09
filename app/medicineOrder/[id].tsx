import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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
  darkText: "#3A5A5A",
  white: "#FFFFFF",
  lightBackground: "#A8D1D133",
  cardBackground: "#E0F2F2",
  lightGray: "#CBCAC8",
};

// --- API URL ---
const API_URL = "http://192.168.43.117:5000";

export default function MedicineOrderScreen() {
  const router = useRouter();
  const { session } = useAuth();
  
  // Get all params passed from the previous screen
  const { 
    medicineRequestId, 
    pharmacyId, 
    pharmacyName, 
    price, 
    priceNote 
  } = useLocalSearchParams();

  // --- THIS IS THE FIX (Part 1) ---
  const [quantity, setQuantity] = useState("10"); // Default quantity
  const [quantityUnit, setQuantityUnit] = useState("tablets"); // Default unit
  const [submitting, setSubmitting] = useState(false);
  // ------------------------------

  // Parse price to a number, default to 0
  const pricePerUnit = parseFloat(price as string || '0');

  // --- THIS IS THE FIX (Part 2) ---
  const handleConfirmOrder = async () => {
    if (!session) {
      Alert.alert("Error", "You must be logged in to order.");
      return;
    }

    // Updated validation
    const quantityNum = parseInt(quantity);
    if (!quantity.trim() || isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert("Error", "Please enter a valid quantity number.");
      return;
    }
    
    setSubmitting(true);

    // Updated data object
    const orderData = {
      medicineRequestId,
      pharmacyId,
      pharmacyName,
      price: pricePerUnit,
      quantity: quantityNum,     // 👈 Send as a number
      quantityUnit: quantityUnit, // 👈 Send the selected unit
    };
    // ------------------------------

    try {
      const authConfig = { headers: { Authorization: `Bearer ${session}` } };
      await axios.post(
        `${API_URL}/api/medicine-orders`,
        orderData,
        authConfig
      );

      // Navigate to the success screen
      router.replace("/medicineOrderSuccess");

    } catch (err: any) {
      console.error("Failed to create order:", err.response?.data?.message || err.message);
      Alert.alert("Error", "Failed to create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Place Your Order</Text>

        {/* Pharmacy Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Selected Pharmacy</Text>
          <Text style={styles.pharmacyName}>{pharmacyName}</Text>
          <Text style={styles.price}>Rs. {pricePerUnit.toLocaleString()}</Text>
          <Text style={styles.priceNote}>Price {priceNote}</Text>
        </View>

        {/* --- THIS IS THE FIX (Part 3) --- */}
        {/* Order Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confirm Quantity</Text>
          
          <Text style={styles.label}>Unit</Text>
          <View style={styles.optionBox}>
            {["tablets", "days", "units", "bottles"].map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.optionButton,
                  quantityUnit === unit && styles.optionSelected,
                ]}
                onPress={() => setQuantityUnit(unit)}
              >
                <Text style={[styles.optionText, quantityUnit === unit && { color: colors.white }]}>
                  {/* Capitalize first letter */}
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 20"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>
        {/* ------------------------------ */}


        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.button, submitting && styles.buttonDisabled]} 
          onPress={handleConfirmOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Send Order Request</Text>
          )}
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primaryTeal,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 10,
  },
  pharmacyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginTop: 5,
  },
  priceNote: {
    fontSize: 14,
    color: colors.darkText,
    fontStyle: 'italic',
  },
  label: {
    fontSize: 15,
    color: colors.darkText,
    marginBottom: 10,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: colors.darkText,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  // --- ADDED STYLES ---
  optionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap", // Allow wrapping
    marginVertical: 5,
  },
  optionButton: {
    backgroundColor: colors.lightBackground,
    paddingVertical: 10,
    paddingHorizontal: 15, // Added horizontal padding
    borderRadius: 10,
    margin: 4, // Added margin
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  optionSelected: {
    backgroundColor: colors.primaryTeal,
    borderColor: colors.darkTeal,
  },
  optionText: {
    color: colors.darkText,
    fontWeight: "500",
  },
  // ---------------------
});