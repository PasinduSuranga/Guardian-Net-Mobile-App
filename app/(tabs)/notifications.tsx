import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext/AuthContext';

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

// --- UPDATED INTERFACE ---
interface BookingPopulated {
  _id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'cancelled' | 'completed';
  paymentStatus: 'pending_advance' | 'pending_verification' | 'advance_paid' | 'pending_final_verification' | 'fully_paid';
}
interface MedicineRequestPopulated {
  _id: string;
  status: 'pending' | 'quoted' | 'fulfilled' | 'cancelled';
}
interface MedicineOrderPopulated {
  _id: string;
  status: 'pending_confirmation' | 'ready_for_pickup' | 'payment_pending_verification' | 'completed' | 'cancelled';
}
interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  booking?: BookingPopulated; 
  medicineRequest?: MedicineRequestPopulated; 
  medicineOrder?: MedicineOrderPopulated; // 👈 ADDED
  createdAt: string;
}
// ------------------------------

export default function NotificationsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true); // 👈 Set loading true on each fetch
      const authConfig = { headers: { Authorization: `Bearer ${session}` } };
      const response = await axios.get(`${API_URL}/api/notifications`, authConfig);
      setNotifications(response.data);
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (session) {
        fetchNotifications();
      }
    }, [session])
  );

  // --- UPDATED NAVIGATION LOGIC ---
  const handleNotificationPress = async (item: Notification) => {
    try {
      // 1. Mark as read
      const authConfig = { headers: { Authorization: `Bearer ${session}` } };
      await axios.put(`${API_URL}/api/notifications/${item._id}/read`, {}, authConfig);
      setNotifications(prev => 
        prev.map(n => n._id === item._id ? { ...n, isRead: true } : n)
      );

      // 2. Handle BOOKING notifications
      if (item.booking) {
        const bookingId = item.booking._id;
        const bookingStatus = item.booking.status;
        const paymentStatus = item.booking.paymentStatus;
        const message = item.message.toLowerCase();

        if (bookingStatus === 'pending') {
          router.push(`/pendingCaregiverRequest/${bookingId}`);
        } 
        else if (paymentStatus === 'pending_advance') {
          router.push(`/payment/${bookingId}`);
        } 
        else if (paymentStatus === 'pending_verification') {
          if (message.includes('advance')) {
            router.push({ pathname: "/paymentPending", params: { type: 'advance' } });
          } else {
            router.push({ pathname: "/paymentPending", params: { type: 'final' } });
          }
        } 
        else if (paymentStatus === 'advance_paid' && bookingStatus === 'confirmed') {
          router.push({ pathname: `/paymentSuccess`, params: { id: bookingId, type: 'advance' } });
        }
        else if (paymentStatus === 'advance_paid' && bookingStatus === 'in_progress') {
          router.push(`/finalPayment/${bookingId}`);
        }
        else if (paymentStatus === 'fully_paid' && bookingStatus === 'completed') {
          router.push({ pathname: `/paymentSuccess`, params: { id: bookingId, type: 'final' } });
        }
        else {
          router.push(`/editBooking/${bookingId}`);
        }
      }
      
      // 3. Handle MEDICINE REQUEST notifications
      else if (item.medicineRequest) {
        const requestId = item.medicineRequest._id;
        if (item.medicineRequest.status === 'pending') {
          router.push(`/medicineRequestPending/${requestId}`);
        } else {
          // 'quoted'
          router.push(`/medicineQuotes/${requestId}`);
        }
      }
      
      // 4. Handle MEDICINE ORDER notifications
      else if (item.medicineOrder) {
        const orderId = item.medicineOrder._id;
        const orderStatus = item.medicineOrder.status;

        if (orderStatus === 'pending_confirmation') {
          // "Your order request has been sent..."
          router.push('/medicineOrderSuccess');
        } 
        else if (orderStatus === 'ready_for_pickup') {
          // "Your order... is ready for pickup!"
          router.push(`/medicinePayment/${orderId}`);
        } 
        else if (orderStatus === 'payment_pending_verification') {
          // "Your final payment receipt has been submitted..."
          router.push({ pathname: "/paymentPending", params: { type: 'final' } });
        } 
        else if (orderStatus === 'completed') {
          // "Your final payment has been verified."
          router.push({ pathname: `/paymentSuccess`, params: { id: orderId, type: 'final' } });
        }
        else {
          // Fallback
          router.push('/(tabs)/notifications');
        }
      }

    } catch (err: any) {
      console.error("Navigation error:", err.message);
      // Fallback
      Alert.alert("Navigation Error", "Could not open this notification.");
    }
  };
  // ---------------------------------

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={styles.notificationCard} 
      onPress={() => handleNotificationPress(item)}
    >
      {!item.isRead && <View style={styles.unreadDot} />}
      <View style={styles.iconContainer}>
        {/* Conditional Icon */}
        <Ionicons 
          name={item.booking ? "calendar-outline" : "medkit-outline"} 
          size={24} 
          color={colors.primaryTeal} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryTeal} style={{ marginTop: 50 }} />
      ) : notifications.length === 0 ? (
        <Text style={styles.emptyText}>You have no notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.list}
          onRefresh={fetchNotifications} // 👈 Added pull-to-refresh
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

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
  notificationCard: {
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
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.darkTeal,
  },
});