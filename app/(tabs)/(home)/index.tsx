
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { getActivePromotions, sampleNotifications } from '@/data/vaccines';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router } from 'expo-router';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  headerContent: {
    marginTop: spacing.md,
  },
  welcomeText: {
    ...typography.h3,
    color: colors.card,
    marginBottom: spacing.xs,
  },
  userText: {
    ...typography.body1,
    color: colors.card,
    opacity: 0.9,
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  quickActions: {
    marginTop: -spacing.xxl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: (width - spacing.lg * 3) / 2,
    alignItems: 'center',
    ...shadows.md,
  },
  actionIcon: {
    marginBottom: spacing.md,
  },
  actionLabel: {
    ...typography.body2,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
  },
  sectionAction: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  promotionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: width * 0.8,
    ...shadows.md,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  promotionIcon: {
    marginRight: spacing.md,
  },
  promotionTitle: {
    ...typography.h6,
    color: colors.text,
    flex: 1,
  },
  promotionDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  promotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotionDiscount: {
    ...typography.h6,
    color: colors.success,
    fontWeight: '700',
  },
  promotionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  promotionButtonText: {
    ...typography.body2,
    color: colors.card,
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: width * 0.4,
    alignItems: 'center',
    ...shadows.md,
  },
  categoryIcon: {
    marginBottom: spacing.md,
  },
  categoryTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  categorySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentActivity: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityIcon: {
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default function HomeScreen() {
  const activePromotions = getActivePromotions();
  const unreadNotifications = sampleNotifications.filter(n => !n.isRead).length;

  // Streamlined quick actions - only essential features
  const quickActions = [
    {
      id: 'catalog',
      label: 'Catálogo',
      subtitle: 'Explorar vacunas',
      icon: 'list.bullet.rectangle',
      color: colors.primary,
      route: '/(tabs)/catalog',
    },
    {
      id: 'orders',
      label: 'Mis Pedidos',
      subtitle: 'Ver estado',
      icon: 'shippingbox.fill',
      color: colors.success,
      route: '/(tabs)/orders',
    },
    {
      id: 'promotions',
      label: 'Ofertas',
      subtitle: 'Descuentos activos',
      icon: 'tag.fill',
      color: colors.warning,
      route: '/(tabs)/promotions',
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      subtitle: 'Configuración',
      icon: 'person.fill',
      color: colors.accent,
      route: '/(tabs)/profile',
    },
  ];

  const categories = [
    {
      id: 'universal',
      title: 'Universal',
      subtitle: 'Todas las edades',
      icon: 'globe',
      color: colors.primary,
    },
    {
      id: 'children',
      title: 'Niños',
      subtitle: '0-12 años',
      icon: 'figure.child.circle',
      color: colors.success,
    },
    {
      id: 'teens',
      title: 'Adolescentes',
      subtitle: '13-17 años',
      icon: 'figure.walk',
      color: colors.warning,
    },
    {
      id: 'adults',
      title: 'Adultos',
      subtitle: '18+ años',
      icon: 'person.fill',
      color: colors.accent,
    },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Pedido #VE-2024-001 entregado',
      time: 'Hace 2 horas',
      icon: 'checkmark.circle.fill',
      color: colors.success,
    },
    {
      id: '2',
      title: 'Recordatorio: Refuerzo Tdap',
      time: 'Hace 1 día',
      icon: 'bell.fill',
      color: colors.warning,
    },
    {
      id: '3',
      title: 'Nueva promoción disponible',
      time: 'Hace 2 días',
      icon: 'tag.fill',
      color: colors.primary,
    },
  ];

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  const handleCategoryPress = (category: string) => {
    router.push(`/(tabs)/catalog?category=${category}`);
  };

  const handleNotifications = () => {
    router.push('/(tabs)/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>¡Hola, María!</Text>
            <Text style={styles.userText}>
              Mantén tu salud al día con VacunaExpress
            </Text>
          </View>
          
          {unreadNotifications > 0 && (
            <TouchableOpacity
              style={styles.notificationBadge}
              onPress={handleNotifications}
            >
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions - Streamlined */}
        <View style={styles.quickActions}>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(action.route)}
              >
                <IconSymbol
                  name={action.icon}
                  size={32}
                  color={action.color}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active Promotions */}
        {activePromotions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ofertas Especiales</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/promotions')}>
                <Text style={styles.sectionAction}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activePromotions.slice(0, 3).map((promotion) => (
                <View key={promotion.id} style={styles.promotionCard}>
                  <View style={styles.promotionHeader}>
                    <IconSymbol
                      name="tag.fill"
                      size={24}
                      color={colors.primary}
                      style={styles.promotionIcon}
                    />
                    <Text style={styles.promotionTitle}>{promotion.title}</Text>
                  </View>
                  
                  <Text style={styles.promotionDescription}>
                    {promotion.description}
                  </Text>
                  
                  <View style={styles.promotionFooter}>
                    <Text style={styles.promotionDiscount}>
                      {promotion.discountValue}% OFF
                    </Text>
                    <TouchableOpacity style={styles.promotionButton}>
                      <Text style={styles.promotionButtonText}>Usar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.sectionAction}>Ver catálogo</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <IconSymbol
                  name={category.icon}
                  size={32}
                  color={category.color}
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          </View>
          
          <View style={styles.recentActivity}>
            {recentActivities.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index === recentActivities.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <IconSymbol
                  name={activity.icon}
                  size={20}
                  color={activity.color}
                  style={styles.activityIcon}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
