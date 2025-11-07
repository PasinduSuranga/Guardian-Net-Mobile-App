import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ConfirmedBookingScreen({  }) {
  const [payment, setPayment] = useState("Card");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [cardScale] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePaymentSelect = (method: any) => {
    const scaleAnim = new Animated.Value(0.95);
    setPayment(method);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Your Booking</Text>
          <Text style={styles.subtitle}>Review details and complete payment</Text>
        </View>

        <Animated.View style={[styles.card, { transform: [{ scale: cardScale }] }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📋 Booking Details</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.icon}>👤</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Caregiver</Text>
              <Text style={styles.detailValue}>Anushka Perera</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>📅</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>Nov 6, 2025</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>🕐</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>10:30 AM</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>📍</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>General Hospital, Colombo</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>💳 Payment Method</Text>
          <Text style={styles.sectionDescription}>Choose your preferred payment option</Text>
        </View>

        <View style={styles.paymentBox}>
          {[
            { method: "Card", icon: "💳" },
            { method: "Cash", icon: "💵" },
            { method: "Online", icon: "🌐" }
          ].map(({ method, icon }) => (
            <TouchableOpacity
              key={method}
              style={[styles.paymentButton, payment === method && styles.selected]}
              onPress={() => handlePaymentSelect(method)}
              activeOpacity={0.7}
            >
              <Text style={styles.paymentIcon}>{icon}</Text>
              <Text
                style={[
                  styles.paymentText,
                  payment === method && styles.selectedText,
                ]}
              >
                {method}
              </Text>
              {payment === method && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>📝 Additional Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Any special requirements? (optional)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>Rs. 2,500</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform Fee</Text>
            <Text style={styles.priceValue}>Rs. 250</Text>
          </View>
          <View style={styles.dividerThin} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs. 2,750</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Confirm & Pay Rs. 2,750</Text>
          <Text style={styles.buttonSubtext}>→</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By confirming, you agree to our Terms & Conditions
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
  },
  card: {
    backgroundColor: "#A8D1D1",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3A5A5A",
  },
  badge: {
    backgroundColor: "#6FADB0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(58, 90, 90, 0.2)",
    marginBottom: 15,
  },
  dividerThin: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
    width: 30,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#3A5A5A",
    opacity: 0.7,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#3A5A5A",
    fontWeight: "600",
  },
  section: {
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 13,
    color: "#999",
  },
  paymentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 10,
  },
  paymentButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    position: "relative",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selected: {
    backgroundColor: "#6FADB0",
    borderColor: "#6FADB0",
    elevation: 3,
    shadowOpacity: 0.15,
  },
  paymentIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  paymentText: {
    color: "#3A5A5A",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  checkmark: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#6FADB0",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A5A5A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: "#3A5A5A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 80,
  },
  priceContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: "#666",
  },
  priceValue: {
    fontSize: 15,
    color: "#3A5A5A",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 17,
    color: "#3A5A5A",
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    color: "#6FADB0",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonSubtext: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});