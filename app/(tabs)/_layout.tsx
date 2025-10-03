
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Inicio',
    },
    {
      name: 'catalog',
      route: '/(tabs)/catalog',
      icon: 'list.bullet',
      label: 'Catálogo',
    },
    {
      name: 'promotions',
      route: '/(tabs)/promotions',
      icon: 'tag.fill',
      label: 'Ofertas',
    },
    {
      name: 'orders',
      route: '/(tabs)/orders',
      icon: 'shippingbox.fill',
      label: 'Pedidos',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person.fill',
      label: 'Perfil',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Inicio</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="catalog">
          <Icon sf="list.bullet" drawable="ic_catalog" />
          <Label>Catálogo</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="promotions">
          <Icon sf="tag.fill" drawable="ic_promotions" />
          <Label>Ofertas</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="orders">
          <Icon sf="shippingbox.fill" drawable="ic_orders" />
          <Label>Pedidos</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person.fill" drawable="ic_profile" />
          <Label>Perfil</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="catalog" />
        <Stack.Screen name="promotions" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="education" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
