import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

// Define your colors
const colors = {
  primaryTeal: "#6FADB0",
  darkText: "#3A5A5A",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        // --- THIS IS THE FIX ---
        // This hides the header for ALL screens in this (tabs) layout
        headerShown: false,
        // ---------------------

        tabBarActiveTintColor: colors.primaryTeal,
        tabBarInactiveTintColor: colors.darkText,
        
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home-outline'; // default icon
          
          if (route.name === 'home') {
            iconName = 'home-outline';
          } else if (route.name === 'myactivities') { // 👈 ADDED THIS
            iconName = 'list-outline';
          } else if (route.name === 'notifications') {
            iconName = 'notifications-outline';
          } else if (route.name === 'userprofile') {
            iconName = 'person-outline';
          }
          // Add any other tab icons you need, e.g.:
          // else if (route.name === 'caregivers') {
          //   iconName = 'heart-outline';
          // }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* These are the 3 screens you WANT to show in your tab bar */}
      <Tabs.Screen 
        name="home" 
        options={{ title: 'Home' }} 
      />

      <Tabs.Screen 
        name="myactivities" 
        options={{ title: 'My Activities' }} 
      />
      
      <Tabs.Screen 
        name="notifications" 
        options={{ title: 'Notifications' }} 
      />
      <Tabs.Screen 
        name="userprofile" 
        options={{ title: 'Profile' }} 
      />

      {/* --- HIDE ALL OTHER SCREENS --- */}
      {/* We MUST list all other files from your screenshot here
          so they are part of this layout, but hidden
          from the tab bar. This is what removes their headers.
      */}
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="bookingsuccess" options={{ href: null }} />
      <Tabs.Screen name="confirmedbooking" options={{ href: null }} />
      <Tabs.Screen name="deliveryoption" options={{ href: null }} />
      <Tabs.Screen name="findmedicine" options={{ href: null }} />
      <Tabs.Screen name="medicinedetail" options={{ href: null }} />
      <Tabs.Screen name="paymentsuccess" options={{ href: null }} />
      <Tabs.Screen name="searchingresult" options={{ href: null }} />

      {/* NOTE: Your screenshot also shows files like 'caregivers.tsx', 
        'findcaregiver.tsx', 'profile.tsx' etc. which are *not*
        in the (tabs) folder. My previous code included them by
        mistake. This new code *only* includes the files
        shown in your (tabs) folder screenshot.
      */}

    </Tabs>
  );
}