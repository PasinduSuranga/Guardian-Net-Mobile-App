import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// GuardianNet color palette
const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  warmGold: "#D4B25E",
  darkText: "#3A5A5A",
  lightGray: "#CBCAC8",
  white: "#FFFFFF",
  lightBg: "#F5F5F5",
};

const MedicineDetailsScreen = ({ navigation, route }: any) => {
  const pharmacyName = route?.params?.pharmacyName || "City Pharmacy - Colombo 03";
  
  const medicineData = {
    manufacturer: "Pfizer Ltd.",
    packSize: "10 tablets",
    batchNumber: "BN2024X5678",
    expiryDate: "12/2025",
    storage: "Refrigerated 2-8°C",
  };

  const pricingData = {
    unitPrice: "Rs. 450.00",
    quantityAvailable: "45 units",
    reservedUntil: "Today 5:30 PM",
  };

  const pharmacyInfo = {
    licensedPharmacist: "Dr. A. Perera",
    licenseNumber: "PH/2018/1234",
    operatingHours: "8:00 AM - 10:00 PM",
    contact: "+94 11 234 5678",
  };

  const importantNotes = [
    "Prescription required for purchase",
    "Cold chain maintained during delivery",
    "Money returned once purchased",
    "Insurance coverage may apply",
  ];

  const handleContactPharmacy = () => {
    console.log("Contact Pharmacy");
    // Add phone call or messaging functionality
  };

  const handleProceedToOrder = () => {
    navigation.navigate("confirmedbooking", {
      pharmacyName,
      medicineData,
      pricingData,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Medicine Details</Text>
          <Text style={styles.headerSubtitle}>{pharmacyName}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Medicine Image Placeholder */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageIcon}>💊</Text>
          </View>

          {/* Medicine Information */}
          <View style={styles.section}>
            <InfoRow label="Manufacturer:" value={medicineData.manufacturer} />
            <InfoRow label="Pack Size:" value={medicineData.packSize} />
            <InfoRow label="Batch Number:" value={medicineData.batchNumber} />
            <InfoRow label="Expiry Date:" value={medicineData.expiryDate} />
            <InfoRow label="Storage:" value={medicineData.storage} />
          </View>

          {/* Pricing & Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing & Availability</Text>
            <InfoRow label="Unit Price:" value={pricingData.unitPrice} />
            <InfoRow label="Quantity Available:" value={pricingData.quantityAvailable} />
            <InfoRow label="Reserved Until:" value={pricingData.reservedUntil} highlight />
          </View>

          {/* Pharmacy Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pharmacy Information</Text>
            <InfoRow label="Licensed Pharmacist:" value={pharmacyInfo.licensedPharmacist} />
            <InfoRow label="License Number:" value={pharmacyInfo.licenseNumber} />
            <InfoRow label="Operating Hours:" value={pharmacyInfo.operatingHours} />
            <InfoRow label="Contact:" value={pharmacyInfo.contact} />
          </View>

          {/* Important Notes */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.notesTitle}>Important Notes</Text>
            </View>
            {importantNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactPharmacy}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>Contact Pharmacy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceedToOrder}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedButtonText}>Proceed to Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable InfoRow Component
const InfoRow = ({ label, value, highlight = false }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && styles.highlightValue]}>
      {value}
    </Text>
  </View>
);

export default MedicineDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryTeal,
  },
  header: {
    backgroundColor: colors.primaryTeal,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "700",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  container: {
    padding: 16,
  },
  imagePlaceholder: {
    backgroundColor: colors.lightTeal + "40",
    borderRadius: 12,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  imageIcon: {
    fontSize: 80,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.darkText,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray + "50",
  },
  infoLabel: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  highlightValue: {
    color: colors.primaryTeal,
    fontWeight: "700",
  },
  notesSection: {
    backgroundColor: colors.warmGold + "15",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.warmGold + "40",
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.darkText,
  },
  noteItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 5,
  },
  bullet: {
    fontSize: 16,
    color: colors.darkText,
    marginRight: 8,
    fontWeight: "700",
  },
  noteText: {
    fontSize: 13,
    color: colors.darkText,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  contactButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primaryTeal,
  },
  contactButtonText: {
    color: colors.primaryTeal,
    fontSize: 15,
    fontWeight: "700",
  },
  proceedButton: {
    flex: 1,
    backgroundColor: colors.primaryTeal,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: colors.darkTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  proceedButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});