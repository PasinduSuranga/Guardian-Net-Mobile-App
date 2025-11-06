import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Pathum Manusha</Text>
      <Text style={styles.email}>pathum@example.com</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Membership</Text>
        <Text style={styles.value}>Guardian Plus</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Joined</Text>
        <Text style={styles.value}>March 2024</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8D1D1",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 40,
    borderWidth: 3,
    borderColor: "#6FADB0",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginTop: 15,
  },
  email: {
    fontSize: 15,
    color: "#3A5A5A",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
  },
  label: {
    color: "#4A8F8F",
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    color: "#3A5A5A",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#CBCAC8",
  },
  logoutText: {
    color: "#3A5A5A",
    fontWeight: "bold",
    fontSize: 16,
  },
});
