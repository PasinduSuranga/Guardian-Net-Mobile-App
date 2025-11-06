import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Responsive sizing helpers
const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 850;
const isSmallWidth = width < 375;

// --- IMPORTANT ---
// Replace this with your computer's local IP address
const API_URL = 'http://192.168.8.139:5000/api/auth/register';
// ---------------

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const router = useRouter();

  // Show error with animation
  const showError = (message: string, duration: number = 4000) => {
    setErrorMessage(message);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setErrorMessage(''));
  };

  // Validation functions
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      showError('Please enter your name');
      return false;
    }
    if (name.trim().length < 2) {
      showError('Name must be at least 2 characters long');
      return false;
    }
    return true;
  };

  const validateContactNumber = (contact: string): boolean => {
    if (!contact.trim()) {
      showError('Please enter your contact number');
      return false;
    }
    // Remove spaces and special characters for validation
    const cleanedContact = contact.replace(/[\s\-\(\)]/g, '');
    
    // Check if it contains only digits and optional + at start
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleanedContact)) {
      showError('Please enter a valid contact number (10-15 digits)');
      return false;
    }
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      showError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      showError('Please enter a password');
      return false;
    }
    if (password.length < 8) {
      showError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      showError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      showError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      showError('Password must contain at least one number');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    // Validate all fields
    if (!validateName(name)) return;
    if (!validateContactNumber(contactNumber)) return;
    if (!validateEmail(email)) return;
    if (!validatePassword(password)) return;

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          contactNumber,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        showError(data.message || 'Registration failed. Please try again.');
      } else {
        // Navigate to verification screen
        router.push({ 
          pathname: '/(auth)/verify', 
          params: { email: email } 
        });
      }
    } catch (err: any) {
      setLoading(false);
      if (err.message === 'Network request failed' || err.message.includes('fetch') || err.name === 'TypeError') {
        showError('Connection failed. Please check your internet and try again.');
      } else {
        showError('Something went wrong. Please try again later.');
      }
      console.error('Sign up failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>Guardian Net</Text>
            <Text style={styles.tagline}>Your Health, Our Priority</Text>
          </View>

          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to access personalized care</Text>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
              <View style={styles.errorIconContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
              </View>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </Animated.View>
          ) : null}

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Pasindu Suranga"
                placeholderTextColor="#A8D1D1"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+94 76 276 5131 or 076 276 5131"
                placeholderTextColor="#A8D1D1"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#A8D1D1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password (min. 8 characters)"
                placeholderTextColor="#A8D1D1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <Text style={styles.passwordHint}>
                Must include uppercase, lowercase, and numbers
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#A8D1D1"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: isSmallWidth ? 24 : 28,
    paddingTop: isSmallDevice ? 20 : 40,
    paddingBottom: 30,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: isSmallDevice ? 24 : 32,
  },
  brandName: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: '700',
    color: '#3A5A5A',
    marginBottom: 4,
  },
  tagline: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#4A8F8F',
    fontWeight: '500',
  },
  headerSection: {
    marginBottom: isSmallDevice ? 20 : 24,
  },
  title: {
    fontSize: isSmallDevice ? 26 : 28,
    fontWeight: '700',
    color: '#3A5A5A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#4A8F8F',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#D4B25E',
    ...Platform.select({
      ios: {
        shadowColor: '#D4B25E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  errorIconContainer: {
    marginRight: 12,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    color: '#3A5A5A',
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: isSmallDevice ? 14 : 16,
  },
  inputLabel: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#3A5A5A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: isSmallDevice ? 14 : 16,
    borderRadius: 12,
    fontSize: isSmallDevice ? 15 : 16,
    borderWidth: 2,
    borderColor: '#A8D1D1',
    color: '#3A5A5A',
    ...Platform.select({
      ios: {
        shadowColor: '#6FADB0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  passwordHint: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#4A8F8F',
    marginTop: 6,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#6FADB0',
    paddingVertical: isSmallDevice ? 15 : 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: isSmallDevice ? 12 : 16,
    ...Platform.select({
      ios: {
        shadowColor: '#4A8F8F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: '#CBCAC8',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 16 : 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: isSmallDevice ? 20 : 24,
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#4A8F8F',
  },
  linkText: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#6FADB0',
    fontWeight: '700',
  },
});