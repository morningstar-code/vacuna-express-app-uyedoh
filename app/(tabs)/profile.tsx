
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
import { colors, commonStyles, spacing, borderRadius, typography } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Sample user data
  const userData = {
    name: 'Dr. Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+1 (809) 555-0123',
    rnc: '123456789',
    cedula: '001-1234567-8',
    centerName: 'Clínica San Rafael',
    address: 'Av. Winston Churchill, Santo Domingo',
    loyaltyPoints: 1250,
    tier: 'Gold',
    totalOrders: 15,
    totalSpent: 2450.00,
  };

  // Clean profile sections - only relevant for doctor/client
  const profileSections = [
    {
      title: 'Información Personal',
      items: [
        { label: 'Editar Perfil', icon: 'person.fill', action: () => console.log('Edit profile') },
        { label: 'Información de Contacto', icon: 'phone.fill', action: () => console.log('Contact info') },
        { label: 'Direcciones', icon: 'location.fill', action: () => console.log('Addresses') },
        { label: 'Métodos de Pago', icon: 'creditcard.fill', action: () => router.push('/payment-methods') },
      ],
    },
    {
      title: 'Programa de Lealtad',
      items: [
        { label: 'Mis Puntos', icon: 'star.fill', action: () => router.push('/loyalty-program'), badge: userData.loyaltyPoints },
        { label: 'Recompensas', icon: 'gift.fill', action: () => router.push('/loyalty-program') },
        { label: 'Referir Amigos', icon: 'person.2.fill', action: () => router.push('/referral-program') },
      ],
    },
    {
      title: 'Mis Datos',
      items: [
        { label: 'Historial de Pedidos', icon: 'clock.fill', action: () => router.push('/(tabs)/orders') },
        { label: 'Facturas', icon: 'doc.text.fill', action: () => console.log('Invoices') },
        { label: 'Suscripciones', icon: 'repeat.circle.fill', action: () => router.push('/subscriptions') },
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
        <Text style={styles.centerName}>{userData.centerName}</Text>
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
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          {renderProfileHeader()}

          {/* Menu Sections */}
          {profileSections.map(renderSection)}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="arrow.right.square" size={20} color={colors.error} />
            <Text style={[commonStyles.text, { color: colors.error, marginLeft: spacing.md }]}>
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
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xxl, // 24dp bottom padding to avoid tab bar overlap
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
    marginLeft: spacing.xs,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
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
    marginBottom: spacing.xxl, // 24dp between sections
  },
  sectionTitle: {
    marginBottom: spacing.md, // 12-16dp for section titles
    paddingHorizontal: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
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
    marginRight: spacing.md,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
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
    paddingVertical: spacing.lg,
    marginVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.error + '10',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
});
