import { Link, router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../AuthContext/AuthContext";

const GuestPrompt = () => {
  return (
    <View style={styles.guestPromptContainer}>
      <Text style={styles.guestPromptText}>
        Log in or create an account to access more features.
      </Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.loginButton} activeOpacity={0.7}>
          <Text style={styles.loginButtonText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default function HomeScreen() {
  const { sessionStatus } = useAuth();

  const handleFindCaregiver = () => {
    router.push('/availableCaregivers')
  };
  const handleViewMedicines = () => {
    router.push('/findmedicine')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>Welcome to Guardian Net</Text>
          <Text style={styles.subtitle}>
            Your trusted partner for professional caregiving and medicine
            delivery services.
          </Text>
        </View>

        {sessionStatus !== "authenticated" && <GuestPrompt />}

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Find a Caregiver</Text>
            <Text style={styles.cardText}>
              Search and hire qualified caregivers you can trust.
            </Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={handleFindCaregiver}
              activeOpacity={0.7}
            >
              <Text style={styles.cardButtonText}>Find Caregivers</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Find a Medicine</Text>
            <Text style={styles.cardText}>
              Find the medicines you need and delivered right to your doorstep.
            </Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={handleViewMedicines}
              activeOpacity={0.7}
            >
              <Text style={styles.cardButtonText}>Find Medicines</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#A8D1D1",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#A8D1D1",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3A5A5A",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: "#3A5A5A",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  cardsContainer: {
    width: "100%",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A8F8F",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#3A5A5A",
    marginBottom: 10,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: "#6FADB0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  guestPromptContainer: {
    backgroundColor: "#E0F2F2",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: "center",
  },
  guestPromptText: {
    fontSize: 15,
    color: "#3A5A5A",
    textAlign: "center",
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#4A8F8F",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});