import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const handleFindCaregiver = () => {
    // Navigate to caregiver search screen
    console.log("Navigate to Find Caregiver");
  };

  const handleViewMedicines = () => {
    // Navigate to medicine reminders screen
    console.log("Navigate to View Medicines");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Guardian Net</Text>
        <Text style={styles.subtitle}>
          Your trusted partner for professional caregiving services.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Find a Caregiver</Text>
          <Text style={styles.cardText}>
            Search and book qualified caregivers for home or hospital care.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleFindCaregiver}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Find Caregiver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medicine Reminders</Text>
          <Text style={styles.cardText}>
            Set and manage your daily medicine schedule easily.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleViewMedicines}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>View Medicines</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#A8D1D1",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3A5A5A",
    textAlign: "center",
    marginBottom: 8,
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
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});