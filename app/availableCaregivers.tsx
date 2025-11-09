import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 👈 ADDED for navigation
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Colors ---
const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  gold: "#D4B25E",
  darkText: "#3A5A5A",
  lightGray: "#CBCAC8",
  white: "#FFFFFF",
  lightBackground: "#A8D1D133",
  cardBackground: "#A8D1D1",
};

// --- THIS IS THE FIX ---
// This data must match the data in your booking screen.
// The `id` is now a 24-character string.
const allCaregivers = [
  {
    id: "600000000000000000000001",
    name: "Kamal Perera",
    rating: 4.8,
    age: 32,
    contact: "0718746267",
    location: "Nugegoda",
    area: "Embuldeniya",
    gender: "Male",
    languages: ["Sinhala", "English"],
    careType: ["Home care"],
    availability: [
      { from: "2025-11-10", to: "2025-11-20" },
      { from: "2025-12-01", to: "2025-12-15" },
    ],
  },
  {
    id: "600000000000000000000002",
    name: "Lexa",
    rating: 4.4,
    age: 29,
    contact: "0717556517",
    location: "General Hospital, Colombo",
    area: "Colombo 10",
    gender: "Female",
    languages: ["English"],
    careType: ["Hospital care"],
    availability: [
      { from: "2025-11-15", to: "2025-11-30" },
    ],
  },
  {
    id: "600000000000000000000003",
    name: "Latha",
    rating: 4.0,
    age: 30,
    contact: "0711111111",
    location: "Grandpass",
    area: "Colombo 14",
    gender: "Female",
    languages: ["Sinhala", "Tamil"],
    careType: ["Home care", "Hospital care"],
    availability: [
      { from: "2025-11-01", to: "2025-12-01" },
    ],
  },
  {
    id: "600000000000000000000004",
    name: "Renuka",
    rating: 3.4,
    age: 34,
    contact: "0712223334",
    location: "Kelaniya",
    area: "Kiribathgoda",
    gender: "Female",
    languages: ["Sinhala"],
    careType: ["Home care"],
    availability: [
      { from: "2025-11-25", to: "2025-12-10" },
    ],
  },
];
// -------------------------

export default function CaregiverFinderScreen() {
  const router = useRouter(); // 👈 ADDED for navigation

  // --- State for all filters ---
  const [careType, setCareType] = useState("Home care");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("Any");
  const [languages, setLanguages] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // --- Live filtering logic ---
  const filteredCaregivers = useMemo(() => {
    let userStartDate: Date | null = null;
    let userEndDate: Date | null = null;
    try {
      if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        userStartDate = new Date(startDate);
      }
      if (endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        userEndDate = new Date(endDate);
      }
    } catch (e) {
      console.error("Invalid date string:", e);
    }

    return allCaregivers.filter((cg) => {
      // 1. Filter by Care Type
      if (!cg.careType.includes(careType)) {
        return false;
      }

      // 2. Filter by Gender
      if (gender !== "Any" && cg.gender !== gender) {
        return false;
      }

      // 3. Filter by Location/Area
      if (location.trim()) {
        const searchTerm = location.toLowerCase();
        const matchesLocation = cg.location.toLowerCase().includes(searchTerm);
        const matchesArea = cg.area.toLowerCase().includes(searchTerm);
        if (!matchesLocation && !matchesArea) {
          return false;
        }
      }

      // 4. Filter by Languages
      if (
        languages.length > 0 &&
        !languages.every((lang) => cg.languages.includes(lang))
      ) {
        return false;
      }
      
      // 5. Filter by Date Availability
      if (userStartDate && userEndDate) {
        const hasOverlap = cg.availability.some((slot) => {
          const slotStart = new Date(slot.from);
          const slotEnd = new Date(slot.to);
          return slotStart <= userEndDate! && slotEnd >= userStartDate!;
        });
        if (!hasOverlap) {
          return false;
        }
      }
      return true;
    });
  }, [careType, location, gender, languages, startDate, endDate]);

  
  // --- Navigation Handlers ---
  const handleViewProfile = (caregiverId: string) => {
  // Use a template literal (backticks ``) to insert the ID
  router.push(`/caregiverProfile/${caregiverId}`);
  };

  const handleBookNow = (caregiverId: string) => { // 👈 Changed to string
    // This path MUST match your file structure
    router.push(`/caregiverBooking/${caregiverId}`);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Find a Caregiver</Text>

        {/* --- Filters Section --- */}
        <View style={styles.filterContainer}>
          {/* Care Type */}
          <Text style={styles.label}>What type of care do you need?</Text>
          <View style={styles.optionBox}>
            {["Home care", "Hospital care"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  careType === type && styles.optionSelected,
                ]}
                onPress={() => setCareType(type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    careType === type && { color: colors.white },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location */}
          <Text style={styles.label}>
            {careType === "Home care" ? "District / Area" : "Hospital / Location"}
          </Text>
          <TextInput
            placeholder={
              careType === "Home care"
                ? "e.g., Nugegoda or Embuldeniya"
                : "e.g., General Hospital, Colombo"
            }
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
          
          {/* Date Filters */}
          <View style={styles.dateRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                placeholder="YYYY-MM-DD"
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          {/* Gender */}
          <Text style={styles.label}>Caregiver Gender</Text>
          <View style={styles.optionBox}>
            {["Any", "Male", "Female"].map((gen) => (
              <TouchableOpacity
                key={gen}
                style={[
                  styles.optionButton,
                  gender === gen && styles.optionSelected,
                ]}
                onPress={() => setGender(gen)}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === gen && { color: colors.white },
                  ]}
                >
                  {gen}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Languages */}
          <Text style={styles.label}>Languages Spoken</Text>
          <View style={styles.optionBox}>
            {["Sinhala", "English", "Tamil"].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.optionButton,
                  languages.includes(lang) && styles.optionSelected,
                ]}
                onPress={() => toggleLanguage(lang)}
              >
                <Text
                  style={[
                    styles.optionText,
                    languages.includes(lang) && { color: colors.white },
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- Results Section --- */}
        <View style={styles.resultsHeaderBox}>
          <Text style={styles.resultsHeaderText}>Available Caregivers</Text>
          <Text style={styles.resultsCount}>
            {filteredCaregivers.length} found
          </Text>
        </View>

        {filteredCaregivers.length === 0 ? (
          <Text style={styles.noResultsText}>
            No caregivers match your filters. Try widening your search.
          </Text>
        ) : (
          // --- UPDATED CARD LISTING ---
          filteredCaregivers.map((cg) => (
            <View key={cg.id} style={styles.card}>
              {/* Simplified Details */}
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{cg.name}</Text>
                <Text style={styles.rating}>
                  {cg.rating} <Ionicons name="star" size={16} color="#D4B25E" />
                </Text>
              </View>
              
              {/* New Button Row */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cardButtonSecondary}
                  onPress={() => handleViewProfile(cg.id)} // 👈 Now sends string
                >
                  <Text style={styles.cardButtonSecondaryText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cardButtonPrimary}
                  onPress={() => handleBookNow(cg.id)} // 👈 Now sends string
                >
                  <Text style={styles.cardButtonPrimaryText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Combined Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primaryTeal,
  },
  filterContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
    color: colors.darkText,
  },
  input: {
    backgroundColor: colors.lightBackground,
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    color: colors.darkText,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInputContainer: {
    flex: 1,
    marginRight: 5, // Added margin
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
  resultsHeaderBox: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultsHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 30,
    padding: 10,
    fontSize: 15,
    color: colors.darkText,
    fontStyle: "italic",
    backgroundColor: colors.lightBackground,
    borderRadius: 10,
  },
  card: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.primaryTeal,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.darkText,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.darkText,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cardButtonSecondary: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.darkTeal,
    marginRight: 10,
  },
  cardButtonSecondaryText: {
    color: colors.darkTeal,
    fontWeight: "bold",
    fontSize: 14,
  },
  cardButtonPrimary: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.darkTeal,
  },
  cardButtonPrimaryText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});