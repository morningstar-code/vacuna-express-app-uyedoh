
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, typography } from '@/styles/commonStyles';
import { promotions, getActivePromotions } from '@/data/vaccines';
import { Promotion } from '@/types/vaccine';

export default function PromotionsScreen() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'loyalty' | 'referral'>('active');

  const getPromotionIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage':
        return 'percent';
      case 'fixed':
        return 'dollarsign.circle.fill';
      case 'bogo':
        return 'plus.circle.fill';
      case 'loyalty':
        return 'star.fill';
      default:
        return 'tag.fill';
    }
  };

  const getPromotionColor = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage':
        return colors.success;
      case 'fixed':
        return colors.primary;
      case 'bogo':
        return colors.warning;
      case 'loyalty':
        return colors.accent;
      default:
        return colors.secondary;
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleClaimPromotion = (promotion: Promotion) => {
    Alert.alert(
      'Aplicar Promoción',
      `¿Deseas aplicar la promoción "${promotion.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aplicar', 
          onPress: () => {
            console.log('Applying promotion:', promotion.id);
            Alert.alert('¡Promoción aplicada!', 'La promoción se ha agregado a tu cuenta.');
          }
        },
      ]
    );
  };

  const handleRedeemReward = (reward: any) => {
    Alert.alert(
      'Canjear Recompensa',
      `¿Deseas canjear ${reward.pointsCost} puntos por "${reward.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Canjear', 
          onPress: () => {
            console.log('Redeeming reward:', reward.id);
            Alert.alert('¡Recompensa canjeada!', 'La recompensa se ha aplicado a tu cuenta.');
          }
        },
      ]
    );
  };

  const handleCopyReferralCode = () => {
    const referralCode = 'VE-REF-12345';
    Clipboard.setString(referralCode);
    Alert.alert('Código copiado', 'Tu código de referido ha sido copiado al portapapeles.');
  };

  const handleShareReferral = () => {
    const referralCode = 'VE-REF-12345';
    const message = `¡Únete a VacunaExpress con mi código de referido ${referralCode} y obtén descuentos especiales en vacunas!`;
    
    Share.share({
      message,
      title: 'Invita a un amigo a VacunaExpress',
    });
  };

  const renderPromotionCard = (promotion: Promotion) => (
    <View key={promotion.id} style={styles.promotionCard}>
      <View style={styles.promotionHeader}>
        <View style={styles.promotionIconContainer}>
          <IconSymbol 
            name={getPromotionIcon(promotion.type)} 
            size={24} 
            color={getPromotionColor(promotion.type)} 
          />
        </View>
        <View style={styles.promotionDiscount}>
          <Text style={styles.discountText}>
            {promotion.type === 'percentage' ? `-${promotion.discountValue}%` : 
             promotion.type === 'fixed' ? `$${promotion.discountValue}` : 
             promotion.type === 'bogo' ? '2x1' : 'Especial'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.promotionTitle}>{promotion.title}</Text>
      <Text style={styles.promotionDescription} numberOfLines={2}>
        {promotion.description}
      </Text>
      
      <View style={styles.promotionFooter}>
        <Text style={styles.promotionExpiry}>
          Válido hasta: {formatDate(promotion.validTo)}
        </Text>
        <TouchableOpacity
          style={[styles.claimButton, { backgroundColor: getPromotionColor(promotion.type) }]}
          onPress={() => handleClaimPromotion(promotion)}
        >
          <Text style={styles.claimButtonText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoyaltyProgram = () => (
    <View style={styles.tabContent}>
      <View style={styles.loyaltyHeader}>
        <View style={styles.pointsCard}>
          <IconSymbol name="star.fill" size={32} color={colors.warning} />
          <Text style={styles.pointsValue}>1,250</Text>
          <Text style={styles.pointsLabel}>Puntos disponibles</Text>
        </View>
        
        <View style={styles.tierCard}>
          <View style={[styles.tierBadge, { backgroundColor: getTierColor('Gold') }]}>
            <IconSymbol name="crown.fill" size={16} color={colors.card} />
            <Text style={styles.tierText}>Gold</Text>
          </View>
          <Text style={styles.tierDescription}>Nivel Gold</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recompensas Disponibles</Text>
      
      {[
        { id: '1', title: 'Descuento 10%', pointsCost: 500, description: 'En tu próximo pedido' },
        { id: '2', title: 'Envío gratis', pointsCost: 300, description: 'En pedidos mayores a $50' },
        { id: '3', title: 'Vacuna gratis', pointsCost: 1000, description: 'Influenza estacional' },
      ].map((reward) => (
        <View key={reward.id} style={styles.rewardCard}>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>{reward.title}</Text>
            <Text style={styles.rewardDescription}>{reward.description}</Text>
            <Text style={styles.rewardCost}>{reward.pointsCost} puntos</Text>
          </View>
          <TouchableOpacity
            style={styles.redeemButton}
            onPress={() => handleRedeemReward(reward)}
          >
            <Text style={styles.redeemButtonText}>Canjear</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderReferralProgram = () => (
    <View style={styles.tabContent}>
      <View style={styles.referralHeader}>
        <IconSymbol name="person.2.fill" size={48} color={colors.primary} />
        <Text style={styles.referralTitle}>Programa de Referencias</Text>
        <Text style={styles.referralSubtitle}>
          Invita amigos y gana recompensas por cada referido exitoso
        </Text>
      </View>

      <View style={styles.referralStats}>
        <View style={styles.referralStatCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Referencias</Text>
        </View>
        <View style={styles.referralStatCard}>
          <Text style={styles.statNumber}>15%</Text>
          <Text style={styles.statLabel}>Descuento</Text>
        </View>
        <View style={styles.referralStatCard}>
          <Text style={styles.statNumber}>$125</Text>
          <Text style={styles.statLabel}>Recompensas</Text>
        </View>
      </View>

      <View style={styles.referralCodeSection}>
        <Text style={styles.sectionTitle}>Tu Código de Referido</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.referralCode}>VE-REF-12345</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyReferralCode}>
            <IconSymbol name="doc.on.doc" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.card} />
          <Text style={styles.shareButtonText}>Compartir Código</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Comparte tu código con amigos</Text>
        </View>
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Ellos se registran con tu código</Text>
        </View>
        <View style={styles.stepCard}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>Ambos reciben descuentos especiales</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Ofertas</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
              onPress={() => setSelectedTab('active')}
            >
              <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
                Promociones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'loyalty' && styles.tabActive]}
              onPress={() => setSelectedTab('loyalty')}
            >
              <Text style={[styles.tabText, selectedTab === 'loyalty' && styles.tabTextActive]}>
                Puntos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'referral' && styles.tabActive]}
              onPress={() => setSelectedTab('referral')}
            >
              <Text style={[styles.tabText, selectedTab === 'referral' && styles.tabTextActive]}>
                Referidos
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {selectedTab === 'active' && (
            <View style={styles.tabContent}>
              {getActivePromotions().map(renderPromotionCard)}
            </View>
          )}
          {selectedTab === 'loyalty' && renderLoyaltyProgram()}
          {selectedTab === 'referral' && renderReferralProgram()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // Tabs
  tabsContainer: {
    paddingVertical: spacing.sm,
  },
  tabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: spacing.lg,
    backgroundColor: '#F2F3F5',
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A3A3C',
  },
  tabTextActive: {
    color: colors.card,
    fontWeight: '600',
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  tabContent: {
    flex: 1,
  },

  // Promotion Cards
  promotionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promotionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotionDiscount: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  discountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  promotionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  promotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotionExpiry: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  claimButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },

  // Loyalty Program
  loyaltyHeader: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  pointsCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tierCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  tierDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },

  // Reward Cards
  rewardCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  rewardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  rewardCost: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },

  // Referral Program
  referralHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  referralTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  referralSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  referralStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  referralStatCard: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  referralCodeSection: {
    marginBottom: spacing.xl,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  referralCode: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  copyButton: {
    padding: spacing.sm,
  },
  shareButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },

  howItWorksSection: {
    marginBottom: spacing.xl,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
});
