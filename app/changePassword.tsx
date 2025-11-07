import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../AuthContext/AuthContext';

// -----------------------------------------------------------------
// ❗️ IMPORTANT: Use the same IP as your ProfileScreen
// -----------------------------------------------------------------
const API_URL = "http://192.168.43.117:5000";

export default function ChangePasswordScreen() {
  const { session } = useAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const authConfig = {
    headers: { Authorization: `Bearer ${session}` }
  };

  // --- NEW: Validation Logic from Register Page ---
  const validateNewPassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'New password must be at least 8 characters long';
    }
    if (!/[a-z]/.test(password)) {
      return 'New password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
      return 'New password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'New password must contain at least one number';
    }
    return null;
  };
  // ------------------------------------------------

  const handleSubmit = async () => {
    // 1. Basic empty checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // 2. --- NEW: Run the advanced validation ---
    const validationError = validateNewPassword(newPassword);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }
    // -------------------------------------------

    // 3. Check if passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 4. Call the API endpoint
      await axios.put(
        `${API_URL}/api/user/change-password`,
        { currentPassword, newPassword },
        authConfig
      );

      // 5. Handle success
      Alert.alert('Success', 'Password updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);

    } catch (err: any) {
      // 6. Handle errors
      console.error("Failed to change password:", err.response?.data || err.message);
      const message = err.response?.data?.message || 'An error occurred. Please try again.';
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Change Password</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              placeholderTextColor="#A8D1D1"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter your new password"
              placeholderTextColor="#A8D1D1"
            />
            {/* --- NEW: Password Hint Text --- */}
            <Text style={styles.passwordHint}>
              Must be at least 8 characters, include uppercase, lowercase, and numbers.
            </Text>
            {/* ------------------------------- */}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your new password"
              placeholderTextColor="#A8D1D1"
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#A8D1D1' },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3A5A5A',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    width: '90%',
    color: '#3A5A5A',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#3A5A5A',
    borderWidth: 2,
    borderColor: '#A8D1D1',
  },
  // --- NEW STYLE ---
  passwordHint: {
    width: '90%',
    fontSize: 12,
    color: '#4A8F8F',
    marginTop: 6,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  // -----------------
  button: {
    backgroundColor: '#4A8F8F',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});