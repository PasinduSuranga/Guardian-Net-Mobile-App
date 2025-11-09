import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // 👈 ADDED
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../AuthContext/AuthContext"; // 👈 Adjust this path

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
  cardBackground: "#E0F2F2", // A lighter card background
};

// --- ADDED API URL ---
const API_URL = "http://192.168.43.117:5000";

// --- Mock Data ---
// UPDATED with packages
const allCaregivers = [
  { 
    id: "600000000000000000000001", 
    name: "Kamal Perera", 
    rating: 4.8, age: 32, contact: "0718746267", location: "Nugegoda", area: "Embuldeniya", gender: "Male", languages: ["Sinhala", "English"], careType: ["Home care"], availability: [],
    packages: [ // 👈 ADDED
      { name: "Full Day Care", price: 3500 },
      { name: "Half Day Care", price: 1500 },
    ]
  },
  { 
    id: "600000000000000000000002", 
    name: "Lexa", 
    rating: 4.4, age: 29, contact: "0717556517", location: "General Hospital, Colombo", area: "Colombo 10", gender: "Female", languages: ["English"], careType: ["Hospital care"], availability: [],
    packages: [ // 👈 ADDED
      { name: "Full Day Care", price: 4000 },
      { name: "Half Day Care", price: 2000 },
    ]
  },
  { 
    id: "600000000000000000000003", 
    name: "Latha", 
    rating: 4.0, age: 30, contact: "0711111111", location: "Grandpass", area: "Colombo 14", gender: "Female", languages: ["Sinhala", "Tamil"], careType: ["Home care", "Hospital care"], availability: [],
    packages: [ // 👈 ADDED
      { name: "Full Day Care", price: 3500 },
      { name: "Half Day Care", price: 1500 },
    ]
  },
  { 
    id: "600000000000000000000004", 
    name: "Renuka", 
    rating: 3.4, age: 34, contact: "0712223334", location: "Kelaniya", area: "Kiribathgoda", gender: "Female", languages: ["Sinhala"], careType: ["Home care"], availability: [],
    packages: [ // 👈 ADDED
      { name: "Full Day Care", price: 3000 },
      { name: "Half Day Care", price: 1300 },
    ]
  },
];
// -------------------------

// --- Type definition ---
type Caregiver = (typeof allCaregivers)[0];
type Package = (typeof allCaregivers)[0]['packages'][0]; // 👈 ADDED

/**
 * 👩‍⚕️ Guest View: Shows minimal caregiver info
 */
const GuestCaregiverInfo = ({ caregiver }: { caregiver: Caregiver }) => (
  <View style={styles.caregiverCard}>
    <Text style={styles.caregiverName}>{caregiver.name}</Text>
    <Text style={styles.caregiverRating}>
      {caregiver.rating} <Ionicons name="star" size={18} color={colors.gold} />
    </Text>
    <Text style={styles.loginPrompt}>
      Please {''}
      <Link href="/(auth)/login" asChild>
       <Text style={styles.loginLink}>log in</Text> 
       </Link> 
       {''} to see full details and book.
    </Text>
  </View>
);

/**
 * 👩‍⚕️ Authenticated View: Shows all caregiver info
 */
const FullCaregiverInfo = ({ caregiver }: { caregiver: Caregiver }) => (
  <View style={styles.caregiverCard}>
    <View style={styles.rowBetween}>
      <Text style={styles.caregiverName}>{caregiver.name}</Text>
      <Text style={styles.caregiverRating}>
        {caregiver.rating} <Ionicons name="star" size={18} color={colors.gold} />
      </Text>
    </View>
    <Text style={styles.caregiverDetail}>Age: {caregiver.age}</Text>
    <Text style={styles.caregiverDetail}>Gender: {caregiver.gender}</Text>
    <Text style={styles.caregiverDetail}>Location: {caregiver.location} ({caregiver.area})</Text>
    <Text style={styles.caregiverDetail}>Speaks: {caregiver.languages.join(", ")}</Text>
    
    {/* 👈 ADDED Package details */}
    <Text style={styles.packageTitle}>Service Packages:</Text>
    {caregiver.packages.map(pkg => (
      <View key={pkg.name} style={styles.rowBetween}>
        <Text style={styles.caregiverDetail}>• {pkg.name}</Text>
        <Text style={styles.caregiverDetail}>Rs. {pkg.price.toLocaleString()}</Text>
      </View>
    ))}
  </View>
);


export default function BookingScreen() {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const { id } = useLocalSearchParams();

  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  
  // --- Form State ---
  const [careType, setCareType] = useState("Home care");
  const [dayType, setDayType] = useState("One Day");
  const [patientName, setPatientName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  
  // 👈 ADDED Package State
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Location States
  const [address, setAddress] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  
  // Date States
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);

  // --- Fetch Caregiver Data On Load ---
  useEffect(() => {
    const caregiverId = Array.isArray(id) ? id[0] : id;
    if (caregiverId) {
      const foundCaregiver = allCaregivers.find(c => c.id === caregiverId);
      if (foundCaregiver) {
        setCaregiver(foundCaregiver);
        setCareType(foundCaregiver.careType[0]);
        // 👈 ADDED: Set default package
        if (foundCaregiver.packages.length > 0) {
          setSelectedPackage(foundCaregiver.packages[0]);
        }
      } else {
        console.error(`Caregiver with ID ${caregiverId} not found!`);
        Alert.alert("Error", "Could not find caregiver details.");
      }
    }
  }, [id]);

  // --- 👈 ADDED: Live Total Price Calculation ---
  useEffect(() => {
    if (!selectedPackage) {
      setTotalPrice(0);
      return;
    }

    let days = 0;

    if (dayType === "One Day" && singleDate) {
      days = 1;
    } else if (dayType === "Multiple Days" && startDate && endDate) {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          setTotalPrice(0); // Invalid range
          return;
        }
        // Calculate diff in time
        const diffInTime = end.getTime() - start.getTime();
        // Calculate diff in days (and add 1 to include the start day)
        days = (diffInTime / (1000 * 3600 * 24)) + 1;
      } catch (e) {
        days = 0; // Invalid date format
      }
    }
    
    setTotalPrice(days * selectedPackage.price);

  }, [singleDate, startDate, endDate, dayType, selectedPackage]);
  // ---------------------------------------------

  // --- Form Submit Handler ---
  const handleBookingSubmit = async () => {
    // Basic validation
    if (!patientName || !guardianName || !guardianContact) {
      Alert.alert("Error", "Please fill in all patient and guardian details.");
      return;
    }
    
    // 👈 ADDED package validation
    if (!selectedPackage) {
      Alert.alert("Error", "Please select a service package.");
      return;
    }
    
    if (dayType === "One Day" && !singleDate) {
      Alert.alert("Error", "Please select a date.");
      return;
    }

    if (dayType === "Multiple Days" && (!startDate || !endDate)) {
      Alert.alert("Error", "Please select a start and end date.");
      return;
    }
    
    if (totalPrice <= 0) {
      Alert.alert("Error", "Please check your dates. Total must be greater than 0.");
      return;
    }
    
    if (careType === "Home care" && !address) {
      Alert.alert("Error", "Please provide a home address.");
      return;
    }

    if (careType === "Hospital care" && (!hospitalName || !wardNumber)) {
      Alert.alert("Error", "Please provide hospital and ward details.");
      return;
    }

    setLoading(true);

    // 👈 UPDATED bookingDetails
    const bookingDetails = {
      caregiverId: caregiver?.id,
      careType,
      dayType,
      singleDate: dayType === "One Day" ? singleDate : null, 
      startDate: dayType === "Multiple Days" ? startDate : null,
      endDate: dayType === "Multiple Days" ? endDate : null,
      patientName,
      guardianName,
      guardianContact,
      address: careType === "Home care" ? address : null,
      hospitalName: careType === "Hospital care" ? hospitalName : null,
      wardNumber: careType === "Hospital care" ? wardNumber : null,
      packageType: selectedPackage.name, // 👈 ADDED
      totalPrice: totalPrice,           // 👈 ADDED
    };
    
    const authConfig = { headers: { Authorization: `Bearer ${session}` } };

    try {
      const response = await axios.post(
        `${API_URL}/api/bookings/request`,
        bookingDetails,
        authConfig
      );

      const newBookingId = response.data.booking._id; 
      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => router.push(`/pendingCaregiverRequest/${newBookingId}`) } 
      ]);

    } catch (err: any) {
      console.error("Booking failed:", err.response?.data?.message || err.message);
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
    
  };

  // --- Render Loading or Not Found ---
  if (!caregiver) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryTeal} />
          <Text>Loading caregiver...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Book Appointment</Text>

        {sessionStatus === "authenticated" ? (
          <FullCaregiverInfo caregiver={caregiver} />
        ) : (
          <GuestCaregiverInfo caregiver={caregiver} />
        )}

        {/* --- 2. Booking Form --- */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Patient Details</Text>
          
          <Text style={styles.label}>Patient's Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g., John Doe" value={patientName} onChangeText={setPatientName} />
          
          <Text style={styles.label}>Guardian's Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g., Jane Doe" value={guardianName} onChangeText={setGuardianName} />
          
          <Text style={styles.label}>Guardian's Contact Number</Text>
          <TextInput style={styles.input} placeholder="e.g., 0771234567" value={guardianContact} onChangeText={setGuardianContact} keyboardType="phone-pad" />

          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          {/* Care Type Selection */}
          <Text style={styles.label}>Care Type</Text>
          <View style={styles.optionBox}>
            {caregiver.careType.map((type) => (
              <TouchableOpacity
                key={type}
                style={[ styles.optionButton, careType === type && styles.optionSelected ]}
                onPress={() => setCareType(type)}
              >
                <Text style={[styles.optionText, careType === type && { color: colors.white }]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* 👈 ADDED Package Selection */}
          <Text style={styles.label}>Service Package</Text>
          <View style={styles.optionBox}>
            {caregiver.packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.name}
                style={[
                  styles.optionButton,
                  selectedPackage?.name === pkg.name && styles.optionSelected,
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                <Text style={[styles.optionText, selectedPackage?.name === pkg.name && { color: colors.white }]}>
                  {pkg.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Conditional Location Inputs */}
          {careType === "Home care" && (
            <>
              <Text style={styles.label}>Home Address</Text>
              <TextInput style={[styles.input, styles.inputMultiline]} placeholder="e.g., 123, Main St, Colombo 5" value={address} onChangeText={setAddress} multiline />
            </>
          )}
          
          {careType === "Hospital care" && (
            <>
              <Text style={styles.label}>Hospital Name</Text>
              <TextInput style={styles.input} placeholder="e.g., General Hospital, Colombo" value={hospitalName} onChangeText={setHospitalName} />
              <Text style={styles.label}>Ward Number</Text>
              <TextInput style={styles.input} placeholder="e.g., Ward 15" value={wardNumber} onChangeText={setWardNumber} />
            </>
          )}

          {/* Day Type Selection */}
          <Text style={styles.label}>Booking Duration</Text>
          <View style={styles.optionBox}>
            {["One Day", "Multiple Days"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[ styles.optionButton, dayType === type && styles.optionSelected ]}
                onPress={() => setDayType(type)}
              >
                <Text style={[styles.optionText, dayType === type && { color: colors.white }]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Conditional Date Inputs */}
          {dayType === "One Day" && (
            <>
              <Text style={styles.label}>Date</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={singleDate} onChangeText={setSingleDate} />
            </>
          )}

          {dayType === "Multiple Days" && (
            <View style={styles.dateRow}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput placeholder="YYYY-MM-DD" style={styles.input} value={startDate} onChangeText={setStartDate} />
              </View>
              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>End Date</Text>
                <TextInput placeholder="YYYY-MM-DD" style={styles.input} value={endDate} onChangeText={setEndDate} />
              </View>
            </View>
          )}
          
          {/* 👈 ADDED Total Price Display */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalPrice}>Rs. {totalPrice.toLocaleString()}</Text>
          </View>
          
          {/* --- 3. Submit Button --- */}
          <TouchableOpacity 
            style={[
              styles.button,
              sessionStatus !== "authenticated" && styles.buttonDisabled 
            ]} 
            onPress={handleBookingSubmit} 
            disabled={loading || sessionStatus !== "authenticated"}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {sessionStatus === "authenticated" ? "Confirm Booking" : "Log in to Book"}
              </Text> 
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primaryTeal,
  },
  // --- Caregiver Card Styles ---
  caregiverCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  caregiverName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.darkText,
  },
  caregiverRating: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.darkText,
    alignItems: 'center',
  },
  caregiverDetail: {
    fontSize: 15,
    color: colors.darkText,
    marginTop: 6,
    lineHeight: 22,
  },
  // 👈 ADDED
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkTeal,
    marginTop: 10,
    marginBottom: 5,
  },
  loginPrompt: {
    fontSize: 15,
    color: colors.darkText,
    marginTop: 10,
  },
  loginLink: {
    fontWeight: 'bold',
    color: colors.darkTeal,
    textDecorationLine: 'underline',
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  // --- Form Styles ---
  formContainer: {
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkTeal,
    borderBottomWidth: 1,
    borderColor: colors.lightTeal,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5,
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
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
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
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 2,
  },
  // 👈 ADDED
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: colors.lightTeal,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkTeal,
  },
  // -------------
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