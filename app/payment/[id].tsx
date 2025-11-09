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
}

export default function PaymentScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { id } = useLocalSearchParams(); // This is the BOOKING ID

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [minimumAdvance, setMinimumAdvance] = useState(0);
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
        // Calculate and set minimum advance
        setMinimumAdvance(Math.ceil(bookingData.totalPrice / 3)); 

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
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      console.error("Failed to pick file:", err);
      Alert.alert("Error", "Could not open file selector.");
    }
  };

  // --- Form Submit Handler ---
  const handleSubmitPayment = async () => {
    if (!file) { 
      Alert.alert("Error", "Please upload a payment receipt screenshot or PDF.");
      return;
    }
    if (!booking) {
      Alert.alert("Error", "Booking details not found.");
      return;
    }

    setSubmitting(true);
    const bookingId = booking._id;
    const authConfig = { headers: { Authorization: `Bearer ${session}` } };
    const contentType = file.mimeType || 'application/octet-stream'; 

    try {
      // --- STAGE 1: Get Presigned URL ---
      const { data: urlData } = await axios.post(
        `${API_URL}/api/bookings/${bookingId}/payment-url`,
        { contentType: contentType }, 
        authConfig
      );
      const { uploadUrl, fileUrl } = urlData;

      // --- STAGE 2: Upload Image to R2 ---
      const response = await fetch(file.uri); 
      const blob = await response.blob();
      
      const r2Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': contentType }, 
      });

      if (!r2Response.ok) {
        throw new Error("Failed to upload receipt to cloud.");
      }

      // --- STAGE 3: Submit Advance to Backend ---
      const submissionData = {
        paymentReceiptUrl: fileUrl,
        amountPaid: minimumAdvance,
      };

      await axios.put(
        `${API_URL}/api/bookings/${bookingId}/submit-advance`,
        submissionData,
        authConfig
      );

      // --- THIS IS THE FIX ---
      // 4. Navigate to pending screen with 'params' (not 'query')
      router.replace({
        pathname: "/paymentPending",
        params: { type: 'advance' } // 👈 It should be 'params'
      });
      // -----------------------

    } catch (err: any) {
      console.error("Payment failed:", err.response?.data?.message || err.message);
      Alert.alert("Error", "Payment submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Loading ---
  if (loading || !booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryTeal} />
        </View>
      </SafeAreaView>
    );
  }

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Complete Your Payment</Text>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Booking Price:</Text>
          <Text style={styles.totalPrice}>Rs. {booking.totalPrice.toLocaleString()}</Text>
          <View style={styles.divider} />
          <Text style={styles.advanceLabel}>Minimum Advance Required (1/3):</Text>
          <Text style={styles.advancePrice}>Rs. {minimumAdvance.toLocaleString()}</Text>
        </View>

        {/* Instructions Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Instructions</Text>
          <Text style={styles.infoText}>
            • A minimum advance of <Text style={styles.bold}>Rs. {minimumAdvance.toLocaleString()}</Text> must be paid to confirm your booking.
          </Text>
          <Text style={styles.infoText}>
            • Please use Bank Transfer or Bank Deposit for this advance payment.
          </Text>
          <Text style={styles.infoText}>
            • The remaining balance can be settled in cash or via bank transfer at the end of the job.
          </Text>
          <Text style={styles.infoTitle}>Bank Details:</Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Bank:</Text> Commercial Bank
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Account:</Text> 1000 123 456
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Name:</Text> Guardian Net (Pvt) Ltd
          </Text>
        </View>

        {/* Upload Card */}
        <View style={styles.uploadCard}>
          <Text style={styles.infoTitle}>Upload Receipt</Text>
          <Text style={styles.infoText}>
            After making the deposit, please upload a pdf or photo of your receipt.
          </Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={pickFile}> 
            <Ionicons name="cloud-upload-outline" size={24} color={colors.darkTeal} />
            <Text style={styles.uploadButtonText}>
              {file ? "Change File" : "Select File"} 
            </Text>
          </TouchableOpacity>

          {/* Conditional Preview */}
          {file && (
            <View style={styles.imagePreviewContainer}>
              {file.mimeType?.startsWith("image/") ? (
                // Show image preview
                <Image source={{ uri: file.uri }} style={styles.imagePreview} />
              ) : (
                // Show PDF/File preview
                <View style={[styles.imagePreview, styles.filePreview]}>
                  <Ionicons name="document-text-outline" size={40} color={colors.darkText} />
                </View>
              )}
              <Text style={styles.imageText}>{file.name}</Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.button, (!file || submitting) && styles.buttonDisabled]} 
          onPress={handleSubmitPayment} 
          disabled={!file || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Submit Advance Payment</Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginVertical: 10,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lightTeal,
    marginVertical: 10,
  },
  advanceLabel: {
    fontSize: 15,
    color: colors.darkText,
    fontWeight: '600',
  },
  advancePrice: {
    fontSize: 24,
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
});