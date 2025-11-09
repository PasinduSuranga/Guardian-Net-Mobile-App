import { Ionicons } from "@expo/vector-icons"; // 👈 ADDED
import axios from "axios"; // 👈 ADDED
import * as DocumentPicker from "expo-document-picker"; // 👈 ADDED
import { useRouter } from "expo-router"; // 👈 ADDED
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../AuthContext/AuthContext"; // 👈 ADDED

// --- API URL ---
const API_URL = "http://192.168.43.117:5000"; // 👈 Use your IP

// GuardianNet Color Palette
const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  warmGold: "#D4B25E",
  darkText: "#3A5A5A",
  lightGray: "#CBCAC8",
  white: "#FFFFFF",
  urgentRed: "#E57373",
  mediumYellow: "#FFD54F",
  lowGreen: "#81C784",
  lightBackground: "#A8D1D133", // 👈 ADDED
};

const FindMedicineScreen = () => {
  const router = useRouter(); // 👈 ADDED
  const { session } = useAuth(); // 👈 ADDED

  const [searchQuery, setSearchQuery] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  
  // --- REMOVED other form states ---
  // const [quantityNeeded, setQuantityNeeded] = useState("");
  // const [urgency, setUrgency] = useState("");
  // const [location, setLocation] = useState("");
  // const [includeDelivery, setIncludeDelivery] = useState(false);

  // --- NEW STATE ---
  const [prescription, setPrescription] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  // -----------------

  // --- NEW: File Picker ---
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // Allows images and PDFs
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPrescription(result.assets[0]);
      }
    } catch (err) {
      console.error("Failed to pick file:", err);
      Alert.alert("Error", "Could not open file selector.");
    }
  };

  // --- UPDATED: Validation ---
  const validateForm = () => {
    // This is the new logic
    if (!searchQuery.trim() && !prescription) {
      Alert.alert("Validation Error", "Please enter a medicine name OR upload a prescription");
      return false;
    }
    // All other validation removed
    return true;
  };

  // --- UPDATED: Submit Handler ---
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!session) {
      Alert.alert("Error", "You must be logged in to make a request.");
      return;
    }

    setLoading(true);
    let uploadedPrescriptionUrl: string | null = null;
    const authConfig = { headers: { Authorization: `Bearer ${session}` } };

    try {
      // STAGE 1: Upload prescription if it exists
      if (prescription) {
        const contentType = prescription.mimeType || 'application/octet-stream';
        
        // 1a. Get presigned URL
        const { data: urlData } = await axios.post(
          `${API_URL}/api/medicine-requests/upload-url`,
          { contentType },
          authConfig
        );
        const { uploadUrl, fileUrl } = urlData;

        // 1b. Upload to R2
        const response = await fetch(prescription.uri);
        const blob = await response.blob();
        const r2Response = await fetch(uploadUrl, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': contentType },
        });

        if (!r2Response.ok) {
          throw new Error("Failed to upload prescription.");
        }
        uploadedPrescriptionUrl = fileUrl;
      }

      // STAGE 2: Submit the request to our backend
      // --- THIS IS THE FIX ---
      // Only send the fields that are left
      const requestData = {
        medicineName: searchQuery || null, // Send null if empty
        prescriptionUrl: uploadedPrescriptionUrl,
        additionalNotes,
        // Removed quantity, urgency, location, etc.
      };

      // --- THIS IS THE FIX ---
      // The backend route is '/' not '/add'
      const response = await axios.post(
        `${API_URL}/api/medicine-requests/add`, 
        requestData,
        authConfig
      );
      
      const newRequestId = response.data.request._id; // Get the new ID
      // -----------------------
      
      // STAGE 3: Success
      Alert.alert(
        "Success",
        "Your request has been sent to nearby pharmacies!",
        [
          { text: "OK", onPress: () => {
              // Reset form
              setSearchQuery("");
              setAdditionalNotes("");
              setPrescription(null);
              // --- THIS IS THE FIX ---
              // Navigate to the new pending screen
              router.push(`/medicineRequestPending/${newRequestId}`); 
            },
          },
        ]
      );

    } catch (err: any) {
      console.error("Failed to submit request:", err.response?.data?.message || err.message);
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- REMOVED urgencyOptions ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Search Bar */}
          <Text style={styles.sectionTitle}>Medicine Name *</Text>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter medicine name (if known)"
              placeholderTextColor={colors.darkText + "80"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
            />
          </View>
          
          {/* --- NEW: Prescription Upload --- */}
          <Text style={styles.orText}>— OR —</Text>
          <View style={styles.uploadCard}>
            <Text style={styles.sectionTitle}>Upload Prescription *</Text>
            <Text style={styles.infoText}>
              Upload a photo or PDF of your prescription.
            </Text>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
              <Ionicons name="cloud-upload-outline" size={24} color={colors.darkTeal} />
              <Text style={styles.uploadButtonText}>
                {prescription ? "Change File" : "Select File"}
              </Text>
            </TouchableOpacity>

            {prescription && (
              <View style={styles.imagePreviewContainer}>
                {prescription.mimeType?.startsWith("image/") ? (
                  <Image source={{ uri: prescription.uri }} style={styles.imagePreview} />
                ) : (
                  <View style={[styles.imagePreview, styles.filePreview]}>
                    <Ionicons name="document-text-outline" size={40} color={colors.darkText} />
                  </View>
                )}
                <Text style={styles.imageText}>{prescription.name}</Text>
              </View>
            )}
          </View>
          {/* --------------------------- */}

          {/* --- REMOVED ALL OTHER INPUTS --- */}

          {/* Additional Notes */}
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., 'Need by 5 PM', 'Generic is okay'"
            placeholderTextColor={colors.darkText + "80"}
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* --- REMOVED Delivery Checkbox --- */}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitText}>Send Request to Pharmacies</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FindMedicineScreen;

// --- Styles (with new styles added at the bottom) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.lightTeal + "40",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    // marginTop: 100, // 👈 REMOVED
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.lightTeal,
    shadowColor: colors.darkTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.darkText,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.darkText,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.darkText,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  // --- REMOVED URGENCY STYLES ---
  // --- REMOVED CHECKBOX STYLES ---
  submitButton: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: colors.darkTeal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: { // 👈 ADDED
    backgroundColor: colors.lightGray,
  },
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  
  // --- NEW STYLES FOR UPLOAD ---
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.darkText + '90',
    fontWeight: '600',
    marginVertical: 10,
  },
  uploadCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.lightTeal,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.darkText,
    textAlign: 'center',
    marginBottom: 15,
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
});