
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  TextInput,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const referralData = {
  referralCode: 'VACUNA2024ABC',
  totalReferrals: 8,
  successfulReferrals: 6,
  pendingReferrals: 2,
  totalEarnings: 1200,
  availableBalance: 800,
  referralBonus: 200,
  refereeBonus: 100,
};

const referralHistory = [
  {
    id: 'ref-1',
    name: 'María González',
    email: 'maria@email.com',
    status: 'completed',
    dateReferred: '2024-01-15',
    dateCompleted: '2024-01-18',
    bonus: 200,
  },
  {
    id: 'ref-2',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    status: 'completed',
    dateReferred: '2024-01-10',
    dateCompleted: '2024-01-12',
    bonus: 200,
  },
  {
    id: 'ref-3',
    name: 'Ana Martínez',
    email: 'ana@email.com',
    status: 'pending',
    dateReferred: '2024-01-20',
    dateCompleted: null,
    bonus: 0,
  },
  {
    id: 'ref-4',
    name: 'Luis Pérez',
    email: 'luis@email.com',
    status: 'pending',
    dateReferred: '2024-01-22',
    dateCompleted: null,
    bonus: 0,
  },
];

export default function ReferralProgramScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'invite' | 'history'>('overview');
  const [inviteEmail, setInviteEmail] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.accent;
      case 'pending':
        return colors.warning;
      case 'expired':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'expired':
        return 'Expirado';
      default:
        return 'Desconocido';
    }
  };

  const handleCopyReferralCode = async () => {
    try {
      await Clipboard.setString(referralData.referralCode);
      Alert.alert('¡Copiado!', 'Código de referido copiado al portapapeles');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
      Alert.alert('Error', 'No se pudo copiar el código');
    }
  };

  const handleShareReferral = async () => {
    try {
      const message = `¡Únete a VacunaExpress y obtén $${referralData.refereeBonus} DOP de descuento en tu primera compra! Usa mi código: ${referralData.referralCode}\n\nDescarga la app: https://vacunaexpress.com/app`;
      
      await Share.share({
        message,
        title: 'Únete a VacunaExpress',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleSendInvite = () => {
    if (!inviteEmail) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    Alert.alert(
      'Invitación Enviada',
      `Se ha enviado una invitación a ${inviteEmail}`,
      [
        {
          text: 'OK',
          onPress: () => setInviteEmail(''),
        },
      ]
    );
  };

  const handleWithdrawEarnings = () => {
    if (referralData.availableBalance === 0) {
      Alert.alert('Sin Fondos', 'No tienes fondos disponibles para retirar');
      return;
    }

    Alert.alert(
      'Retirar Ganancias',
      `¿Deseas retirar $${referralData.availableBalance} DOP a tu método de pago predeterminado?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retirar',
          onPress: () => {
            Alert.alert('¡Éxito!', 'Tu retiro ha sido procesado exitosamente');
          },
        },
      ]
    );
  };

  const renderOverview = () => (
    <>
      {/* Earnings Card */}
      <View style={[commonStyles.card, styles.earningsCard]}>
        <View style={styles.earningsHeader}>
          <IconSymbol name="dollarsign.circle.fill" size={32} color={colors.accent} />
          <View style={styles.earningsInfo}>
            <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.accent }]}>
              ${referralData.availableBalance}
            </Text>
            <Text style={commonStyles.textSecondary}>Disponible para retirar</Text>
          </View>
          <TouchableOpacity
            style={[buttonStyles.primary, styles.withdrawButton]}
            onPress={handleWithdrawEarnings}
          >
            <Text style={[commonStyles.buttonText, { fontSize: 14 }]}>
              Retirar
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.earningsDetails}>
          <View style={styles.earningsItem}>
            <Text style={commonStyles.textSecondary}>Total ganado</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${referralData.totalEarnings}
            </Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={commonStyles.textSecondary}>Por referido</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              ${referralData.referralBonus}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[commonStyles.card, styles.statCard]}>
          <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', color: colors.primary }]}>
            {referralData.totalReferrals}
          </Text>
          <Text style={commonStyles.textSecondary}>Total Referidos</Text>
        </View>
        <View style={[commonStyles.card, styles.statCard]}>
          <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', color: colors.accent }]}>
            {referralData.successfulReferrals}
          </Text>
          <Text style={commonStyles.textSecondary}>Exitosos</Text>
        </View>
        <View style={[commonStyles.card, styles.statCard]}>
          <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', color: colors.warning }]}>
            {referralData.pendingReferrals}
          </Text>
          <Text style={commonStyles.textSecondary}>Pendientes</Text>
        </View>
      </View>

      {/* How it Works */}
      <View style={[commonStyles.card, styles.howItWorksCard]}>
        <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
          ¿Cómo Funciona?
        </Text>
        
        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={commonStyles.text}>Comparte tu código de referido</Text>
              <Text style={commonStyles.textSecondary}>
                Invita a amigos y familiares usando tu código único
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={commonStyles.text}>Tu amigo se registra y compra</Text>
              <Text style={commonStyles.textSecondary}>
                Obtiene ${referralData.refereeBonus} de descuento en su primera compra
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: colors.warning }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={commonStyles.text}>Tú ganas ${referralData.referralBonus}</Text>
              <Text style={commonStyles.textSecondary}>
                Recibe tu bonificación cuando complete su primera compra
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  const renderInvite = () => (
    <>
      {/* Referral Code Card */}
      <View style={[commonStyles.card, styles.referralCodeCard]}>
        <Text style={[commonStyles.heading, { marginBottom: 16, textAlign: 'center' }]}>
          Tu Código de Referido
        </Text>
        
        <View style={styles.codeContainer}>
          <Text style={styles.referralCode}>{referralData.referralCode}</Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyReferralCode}
          >
            <IconSymbol name="doc.on.doc" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[buttonStyles.primary, styles.shareButton]}
          onPress={handleShareReferral}
        >
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.card} />
          <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>
            Compartir Código
          </Text>
        </TouchableOpacity>
      </View>

      {/* Email Invite */}
      <View style={[commonStyles.card, styles.emailInviteCard]}>
        <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
          Invitar por Correo
        </Text>
        
        <TextInput
          style={commonStyles.input}
          placeholder="correo@ejemplo.com"
          value={inviteEmail}
          onChangeText={setInviteEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TouchableOpacity
          style={[buttonStyles.accent, styles.inviteButton]}
          onPress={handleSendInvite}
        >
          <Text style={commonStyles.buttonText}>Enviar Invitación</Text>
        </TouchableOpacity>
      </View>

      {/* Benefits Card */}
      <View style={[commonStyles.card, styles.benefitsCard]}>
        <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
          Beneficios del Programa
        </Text>
        
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <IconSymbol name="dollarsign.circle.fill" size={20} color={colors.accent} />
            <Text style={styles.benefitText}>
              Gana ${referralData.referralBonus} por cada referido exitoso
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol name="gift.fill" size={20} color={colors.warning} />
            <Text style={styles.benefitText}>
              Tu amigo obtiene ${referralData.refereeBonus} de descuento
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol name="infinity" size={20} color={colors.primary} />
            <Text style={styles.benefitText}>
              Sin límite de referidos
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <IconSymbol name="creditcard.fill" size={20} color={colors.secondary} />
            <Text style={styles.benefitText}>
              Retiros rápidos a tu cuenta
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderHistory = () => (
    <>
      <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
        Historial de Referidos
      </Text>
      
      {referralHistory.map((referral) => (
        <View key={referral.id} style={[commonStyles.card, styles.historyCard]}>
          <View style={styles.historyHeader}>
            <View style={styles.historyInfo}>
              <Text style={commonStyles.heading}>{referral.name}</Text>
              <Text style={commonStyles.textSecondary}>{referral.email}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(referral.status) }]}>
              <Text style={styles.statusText}>{getStatusText(referral.status)}</Text>
            </View>
          </View>
          
          <View style={styles.historyDetails}>
            <View style={styles.historyItem}>
              <Text style={commonStyles.textSecondary}>Fecha de referido:</Text>
              <Text style={commonStyles.text}>
                {new Date(referral.dateReferred).toLocaleDateString('es-DO')}
              </Text>
            </View>
            
            {referral.dateCompleted && (
              <View style={styles.historyItem}>
                <Text style={commonStyles.textSecondary}>Fecha completado:</Text>
                <Text style={commonStyles.text}>
                  {new Date(referral.dateCompleted).toLocaleDateString('es-DO')}
                </Text>
              </View>
            )}
            
            <View style={styles.historyItem}>
              <Text style={commonStyles.textSecondary}>Bonificación:</Text>
              <Text style={[
                commonStyles.text,
                {
                  color: referral.bonus > 0 ? colors.accent : colors.textSecondary,
                  fontWeight: '600',
                }
              ]}>
                ${referral.bonus}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'invite':
        return renderInvite();
      case 'history':
        return renderHistory();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Programa de Referidos',
          headerShown: true,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Programa de Referidos</Text>
          <Text style={commonStyles.textSecondary}>
            Invita amigos y gana dinero
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { key: 'overview', label: 'Resumen' },
            { key: 'invite', label: 'Invitar' },
            { key: 'history', label: 'Historial' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && styles.tabActive,
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab.key && styles.tabTextActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.card,
    ...commonStyles.shadow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  earningsCard: {
    marginBottom: 20,
    padding: 20,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsInfo: {
    flex: 1,
    marginLeft: 16,
  },
  withdrawButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  earningsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  earningsItem: {
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  howItWorksCard: {
    marginBottom: 20,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
  },
  stepContent: {
    flex: 1,
  },
  referralCodeCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  copyButton: {
    padding: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emailInviteCard: {
    marginBottom: 20,
  },
  inviteButton: {
    marginTop: 12,
  },
  benefitsCard: {
    marginBottom: 20,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  historyDetails: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
