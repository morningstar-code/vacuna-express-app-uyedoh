
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { getActivePromotions, sampleNotifications } from '@/data/vaccines';

export default function HomeScreen() {
  const activePromotions = getActivePromotions();
  const unreadNotifications = sampleNotifications.filter(n => !n.isRead);

  const quickActions = [
    {
      title: 'Explorar Vacunas',
      description: 'Ver catálogo completo',
      icon: 'list.bullet',
      color: colors.primary,
      route: '/(tabs)/catalog',
    },
    {
      title: 'Ofertas Especiales',
      description: `${activePromotions.length} promociones activas`,
      icon: 'tag.fill',
      color: colors.warning,
      route: '/(tabs)/promotions',
      badge: activePromotions.length > 0 ? activePromotions.length : undefined,
    },
    {
      title: 'Mis Pedidos',
      description: 'Seguir mis órdenes',
      icon: 'shippingbox.fill',
      color: colors.accent,
      route: '/(tabs)/orders',
    },
    {
      title: 'Educación',
      description: 'Aprende sobre vacunas',
      icon: 'book.fill',
      color: colors.secondary,
      route: '/(tabs)/education',
    },
  ];

  const categories = [
    { name: 'Universal', count: 2, color: colors.primary },
    { name: 'Niños', count: 9, color: colors.accent },
    { name: 'Adolescentes', count: 3, color: colors.highlight },
    { name: 'Adultos', count: 5, color: colors.secondary },
  ];

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(tabs)/catalog',
      params: { category },
    } as any);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'VacunaExpress',
            headerLargeTitle: true,
          }}
        />
      )}
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={[commonStyles.title, styles.welcomeTitle]}>
                ¡Bienvenido!
              </Text>
              <Text style={[commonStyles.textSecondary, styles.welcomeSubtitle]}>
                Distribución de vacunas a domicilio
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => router.push('/(tabs)/notifications')}
              >
                <IconSymbol name="bell.fill" size={24} color={colors.primary} />
                {unreadNotifications.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadNotifications.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <IconSymbol name="cross.fill" size={32} color={colors.primary} />
              </View>
            </View>
          </View>
        </View>

        {/* Active Promotions Banner */}
        {activePromotions.length > 0 && (
          <View style={styles.promotionBanner}>
            <View style={[commonStyles.card, styles.promotionCard]}>
              <View style={styles.promotionHeader}>
                <IconSymbol name="tag.fill" size={20} color={colors.warning} />
                <Text style={[commonStyles.heading, { marginLeft: 8 }]}>
                  ¡Ofertas Especiales!
                </Text>
              </View>
              <Text style={commonStyles.textSecondary}>
                {activePromotions[0].title} - {activePromotions[0].discountValue}% de descuento
              </Text>
              <TouchableOpacity 
                style={styles.promotionButton}
                onPress={() => router.push('/(tabs)/promotions')}
              >
                <Text style={[commonStyles.text, { color: colors.primary }]}>
                  Ver todas las ofertas
                </Text>
                <IconSymbol name="arrow.right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[commonStyles.heading, styles.sectionTitle]}>
            Acciones Rápidas
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, commonStyles.card]}
                onPress={() => handleQuickAction(action.route)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <IconSymbol name={action.icon as any} size={24} color={colors.card} />
                  {action.badge && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>{action.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[commonStyles.heading, styles.quickActionTitle]}>
                  {action.title}
                </Text>
                <Text style={[commonStyles.textSecondary, styles.quickActionDescription]}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories Overview */}
        <View style={styles.section}>
          <Text style={[commonStyles.heading, styles.sectionTitle]}>
            Categorías de Vacunas
          </Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryCard, commonStyles.card]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
                <View style={styles.categoryContent}>
                  <Text style={[commonStyles.heading, styles.categoryName]}>
                    {category.name}
                  </Text>
                  <Text style={[commonStyles.textSecondary, styles.categoryCount]}>
                    {category.count} vacunas disponibles
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.section, styles.infoSection]}>
          <View style={[commonStyles.card, styles.infoCard]}>
            <View style={styles.infoHeader}>
              <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
              <Text style={[commonStyles.heading, styles.infoTitle]}>
                Información Importante
              </Text>
            </View>
            <Text style={[commonStyles.text, styles.infoText]}>
              • Entrega a domicilio en 24-48 horas{'\n'}
              • Vacunas certificadas y refrigeradas{'\n'}
              • Seguimiento en tiempo real{'\n'}
              • Facturación electrónica disponible
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.card,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...commonStyles.shadow,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
  },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.card,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadow,
  },
  promotionBanner: {
    marginBottom: 32,
  },
  promotionCard: {
    backgroundColor: colors.warning + '10',
    borderColor: colors.warning,
    borderWidth: 1,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.card,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    lineHeight: 22,
    fontSize: 14,
  },
});
