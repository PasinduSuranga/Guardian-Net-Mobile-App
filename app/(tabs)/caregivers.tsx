import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const caregivers = [
  {
    name: "Kamal Perera",
    rating: 4.8,
    age: 32,
    contact: "0718746267",
    location: "Nugegoda",
  },
  {
    name: "Lexa",
    rating: 4.4,
    age: 29,
    contact: "0717556517",
    location: "Peliyagoda",
  },
  {
    name: "Latha",
    rating: 4.0,
    age: 30,
    contact: "0711111111",
    location: "Grandpass",
  },
  {
    name: "Renuka",
    rating: 3.4,
    age: 34,
    contact: "0712223334",
    location: "Kelaniya",
  },
];

export default function CaregiversScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>Available Caregivers</Text>
      </View>

      {caregivers.map((cg, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.name}>Name: {cg.name}</Text>
            <Text style={styles.rating}>
              Rating: {cg.rating} <Ionicons name="star-outline" size={14} color="#D4B25E" />
            </Text>
          </View>
          <Text style={styles.details}>Age: {cg.age}</Text>
          <Text style={styles.details}>Contact Number: {cg.contact}</Text>
          <Text style={styles.details}>Location: {cg.location}</Text>
          <TouchableOpacity>
            <Text style={styles.more}>More Details..</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerBox: {
    backgroundColor: "#6FADB0",
    paddingVertical: 25,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#A8D1D1",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A5A5A",
  },
  rating: {
    fontSize: 14,
    color: "#3A5A5A",
  },
  details: {
    fontSize: 14,
    color: "#3A5A5A",
    marginTop: 4,
  },
  more: {
    fontSize: 14,
    color: "#4A8F8F",
    marginTop: 6,
    textDecorationLine: "underline",
  },
});
