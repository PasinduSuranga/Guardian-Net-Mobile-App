import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const isSmallDevice = height < 700;
const isMediumDevice = height >= 700 && height < 850;

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to{'\n'}GUARDIAN NET</Text>
            <Text style={styles.subtitle}>
              Easily connect with verified caregivers and have your medicines safely delivered to your home.
            </Text>
            
            <View style={styles.featureContainer}>
              <View style={styles.featurePill}>
                <Text style={styles.featureText}>👨‍⚕️ Find Caregivers</Text>
              </View>
              <View style={styles.featurePill}>
                <Text style={styles.featureText}>💊 Order Medicines</Text>
              </View>
              <View style={styles.featurePill}>
                <Text style={styles.featureText}>🚚 Have it delivered</Text>
              </View>
            </View>

            <Link href="/(tabs)/deliveryoption" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.footerWrapper}>
            <Text style={styles.footerText}>
              Your health, our priority
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: isSmallDevice ? 15 : 20,
    justifyContent: 'space-between', 
    alignItems: 'center',
    minHeight: height - 100,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    paddingVertical: isSmallDevice ? 20 : isMediumDevice ? 30 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoCircle: {
    width: isSmallDevice ? width * 0.35 : isMediumDevice ? width * 0.38 : width * 0.42,
    height: isSmallDevice ? width * 0.35 : isMediumDevice ? width * 0.38 : width * 0.42,
    borderRadius: isSmallDevice ? (width * 0.35) / 2 : isMediumDevice ? (width * 0.38) / 2 : (width * 0.42) / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A8D1D1',
    ...Platform.select({
      ios: {
        shadowColor: '#6FADB0',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: '75%',
    height: '75%',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingVertical: isSmallDevice ? 10 : 15,
  },
  title: {
    fontSize: isSmallDevice ? 26 : isMediumDevice ? 29 : 32,
    fontWeight: '700',
    color: '#3A5A5A',
    textAlign: 'center',
    marginBottom: isSmallDevice ? 12 : 16,
    lineHeight: isSmallDevice ? 34 : 40,
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#4A8F8F',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: isSmallDevice ? 20 : 28,
    lineHeight: isSmallDevice ? 20 : 24,
  },
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isSmallDevice ? 8 : 12,
    paddingHorizontal: 8,
    marginBottom: isSmallDevice ? 24 : 32,
  },
  featurePill: {
    backgroundColor: '#A8D1D1',
    paddingHorizontal: isSmallDevice ? 12 : 16,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6FADB0',
    ...Platform.select({
      ios: {
        shadowColor: '#6FADB0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  featureText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#3A5A5A',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6FADB0',
    paddingVertical: isSmallDevice ? 16 : 18,
    paddingHorizontal: isSmallDevice ? 40 : 48,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A8F8F',
    ...Platform.select({
      ios: {
        shadowColor: '#4A8F8F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerWrapper: {
    paddingVertical: isSmallDevice ? 15 : 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#4A8F8F',
    fontWeight: '500',
  },
});