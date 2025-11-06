import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BookingSuccessfulScreen({  }) {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [checkmarkAnim] = useState(new Animated.Value(0));

  // Success animation on mount
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Checkmark rotation animation
    Animated.timing(checkmarkAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotateInterpolate = checkmarkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.iconContainer}>
        <Animated.Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
          }}
          style={[
            styles.image,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotateInterpolate }
              ],
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Booking Confirmed!</Text>

      <View style={styles.statusBadge}>
        <View style={styles.successDot} />
        <Text style={styles.statusText}>Accepted by Caregiver</Text>
      </View>

      <Text style={styles.message}>
        A qualified caregiver has accepted your request.{"\n"}
        Please review your booking details and complete payment.
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>👤</Text>
          <View>
            <Text style={styles.infoLabel}>Caregiver Assigned</Text>
            <Text style={styles.infoValue}>Professional Caregiver</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏰</Text>
          <View>
            <Text style={styles.infoLabel}>Next Step</Text>
            <Text style={styles.infoValue}>Complete Payment</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>View Full Details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.helpLink}>
        <Text style={styles.helpText}>Questions? Contact Support</Text>
      </TouchableOpacity>
    </Animated.View>
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
  iconContainer: {
    backgroundColor: "rgba(111, 173, 176, 0.2)",
    borderRadius: 70,
    padding: 15,
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    tintColor: "#6FADB0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginBottom: 12,
    textAlign: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(106, 190, 131, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  successDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#3A5A5A",
    fontWeight: "600",
  },
  message: {
    textAlign: "center",
    color: "#3A5A5A",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#3A5A5A",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6FADB0",
    width: "90%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#6FADB0",
    fontSize: 15,
    fontWeight: "600",
  },
  helpLink: {
    marginTop: 10,
  },
  helpText: {
    color: "#3A5A5A",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});