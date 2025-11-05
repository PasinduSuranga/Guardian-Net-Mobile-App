// app/(auth)/login.tsx
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    // State and logic for handling login and navigation to /(app)/dashboard
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>Welcome back to Guardian Net</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput style={styles.input} placeholder="you@example.com" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput style={styles.input} placeholder="********" secureTextEntry />
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/(auth)/signup" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Create Account</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 28,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3A5A5A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#4A8F8F',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3A5A5A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#A8D1D1',
        color: '#3A5A5A',
    },
    button: {
        backgroundColor: '#6FADB0',
        paddingVertical: 17,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        flexWrap: 'wrap',
    },
    footerText: {
        fontSize: 15,
        color: '#4A8F8F',
    },
    linkText: {
        fontSize: 15,
        color: '#6FADB0',
        fontWeight: '700',
    },
});