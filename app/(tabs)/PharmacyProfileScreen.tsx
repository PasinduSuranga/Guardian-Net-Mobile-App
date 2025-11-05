// app/(app)/profile.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import BottomNav from './PharmacyBottomNavigation'; // Adjusted path

const Profile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    pharmacyName: 'Medicare Pharmacy',
    licenseNumber: 'PH-2024-1234',
    contactDetails: '+94 77 123 4567',
    bio: 'Trusted community pharmacy serving Colombo for over 10 years.',
  });

  const colors = {
    primary: '#6FADB0',
    primaryDark: '#4A8F8F',
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#E1E8ED',
    urgent: '#FF5252',
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Log Out', 
        onPress: () => router.replace('/(auth)/login'), // Use Expo Router navigation
        style: 'destructive' 
      },
    ]);
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleEditPhoto = () => {
    Alert.alert('Photo Upload', 'Photo upload feature coming soon!');
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Profile Management</Text>
          <Text style={styles.headerSubtitle}>Keep your details up-to-date</Text>
        </LinearGradient>

        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {/* Profile Picture */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{getInitials(formData.pharmacyName)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: '#FFFFFF' }]}
              onPress={handleEditPhoto}
            >
              <Camera color={colors.primary} size={16} />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputCard}>
              <Text style={styles.label}>Pharmacy Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.pharmacyName}
                onChangeText={(text) => setFormData({ ...formData, pharmacyName: text })}
                editable={isEditing}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>License Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.licenseNumber}
                onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
                editable={isEditing}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>Contact Details</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={formData.contactDetails}
                onChangeText={(text) => setFormData({ ...formData, contactDetails: text })}
                editable={isEditing}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>Profile Bio</Text>
              <TextInput
                style={[styles.textArea, !isEditing && styles.inputDisabled]}
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                editable={isEditing}
                multiline
                numberOfLines={4}
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!isEditing ? (
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.textLight }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.logoutButton, { borderColor: colors.urgent }]}
              onPress={handleLogout}
            >
              <Text style={[styles.logoutButtonText, { color: colors.urgent }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    marginBottom: 80,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '50%',
    marginRight: -20, // Adjust this offset
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#F5F7FA',
    color: '#7F8C8D',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  editButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    marginTop: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Profile;