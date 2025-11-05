// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Auth Screens (Sign In, Sign Up, Verify) */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      {/* App Screens (Dashboard, Profile, Settings) */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />

      {/* Index/Default screen (often redirects to auth or app based on login state) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Catch-all for 404 */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// NOTE: You would typically define a separate stack for (auth) and (app) 
// using nested layout files, but this simplified root layout is a common starting point.
// You will still need to manually implement 'SignIn' or 'Login' screens 
// as they are referenced in your other code.