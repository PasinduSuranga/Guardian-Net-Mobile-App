import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// NOTE: These imports will show as errors in this web preview,
// but they are correct for your Expo project.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../AuthContext/AuthContext'; // Check this path

// --- Component for Logged-In Users ---
const UserDashboard = () => {
  const { session, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, User!</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>
      <Text style={styles.tokenTitle}>Your Session Token:</Text>
      <Text style={styles.token} selectable>{session}</Text>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Component for Guests ---
const GuestDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Guest!</Text>
      <Text style={styles.subtitle}>
        You are browsing in guest mode.
      </Text>
      <Text style={styles.info}>
        Sign in or create an account to access all features.
      </Text>
      {/* You could add a <Link href="/(auth)/login"> button here 
        to prompt guests to sign in.
      */}
    </View>
  );
};

// --- Main Screen ---
// This component checks the auth status and renders the correct dashboard.
export default function HomeScreen() {
  const { sessionStatus } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      {sessionStatus === 'authenticated' ? (
        <UserDashboard />
      ) : (
        <GuestDashboard />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c6c70',
    marginBottom: 32,
  },
  info: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tokenTitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 20,
  },
  token: {
    fontSize: 12,
    color: '#000',
    // Use a monospace font if available
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    maxWidth: '90%',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#FF3B30', // A red for sign out
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
});