
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro que desea cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handleContactInfo = () => {
    // TODO: Navigate to contact info screen
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handleAddresses = () => {
    // TODO: Navigate to addresses screen
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handlePaymentMethods = () => {
    router.push('/payment-methods');
  };

  const handleReferralProgram = () => {
    router.push('/referral-program');
  };

  if (!profile) {
    return null;
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.fill" size={48} color={colors.primary} />
          </View>
          <Text style={styles.name}>Dr. {profile.first_name} {profile.last_name}</Text>
          <Text style={styles.businessName}>{profile.business_name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Información Personal</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="person.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Editar Perfil</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleContactInfo}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="phone.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Información de Contacto</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleAddresses}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="location.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Direcciones</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="creditcard.circle" size={24} color={colors.primary} />
              <Text style={styles.menuItemText}>Métodos de Pago</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Referral Program */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Programa de Referidos</Text>
          
          <TouchableOpacity style={styles.referralCard} onPress={handleReferralProgram}>
            <View style={styles.referralContent}>
              <View style={styles.referralLeft}>
                <IconSymbol name="gift.fill" size={32} color={colors.success} />
                <View style={styles.referralText}>
                  <Text style={styles.referralTitle}>Invita y Gana</Text>
                  <Text style={styles.referralDescription}>
                    Refiere colegas y obtén créditos
                  </Text>
                </View>
              </View>
              <View style={styles.referralRight}>
                <Text style={styles.referralAmount}>RD$ 0.00</Text>
                <Text style={styles.referralLabel}>Disponible</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleReferralProgram}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="person.2.circle" size={24} color={colors.success} />
              <Text style={styles.menuItemText}>Usar en próxima compra</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Información de la Cuenta</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>RNC:</Text>
              <Text style={styles.infoValue}>{profile.rnc}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cédula:</Text>
              <Text style={styles.infoValue}>{profile.cedula}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{profile.address}</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color={colors.error} />
            <Text style={styles.signOutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Footer spacing for tab bar */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  businessName: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  menuItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    ...typography.body1,
    color: colors.text,
    marginLeft: spacing.md,
  },
  referralCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  referralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referralLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  referralText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  referralTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  referralDescription: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  referralRight: {
    alignItems: 'flex-end',
  },
  referralAmount: {
    ...typography.h6,
    color: colors.success,
    fontWeight: '700',
  },
  referralLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    ...typography.body2,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  signOutButton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    ...shadows.sm,
  },
  signOutText: {
    ...typography.body1,
    color: colors.error,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
  footerSpacing: {
    height: spacing.xxl,
  },
});
