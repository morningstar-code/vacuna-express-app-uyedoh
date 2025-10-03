
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { promotions, getActivePromotions } from '@/data/vaccines';
import { Promotion } from '@/types/vaccine';

export default function PromotionsScreen() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'loyalty' | 'referral'>('active');

  const activePromotions = getActivePromotions();
  
  // Sample loyalty program data
  const loyaltyData = {
    points: 1250,
    tier: 'gold' as const,
    nextTierPoints: 2000,
    availableRewards: [
      { id: '1', name: '10% Descuento', points: 500, description: 'Descuento del 10% en tu próxima compra' },
      { id: '2', name: '15% Descuento', points: 750, description: 'Descuento del 15% en tu próxima compra' },
      { id: '3', name: 'Vacuna Gratis', points: 1000, description: 'Una vacuna gratis de hasta $50' },
      { id: '4', name: '20% Descuento', points: 1200, description: 'Descuento del 20% en tu próxima compra' },
    ]
  };

  const referralData = {
    referralCode: 'JUAN2024',
    referralsCount: 3,
    earnedDiscounts: 15, // percentage
    pendingRewards: 2,
  };

  const getPromotionIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'seasonal':
        return 'snowflake';
      case 'loyalty':
        return 'star.fill';
      case 'family':
        return 'house.fill';
      case 'corporate':
        return 'building.2.fill';
      default:
        return 'tag.fill';
    }
  };

  const getPromotionColor = (type: Promotion['type']) => {
    switch (type) {
      case 'seasonal':
        return colors.primary;
      case 'loyalty':
        return colors.warning;
      case 'family':
        return colors.accent;
      case 'corporate':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
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
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleClaimPromotion = (promotion: Promotion) => {
    Alert.alert(
      'Promoción Aplicada',
      `Se ha aplicado la promoción "${promotion.title}" a tu cuenta.`,
      [{ text: 'OK' }]
    );
  };

  const handleRedeemReward = (reward: any) => {
    if (loyaltyData.points >= reward.points) {
      Alert.alert(
        'Canjear Recompensa',
        `¿Deseas canjear "${reward.name}" por ${reward.points} puntos?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Canjear', onPress: () => console.log('Reward redeemed') },
        ]
      );
    } else {
      Alert.alert(
        'Puntos Insuficientes',
        `Necesitas ${reward.points - loyaltyData.points} puntos más para canjear esta recompensa.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleShareReferral = () => {
    Alert.alert(
      'Compartir Código',
      `Tu código de referido es: ${referralData.referralCode}\n\n¡Compártelo con tus amigos y ambos obtendrán descuentos!`,
      [{ text: 'OK' }]
    );
  };

  const renderPromotionCard = (promotion: Promotion) => (
    <View key={promotion.id} style={[commonStyles.card, styles.promotionCard]}>
      <View style={styles.promotionHeader}>
        <View style={[styles.promotionIcon, { backgroundColor: getPromotionColor(promotion.type) }]}>
          <IconSymbol 
            name={getPromotionIcon(promotion.type)} 
            size={24} 
            color={colors.card} 
          />
        </View>
        <View style={styles.promotionInfo}>
          <Text style={commonStyles.heading}>{promotion.title}</Text>
          <Text style={commonStyles.textSecondary}>{promotion.description}</Text>
        </View>
      </View>

      <View style={styles.promotionDetails}>
        <View style={[commonStyles.row, commonStyles.spaceBetween]}>
          <Text style={commonStyles.text}>
            Descuento: {promotion.discountValue}
            {promotion.discountType === 'percentage' ? '%' : ' USD'}
          </Text>
          <Text style={commonStyles.textSecondary}>
            Válido hasta: {formatDate(promotion.validTo)}
          </Text>
        </View>
        
        {promotion.minQuantity && (
          <Text style={[commonStyles.textSmall, { marginTop: 8 }]}>
            Mínimo {promotion.minQuantity} productos
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.claimButton, { backgroundColor: getPromotionColor(promotion.type) }]}
        onPress={() => handleClaimPromotion(promotion)}
      >
        <Text style={commonStyles.buttonText}>Aplicar Promoción</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoyaltyProgram = () => (
    <View style={styles.loyaltyContainer}>
      {/* Loyalty Status */}
      <View style={[commonStyles.card, styles.loyaltyCard]}>
        <View style={styles.loyaltyHeader}>
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(loyaltyData.tier) }]}>
            <IconSymbol name="crown.fill" size={20} color={colors.card} />
            <Text style={styles.tierText}>{loyaltyData.tier.toUpperCase()}</Text>
          </View>
          <Text style={commonStyles.heading}>Programa de Lealtad</Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{loyaltyData.points}</Text>
          <Text style={commonStyles.textSecondary}>puntos disponibles</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(loyaltyData.points / loyaltyData.nextTierPoints) * 100}%`,
                  backgroundColor: getTierColor(loyaltyData.tier)
                }
              ]} 
            />
          </View>
          <Text style={commonStyles.textSmall}>
            {loyaltyData.nextTierPoints - loyaltyData.points} puntos para el siguiente nivel
          </Text>
        </View>
      </View>

      {/* Available Rewards */}
      <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 16 }]}>
        Recompensas Disponibles
      </Text>
      
      {loyaltyData.availableRewards.map(reward => (
        <View key={reward.id} style={[commonStyles.card, styles.rewardCard]}>
          <View style={styles.rewardInfo}>
            <Text style={commonStyles.heading}>{reward.name}</Text>
            <Text style={commonStyles.textSecondary}>{reward.description}</Text>
            <Text style={[commonStyles.text, { color: colors.primary, marginTop: 4 }]}>
              {reward.points} puntos
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.redeemButton,
              loyaltyData.points < reward.points && styles.redeemButtonDisabled
            ]}
            onPress={() => handleRedeemReward(reward)}
            disabled={loyaltyData.points < reward.points}
          >
            <Text style={[
              commonStyles.buttonText,
              loyaltyData.points < reward.points && { color: colors.textSecondary }
            ]}>
              Canjear
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderReferralProgram = () => (
    <View style={styles.referralContainer}>
      {/* Referral Stats */}
      <View style={[commonStyles.card, styles.referralCard]}>
        <View style={styles.referralHeader}>
          <IconSymbol name="person.2.fill" size={32} color={colors.primary} />
          <Text style={commonStyles.heading}>Programa de Referencias</Text>
        </View>

        <View style={styles.referralStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{referralData.referralsCount}</Text>
            <Text style={commonStyles.textSecondary}>Referencias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{referralData.earnedDiscounts}%</Text>
            <Text style={commonStyles.textSecondary}>Descuento Ganado</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{referralData.pendingRewards}</Text>
            <Text style={commonStyles.textSecondary}>Recompensas Pendientes</Text>
          </View>
        </View>

        <View style={styles.referralCodeContainer}>
          <Text style={commonStyles.textSecondary}>Tu código de referido:</Text>
          <View style={styles.referralCode}>
            <Text style={styles.referralCodeText}>{referralData.referralCode}</Text>
            <TouchableOpacity onPress={handleShareReferral}>
              <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareReferral}>
          <IconSymbol name="paperplane.fill" size={16} color={colors.card} />
          <Text style={commonStyles.buttonText}>Compartir Código</Text>
        </TouchableOpacity>
      </View>

      {/* How it Works */}
      <View style={[commonStyles.card, { marginTop: 16 }]}>
        <Text style={commonStyles.heading}>¿Cómo Funciona?</Text>
        <View style={styles.howItWorks}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={commonStyles.text}>Comparte tu código con amigos</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={commonStyles.text}>Ellos obtienen 10% de descuento</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={commonStyles.text}>Tú obtienes 15% en tu próxima compra</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Promociones</Text>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
              onPress={() => setSelectedTab('active')}
            >
              <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
                Activas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'loyalty' && styles.tabActive]}
              onPress={() => setSelectedTab('loyalty')}
            >
              <Text style={[styles.tabText, selectedTab === 'loyalty' && styles.tabTextActive]}>
                Lealtad
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'referral' && styles.tabActive]}
              onPress={() => setSelectedTab('referral')}
            >
              <Text style={[styles.tabText, selectedTab === 'referral' && styles.tabTextActive]}>
                Referencias
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedTab === 'active' && (
            activePromotions.length > 0 ? (
              activePromotions.map(renderPromotionCard)
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="tag" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No hay promociones activas
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  ¡Mantente atento a nuevas ofertas!
                </Text>
              </View>
            )
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.card,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
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
  promotionCard: {
    marginBottom: 16,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promotionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  promotionInfo: {
    flex: 1,
  },
  promotionDetails: {
    marginBottom: 16,
  },
  claimButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loyaltyContainer: {
    paddingBottom: 20,
  },
  loyaltyCard: {
    alignItems: 'center',
  },
  loyaltyHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: colors.background,
  },
  referralContainer: {
    paddingBottom: 20,
  },
  referralCard: {
    alignItems: 'center',
  },
  referralHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  referralStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  referralCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  referralCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  referralCodeText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  howItWorks: {
    marginTop: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
});
