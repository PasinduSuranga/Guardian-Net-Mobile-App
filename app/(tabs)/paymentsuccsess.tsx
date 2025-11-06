import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentSuccessfulScreen({  }) {
  const bookingId = "GN-25-1106-1234";
  const time = "Nov 6, 2025 - 10:45 AM";

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>Your caregiver booking has been confirmed.</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Booking ID: {bookingId}</Text>
        <Text style={styles.infoText}>Confirmed Time: {time}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8D1D1",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    tintColor: "#6FADB0",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#3A5A5A",
    textAlign: "center",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginBottom: 30,
  },
  infoText: {
    color: "#3A5A5A",
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
