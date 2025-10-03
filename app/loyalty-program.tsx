
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LoyaltyProgram, Badge, UserBadge } from '@/types/vaccine';
import { badges } from '@/data/vaccines';

const { width } = Dimensions.get('window');

const userLoyalty: LoyaltyProgram = {
  userId: 'user-1',
  points: 1250,
  tier: 'gold',
  totalSpent: 15000,
  ordersCount: 12,
};

const userBadges: UserBadge[] = [
  { userId: 'user-1', badgeId: 'first-order', earnedAt: '2023-06-15' },
  { userId: 'user-1', badgeId: 'family-protector', earnedAt: '2023-08-20' },
  { userId: 'user-1', badgeId: 'loyal-customer', earnedAt: '2023-12-10' },
];

const tierBenefits = {
  bronze: {
    name: 'Bronce',
    color: '#CD7F32',
    icon: 'star',
    minPoints: 0,
    benefits: [
      'Descuento del 5% en todas las vacunas',
      'Recordatorios básicos',
      'Soporte por email',
    ],
  },
  silver: {
    name: 'Plata',
    color: '#C0C0C0',
    icon: 'star.fill',
    minPoints: 500,
    benefits: [
      'Descuento del 10% en todas las vacunas',
      'Recordatorios personalizados',
      'Soporte prioritario',
      'Entrega gratuita',
    ],
  },
  gold: {
    name: 'Oro',
    color: '#FFD700',
    icon: 'star.circle.fill',
    minPoints: 1000,
    benefits: [
      'Descuento del 15% en todas las vacunas',
      'Recordatorios avanzados',
      'Soporte VIP 24/7',
      'Entrega express gratuita',
      'Consultas médicas gratuitas',
    ],
  },
  platinum: {
    name: 'Platino',
    color: '#E5E4E2',
    icon: 'crown.fill',
    minPoints: 2000,
    benefits: [
      'Descuento del 20% en todas las vacunas',
      'Gestor personal dedicado',
      'Soporte VIP 24/7',
      'Entrega express gratuita',
      'Consultas médicas ilimitadas',
      'Acceso a vacunas exclusivas',
    ],
  },
};

const rewardOptions = [
  {
    id: 'discount-10',
    name: 'Descuento 10%',
    description: 'Descuento del 10% en tu próxima compra',
    points: 200,
    type: 'discount',
    icon: 'percent',
  },
  {
    id: 'free-delivery',
    name: 'Entrega Gratuita',
    description: 'Entrega gratuita en tu próximo pedido',
    points: 150,
    type: 'service',
    icon: 'truck.box.fill',
  },
  {
    id: 'consultation',
    name: 'Consulta Médica',
    description: 'Consulta médica virtual gratuita',
    points: 500,
    type: 'service',
    icon: 'stethoscope',
  },
  {
    id: 'discount-20',
    name: 'Descuento 20%',
    description: 'Descuento del 20% en tu próxima compra',
    points: 400,
    type: 'discount',
    icon: 'percent',
  },
];

export default function LoyaltyProgramScreen() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rewards' | 'badges'>('overview');

  const currentTier = tierBenefits[userLoyalty.tier];
  const nextTierKey = Object.keys(tierBenefits).find(
    tier => tierBenefits[tier as keyof typeof tierBenefits].minPoints > userLoyalty.points
  ) as keyof typeof tierBenefits | undefined;
  const nextTier = nextTierKey ? tierBenefits[nextTierKey] : null;

  const earnedBadges = badges.filter(badge => 
    userBadges.some(userBadge => userBadge.badgeId === badge.id)
  );
  const availableBadges = badges.filter(badge => 
    !userBadges.some(userBadge => userBadge.badgeId === badge.id)
  );

  const handleRedeemReward = (reward: any) => {
    if (userLoyalty.points < reward.points) {
      Alert.alert('Puntos Insuficientes', 'No tienes suficientes puntos para canjear esta recompensa');
      return;
    }

    Alert.alert(
      'Canjear Recompensa',
      `¿Deseas canjear ${reward.points} puntos por ${reward.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Canjear',
          onPress: () => {
            // Update points (in real app, this would be handled by backend)
            Alert.alert('¡Éxito!', 'Recompensa canjeada exitosamente');
          },
        },
      ]
    );
  };

  const renderTierProgress = () => {
    const progressPercentage = nextTier 
      ? ((userLoyalty.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
      : 100;

    return (
      <View style={[commonStyles.card, styles.tierCard]}>
        <View style={styles.tierHeader}>
          <View style={[styles.tierIcon, { backgroundColor: currentTier.color }]}>
            <IconSymbol name={currentTier.icon as any} size={24} color={colors.card} />
          </View>
          <View style={styles.tierInfo}>
            <Text style={[commonStyles.heading, { color: currentTier.color }]}>
              Nivel {currentTier.name}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {userLoyalty.points} puntos
            </Text>
          </View>
          <View style={styles.pointsDisplay}>
            <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color: colors.primary }]}>
              {userLoyalty.points}
            </Text>
            <Text style={commonStyles.textSmall}>puntos</Text>
          </View>
        </View>

        {nextTier && (
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={commonStyles.textSecondary}>
                Progreso al nivel {nextTier.name}
              </Text>
              <Text style={commonStyles.text}>
                {nextTier.minPoints - userLoyalty.points} puntos restantes
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(progressPercentage, 100)}%`,
                    backgroundColor: currentTier.color,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderBenefits = () => (
    <View style={[commonStyles.card, styles.benefitsCard]}>
      <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
        Beneficios de tu Nivel
      </Text>
      {currentTier.benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitItem}>
          <IconSymbol name="checkmark.circle.fill" size={16} color={colors.accent} />
          <Text style={[commonStyles.text, styles.benefitText]}>{benefit}</Text>
        </View>
      ))}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsGrid}>
      <View style={[commonStyles.card, styles.statCard]}>
        <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', color: colors.primary }]}>
          {userLoyalty.ordersCount}
        </Text>
        <Text style={commonStyles.textSecondary}>Pedidos</Text>
      </View>
      <View style={[commonStyles.card, styles.statCard]}>
        <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', color: colors.accent }]}>
          ${userLoyalty.totalSpent.toLocaleString()}
        </Text>
        <Text style={commonStyles.textSecondary}>Gastado</Text>
      </View>
      <View style={[commonStyles.card, styles.statCard]}>
        <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', color: colors.warning }]}>
          {earnedBadges.length}
        </Text>
        <Text style={commonStyles.textSecondary}>Insignias</Text>
      </View>
    </View>
  );

  const renderRewardCard = (reward: any) => (
    <TouchableOpacity
      key={reward.id}
      style={[commonStyles.card, styles.rewardCard]}
      onPress={() => handleRedeemReward(reward)}
    >
      <View style={styles.rewardHeader}>
        <View style={[styles.rewardIcon, { backgroundColor: colors.primary }]}>
          <IconSymbol name={reward.icon as any} size={20} color={colors.card} />
        </View>
        <View style={styles.rewardInfo}>
          <Text style={commonStyles.heading}>{reward.name}</Text>
          <Text style={commonStyles.textSecondary}>{reward.description}</Text>
        </View>
        <View style={styles.rewardPoints}>
          <Text style={[commonStyles.text, { fontWeight: '700', color: colors.primary }]}>
            {reward.points}
          </Text>
          <Text style={commonStyles.textSmall}>puntos</Text>
        </View>
      </View>
      
      <View style={styles.rewardFooter}>
        <Text style={[
          commonStyles.text,
          {
            color: userLoyalty.points >= reward.points ? colors.accent : colors.textSecondary,
            fontWeight: '600',
          }
        ]}>
          {userLoyalty.points >= reward.points ? 'Disponible' : 'Puntos insuficientes'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderBadgeCard = (badge: Badge, isEarned: boolean) => (
    <View
      key={badge.id}
      style={[
        commonStyles.card,
        styles.badgeCard,
        !isEarned && styles.badgeCardDisabled,
      ]}
    >
      <View style={[
        styles.badgeIcon,
        {
          backgroundColor: isEarned ? colors.warning : colors.border,
        }
      ]}>
        <IconSymbol
          name={badge.iconName as any}
          size={24}
          color={isEarned ? colors.card : colors.textSecondary}
        />
      </View>
      <Text style={[
        commonStyles.heading,
        { fontSize: 14, textAlign: 'center', marginTop: 8 }
      ]}>
        {badge.name}
      </Text>
      <Text style={[
        commonStyles.textSecondary,
        { fontSize: 12, textAlign: 'center', marginTop: 4 }
      ]}>
        {badge.description}
      </Text>
      {isEarned && (
        <View style={styles.earnedBadge}>
          <IconSymbol name="checkmark.circle.fill" size={16} color={colors.accent} />
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <>
            {renderTierProgress()}
            {renderStats()}
            {renderBenefits()}
          </>
        );
      case 'rewards':
        return (
          <View>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Canjear Puntos
            </Text>
            {rewardOptions.map(renderRewardCard)}
          </View>
        );
      case 'badges':
        return (
          <View>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Insignias Obtenidas ({earnedBadges.length})
            </Text>
            <View style={styles.badgesGrid}>
              {earnedBadges.map(badge => renderBadgeCard(badge, true))}
            </View>
            
            <Text style={[commonStyles.heading, { marginTop: 24, marginBottom: 16 }]}>
              Insignias Disponibles ({availableBadges.length})
            </Text>
            <View style={styles.badgesGrid}>
              {availableBadges.map(badge => renderBadgeCard(badge, false))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Programa de Lealtad',
          headerShown: true,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Programa de Lealtad</Text>
          <Text style={commonStyles.textSecondary}>
            Gana puntos y desbloquea beneficios exclusivos
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { key: 'overview', label: 'Resumen' },
            { key: 'rewards', label: 'Recompensas' },
            { key: 'badges', label: 'Insignias' },
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
  tierCard: {
    marginBottom: 20,
    padding: 20,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tierInfo: {
    flex: 1,
  },
  pointsDisplay: {
    alignItems: 'center',
  },
  progressSection: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
  benefitsCard: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
  },
  rewardCard: {
    marginBottom: 12,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardPoints: {
    alignItems: 'center',
  },
  rewardFooter: {
    alignItems: 'flex-end',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: (width - 48) / 2,
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  badgeCardDisabled: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
