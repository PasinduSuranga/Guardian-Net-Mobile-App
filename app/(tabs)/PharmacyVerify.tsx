import { Link, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native'; // ✅ Make sure this package is installed
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [fadeAnim] = useState(new Animated.Value(0));

  // 🔧 Smooth fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔧 Resend timer countdown
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;

    if (resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [resendTimer]);

  // 🔧 Verify OTP handler
  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);

    // Simulated delay
    setTimeout(() => {
      setIsVerifying(false);
      alert('OTP Verified ✅');
      router.push('/home' as any);
    }, 2000);
  };

  // 🔧 Resend OTP handler
  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      alert('OTP Resent!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Mail size={80} color="#007BFF" />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to your email
        </Text>

        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
        />

        <TouchableOpacity
          style={[styles.button, isVerifying && { opacity: 0.7 }]}
          onPress={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResend}
          disabled={resendTimer > 0}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.resendText}>
            {resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : 'Resend OTP'}
          </Text>
        </TouchableOpacity>

        <Link href="/login" style={styles.backLink}>
          Back to Login
        </Link>
      </Animated.View>
    </ScrollView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  otpInput: {
    width: width * 0.8,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#007BFF',
    borderRadius: 12,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    width: width * 0.8,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendText: {
    color: '#007BFF',
    fontSize: 16,
  },
  backLink: {
    color: '#555',
    fontSize: 15,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});
