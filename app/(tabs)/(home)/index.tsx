
import React, { useState, useEffect } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  discount_value: number;
  valid_to: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
}

export default function HomeScreen() {
  const { profile, signOut } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (profile) {
      fetchPromotions();
      fetchNotifications();
    }
  }, [profile]);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('valid_to', new Date().toISOString())
        .limit(3);

      if (error) {
        console.error('Error fetching promotions:', error);
      } else {
        setPromotions(data || []);
      }
    } catch (error) {
      console.error('Exception fetching promotions:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
        const unread = data?.filter(n => !n.is_read).length || 0;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Exception fetching notifications:', error);
    }
  };

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(tabs)/catalog',
      params: { category }
    });
  };

  const handleNotifications = () => {
    router.push('/(tabs)/notifications');
  };

  const handleViewAllPromotions = () => {
    router.push('/(tabs)/promotions');
  };

  const handleEducation = () => {
    router.push('/(tabs)/education');
  };

  const getNotificationTypeChip = (type: string) => {
    const colors_map = {
      reminder: colors.info,
      promotion: colors.success,
      shipment: colors.warning,
      educational: colors.secondary,
    };
    return colors_map[type as keyof typeof colors_map] || colors.secondary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-DO');
  };

  if (!profile) {
    return null; // This shouldn't happen due to auth guard, but just in case
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>👋 Hola, Dr. {profile.first_name}</Text>
              <Text style={styles.businessName}>{profile.business_name}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
              <IconSymbol name="bell.fill" size={24} color={colors.text} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('/(tabs)/catalog')}
            >
              <IconSymbol name="list.bullet.clipboard.fill" size={32} color={colors.primary} />
              <Text style={styles.quickActionText}>Catálogo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('/(tabs)/orders')}
            >
              <IconSymbol name="shippingbox.fill" size={32} color={colors.warning} />
              <Text style={styles.quickActionText}>Pedidos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('/(tabs)/promotions')}
            >
              <IconSymbol name="tag.fill" size={32} color={colors.success} />
              <Text style={styles.quickActionText}>Ofertas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard} 
              onPress={() => handleQuickAction('/(tabs)/profile')}
            >
              <IconSymbol name="person.fill" size={32} color={colors.secondary} />
              <Text style={styles.quickActionText}>Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vaccine Categories */}
        <View style={styles.section}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Categorías de Vacunas</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity 
              style={styles.categoryCard} 
              onPress={() => handleCategoryPress('Universal')}
            >
              <IconSymbol name="globe" size={28} color={colors.info} />
              <Text style={styles.categoryText}>Universal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryCard} 
              onPress={() => handleCategoryPress('Niños')}
            >
              <IconSymbol name="figure.child" size={28} color={colors.success} />
              <Text style={styles.categoryText}>Niños</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryCard} 
              onPress={() => handleCategoryPress('Adolescentes')}
            >
              <IconSymbol name="figure.walk" size={28} color={colors.warning} />
              <Text style={styles.categoryText}>Adolescentes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.categoryCard} 
              onPress={() => handleCategoryPress('Adultos')}
            >
              <IconSymbol name="figure.stand" size={28} color={colors.primary} />
              <Text style={styles.categoryText}>Adultos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promotions */}
        {promotions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Promociones</Text>
              <TouchableOpacity onPress={handleViewAllPromotions}>
                <Text style={styles.viewAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promotionsScroll}>
              {promotions.map((promotion) => (
                <View key={promotion.id} style={styles.promotionCard}>
                  <View style={styles.promotionHeader}>
                    <IconSymbol name="tag.fill" size={20} color={colors.success} />
                    <Text style={styles.promotionDiscount}>-{promotion.discount_value}%</Text>
                  </View>
                  <Text style={styles.promotionTitle}>{promotion.title}</Text>
                  <Text style={styles.promotionDescription} numberOfLines={2}>
                    {promotion.description}
                  </Text>
                  <Text style={styles.promotionExpiry}>
                    Válido hasta: {new Date(promotion.valid_to).toLocaleDateString('es-DO')}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[commonStyles.subtitle, styles.sectionTitle]}>Notificaciones Recientes</Text>
              <TouchableOpacity onPress={handleNotifications}>
                <Text style={styles.viewAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            {notifications.slice(0, 3).map((notification) => (
              <View key={notification.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  <View style={[styles.notificationTypeChip, { backgroundColor: getNotificationTypeChip(notification.type) }]}>
                    <Text style={styles.notificationTypeText}>{notification.type}</Text>
                  </View>
                  <Text style={styles.notificationTime}>{formatDate(notification.created_at)}</Text>
                </View>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Education Card */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.educationCard} onPress={handleEducation}>
            <View style={styles.educationContent}>
              <IconSymbol name="book.fill" size={32} color={colors.primary} />
              <View style={styles.educationText}>
                <Text style={styles.educationTitle}>Recursos Educativos</Text>
                <Text style={styles.educationDescription}>
                  Aprenda sobre vacunas, protocolos y mejores prácticas
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  businessName: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 0,
  },
  viewAllText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  quickActionText: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  categoryText: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  promotionsScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  promotionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: 280,
    ...shadows.sm,
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  promotionDiscount: {
    ...typography.body2,
    color: colors.success,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },
  promotionTitle: {
    ...typography.h6,
    color: colors.text,
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
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notificationTypeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  notificationTypeText: {
    ...typography.caption,
    color: colors.card,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  notificationTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  notificationTitle: {
    ...typography.body1,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  educationCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  educationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  educationText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  educationTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  educationDescription: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  footerSpacing: {
    height: spacing.xxl,
  },
});
