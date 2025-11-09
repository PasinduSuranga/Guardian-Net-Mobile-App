import { useLocalSearchParams, useRouter } from "expo-router"; // 👈 ADDED
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  warmGold: "#D4B25E",
  darkText: "#3A5A5A",
  lightGray: "#CBCAC8",
  white: "#FFFFFF",
};

// --- ADDED MOCK DATA (to find the caregiver) ---
const allCaregivers = [
  { id: "600000000000000000000001", name: "Mr. Kamil Perera", rating: 4.8, age: 32, contact: "0718746267", location: "Nugegoda", area: "Embuldeniya", gender: "Male", languages: ["Sinhala", "English"], careType: ["Home care"], availability: [] },
  { id: "600000000000000000000002", name: "Lexa", rating: 4.4, age: 29, contact: "0717556517", location: "General Hospital, Colombo", area: "Colombo 10", gender: "Female", languages: ["English"], careType: ["Hospital care"], availability: [] },
  { id: "600000000000000000000003", name: "Latha", rating: 4.0, age: 30, contact: "0711111111", location: "Grandpass", area: "Colombo 14", gender: "Female", languages: ["Sinhala", "Tamil"], careType: ["Home care", "Hospital care"], availability: [] },
  { id: "600000000000000000000004", name: "Renuka", rating: 3.4, age: 34, contact: "0712223334", location: "Kelaniya", area: "Kiribathgoda", gender: "Female", languages: ["Sinhala"], careType: ["Home care"], availability: [] },
];
type Caregiver = (typeof allCaregivers)[0];
// ---------------------------------------------

const CaregiverProfileScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // 👈 Get the ID from the URL

  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);

  useEffect(() => {
    // Find the caregiver from the mock data
    const caregiverId = Array.isArray(id) ? id[0] : id;
    if (caregiverId) {
      const foundCaregiver = allCaregivers.find(c => c.id === caregiverId);
      if (foundCaregiver) {
        setCaregiver(foundCaregiver);
      }
    }
  }, [id]);

  const handleBookNow = () => {
    if (!caregiver) return; // Don't do anything if no caregiver
    // Navigate to the booking screen with the correct ID
    router.push(`/caregiverBooking/${caregiver.id}`);
  };

  // Show a loading state while fetching
  if (!caregiver) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Caregiver Profile</Text>
        </View>
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color={colors.primaryTeal} />
      </View>
    );
  }

  // --- Main View ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Caregiver Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileCenter}>
            <Image
               // change path to your image
              style={styles.profileImage}
            />
            {/* --- UPDATED --- */}
            <Text style={styles.name}>{caregiver.name}</Text>
            <Text style={styles.rating}>⭐ {caregiver.rating} (127 reviews)</Text>
            {/* ------------- */}

            <View style={styles.availabilityTag}>
              <Text style={styles.availabilityText}>Available Now</Text>
            </View>
          </View>

          {/* Professional Details */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Professional Details</Text>
            <Text style={styles.text}>
              {/* This data is still static, you can make it dynamic later */}
              Experience: 6 years in hospital care{"\n"}
              Certification: Certified Nursing Assistant{"\n"}
              Languages: {caregiver.languages.join(", ")}{"\n"}
              Specialization: Elderly Care, Surgery Support{"\n"}
              Age: {caregiver.age} years
            </Text>
          </View>
        </View>

        {/* Service Packages */}
        <Text style={styles.sectionHeader}>Service Packages</Text>

        <View style={styles.serviceCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.boldText}>Full Day Care</Text>
            <Text style={styles.boldText}>Rs. 3,500</Text>
          </View>
          <Text style={styles.text}>8 hours of dedicated care (8 AM - 4 PM)</Text>
          <Text style={styles.text}>
            • Personal assistance and companionship{"\n"}
            • Medication reminders{"\n"}
            • Regular updates to family{"\n"}
            • Emergency contact support
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.boldText}>Half Day Care</Text>
            <Text style={styles.boldText}>Rs. 1,500</Text>
          </View>
          <Text style={styles.text}>4 hours of flexible timing</Text>
          <Text style={styles.text}>
            • Basic assistance{"\n"}
            • Meal support{"\n"}
            • Family updates
          </Text>
        </View>

        {/* Reviews */}
        <Text style={styles.sectionHeader}>Recent Reviews</Text>

        <View style={styles.reviewCard}>
          <Text style={styles.text}>⭐⭐⭐⭐⭐ Excellent care for my mother!</Text>
          <Text style={styles.smallText}>2 days ago</Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.text}>⭐⭐⭐⭐⭐ Highly recommended! Great communication.</Text>
          <Text style={styles.smallText}>1 week ago</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {/* Removed Message Button */}

          {/* --- UPDATED --- */}
          <TouchableOpacity 
            style={styles.solidButton}
            onPress={handleBookNow}
          >
            <Text style={styles.solidButtonText}>Book Now</Text>
          </TouchableOpacity>
          {/* ------------- */}
        </View>
      </ScrollView>
    </View>
  );
};

export default CaregiverProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 45,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: colors.lightTeal,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  profileCenter: {
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: colors.lightGray, // Placeholder
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.darkText,
  },
  rating: {
    color: colors.darkText,
  },
  availabilityTag: {
    backgroundColor: colors.warmGold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 5,
  },
  availabilityText: {
    color: colors.white,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: colors.darkText,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkText,
    marginBottom: 8,
  },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: colors.darkText,
  },
  text: {
    color: colors.darkText,
    lineHeight: 20,
  },
  smallText: {
    color: colors.darkText,
    fontSize: 12,
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: colors.lightTeal,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  solidButton: {
    flex: 1,
    backgroundColor: colors.primaryTeal,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  solidButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});