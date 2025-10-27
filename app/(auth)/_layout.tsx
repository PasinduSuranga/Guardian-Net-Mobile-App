import { Stack } from 'expo-router';
import React from 'react';

// NOTE: The error about 'expo-router' is expected in this web preview.
// This code is correct for your Expo project.

/**
 * This layout component defines the navigation stack for the (auth) group.
 * All screens inside /app/(auth)/ will be part of this stack.
 */
export default function AuthLayout() {
  return (
    <Stack
      // This is the fix: It hides the header for all screens in this stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

