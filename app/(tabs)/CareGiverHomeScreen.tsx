import {
  Calendar,
  Clipboard,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
} from 'lucide-react-native'; // ✅ For React Native
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type MenuItem = {
  id: number;
  title: string;
  icon: React.ElementType;
  color: string;
};

export default function CareGiverHomeScreen() {
  const [currentAssignment] = useState({
    patient: 'Mr. Sunil Fernando',
    location: 'National Hospital, Rm 304-A',
  });

  const menuItems: MenuItem[] = [
    { id: 1, title: 'Booking Requests', icon: Calendar, color: 'from-blue-400 to-purple-500' },
    { id: 2, title: 'Patient Care Log', icon: Clipboard, color: 'from-blue-400 to-purple-500' },
    { id: 3, title: 'My Assignments', icon: FileText, color: 'from-blue-400 to-purple-500' },
    { id: 4, title: 'Messages', icon: MessageSquare, color: 'from-blue-400 to-purple-500' },
    { id: 5, title: 'Earnings', icon: DollarSign, color: 'from-blue-400 to-purple-500' },
    { id: 6, title: 'My Schedule', icon: Clock, color: 'from-blue-400 to-purple-500' },
  ];

  const handleMenuClick = (item: MenuItem) => {
    console.log('Menu clicked:', item.title);
    Alert.alert('Menu Clicked', `${item.title} clicked!`);
  };

  const handleLogUpdate = () => {
    console.log('Log Patient Update clicked');
    Alert.alert('Log Patient Update', 'Log Patient Update clicked!');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F7FA',
        paddingVertical: 20,
      }}
    >
      <View
        style={{
          width: '90%',
          backgroundColor: 'white',
          borderRadius: 30,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: '#4F46E5',
            paddingVertical: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Welcome</Text>
        </View>

        {/* Today's Schedule Card */}
        <View
          style={{
            backgroundColor: '#6366F1',
            margin: 20,
            borderRadius: 25,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Today's Schedule
          </Text>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: 'white', fontSize: 14 }}>Current Assignment:</Text>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
              {currentAssignment.patient}
            </Text>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: 'white', fontSize: 14 }}>Location:</Text>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
              {currentAssignment.location}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogUpdate}
            style={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Log Patient Update</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
        >
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleMenuClick(item)}
                style={{
                  width: '47%',
                  backgroundColor: '#EEF2FF',
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  marginVertical: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    backgroundColor: '#6366F1',
                    borderRadius: 50,
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <IconComponent color="white" size={26} />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: 13,
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
