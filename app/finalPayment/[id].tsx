import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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

interface Booking {
  _id: string;
  totalPrice: number;
  advancePaid: number;
}

export default function FinalPaymentScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams(); 

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [remainingBalance, setRemainingBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('bank');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // --- Fetch Booking Data On Load ---
  useEffect(() => {
    const bookingId = Array.isArray(id) ? id[0] : id;
    if (!bookingId || !session) return;

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const authConfig = { headers: { Authorization: `Bearer ${session}` } };
        const response = await axios.get(`${API_URL}/api/bookings/${bookingId}`, authConfig);
        const bookingData: Booking = response.data;
        
        setBooking(bookingData);
        setRemainingBalance(bookingData.totalPrice - bookingData.advancePaid);

      } catch (err: any) {
        console.error("Failed to fetch booking:", err.response?.data?.message || err.message);
        Alert.alert("Error", "Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, session]);

  // --- File Picker ---
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) { console.error("Failed to pick file:", err); }
  };

  // --- Form Submit Handler ---
  const handleSubmitPayment = async () => {
    if (!booking) return;

    setSubmitting(true);
    const bookingId = booking._id;
    const authConfig = { headers: { Authorization: `Bearer ${session}` } };
    let submissionData = {
      paymentMethod,
      paymentReceiptUrl: null, 
    };

    try {
      // --- STAGE 1: Handle Bank Transfer (if selected) ---
      if (paymentMethod === 'bank') {
        if (!file) {
          Alert.alert("Error", "Please upload a receipt for bank transfer.");
          setSubmitting(false);
          return;
        }

        const { data: urlData } = await axios.post(
          `${API_URL}/api/bookings/${bookingId}/payment-url`,
          { contentType: file.mimeType || 'image/jpeg' },
          authConfig
        );
        const { uploadUrl, fileUrl } = urlData;

        const response = await fetch(file.uri);
        const blob = await response.blob();
        const r2Response = await fetch(uploadUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': file.mimeType || 'image/jpeg' },
        });

        if (!r2Response.ok) throw new Error("Failed to upload receipt.");
        
        submissionData.paymentReceiptUrl = fileUrl;
      }
      
      // --- STAGE 2: Submit to Backend (for Cash or Bank) ---
      await axios.put(
        `${API_URL}/api/bookings/${bookingId}/submit-final-payment`,
        submissionData,
        authConfig
      );

      // --- THIS IS THE FIX ---
      // 3. Navigate to pending screen with 'params'
      router.replace({
        pathname: "/paymentPending",
        params: { type: 'final' } // 👈 It should be 'params'
      });
      // -----------------------

    } catch (err: any) {
      console.error("Final payment failed:", err.response?.data?.message || err.message);
      Alert.alert("Error", "Payment submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}><ActivityIndicator size="large" color={colors.primaryTeal} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settle Balance</Text>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Price:</Text>
          <Text style={styles.totalPrice}>Rs. {booking.totalPrice.toLocaleString()}</Text>
          <Text style={styles.detailText}>Advance Paid: - Rs. {booking.advancePaid.toLocaleString()}</Text>
          <View style={styles.divider} />
          <Text style={styles.advanceLabel}>Remaining Balance:</Text>
          <Text style={styles.advancePrice}>Rs. {remainingBalance.toLocaleString()}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Select Payment Method</Text>
          <View style={styles.optionBox}>
            <TouchableOpacity
              style={[styles.optionButton, paymentMethod === 'bank' && styles.optionSelected]}
              onPress={() => setPaymentMethod('bank')}
            >
              <Text style={[styles.optionText, paymentMethod === 'bank' && { color: colors.white }]}>
                Bank Transfer / Deposit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, paymentMethod === 'cash' && styles.optionSelected]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text style={[styles.optionText, paymentMethod === 'cash' && { color: colors.white }]}>
                Pay with Cash
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional Instructions Card */}
        {paymentMethod === 'bank' ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Bank Transfer</Text>
            <Text style={styles.infoText}>
              Please deposit the remaining balance to the account below and upload your receipt.
            </Text>
            <Text style={styles.infoText}><Text style={styles.bold}>Bank:</Text> Commercial Bank</Text>
            <Text style={styles.infoText}><Text style={styles.bold}>Account:</Text> 1000 123 456</Text>
            <Text style={styles.infoText}><Text style={styles.bold}>Name:</Text> Guardian Net (Pvt) Ltd</Text>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Pay with Cash</Text>
            <Text style={styles.infoText}>
              Please hand over the remaining balance of <Text style={styles.bold}>Rs. {remainingBalance.toLocaleString()}</Text> directly to your caregiver.
            </Text>
            <Text style={styles.infoText}>
              Tap "Confirm Cash Payment" below once you have paid. The caregiver will then verify the payment.
            </Text>
          </View>
        )}

        {/* Conditional Upload Card */}
        {paymentMethod === 'bank' && (
          <View style={styles.uploadCard}>
            <Text style={styles.infoTitle}>Upload Final Receipt</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
              <Ionicons name="cloud-upload-outline" size={24} color={colors.darkTeal} />
              <Text style={styles.uploadButtonText}>{file ? "Change File" : "Select File"}</Text>
            </TouchableOpacity>
            {file && (
              <View style={styles.imagePreviewContainer}>
                {file.mimeType?.startsWith("image/") ? (
                  <Image source={{ uri: file.uri }} style={styles.imagePreview} />
                ) : (
                  <View style={[styles.imagePreview, styles.filePreview]}>
                    <Ionicons name="document-text-outline" size={40} color={colors.darkText} />
                  </View>
                )}
                <Text style={styles.imageText}>{file.name}</Text>
              </View>
            )}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            (submitting || (paymentMethod === 'bank' && !file)) && styles.buttonDisabled
          ]} 
          onPress={handleSubmitPayment} 
          disabled={submitting || (paymentMethod === 'bank' && !file)}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>
              {paymentMethod === 'cash' ? "Confirm Cash Payment" : "Submit Bank Receipt"}
            </Text>
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primaryTeal,
  },
  totalCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: colors.darkText,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginVertical: 5,
  },
  detailText: {
    fontSize: 14,
    color: colors.darkText,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lightTeal,
    marginVertical: 10,
  },
  advanceLabel: {
    fontSize: 16,
    color: colors.darkText,
    fontWeight: '600',
  },
  advancePrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: colors.darkText,
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  uploadCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.lightTeal,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBackground,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkTeal,
    marginLeft: 10,
  },
  imagePreviewContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: colors.lightTeal,
    borderWidth: 1,
  },
  filePreview: {
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 12,
    color: colors.darkText,
    marginTop: 5,
    fontStyle: 'italic',
    maxWidth: 150,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
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
  optionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.lightBackground,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
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
});