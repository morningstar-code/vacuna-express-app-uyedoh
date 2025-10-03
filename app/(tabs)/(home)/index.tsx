
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

export default function HomeScreen() {
  // Mock user data - in a real app this would come from authentication
  const doctorName = "Dr. María González";

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

  const handleViewAllPromotions = () => {
    console.log('View all promotions');
    router.push('/promotions');
  };

  const getNotificationTypeChip = (type: string) => {
    switch (type) {
      case 'promotion':
        return { color: colors.success, text: 'Promoción' };
      case 'reminder':
        return { color: colors.primary, text: 'Recordatorio' };
      case 'shipment':
        return { color: colors.warning, text: 'Pedido' };
      default:
        return { color: colors.secondary, text: 'Info' };
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView 
        style={commonStyles.container}
        contentContainerStyle={{ paddingBottom: 32 }} // 32dp padding at bottom
        showsVerticalScrollIndicator={false}
      >
        {/* Header with notification icon next to greeting */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <View style={styles.greetingText}>
              <Text style={styles.greeting}>👋 Hola, {doctorName}</Text>
              <Text style={styles.welcomeText}>Bienvenido a VacunaExpress</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={handleNotifications}
            >
              <IconSymbol name="bell.fill" size={24} color={colors.text} />
              {sampleNotifications.filter(n => !n.isRead).length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {sampleNotifications.filter(n => !n.isRead).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions - 2 per row, smaller and uniform */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/catalog')}
            >
              <View style={styles.quickActionIcon}>
                <IconSymbol name="list.bullet.rectangle" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Catálogo</Text>
              <Text style={styles.quickActionSubtitle}>Explorar vacunas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/orders')}
            >
              <View style={styles.quickActionIcon}>
                <IconSymbol name="shippingbox.fill" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Pedidos</Text>
              <Text style={styles.quickActionSubtitle}>Seguir entregas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/promotions')}
            >
              <View style={styles.quickActionIcon}>
                <IconSymbol name="tag.fill" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Ofertas</Text>
              <Text style={styles.quickActionSubtitle}>Descuentos activos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('/(tabs)/profile')}
            >
              <View style={styles.quickActionIcon}>
                <IconSymbol name="person.fill" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Perfil</Text>
              <Text style={styles.quickActionSubtitle}>Mi cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories - Horizontal Scrollable */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías de Vacunas</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Universal')}
            >
              <View style={styles.categoryIcon}>
                <IconSymbol name="globe" size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>Universal</Text>
              <Text style={styles.categorySubtitle}>Todas las edades</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Niños')}
            >
              <View style={styles.categoryIcon}>
                <IconSymbol name="figure.child" size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>Niños</Text>
              <Text style={styles.categorySubtitle}>Pediatría</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Adolescentes')}
            >
              <View style={styles.categoryIcon}>
                <IconSymbol name="figure.walk" size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>Adolescentes</Text>
              <Text style={styles.categorySubtitle}>11-18 años</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('Adultos')}
            >
              <View style={styles.categoryIcon}>
                <IconSymbol name="person.2.fill" size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryTitle}>Adultos</Text>
              <Text style={styles.categorySubtitle}>18+ años</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Promotions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promociones</Text>
            <TouchableOpacity onPress={handleViewAllPromotions} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todas</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {getActivePromotions().slice(0, 2).map((promotion) => (
            <View key={promotion.id} style={styles.promotionCard}>
              <View style={styles.promotionHeader}>
                <View style={[styles.typeChip, { backgroundColor: colors.success }]}>
                  <Text style={styles.typeChipText}>Promoción</Text>
                </View>
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
        </View>

        {/* Recent Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notificaciones Recientes</Text>
            <TouchableOpacity onPress={handleNotifications} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todas</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {sampleNotifications.slice(0, 3).map((notification) => {
            const chipData = getNotificationTypeChip(notification.type);
            return (
              <View key={notification.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <View style={[styles.typeChip, { backgroundColor: chipData.color }]}>
                    <Text style={styles.typeChipText}>{chipData.text}</Text>
                  </View>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.createdAt).toLocaleDateString('es-DO')}
                  </Text>
                </View>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    marginBottom: spacing.xl, // Increased margin between sections
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28, // 1.4 line height
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280', // Gray as specified
    lineHeight: 20, // 1.4 line height
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
    marginLeft: spacing.md,
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
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  
  section: {
    marginBottom: spacing.xl, // Increased margin between sections (20-24dp)
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16, // Reduced from 18 to 16 for subtitles
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22, // 1.4 line height
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  
  // Updated Quick Actions - 2 per row, smaller and uniform
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  quickActionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md, // Reduced padding for smaller cards
    alignItems: 'center',
    width: '47%', // 2 per row
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100, // Smaller uniform height
  },
  quickActionIcon: {
    width: 40, // Reduced from 48
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    fontSize: 14, // Reduced from 15
    fontWeight: '700',
    color: colors.text,
    lineHeight: 19,
    marginBottom: 2,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12, // Reduced from 13
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  categoriesContainer: {
    paddingRight: spacing.lg,
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md, // Reduced padding
    alignItems: 'center',
    width: 120, // Reduced from 140
    marginRight: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    width: 48, // Reduced from 56
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryTitle: {
    fontSize: 14, // Reduced from 15
    fontWeight: '700',
    color: colors.text,
    lineHeight: 19,
    marginBottom: 2,
    textAlign: 'center',
  },
  categorySubtitle: {
    fontSize: 12, // Reduced from 13
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  promotionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  promotionDiscount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  promotionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
  promotionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  promotionExpiry: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textTertiary,
    lineHeight: 17,
  },
  
  notificationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textTertiary,
    lineHeight: 17,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
});
