// app/(app)/settings.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, HelpCircle, Info, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BottomNav from './PharmacyBottomNavigation';



const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    email: false,
    sms: true,
  });

  const colors = {
    primary: '#6FADB0', // Adjusted color
    primaryDark: '#4A8F8F', // Adjusted color
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#E1E8ED',
  };

  const handleAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your preferences</Text>
        </LinearGradient>

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive instant alerts</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => setSettings({ ...settings, notifications: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.settingItem, styles.borderTop]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Email Alerts</Text>
                <Text style={styles.settingDescription}>Get updates via email</Text>
              </View>
              <Switch
                value={settings.email}
                onValueChange={(value) => setSettings({ ...settings, email: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.settingItem, styles.borderTop]}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>SMS Updates</Text>
                <Text style={styles.settingDescription}>Receive text messages</Text>
              </View>
              <Switch
                value={settings.sms}
                onValueChange={(value) => setSettings({ ...settings, sms: value })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Account Section */}
          <TouchableOpacity style={styles.menuCard} onPress={() => handleAlert('Account Settings', 'Account settings coming soon!')}>
            <View style={styles.menuContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Shield color={colors.primary} size={20} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Account</Text>
                <Text style={styles.menuDescription}>Manage your account settings</Text>
              </View>
            </View>
            <ChevronRight color={colors.textLight} size={20} />
          </TouchableOpacity>

          {/* Privacy & Security Section */}
          <TouchableOpacity style={styles.menuCard} onPress={() => handleAlert('Privacy & Security', 'Privacy & Security settings coming soon!')}>
            <View style={styles.menuContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Shield color={colors.primary} size={20} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Privacy & Security</Text>
                <Text style={styles.menuDescription}>Control your data and security</Text>
              </View>
            </View>
            <ChevronRight color={colors.textLight} size={20} />
          </TouchableOpacity>

          {/* Help & Support Section */}
          <TouchableOpacity style={styles.menuCard} onPress={() => handleAlert('Help & Support', 'Help & Support coming soon!')}>
            <View style={styles.menuContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <HelpCircle color={colors.primary} size={20} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>Help & Support</Text>
                <Text style={styles.menuDescription}>Get help and contact support</Text>
              </View>
            </View>
            <ChevronRight color={colors.textLight} size={20} />
          </TouchableOpacity>

          {/* About Section */}
          <TouchableOpacity style={styles.menuCard} onPress={() => handleAlert('About', 'GuardianNet v1.0.0\nYour trusted pharmacy portal')}>
            <View style={styles.menuContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Info color={colors.primary} size={20} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>About</Text>
                <Text style={styles.menuDescription}>App version and information</Text>
              </View>
            </View>
            <ChevronRight color={colors.textLight} size={20} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  mainContent: {
    flex: 1,
    padding: 16,
    marginBottom: 80,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    marginTop: 8,
    paddingTop: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default Settings;