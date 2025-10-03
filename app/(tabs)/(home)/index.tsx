
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

export default function HomeScreen() {
  const quickActions = [
    {
      title: 'Explorar Vacunas',
      description: 'Ver catálogo completo',
      icon: 'list.bullet',
      color: colors.primary,
      route: '/(tabs)/catalog',
    },
    {
      title: 'Mis Pedidos',
      description: 'Seguir mis órdenes',
      icon: 'shippingbox.fill',
      color: colors.accent,
      route: '/(tabs)/orders',
    },
    {
      title: 'Mi Perfil',
      description: 'Gestionar cuenta',
      icon: 'person.fill',
      color: colors.secondary,
      route: '/(tabs)/profile',
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
            <View style={styles.logoContainer}>
              <IconSymbol name="cross.fill" size={32} color={colors.primary} />
            </View>
          </View>
        </View>

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
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: colors.card,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadow,
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
