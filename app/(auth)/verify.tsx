import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
const API_URL = 'http://192.168.43.117:5000/api/auth';
// ---------------

export default function VerifyScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

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

  // Cross-platform alert
  const showAlert = (title: string, message: string, onPress?: () => void) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n${message}`);
      if (onPress) onPress();
    } else {
      Alert.alert(title, message, onPress ? [{ text: 'OK', onPress }] : [{ text: 'OK' }]);
    }
  };

  const handleVerify = async () => {
    // Validation
    if (!otp.trim()) {
      showError('Please enter the OTP code');
      return;
    }
    if (otp.length !== 6) {
      showError('OTP must be exactly 6 digits');
      return;
    }
    if (!/^\d+$/.test(otp)) {
      showError('OTP must contain only numbers');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        showError(data.message || 'Verification failed. Please try again.');
      } else {
        // Success - redirect to login
        showAlert(
          'Success!',
          'Your account has been verified. Please log in to continue.',
          () => router.replace('/(auth)/login')
        );
      }
    } catch (err: any) {
      setLoading(false);
      if (err.message === 'Network request failed' || err.message.includes('fetch') || err.name === 'TypeError') {
        showError('Connection failed. Please check your internet and try again.');
      } else {
        showError('Something went wrong. Please try again later.');
      }
      console.error(err);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        showError(data.message || 'Failed to resend OTP');
      } else {
        showAlert('OTP Sent', 'A new OTP has been sent to your email.');
      }
    } catch (err: any) {
      setLoading(false);
      showError('Failed to resend OTP. Please try again.');
      console.error(err);
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
            <Text style={styles.title}>Verify Your Account</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.emailText}>{email || 'your email'}</Text>
            </Text>
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

          {/* OTP Input Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter OTP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#A8D1D1"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Verify Account</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP Section */}
            <View style={styles.resendSection}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity 
                onPress={handleResendOTP}
                disabled={loading}
              >
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              The verification code is valid for 10 minutes. Please check your spam folder if you don't see it in your inbox.
            </Text>
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#4A8F8F',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: '#6FADB0',
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: isSmallDevice ? 20 : 24,
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
    paddingVertical: isSmallDevice ? 16 : 18,
    borderRadius: 12,
    fontSize: isSmallDevice ? 20 : 24,
    borderWidth: 2,
    borderColor: '#A8D1D1',
    color: '#3A5A5A',
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
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
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isSmallDevice ? 20 : 24,
    flexWrap: 'wrap',
  },
  resendText: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#4A8F8F',
  },
  resendLink: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#6FADB0',
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#6FADB0',
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: isSmallDevice ? 12 : 13,
    color: '#3A5A5A',
    lineHeight: 18,
  },
});