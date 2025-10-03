
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, // Primary blue for active tabs
        tabBarInactiveTintColor: colors.text, // Contrasting color for inactive tabs
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Solid white background
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB', // Subtle shadow above
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 34 : 8,
          paddingTop: 8,
          elevation: 8, // Android shadow
          shadowColor: '#E5E7EB', // iOS shadow - subtle gray
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'list.bullet.clipboard.fill' : 'list.bullet.clipboard'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'shippingbox.fill' : 'shippingbox'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Educación',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'book.fill' : 'book'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name={focused ? 'bell.fill' : 'bell'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
