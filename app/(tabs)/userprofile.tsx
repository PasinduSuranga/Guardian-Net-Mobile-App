import axios from "axios"; // Make sure to install: npm install axios
import { Link, useFocusEffect, useRouter } from "expo-router"; // 👈 ADDED useRouter
import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../AuthContext/AuthContext"; // 👈 Check this path

// -----------------------------------------------------------------
// ❗️ IMPORTANT: Set this to your backend's IP address and port.
// (e.g., 'http://192.168.1.5:5000' or 'https://your-api.com')
// -----------------------------------------------------------------
const API_URL = "http://192.168.43.117:5000";

// Define a type for our profile data
interface UserProfile {
  name: string;
  email: string;
  contactNumber: string;
  profilePhotoUrl: string;
  createdAt: string; // This will be an ISO date string
}

// --- ADDED GUEST PROMPT COMPONENT (from HomeScreen) ---
const GuestPrompt = () => {
  return (
    <View style={styles.guestPromptContainer}>
      <Text style={styles.guestPromptText}>
        Log in or create an account to view your profile and manage your account.
      </Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.loginButton} activeOpacity={0.7}>
          <Text style={styles.loginButtonText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
// ---------------------------------------------------

export default function ProfileScreen() {
  // --- MODIFIED ---
  // Added `sessionStatus` to check if user is a guest
  const { session, signOut, sessionStatus } = useAuth();
  const router = useRouter(); // 👈 ADDED ROUTER
  // ----------------

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This function formats the "createdAt" date
  const getJoinedDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // We use useFocusEffect so the data re-fetches if the user
  // edits their profile and comes back to this tab.
  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        // This check is still important:
        // Don't fetch if we're authenticated but session is somehow null
        if (!session) {
          // Only run fetch logic if we are authenticated
          if (sessionStatus === "authenticated") {
            setLoading(false);
            setError("No session token found. Please log in.");
          } else {
            // If we are a guest, just stop loading.
            setLoading(false);
            setError(null);
          }
          return;
        }

        try {
          setLoading(true);
          setError(null);

          const config = {
            headers: {
              Authorization: `Bearer ${session}`, // Send the token
            },
          };

          const response = await axios.get(
            `${API_URL}/api/user/profile`,
            config
          );
          setProfile(response.data);
        } catch (err: any) { // Add :any to 'err'
          console.error("Failed to fetch profile:", err);
          
          if (err.response) {
            console.error("Error Data:", err.response.data);
            console.error("Error Status:", err.response.status);
            setError(`Error ${err.response.status}: ${err.response.data.message || 'Server Error'}`);
          } else if (err.request) {
            console.error("Error Request:", err.request);
            setError("Couldn't connect to server. Check your network/IP.");
          } else {
            console.error("Error Message:", err.message);
            setError("An unknown error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, [session, sessionStatus]) // Re-run if session or status changes
  );

  const handleEditProfile = () => {
    router.push('/editUserProfile'); // Changed to .push for better navigation stack
  };

  // --- NEW FUNCTION ---
  const handleChangePassword = () => {
    router.push('/changePassword'); // This will navigate to app/changePassword.tsx
  };

  // This is the updated function with the 'async' keyword
  const handleSignOut = async () => {
    await signOut(); // This clears the session
    router.replace('/'); // This manually forces the redirect to the landing page
  };

  // --- Render States ---

  // --- THIS IS THE NEW LOGIC ---
  // 1. Check if user is a guest (or session is loading)
  if (sessionStatus !== "authenticated") {
    // Show the Guest UI
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Profile</Text>
          <GuestPrompt />
        </View>
      </SafeAreaView>
    );
  }

  // 2. If user IS authenticated, render your EXISTING UI
  // (This is your original `if (loading)` block)
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3A5A5A" />
        </View>
      </SafeAreaView>
    );
  }

  // --- Main Profile View (Authenticated) ---
  // (This is your original `return` block)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ADDED TITLE for consistency */}
        <Text style={styles.title}>Your Profile</Text>

        {error ? (
          <View style={styles.centered}>
             <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : profile ? (
          <>
            <Image
              source={{ uri: profile.profilePhotoUrl }} 
              style={styles.avatar}
            />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>{profile.contactNumber}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Joined</Text>
              <Text style={styles.value}>{getJoinedDate(profile.createdAt)}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* --- NEW BUTTON --- */}
            <TouchableOpacity
              style={[styles.button, styles.changePasswordButton]}
              onPress={handleChangePassword}
            >
              <Text style={styles.changePasswordButtonText}>Change Password</Text>
            </TouchableOpacity>
          </>
        ) : (
           <View style={styles.centered}>
             <Text style={styles.errorText}>Profile not found.</Text>
           </View>
        )}
        
        {/* Sign Out button is always visible (because we are authenticated) */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#A8D1D1",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  // --- ADDED TITLE STYLE ---
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3A5A5A",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // marginTop: 40, // Title provides spacing now
    borderWidth: 3,
    borderColor: "#6FADB0",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3A5A5A",
    marginTop: 15,
  },
  email: {
    fontSize: 15,
    color: "#3A5A5A",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D9534F', 
    textAlign: 'center',
    padding: 20,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
  },
  label: {
    color: "#4A8F8F",
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    color: "#3A5A5A",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#6FADB0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  // --- NEW STYLES ---
  changePasswordButton: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#6FADB0'
  },
  changePasswordButtonText: {
    color: "#6FADB0",
    fontWeight: "bold",
    fontSize: 16,
  },
  // ------------------
  logoutButton: {
    backgroundColor: "#CBCAC8",
    marginTop: 12,
  },
  logoutText: {
    color: "#3A5A5A",
    fontWeight: "bold",
    fontSize: 16,
  },
  // --- ADDED GUEST PROMPT STYLES ---
  guestPromptContainer: {
    backgroundColor: "#E0F2F2",
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: "center",
    width: '100%',
  },
  guestPromptText: {
    fontSize: 15,
    color: "#3A5A5A",
    textAlign: "center",
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#4A8F8F",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});