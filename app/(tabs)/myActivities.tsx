import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext/AuthContext'; // 👈 Adjust path

const API_URL = "http://192.168.43.117:5000"; // Your API URL

const colors = {
  primaryTeal: "#6FADB0",
  darkTeal: "#4A8F8F",
  darkText: "#3A5A5A",
  white: "#FFFFFF",
  lightBackground: "#E0F2F2",
  gold: "#D4B25E",
  lightTeal: "#A8D1D1", 
  lightGray: "#CBCAC8", 
};

// This interface matches the backend controller's output
interface Activity {
  _id: string;
  type: 'booking' | 'medicine_request';
  status: string;
  paymentStatus?: string; // Only for bookings
  title: string;
  description: string;
  createdAt: string;
}

export default function MyActivitiesScreen() {
  const router = useRouter();
  
  // --- THIS IS THE FIX ---
  const { session } = useAuth(); // Removed the underscore
  // -----------------------
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true); // 👈 Set loading true on each fetch
      const authConfig = { headers: { Authorization: `Bearer ${session}` } };
      const response = await axios.get(`${API_URL}/api/user/activities`, authConfig);
      setActivities(response.data);
    } catch (err: any) {
      console.error("Failed to fetch activities:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect re-fetches data every time the tab comes into view
  useFocusEffect(
    useCallback(() => {
      if (session) {
        fetchActivities();
      }
    }, [session])
  );

  // Handle navigation when an activity is tapped
  const handleActivityPress = (item: Activity) => {
    if (item.type === 'booking') {
      // If it's a booking, go to the edit/details screen
      router.push(`/editBooking/${item._id}`);
    } 
    else if (item.type === 'medicine_request') {
      // If it's a medicine request, go to the appropriate screen
      if (item.status === 'pending') {
        router.push(`/medicineRequestPending/${item._id}`);
      } else {
        router.push(`/medicineQuotes/${item._id}`);
      }
    }
  };

  const renderItem = ({ item }: { item: Activity }) => {
    const isBooking = item.type === 'booking';
    
    return (
      <TouchableOpacity 
        style={styles.activityCard} 
        onPress={() => handleActivityPress(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isBooking ? "calendar-outline" : "medkit-outline"} 
            size={24} 
            color={colors.primaryTeal} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>My Activities</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryTeal} style={{ marginTop: 50 }} />
      ) : activities.length === 0 ? (
        <Text style={styles.emptyText}>You have no activities yet.</Text>
      ) : (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.type + item._id}
          style={styles.list}
          onRefresh={fetchActivities}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

// These styles are based on your notifications.tsx screen
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.darkText,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.darkText,
  },
  activityCard: {
    backgroundColor: colors.lightBackground,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightTeal,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.darkText,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    color: colors.darkTeal,
  },
});