import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Sample user data
  const userData = {
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+1 (809) 555-0123',
    rnc: '123456789',
    cedula: '001-1234567-8',
    address: 'Av. Winston Churchill, Santo Domingo',
    loyaltyPoints: 1250,
    tier: 'Gold',
    totalOrders: 15,
    totalSpent: 2450.00,
  };

  const profileSections = [
    {
      title: 'Información Personal',
      items: [
        { label: 'Editar Perfil', icon: 'person.fill', action: () => console.log('Edit profile') },
        { label: 'Información de Contacto', icon: 'phone.fill', action: () => console.log('Contact info') },
        { label: 'Direcciones', icon: 'location.fill', action: () => console.log('Addresses') },
      ],
    },
    {
      title: 'Programa de Lealtad',
      items: [
        { label: 'Mis Puntos', icon: 'star.fill', action: () => router.push('/(tabs)/promotions'), badge: userData.loyaltyPoints },
        { label: 'Historial de Recompensas', icon: 'gift.fill', action: () => console.log('Rewards history') },
        { label: 'Referencias', icon: 'person.2.fill', action: () => router.push('/(tabs)/promotions') },
      ],
    },
    {
      title: 'Mis Datos',
      items: [
        { label: 'Historial de Pedidos', icon: 'clock.fill', action: () => router.push('/(tabs)/orders') },
        { label: 'Facturas', icon: 'doc.text.fill', action: () => console.log('Invoices') },
        { label: 'Métodos de Pago', icon: 'creditcard.fill', action: () => console.log('Payment methods') },
        { label: 'Suscripciones', icon: 'repeat.circle.fill', action: () => console.log('Subscriptions') },
      ],
    },
    {
      title: 'Salud y Vacunación',
      items: [
        { label: 'Mi Registro de Vacunas', icon: 'heart.text.square.fill', action: () => console.log('Vaccination record') },
        { label: 'Familia', icon: 'house.fill', action: () => console.log('Family members') },
        { label: 'Recordatorios', icon: 'bell.fill', action: () => router.push('/(tabs)/notifications') },
        { label: 'Certificados', icon: 'doc.badge.plus', action: () => console.log('Certificates') },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { label: 'Notificaciones', icon: 'bell.fill', toggle: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { label: 'Ubicación', icon: 'location.fill', toggle: true, value: locationEnabled, onToggle: setLocationEnabled },
        { label: 'Biometría', icon: 'faceid', toggle: true, value: biometricEnabled, onToggle: setBiometricEnabled },
        { label: 'Idioma', icon: 'globe', action: () => console.log('Language') },
        { label: 'Moneda', icon: 'dollarsign.circle.fill', action: () => console.log('Currency') },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { label: 'Centro de Ayuda', icon: 'questionmark.circle.fill', action: () => console.log('Help center') },
        { label: 'Contactar Soporte', icon: 'message.fill', action: () => console.log('Contact support') },
        { label: 'Términos y Condiciones', icon: 'doc.text', action: () => console.log('Terms') },
        { label: 'Política de Privacidad', icon: 'lock.fill', action: () => console.log('Privacy') },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            console.log('Logging out...');
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      default:
        return colors.primary;
    }
  };

  const renderProfileHeader = () => (
    <View style={[commonStyles.card, styles.profileHeader]}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <IconSymbol name="person.fill" size={40} color={colors.card} />
        </View>
        <View style={[styles.tierBadge, { backgroundColor: getTierColor(userData.tier) }]}>
          <IconSymbol name="crown.fill" size={12} color={colors.card} />
          <Text style={styles.tierText}>{userData.tier}</Text>
        </View>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={commonStyles.title}>{userData.name}</Text>
        <Text style={commonStyles.textSecondary}>{userData.email}</Text>
        <Text style={commonStyles.textSecondary}>{userData.phone}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData.totalOrders}</Text>
          <Text style={commonStyles.textSecondary}>Pedidos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${userData.totalSpent.toFixed(0)}</Text>
          <Text style={commonStyles.textSecondary}>Gastado</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userData.loyaltyPoints}</Text>
          <Text style={commonStyles.textSecondary}>Puntos</Text>
        </View>
      </View>
    </View>
  );

  const renderSection = (section: any) => (
    <View key={section.title} style={styles.section}>
      <Text style={[commonStyles.heading, styles.sectionTitle]}>{section.title}</Text>
      <View style={commonStyles.card}>
        {section.items.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index < section.items.length - 1 && styles.menuItemBorder
            ]}
            onPress={item.action}
            disabled={item.toggle}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <IconSymbol name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={commonStyles.text}>{item.label}</Text>
            </View>
            
            <View style={styles.menuItemRight}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              {item.toggle ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.card}
                />
              ) : (
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          {renderProfileHeader()}

          {/* Menu Sections */}
          {profileSections.map(renderSection)}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="arrow.right.square" size={20} color={colors.error} />
            <Text style={[commonStyles.text, { color: colors.error, marginLeft: 12 }]}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={commonStyles.textSmall}>VacunaExpress v1.0.0</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 4,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    backgroundColor: colors.error + '10',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
