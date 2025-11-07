import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// GuardianNet Color Palette - Official Brand Colors
const colors = {
  primaryTeal: "#6FADB0",      // Main brand color
  darkTeal: "#4A8F8F",         // Secondary/contrast
  lightTeal: "#A8D1D1",        // Accent/background
  warmGold: "#D4B25E",         // Important highlights
  darkText: "#3A5A5A",         // Primary text
  lightGray: "#CBCAC8",        // Borders/disabled
  white: "#FFFFFF",            // Text on dark & backgrounds
  urgentRed: "#E57373",        // For urgency indicators
  mediumYellow: "#FFD54F",     // For medium urgency
  lowGreen: "#81C784",         // For low urgency
};

const FindMedicineScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [brandName, setBrandName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantityNeeded, setQuantityNeeded] = useState("");
  const [urgency, setUrgency] = useState("");
  const [location, setLocation] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [includeDelivery, setIncludeDelivery] = useState(false);

  const validateForm = () => {
    if (!searchQuery.trim()) {
      Alert.alert("Validation Error", "Please enter medicine name");
      return false;
    }
    if (!quantityNeeded.trim()) {
      Alert.alert("Validation Error", "Please enter quantity needed");
      return false;
    }
    if (!urgency) {
      Alert.alert("Validation Error", "Please select urgency level");
      return false;
    }
    if (!location.trim()) {
      Alert.alert("Validation Error", "Please enter your location");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log({
      searchQuery,
      brandName,
      dosage,
      quantityNeeded,
      urgency,
      location,
      additionalNotes,
      includeDelivery,
    });

    Alert.alert(
      "Success",
      "Request sent to pharmacies successfully!",
      [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setSearchQuery("");
            setBrandName("");
            setDosage("");
            setQuantityNeeded("");
            setUrgency("");
            setLocation("");
            setAdditionalNotes("");
            setIncludeDelivery(false);
          },
        },
      ]
    );
  };

  const urgencyOptions = [
    { value: "urgent", label: "URGENT", sublabel: "Need today", color: colors.urgentRed },
    { value: "medium", label: "MEDIUM", sublabel: "2-3 days", color: colors.mediumYellow },
    { value: "low", label: "LOW", sublabel: "Within week", color: colors.lowGreen },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter medicine name"
              placeholderTextColor={colors.darkText + "80"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
            />
          </View>

          {/* Medicine Details */}
          <Text style={styles.sectionTitle}>Medicine Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand name (if specific)"
            placeholderTextColor={colors.darkText + "80"}
            value={brandName}
            onChangeText={setBrandName}
            autoCapitalize="words"
          />

          {/* Dosage */}
          <Text style={styles.sectionTitle}>Dosage</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 500mg"
            placeholderTextColor={colors.darkText + "80"}
            value={dosage}
            onChangeText={setDosage}
          />

          {/* Quantity Needed */}
          <Text style={styles.sectionTitle}>Quantity Needed</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 20 tablets"
            placeholderTextColor={colors.darkText + "80"}
            value={quantityNeeded}
            onChangeText={setQuantityNeeded}
          />

          {/* Urgency Level */}
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <View style={styles.urgencyContainer}>
            {urgencyOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyButton,
                  { backgroundColor: option.color },
                  urgency === option.value && styles.selectedButton,
                ]}
                onPress={() => setUrgency(option.value)}
                activeOpacity={0.7}
              >
                <Text style={styles.urgencyLabel}>{option.label}</Text>
                <Text style={styles.urgencySublabel}>{option.sublabel}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Your Location */}
          <Text style={styles.sectionTitle}>Your Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor={colors.darkText + "80"}
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
          />

          {/* Additional Notes */}
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any additional information..."
            placeholderTextColor={colors.darkText + "80"}
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Delivery Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIncludeDelivery(!includeDelivery)}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {includeDelivery && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.checkboxLabel}>
              Include delivery option (additional charges apply)
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Send Request to Pharmacies</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FindMedicineScreen;

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
    marginBottom: 20,
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
  urgencyContainer: {
    flexDirection: "column",
    gap: 12,
    marginVertical: 10,
  },
  urgencyButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  urgencyLabel: {
    color: colors.darkText,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  urgencySublabel: {
    color: colors.darkText,
    fontSize: 13,
    fontWeight: "500",
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: colors.darkTeal,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.darkTeal,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: colors.darkTeal,
    borderRadius: 2,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.darkText,
  },
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
  submitText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});