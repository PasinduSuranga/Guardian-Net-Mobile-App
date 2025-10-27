// ---
// NOTE: The errors you see about "expo-router", "@expo/vector-icons",
// and "AuthContext" are expected in this web preview.
// ---

import { Tabs } from 'expo-router';
import React from 'react';

// NOTE: These imports will show as errors in this web preview,
// but they are correct for your Expo project.
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../AuthContext/AuthContext'; // Check this path!

/**
 * This is the layout for the (tabs) group.
 * It sets up the bottom tab bar.
 */
export default function TabsLayout() {
  const { sessionStatus } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // Calm blue
        headerShown: true, // Show header by default
      }}
    >
      {/* This is the new default tab.
        It's hidden from the bar (href: null)
        and just redirects to 'about'.
      */}
      <Tabs.Screen
        name="index" // This matches app/(tabs)/index.tsx
        options={{
          href: null, // Hides this tab from the bar
        }}
      />

      {/*
       * This is your "Home" screen (about.tsx).
       * We've removed href: "/" to stop it from hijacking the root route.
       * It's now just a normal tab.
       */}
      

      {/*
       * This is your "Profile" screen.
       * It's a protected route.
       */}
      <Tabs.Screen
        name="profile" // This matches app/(tabs)/profile.tsx
        options={{
          title: 'Profile',
          headerShown: true, // This screen *will* show the header
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),

          // This dynamically hides the 'Profile' tab if you are logged out
          href: sessionStatus === 'authenticated' ? '/profile' : null,
        }}
      />
    </Tabs>
  );
}