// app/(app)/messages.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomNav from './PharmacyBottomNavigation'; // Adjusted path

const Messages = () => {
    const colors = {
        primary: '#6FADB0',
        primaryDark: '#4A8F8F',
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Messages</Text>
                    <Text style={styles.headerSubtitle}>Your secure communication hub.</Text>
                </LinearGradient>
                <View style={styles.mainContent}>
                    <Text style={styles.placeholderText}>
                        Your messages will appear here.
                    </Text>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
    },
    placeholderText: {
        fontSize: 16,
        color: '#7F8C8D',
    }
});

export default Messages;