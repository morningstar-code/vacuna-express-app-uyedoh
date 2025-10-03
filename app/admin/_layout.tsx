
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Panel de Administración',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="inventory"
        options={{
          title: 'Gestión de Inventario',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Gestión de Pedidos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="promotions"
        options={{
          title: 'Gestión de Promociones',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: 'Gestión de Usuarios',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Análisis y Reportes',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
