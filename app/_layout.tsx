// ---
// NOTE: The errors you see about "expo-router" and "AuthContext"
// are expected in this web preview. The code is correct.
// ---
import { Stack } from 'expo-router';
import React from 'react';
// --- ADDED ---
import { ActivityIndicator, View } from 'react-native';
// Make sure this path is correct for your project
import { AuthProvider, useAuth, useProtectedRoute } from '../AuthContext/AuthContext';
// -----------

function RootLayoutNav() {

  useProtectedRoute();
  // --- ADDED: Handle Loading State ---
  const { sessionStatus } = useAuth();
  // useProtectedRoute(); // This hook manages all your redirects

  // Show a loading indicator while the session is being checked
  if (sessionStatus === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // ---------------------------------

  // Once loaded, show the app
  return (
    <Stack>
      {/* Your public landing page */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Your main app (the tabs group) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Your auth screens (login, signup, verify) */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      <Stack.Screen name="editUserProfile" options={{ headerShown: false }} />

      <Stack.Screen name="changePassword" options={{ headerShown: false }} />

      <Stack.Screen name="availableCaregivers" options={{ headerShown: false }} />

      <Stack.Screen 
        name="caregiverBooking/[id]" 
        options={{ 
          title: 'Book Appointment',
          presentation: 'modal',
          headerShown: false // This will make it slide up
        }} 
      />

      <Stack.Screen 
        name="caregiverProfile/[id]" 
        options={{ 
          title: 'view profile',
          presentation: 'modal',
          headerShown: false // This will make it slide up
        }} 
      />

      <Stack.Screen 
        name="pendingCaregiverRequest/[id]" 
        options={{ 
          title: 'pending request',
          presentation: 'modal',
          headerShown: false // This will make it slide up
        }} 
      />

      <Stack.Screen 
        name="editBooking/[id]" 
        options={{ 
          title: 'edit booking',
          presentation: 'modal',
          headerShown: false // This will make it slide up
        }} 
      />

      <Stack.Screen
        name='bookingSuccess/[id]'
        options={{
          title: 'booking success',
          presentation: 'modal',
          headerShown: false
        }}
        />

        <Stack.Screen 
        name="payment/[id]" 
        options={{ title: 'Complete Payment', presentation: 'modal', headerShown: false }} 
      />
      <Stack.Screen 
        name="paymentSuccess" 
        options={{ title: 'Payment Submitted', presentation: 'modal', headerShown: false }} 
      />

      <Stack.Screen 
        name="paymentPending" 
        options={{ title: 'Payment review', presentation: 'modal', headerShown: false }} 
      />

      <Stack.Screen 
        name="finalPayment/[id]" 
        options={{ title: 'Final Payment', presentation: 'modal' }} 
      />


      <Stack.Screen 
        name="medicineRequestPending/[id]" 
        options={{ 
          title: 'Medicine Request Pending',
          presentation: 'modal'
        }} 
      />


      <Stack.Screen 
        name="medicineQuotes/[id]" 
        options={{ 
          title: 'Pharmacy Quotes',
          presentation: 'modal'
        }} 
      />

      <Stack.Screen 
        name="medicineOrder/[id]" 
        options={{ 
          title: 'Place Your Order',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="medicineOrderSuccess" 
        options={{ 
          title: 'Order Sent',
          presentation: 'modal',
          headerShown: false
        }} 
      />


      <Stack.Screen 
        name="medicinePayment/[id]" 
        options={{ title: 'Complete Order', presentation: 'modal' }} 
      />

    </Stack>
  );
}

export default function RootLayout() {
  // The AuthProvider wraps your entire app
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}