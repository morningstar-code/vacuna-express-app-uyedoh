
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
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subscription } from '@/types/vaccine';

const subscriptionPlans = [
  {
    id: 'basic-monthly',
    name: 'Plan Básico Mensual',
    type: 'monthly' as const,
    plan: 'basic' as const,
    price: 1500,
    currency: 'DOP' as const,
    features: [
      'Vacunas básicas incluidas',
      'Recordatorios automáticos',
      'Soporte por email',
      'Descuento del 10% en vacunas adicionales',
    ],
    vaccineIds: ['influenza', 'hepatitis-a', 'td'],
  },
  {
    id: 'premium-monthly',
    name: 'Plan Premium Mensual',
    type: 'monthly' as const,
    plan: 'premium' as const,
    price: 2500,
    currency: 'DOP' as const,
    features: [
      'Todas las vacunas incluidas',
      'Recordatorios personalizados',
      'Soporte prioritario 24/7',
      'Descuento del 20% en vacunas adicionales',
      'Consultas médicas virtuales',
      'Entrega express gratuita',
    ],
    vaccineIds: ['influenza', 'hepatitis-a', 'hepatitis-b', 'td', 'tdap', 'vph'],
  },
  {
    id: 'corporate-yearly',
    name: 'Plan Corporativo Anual',
    type: 'yearly' as const,
    plan: 'corporate' as const,
    price: 25000,
    currency: 'DOP' as const,
    features: [
      'Cobertura para hasta 50 empleados',
      'Dashboard corporativo',
      'Reportes de vacunación',
      'Gestión de campañas',
      'Descuento del 30% en todas las vacunas',
      'Soporte dedicado',
      'Facturación centralizada',
    ],
    vaccineIds: [],
  },
];

const sampleSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    userId: 'user-1',
    type: 'monthly',
    plan: 'basic',
    vaccineIds: ['influenza', 'hepatitis-a'],
    price: 1500,
    currency: 'DOP',
    status: 'active',
    nextBillingDate: '2024-02-15',
    autoRenew: true,
  },
];

export default function SubscriptionsScreen() {
  const [subscriptions, setSubscriptions] = useState(sampleSubscriptions);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return colors.primary;
      case 'premium':
        return colors.accent;
      case 'corporate':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'star';
      case 'premium':
        return 'star.fill';
      case 'corporate':
        return 'building.2.fill';
      default:
        return 'star';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return currency === 'DOP' ? `$${price.toLocaleString()} DOP` : `$${price} USD`;
  };

  const handleSubscribe = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    Alert.alert(
      'Confirmar Suscripción',
      `¿Deseas suscribirte al ${plan.name} por ${formatPrice(plan.price, plan.currency)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Suscribirse',
          onPress: () => {
            const newSubscription: Subscription = {
              id: `sub-${Date.now()}`,
              userId: 'user-1',
              type: plan.type,
              plan: plan.plan,
              vaccineIds: plan.vaccineIds,
              price: plan.price,
              currency: plan.currency,
              status: 'active',
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              autoRenew: true,
            };
            setSubscriptions(prev => [...prev, newSubscription]);
            Alert.alert('¡Éxito!', 'Te has suscrito exitosamente al plan');
          },
        },
      ]
    );
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    Alert.alert(
      'Cancelar Suscripción',
      '¿Estás seguro de que deseas cancelar esta suscripción?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => {
            setSubscriptions(prev =>
              prev.map(sub =>
                sub.id === subscriptionId
                  ? { ...sub, status: 'cancelled' as const }
                  : sub
              )
            );
            Alert.alert('Suscripción Cancelada', 'Tu suscripción ha sido cancelada');
          },
        },
      ]
    );
  };

  const toggleAutoRenew = (subscriptionId: string) => {
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, autoRenew: !sub.autoRenew }
          : sub
      )
    );
  };

  const renderPlanCard = (plan: any) => (
    <View key={plan.id} style={[commonStyles.card, styles.planCard]}>
      <View style={styles.planHeader}>
        <View style={[styles.planIcon, { backgroundColor: getPlanColor(plan.plan) }]}>
          <IconSymbol
            name={getPlanIcon(plan.plan)}
            size={24}
            color={colors.card}
          />
        </View>
        <View style={styles.planInfo}>
          <Text style={commonStyles.heading}>{plan.name}</Text>
          <Text style={[commonStyles.text, { color: getPlanColor(plan.plan), fontWeight: '700' }]}>
            {formatPrice(plan.price, plan.currency)}
            <Text style={commonStyles.textSecondary}>
              /{plan.type === 'monthly' ? 'mes' : 'año'}
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.planFeatures}>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <IconSymbol name="checkmark.circle.fill" size={16} color={colors.accent} />
            <Text style={[commonStyles.textSecondary, styles.featureText]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.subscribeButton, { backgroundColor: getPlanColor(plan.plan) }]}
        onPress={() => handleSubscribe(plan.id)}
      >
        <Text style={[commonStyles.buttonText, styles.subscribeButtonText]}>
          Suscribirse
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderActiveSubscription = (subscription: Subscription) => {
    const plan = subscriptionPlans.find(p => p.plan === subscription.plan);
    
    return (
      <View key={subscription.id} style={[commonStyles.card, styles.activeSubscriptionCard]}>
        <View style={styles.subscriptionHeader}>
          <View style={styles.subscriptionInfo}>
            <Text style={commonStyles.heading}>
              {plan?.name || `Plan ${subscription.plan}`}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {formatPrice(subscription.price, subscription.currency)}/{subscription.type === 'monthly' ? 'mes' : 'año'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { 
            backgroundColor: subscription.status === 'active' ? colors.accent : colors.error 
          }]}>
            <Text style={styles.statusText}>
              {subscription.status === 'active' ? 'Activa' : 'Cancelada'}
            </Text>
          </View>
        </View>

        <View style={styles.subscriptionDetails}>
          <View style={styles.detailRow}>
            <Text style={commonStyles.textSecondary}>Próxima facturación:</Text>
            <Text style={commonStyles.text}>
              {new Date(subscription.nextBillingDate).toLocaleDateString('es-DO')}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={commonStyles.textSecondary}>Renovación automática:</Text>
            <Switch
              value={subscription.autoRenew}
              onValueChange={() => toggleAutoRenew(subscription.id)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>

        {subscription.status === 'active' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelSubscription(subscription.id)}
          >
            <Text style={[commonStyles.text, { color: colors.error }]}>
              Cancelar Suscripción
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Suscripciones',
          headerShown: true,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <ScrollView style={commonStyles.container}>
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>Suscripciones</Text>
            <Text style={commonStyles.textSecondary}>
              Planes de vacunación mensual y anual
            </Text>
          </View>

          {/* Active Subscriptions */}
          {subscriptions.length > 0 && (
            <View style={styles.section}>
              <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
                Mis Suscripciones
              </Text>
              {subscriptions.map(renderActiveSubscription)}
            </View>
          )}

          {/* Available Plans */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Planes Disponibles
            </Text>
            {subscriptionPlans.map(renderPlanCard)}
          </View>

          {/* Benefits Section */}
          <View style={styles.section}>
            <View style={[commonStyles.card, styles.benefitsCard]}>
              <View style={styles.benefitsHeader}>
                <IconSymbol name="gift.fill" size={24} color={colors.warning} />
                <Text style={[commonStyles.heading, { marginLeft: 12 }]}>
                  Beneficios de Suscribirse
                </Text>
              </View>
              
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <IconSymbol name="percent" size={16} color={colors.accent} />
                  <Text style={styles.benefitText}>
                    Descuentos exclusivos en todas las vacunas
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <IconSymbol name="bell.fill" size={16} color={colors.accent} />
                  <Text style={styles.benefitText}>
                    Recordatorios automáticos personalizados
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <IconSymbol name="truck.box.fill" size={16} color={colors.accent} />
                  <Text style={styles.benefitText}>
                    Entrega prioritaria y gratuita
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <IconSymbol name="phone.fill" size={16} color={colors.accent} />
                  <Text style={styles.benefitText}>
                    Soporte médico especializado
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  planCard: {
    marginBottom: 16,
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    flex: 1,
  },
  subscribeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  activeSubscriptionCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionInfo: {
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
  subscriptionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    alignSelf: 'flex-start',
  },
  benefitsCard: {
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning,
    borderWidth: 1,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
});
