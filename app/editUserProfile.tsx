import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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

export default function EditProfileScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null); // Stores the *new* image asset
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null); // Existing photo
  
  // Loading/Error state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const authConfig = {
    headers: { Authorization: `Bearer ${session}` }
  };

  // Fetch current profile data to pre-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/profile`, authConfig);
        const { name, email, contactNumber, profilePhotoUrl } = response.data;
        setName(name);
        setEmail(email);
        setContactNumber(contactNumber);
        setCurrentPhotoUrl(profilePhotoUrl);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        Alert.alert("Error", "Could not load your profile data.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  // Function to pick an image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0]); // Save the full asset
    }
  };

  // Function to handle the form submission
  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert("Validation Error", "Name and Email are required.");
      return;
    }
    
    setSubmitting(true);
    let finalProfilePhotoUrl = currentPhotoUrl; // Start with the existing URL

    try {
      // --- STAGE 1: If a new image was picked, upload it ---
      if (newImage && newImage.mimeType) {
        
        // 1a. Get the presigned URL from *our* server
        const { data } = await axios.post(
          `${API_URL}/api/user/generate-upload-url`,
          { contentType: newImage.mimeType }, // Send the file type
          authConfig
        );
        
        const { uploadUrl, fileUrl } = data;

        // 1b. Read the image file from the phone's disk
        const response = await fetch(newImage.uri);
        const blob = await response.blob();
        
        // 1c. Upload the file *directly* to Cloudflare R2
        // 👇 --- THIS IS THE FIX --- 👇
        const r2Response = await fetch(uploadUrl, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': newImage.mimeType,
          },
        });

        // 1d. CHECK THE RESPONSE!
        if (!r2Response.ok) {
          // If R2 returned an error, get the error text and throw
          const errorText = await r2Response.text();
          throw new Error(`Cloudflare R2 upload failed: ${r2Response.status} ${errorText}`);
        }
        // 👆 --- END OF FIX --- 👆
        
        // 1e. Set the final URL to the new one (only if upload succeeded)
        finalProfilePhotoUrl = fileUrl;
        
      } else if (newImage) {
        // Handle case where image was picked but has no mimeType
        console.warn("Selected image is missing a mimeType. Skipping image upload.");
      }

      // --- STAGE 2: Update the profile on *our* server ---
      // This sends the text fields and the *final* image URL
      const profileData = {
        name,
        email,
        contactNumber,
        profilePhotoUrl: finalProfilePhotoUrl,
      };

      await axios.put(
        `${API_URL}/api/user/profile`, 
        profileData, // Send as simple JSON
        authConfig
      );
      
      Alert.alert('Success', 'Profile updated successfully!');
      router.replace('/(tabs)/userprofile'); // Go back to the profile screen

    } catch (err: any) {
      // Now, your upload error will be caught here!
      console.error("Failed to update profile:", err.response?.data || err.message);
      // Show the specific error to the user
      Alert.alert("Error", `Could not update profile: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Set the screen title
  useEffect(() => {
    navigation.setOptions({ title: 'Edit Profile' });
  }, [navigation]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#3A5A5A" /></View>;
  }

  // Determine which image URI to display
  const displayImageUri = (newImage ? newImage.uri : currentPhotoUrl) || undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: displayImageUri }}
            style={styles.avatar}
          />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        
        <Text style={styles.label}>Contact Number</Text>
        <TextInput style={styles.input} value={contactNumber} onChangeText={setContactNumber} />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleUpdate}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles consistent with your ProfileScreen
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#A8D1D1' },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8D1D1',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 100,
    borderWidth: 3,
    borderColor: '#6FADB0',
    backgroundColor: '#E0F2F2',
  },
  changePhotoText: {
    color: '#3A5A5A',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
  label: {
    width: '90%',
    color: '#3A5A5A',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#3A5A5A',
  },
  button: {
    backgroundColor: '#4A8F8F', // Darker green for save
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});