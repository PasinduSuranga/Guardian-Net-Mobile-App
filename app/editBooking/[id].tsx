import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  cardBackground: "#E0F2F2",
};

// --- API URL ---
const API_URL = "http://192.168.43.117:5000";

// --- Mock Caregiver Data (with packages) ---
const allCaregivers = [
  { 
    id: "600000000000000000000001", 
    name: "Kamal Perera", 
    rating: 4.8, age: 32, contact: "0718746267", location: "Nugegoda", area: "Embuldeniya", gender: "Male", languages: ["Sinhala", "English"], careType: ["Home care"], availability: [],
    packages: [ 
      { name: "Full Day Care", price: 3500 },
      { name: "Half Day Care", price: 1500 },
    ]
  },
  { 
    id: "600000000000000000000002", 
    name: "Lexa", 
    rating: 4.4, age: 29, contact: "0717556517", location: "General Hospital, Colombo", area: "Colombo 10", gender: "Female", languages: ["English"], careType: ["Hospital care"], availability: [],
    packages: [
      { name: "Full Day Care", price: 4000 },
      { name: "Half Day Care", price: 2000 },
    ]
  },
  { 
    id: "600000000000000000000003", 
    name: "Latha", 
    rating: 4.0, age: 30, contact: "0711111111", location: "Grandpass", area: "Colombo 14", gender: "Female", languages: ["Sinhala", "Tamil"], careType: ["Home care", "Hospital care"], availability: [],
    packages: [
      { name: "Full Day Care", price: 3500 },
      { name: "Half Day Care", price: 1500 },
    ]
  },
  { 
    id: "600000000000000000000004", 
    name: "Renuka", 
    rating: 3.4, age: 34, contact: "0712223334", location: "Kelaniya", area: "Kiribathgoda", gender: "Female", languages: ["Sinhala"], careType: ["Home care"], availability: [],
    packages: [
      { name: "Full Day Care", price: 3000 },
      { name: "Half Day Care", price: 1300 },
    ]
  },
];
type Caregiver = (typeof allCaregivers)[0];
type Package = (typeof allCaregivers)[0]['packages'][0]; 

// --- UPDATED BOOKING INTERFACE ---
interface Booking {
  _id: string;
  caregiver: string; 
  user: string;
  patientName: string;
  guardianName: string;
  guardianContact: string;
  careType: string;
  address?: string;
  hospitalName?: string;
  wardNumber?: string;
  dayType: string;
  singleDate?: string;
  startDate?: string;
  endDate?: string;
  packageType: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}
// -----------------------------

/**
 * Helper function to format date string to YYYY-MM-DD
 */
const formatDateForInput = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return "";
  }
};

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
  </View>
);
// -----------------------

export default function EditBookingScreen() {
  const router = useRouter();
  const { sessionStatus, session } = useAuth();
  const { id } = useLocalSearchParams(); // This `id` is the BOOKING_ID

  // --- Main Booking State ---
  const [booking, setBooking] = useState<Booking | null>(null);
  
  // --- Caregiver Data ---
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  
  // --- Form State ---
  const [careType, setCareType] = useState("Home care");
  const [dayType, setDayType] = useState("One Day");
  const [patientName, setPatientName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [address, setAddress] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true); // Start true to load data
  const [submitting, setSubmitting] = useState(false);

  // --- Fetch EXISTING Booking Data On Load ---
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

        if (bookingData.caregiver) { 
          const foundCaregiver = allCaregivers.find(c => c.id === bookingData.caregiver);
          if (foundCaregiver) {
            setCaregiver(foundCaregiver);
            const foundPackage = foundCaregiver.packages.find(p => p.name === bookingData.packageType);
            setSelectedPackage(foundPackage || null);

          } else {
            console.error("Critical Error: Booking data has a caregiver ID that is not in the mock data.");
            Alert.alert("Error", "Could not load caregiver details for this booking.");
            setLoading(false);
            return;
          }
        } else {
          console.error("Critical Error: Booking data is missing a caregiver ID.");
          Alert.alert("Error", "Could not load caregiver details for this booking.");
          setLoading(false);
          return;
        }

        // Pre-fill all form fields
        setPatientName(bookingData.patientName);
        setGuardianName(bookingData.guardianName);
        setGuardianContact(bookingData.guardianContact);
        setCareType(bookingData.careType);
        setDayType(bookingData.dayType);
        setAddress(bookingData.address || "");
        setHospitalName(bookingData.hospitalName || "");
        setWardNumber(bookingData.wardNumber || "");
        setSingleDate(formatDateForInput(bookingData.singleDate));
        setStartDate(formatDateForInput(bookingData.startDate));
        setEndDate(formatDateForInput(bookingData.endDate));
        setTotalPrice(bookingData.totalPrice || 0);

      } catch (err: any) {
        console.error("Failed to fetch booking:", err.response?.data?.message || err.message);
        Alert.alert("Error", "Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, session]);

  // --- Live Total Price Calculation ---
  useEffect(() => {
    // Don't calculate if the screen is still loading
    if (loading) return; 

    if (!selectedPackage) {
      setTotalPrice(0);
      return;
    }

    let days = 0;
    const isValidDate = (dateStr: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

    if (dayType === "One Day" && isValidDate(singleDate)) {
      days = 1;
    } else if (dayType === "Multiple Days" && isValidDate(startDate) && isValidDate(endDate)) {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          days = 0; 
        } else {
          const diffInTime = end.getTime() - start.getTime();
          days = (diffInTime / (1000 * 3600 * 24)) + 1;
        }
      } catch (e) {
        days = 0; 
      }
    }
    
    setTotalPrice(Math.round(days * selectedPackage.price)); 

  }, [singleDate, startDate, endDate, dayType, selectedPackage, loading]); // Added 'loading'

  // --- Form Submit Handler ---
  const handleBookingUpdate = async () => {
    if (!patientName || !guardianName || !guardianContact) { Alert.alert("Error", "Patient details incomplete."); return; }
    
    if (!selectedPackage) {
      Alert.alert("Error", "Please select a service package.");
      return;
    }
    if (totalPrice <= 0) {
      Alert.alert("Error", "Please check your dates. Total must be greater than 0.");
      return;
    }

    setSubmitting(true);

    // --- THIS IS THE FIX ---
    // Added packageType and totalPrice to the object being sent
    const bookingDetails = {
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
    // ----------------------
    
    const authConfig = {
      headers: { Authorization: `Bearer ${session}` }
    };

    try {
      const bookingId = Array.isArray(id) ? id[0] : id;
      
      const response = await axios.put(
        `${API_URL}/api/bookings/${bookingId}`, 
        bookingDetails,
        authConfig
      );

      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => router.back() } 
      ]);

    } catch (err: any) {
      console.error("Booking update failed:", err.response?.data?.message || err.message);
      const message = err.response?.data?.message || "An error occurred. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- NEW: Payment Button Handler ---
  const handleProceedToPayment = () => {
    const bookingId = Array.isArray(id) ? id[0] : id;
    router.push(`/payment/${bookingId}`); // Navigate to a payment screen
  };

  // --- Render Loading or Not Found ---
  if (loading || !caregiver || !booking) { 
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryTeal} />
          <Text>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const isPending = booking.status === 'pending'; 

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {isPending ? "Edit Your Booking" : "Booking Details"}
        </Text>

        {/* 1. Caregiver Info */}
        <FullCaregiverInfo caregiver={caregiver} />

        {/* 2. Booking Form (Conditional) */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <Text style={styles.label}>Patient's Full Name</Text>
          {isPending ? (
            <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} />
          ) : (
            <Text style={styles.valueText}>{patientName}</Text>
          )}

          <Text style={styles.label}>Guardian's Full Name</Text>
          {isPending ? (
            <TextInput style={styles.input} value={guardianName} onChangeText={setGuardianName} />
          ) : (
            <Text style={styles.valueText}>{guardianName}</Text>
          )}

          <Text style={styles.label}>Guardian's Contact Number</Text>
          {isPending ? (
            <TextInput style={styles.input} value={guardianContact} onChangeText={setGuardianContact} keyboardType="phone-pad" />
          ) : (
            <Text style={styles.valueText}>{guardianContact}</Text>
          )}

          <Text style={styles.sectionTitle}>Booking Details</Text>
          <Text style={styles.label}>Care Type</Text>
          {isPending ? (
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
          ) : (
            <Text style={styles.valueText}>{careType}</Text>
          )}

          {/* Package Selection */}
          <Text style={styles.label}>Service Package</Text>
          {isPending ? (
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
          ) : (
             <Text style={styles.valueText}>{booking.packageType}</Text>
          )}
          
          {careType === "Home care" && (
             <><Text style={styles.label}>Home Address</Text>
              {isPending ? (
                <TextInput style={[styles.input, styles.inputMultiline]} value={address} onChangeText={setAddress} multiline />
              ) : (
                <Text style={styles.valueText}>{address}</Text>
              )}
             </>
          )}
          
          {careType === "Hospital care" && (
            <>
              <Text style={styles.label}>Hospital Name</Text>
              {isPending ? (
                <TextInput style={styles.input} value={hospitalName} onChangeText={setHospitalName} />
              ) : (
                <Text style={styles.valueText}>{hospitalName}</Text>
              )}
              
              <Text style={styles.label}>Ward Number</Text>
              {isPending ? (
                <TextInput style={styles.input} value={wardNumber} onChangeText={setWardNumber} />
              ) : (
                <Text style={styles.valueText}>{wardNumber}</Text>
              )}
            </>
          )}

          <Text style={styles.label}>Booking Duration</Text>
          {isPending ? (
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
          ) : (
            <Text style={styles.valueText}>{dayType}</Text>
          )}

          {dayType === "One Day" && (
            <>
              <Text style={styles.label}>Date</Text>
              {isPending ? (
                <TextInput style={styles.input} value={singleDate} onChangeText={setSingleDate} />
              ) : (
                <Text style={styles.valueText}>{singleDate}</Text>
              )}
            </>
          )}

          {dayType === "Multiple Days" && (
            <View style={styles.dateRow}>
              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>Start Date</Text>
                {isPending ? (
                  <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} />
                ) : (
                  <Text style={styles.valueText}>{startDate}</Text>
                )}
              </View>
              <View style={styles.dateInputContainer}>
                <Text style={styles.label}>End Date</Text>
                {isPending ? (
                  <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} />
                ) : (
                  <Text style={styles.valueText}>{endDate}</Text>
                )}
              </View>
            </View>
          )}
          
          {/* Total Price Display */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalPrice}>Rs. {totalPrice.toLocaleString()}</Text>
          </View>
          
          {/* --- 3. Conditional Submit Button --- */}
          {isPending ? (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleBookingUpdate}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Re-Confirm Booking</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleProceedToPayment}
            >
              <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles (Identical to your BookingScreen) ---
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
  loginPrompt: { fontSize: 15, color: colors.darkText, marginTop: 10 },
  loginLink: { fontWeight: 'bold', color: colors.darkTeal, textDecorationLine: 'underline' },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
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
  // --- NEW STYLE for Read-only text ---
  valueText: {
    backgroundColor: colors.lightBackground,
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    color: colors.darkText,
    overflow: 'hidden', // for text inputs that are now text
  },
  // -----------------------------------
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