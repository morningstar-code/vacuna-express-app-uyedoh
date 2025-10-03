
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { getActivePromotions, sampleNotifications } from '@/data/vaccines';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingCartButton from '@/components/FloatingCartButton';

export default function HomeScreen() {
  // Mock cart state - in a real app this would come from a global state manager
  const [cart, setCart] = useState<{[key: string]: number}>({});
  
  // Calculate cart totals
  const cartItemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = Object.entries(cart).reduce((total, [vaccineId, quantity]) => {
    // Mock price calculation - in real app would fetch from vaccine data
    const mockPrice = 25.99;
    return total + (mockPrice * quantity);
  }, 0);

  const handleQuickAction = (route: string) => {
    console.log('Navigating to:', route);
    router.push(route);
  };

  const handleCategoryPress = (category: string) => {
    console.log('Category pressed:', category);
    router.push('/(tabs)/catalog');
  };

  const handleNotifications = () => {
    console.log('Opening notifications');
    router.push('/(tabs)/notifications');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={{ paddingBottom: cartItemCount > 0 ? 100 : 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola!</Text>
            <Text style={styles.welcomeText}>Bienvenido a VacunaExpress</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotifications}
          >
            <IconSymbol name="bell.fill" size={24} color={colors.primary} />
            {sampleNotifications.filter(n => !n.isRead).length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {sampleNotifications.filter(n => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/catalog')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <IconSymbol name="list.bullet.rectangle" size={28} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Catálogo</Text>
              <Text style={styles.quickActionSubtitle}>Explorar vacunas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/orders')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '15' }]}>
                <IconSymbol name="shippingbox.fill" size={28} color={colors.accent} />
              </View>
              <Text style={styles.quickActionTitle}>Mis Pedidos</Text>
              <Text style={styles.quickActionSubtitle}>Seguir entregas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/promotions')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '15' }]}>
                <IconSymbol name="tag.fill" size={28} color={colors.warning} />
              </View>
              <Text style={styles.quickActionTitle}>Ofertas</Text>
              <Text style={styles.quickActionSubtitle}>Descuentos activos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/profile')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.info + '15' }]}>
                <IconSymbol name="person.fill" size={28} color={colors.info} />
              </View>
              <Text style={styles.quickActionTitle}>Mi Perfil</Text>
              <Text style={styles.quickActionSubtitle}>Configuración</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías de Vacunas</Text>
          <View style={styles.categories}>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Universal')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors.primary + '15' }]}>
                <IconSymbol name="globe" size={32} color={colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>Universal</Text>
              <Text style={styles.categorySubtitle}>Para todas las edades</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Niños')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors.accent + '15' }]}>
                <IconSymbol name="figure.child" size={32} color={colors.accent} />
              </View>
              <Text style={styles.categoryTitle}>Niños</Text>
              <Text style={styles.categorySubtitle}>Pediatría especializada</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Adolescentes')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors.info + '15' }]}>
                <IconSymbol name="figure.walk" size={32} color={colors.info} />
              </View>
              <Text style={styles.categoryTitle}>Adolescentes</Text>
              <Text style={styles.categorySubtitle}>11-18 años</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Adultos')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors.warning + '15' }]}>
                <IconSymbol name="person.2.fill" size={32} color={colors.warning} />
              </View>
              <Text style={styles.categoryTitle}>Adultos</Text>
              <Text style={styles.categorySubtitle}>Mayores de 18 años</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Promotions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promociones Activas</Text>
            <TouchableOpacity onPress={() => handleQuickAction('/(tabs)/promotions')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionsContainer}
          >
            {getActivePromotions().slice(0, 3).map((promotion) => (
              <View key={promotion.id} style={styles.promotionCard}>
                <View style={styles.promotionHeader}>
                  <IconSymbol name="tag.fill" size={20} color={colors.warning} />
                  <Text style={styles.promotionDiscount}>-{promotion.discountValue}%</Text>
                </View>
                <Text style={styles.promotionTitle}>{promotion.title}</Text>
                <Text style={styles.promotionDescription} numberOfLines={2}>
                  {promotion.description}
                </Text>
                <Text style={styles.promotionExpiry}>
                  Válido hasta: {new Date(promotion.validTo).toLocaleDateString('es-DO')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
            <TouchableOpacity onPress={handleNotifications}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          {sampleNotifications.slice(0, 3).map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationIcon}>
                <IconSymbol 
                  name={
                    notification.type === 'reminder' ? 'clock.fill' :
                    notification.type === 'promotion' ? 'tag.fill' :
                    notification.type === 'shipment' ? 'shippingbox.fill' :
                    'info.circle.fill'
                  } 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleDateString('es-DO')}
                </Text>
              </View>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Cart Button */}
      <FloatingCartButton
        itemCount={cartItemCount}
        totalAmount={cartTotal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  greeting: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  welcomeText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    ...typography.caption,
    color: colors.card,
    fontWeight: '700',
    fontSize: 10,
  },
  
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    fontWeight: '600',
  },
  seeAllText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '47%',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    ...typography.h6,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '47%',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  categoryTitle: {
    ...typography.h6,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  categorySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  promotionsContainer: {
    paddingRight: spacing.lg,
  },
  promotionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: 280,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promotionDiscount: {
    ...typography.h5,
    color: colors.warning,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  promotionTitle: {
    ...typography.h6,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  promotionDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  promotionExpiry: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  
  notificationCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationMessage: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
});
