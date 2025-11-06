import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  lightTeal: "#A8D1D1",
  gold: "#D4B25E",
  darkText: "#3A5A5A",
  lightGray: "#CBCAC8",
  white: "#FFFFFF",
};

const FindCaregiversScreen = () => {
  const [careType, setCareType] = useState("Hospital care");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gender, setGender] = useState("Female");
  const [languages, setLanguages] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Find Caregivers</Text>

        {/* Care Type */}
        <View style={styles.optionBox}>
          {["Hospital care", "Home care"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                careType === type && styles.optionSelected,
              ]}
              onPress={() => setCareType(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  careType === type && { color: colors.white },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hospital Location */}
        <Text style={styles.label}>Hospital Location *</Text>
        <TextInput
          placeholder="General hospital, Colombo"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        {/* Start Date */}
        <Text style={styles.label}>Start Date *</Text>
        <TextInput
          placeholder="07/15/2025"
          style={styles.input}
          value={startDate}
          onChangeText={setStartDate}
        />

        {/* End Date */}
        <Text style={styles.label}>End Date</Text>
        <TextInput
          placeholder="07/19/2025"
          style={styles.input}
          value={endDate}
          onChangeText={setEndDate}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <TextInput
          placeholder="Female"
          style={styles.input}
          value={gender}
          onChangeText={setGender}
        />

        {/* Languages */}
        <Text style={styles.label}>Languages</Text>
        <View style={styles.optionBox}>
          {["Sinhala", "English", "Tamil"].map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.optionButton,
                languages.includes(lang) && styles.optionSelected,
              ]}
              onPress={() => toggleLanguage(lang)}
            >
              <Text
                style={[
                  styles.optionText,
                  languages.includes(lang) && { color: colors.white },
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Special Notes</Text>
        <TextInput
          placeholder="Any special requirements / concerns"
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Find Available Caregivers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const HomeScreen = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Profile Screen</Text>
  </View>
);

const MedicineScreen = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Medicine Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primaryTeal,
          tabBarInactiveTintColor: colors.darkText,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.lightGray,
            height: 60,
            paddingBottom: 8,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Profile") iconName = "person";
            else if (route.name === "Medicine") iconName = "medkit";
            else if (route.name === "Caregiver") iconName = "heart";

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Medicine" component={MedicineScreen} />
        <Tab.Screen name="Caregiver" component={FindCaregiversScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    
  );
};

export default AppTabs;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.primaryTeal,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    color: colors.darkText,
  },
  input: {
    backgroundColor: colors.lightTeal + "33",
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
  },
  notesInput: {
    height: 90,
    textAlignVertical: "top",
  },
  optionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.lightGray + "55",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: colors.primaryTeal,
  },
  optionText: {
    color: colors.darkText,
    fontWeight: "500",
  },
  button: {
    backgroundColor: colors.primaryTeal,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});
