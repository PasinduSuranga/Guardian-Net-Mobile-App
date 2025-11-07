import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
  purple: "#9B7EBD",
  blue: "#7EC8E3",
  red: "#E57373",
  green: "#81C784",
};

const DeliveryOptionsScreen = ({ navigation, route }: any) => {
  const [selectedDelivery, setSelectedDelivery] = useState("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("123 Main Street, Colombo 03");

  const orderData = {
    medicine: "Paracetamol 500mg",
    quantity: "20 units",
    pharmacy: "City Pharmacy",
    medicinePrice: "Rs. 450.00",
  };

  const deliveryOptions = [
    {
      id: "pickup",
      title: "Pharmacy Pickup",
      subtitle: "Collect from City Pharmacy",
      badge: "FREE",
      badgeColor: colors.green,
      icon: "🏪",
      color: colors.purple,
    },
    {
      id: "standard",
      title: "Standard Delivery",
      subtitle: "Delivered to your location",
      badge: null,
      icon: "📦",
      color: colors.blue,
    },
    {
      id: "express",
      title: "Express Delivery",
      subtitle: "Priority delivery service",
      badge: null,
      icon: "⚡",
      color: colors.red,
    },
  ];

  const calculateTotal = () => {
    const medicinePrice = 450;
    let deliveryFee = 0;
    let serviceFee = 0;

    if (selectedDelivery === "standard") {
      deliveryFee = 150;
      serviceFee = 50;
    } else if (selectedDelivery === "express") {
      deliveryFee = 300;
      serviceFee = 100;
    }

    return {
      medicine: medicinePrice,
      delivery: deliveryFee,
      service: serviceFee,
      total: medicinePrice + deliveryFee + serviceFee,
    };
  };

  const handleConfirmOrder = () => {
    if (selectedDelivery !== "pickup" && !deliveryAddress.trim()) {
      Alert.alert("Error", "Please enter delivery address");
      return;
    }

    Alert.alert(
      "Order Confirmed",
      "Your order has been placed successfully!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]
    );
  };

  const costs = calculateTotal();

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
          <Text style={styles.headerTitle}>Delivery Options</Text>
          <Text style={styles.headerSubtitle}>Choose pickup or delivery</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Medicine:</Text>
              <Text style={styles.summaryValue}>{orderData.medicine}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity:</Text>
              <Text style={styles.summaryValue}>{orderData.quantity}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pharmacy:</Text>
              <Text style={styles.summaryValue}>{orderData.pharmacy}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Medicine Price:</Text>
              <Text style={styles.summaryValue}>{orderData.medicinePrice}</Text>
            </View>
          </View>

          {/* Select Delivery Method */}
          <Text style={styles.sectionTitle}>Select Delivery Method</Text>

          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.deliveryOption,
                selectedDelivery === option.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedDelivery(option.id)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: option.color + "30" }]}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                {option.badge && (
                  <View style={[styles.badge, { backgroundColor: option.badgeColor }]}>
                    <Text style={styles.badgeText}>{option.badge}</Text>
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.radioCircle,
                  selectedDelivery === option.id && styles.radioSelected,
                ]}
              >
                {selectedDelivery === option.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Delivery Address */}
          {selectedDelivery !== "pickup" && (
            <View style={styles.addressSection}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter delivery address"
                placeholderTextColor={colors.darkText + "80"}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.changeAddressButton} activeOpacity={0.7}>
                <Text style={styles.changeAddressText}>Change Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Total Cost */}
          <View style={styles.totalCard}>
            <Text style={styles.cardTitle}>Total Cost</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Medicine:</Text>
              <Text style={styles.summaryValue}>Rs. {costs.medicine}.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery:</Text>
              <Text style={styles.summaryValue}>
                {costs.delivery === 0 ? "FREE" : `Rs. ${costs.delivery}.00`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee:</Text>
              <Text style={styles.summaryValue}>
                {costs.service === 0 ? "FREE" : `Rs. ${costs.service}.00`}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>Rs. {costs.total}.00</Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmOrder}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeliveryOptionsScreen;

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
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.darkText,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.darkText,
    marginBottom: 12,
  },
  deliveryOption: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  selectedOption: {
    borderColor: colors.primaryTeal,
    backgroundColor: colors.lightTeal + "20",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.darkText,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.darkText,
    opacity: 0.7,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginTop: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: colors.primaryTeal,
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primaryTeal,
  },
  addressSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  addressInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: colors.darkText,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 80,
    marginBottom: 10,
  },
  changeAddressButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  changeAddressText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.darkText,
  },
  totalCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: colors.lightGray,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.darkText,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 16,
    color: colors.primaryTeal,
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: colors.darkTeal,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});