import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    // Add the screenOptions prop here
    <Tabs
      screenOptions={{
        headerShown: false, // 👈 This hides the header
      }}
    >
      <Tabs.Screen
        name="home" // 👈 This matches 'home.tsx'
        options={{
          title: 'Home', // 👈 This is the text label on the tab
        }}
      />

      {/* <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      /> */}
    </Tabs>
  );
}