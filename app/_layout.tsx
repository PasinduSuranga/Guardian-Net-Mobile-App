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