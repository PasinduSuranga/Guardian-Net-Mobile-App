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
import { useAuth } from '../../AuthContext/AuthContext';

const { width, height } = Dimensions.get('window');

// Responsive sizing helpers
const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 850;
const isSmallWidth = width < 375;

// --- IMPORTANT ---
// Replace this with your computer's local IP address
const API_URL = 'http://192.168.43.117:5000/api/auth';
// ---------------

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const { signIn } = useAuth();
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

  const handleSignIn = async () => {
    // Validation
    if (!email.trim()) {
      showError('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      showError('Please enter your password');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // Handle "USER_NOT_VERIFIED" code from backend
        if (data.code === 'USER_NOT_VERIFIED') {
          showError('Account verification required. Redirecting...', 2500);
          setTimeout(() => {
            router.push({
              pathname: '/(auth)/verify',
              params: { email },
            });
          }, 2500);
        } else if (res.status === 401) {
          showError('Invalid email or password. Please try again.');
        } else if (res.status === 404) {
          showError('Account not found. Please sign up first.');
        } else {
          showError(data.message || 'Unable to sign in. Please try again.');
        }
      } else {
        await signIn(data.token);
      }
    } catch (err: any) {
      setLoading(false);
      // Handle network errors gracefully
      if (err.message === 'Network request failed' || err.message.includes('fetch') || err.name === 'TypeError') {
        showError('Connection failed. Please check your internet and try again.');
      } else {
        showError('Something went wrong. Please try again later.');
      }
      console.error(err);
    }
  };

  const handleGuest = () => {
    router.replace('/about');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access full features</Text>
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
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#A8D1D1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A8D1D1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.guestButton} 
              onPress={handleGuest}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign Up</Text>
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
    marginBottom: isSmallDevice ? 30 : 40,
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
    marginBottom: isSmallDevice ? 24 : 32,
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
    marginBottom: isSmallDevice ? 16 : 20,
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
  button: {
    backgroundColor: '#6FADB0',
    paddingVertical: isSmallDevice ? 15 : 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isSmallDevice ? 20 : 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBCAC8',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#4A8F8F',
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '500',
  },
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: isSmallDevice ? 15 : 17,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A8D1D1',
  },
  guestButtonText: {
    color: '#4A8F8F',
    fontSize: isSmallDevice ? 16 : 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: isSmallDevice ? 24 : 32,
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