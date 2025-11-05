// app/(app)/dashboard.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomNav from './PharmacyBottomNavigation'; // Adjusted path

const Dashboard = () => {
    const colors = {
        primary: '#6FADB0',
        primaryDark: '#4A8F8F',
        background: '#F5F7FA',
        text: '#2C3E50',
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Welcome Back!</Text>
                    <Text style={styles.headerSubtitle}>Ready to manage today's tasks.</Text>
                </LinearGradient>

                <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Daily Summary</Text>
                        <Text style={styles.cardText}>You have 5 pending messages.</Text>
                        <Text style={styles.cardText}>2 appointments scheduled today.</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Quick Actions</Text>
                        <Text style={styles.cardText}>Go to Messages, Profile, or Settings using the navigation bar.</Text>
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
        marginBottom: 20,
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
        paddingHorizontal: 20,
        marginBottom: 80,
    },
    card: {
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 4,
    }
});

export default Dashboard;