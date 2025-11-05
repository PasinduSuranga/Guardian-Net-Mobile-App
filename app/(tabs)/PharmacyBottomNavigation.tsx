// components/BottomNav.tsx
import { useRouter, useSegments } from 'expo-router';
import { Home, MessageCircle, Settings, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BottomNav: React.FC = () => {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1]; // e.g., 'dashboard', 'profile'

  const colors = {
    primary: '#6FADB0',
    textLight: '#4A8F8F',
    border: '#E1E8ED',
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', route: 'dashboard' },
    { icon: User, label: 'Profile', route: 'profile' },
    { icon: MessageCircle, label: 'Messages', route: 'messages' },
    { icon: Settings, label: 'Settings', route: 'settings' },
  ];

  // ✅ Type-safe fix with `as any` to silence TS route typing error
  const navigateTo = (route: string) => {
    router.navigate(`/(app)/${route}` as any);
  };

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.route;

        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => navigateTo(item.route)}
            activeOpacity={0.8}
          >
            <Icon
              color={isActive ? colors.primary : colors.textLight}
              size={22}
              strokeWidth={isActive ? 3 : 2}
            />
            <Text
              style={[
                styles.navLabel,
                { color: isActive ? colors.primary : colors.textLight },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 8, // Handles iPhone safe area
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default BottomNav;
