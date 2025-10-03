
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
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  activeUsers: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'inventory' | 'user' | 'promotion';
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    width: (width - 44) / 2,
    ...commonStyles.shadow,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    width: (width - 44) / 2,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  recentActivity: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.card,
  },
  alertsSection: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.card,
  },
});

export default function AdminDashboardScreen() {
  const [stats] = useState<DashboardStats>({
    totalOrders: 1247,
    pendingOrders: 23,
    totalRevenue: 2847500,
    lowStockItems: 8,
    activeUsers: 3421,
    completionRate: 94.2,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'order',
      description: 'Nuevo pedido #VE-2024-1248 recibido',
      timestamp: '2024-01-20T16:30:00Z',
      priority: 'medium',
    },
    {
      id: '2',
      type: 'inventory',
      description: 'Stock bajo: Vacuna Influenza (5 unidades)',
      timestamp: '2024-01-20T15:45:00Z',
      priority: 'high',
    },
    {
      id: '3',
      type: 'user',
      description: 'Nuevo usuario registrado: María González',
      timestamp: '2024-01-20T14:20:00Z',
      priority: 'low',
    },
    {
      id: '4',
      type: 'promotion',
      description: 'Promoción "Campaña Influenza" activada',
      timestamp: '2024-01-20T13:15:00Z',
      priority: 'medium',
    },
  ]);

  const quickActions = [
    {
      id: 'inventory',
      label: 'Gestionar Inventario',
      icon: 'cube.box.fill',
      color: colors.primary,
      route: '/admin/inventory',
    },
    {
      id: 'orders',
      label: 'Ver Pedidos',
      icon: 'shippingbox.fill',
      color: colors.success,
      route: '/admin/orders',
    },
    {
      id: 'promotions',
      label: 'Promociones',
      icon: 'tag.fill',
      color: colors.warning,
      route: '/admin/promotions',
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: 'person.2.fill',
      color: colors.accent,
      route: '/admin/users',
    },
    {
      id: 'analytics',
      label: 'Análisis',
      icon: 'chart.bar.fill',
      color: colors.secondary,
      route: '/admin/analytics',
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'doc.text.fill',
      color: colors.primary,
      route: '/admin/reports',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'order': return 'shippingbox.fill';
      case 'inventory': return 'cube.box.fill';
      case 'user': return 'person.fill';
      case 'promotion': return 'tag.fill';
      default: return 'circle.fill';
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'order': return colors.success;
      case 'inventory': return colors.warning;
      case 'user': return colors.primary;
      case 'promotion': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  const handleViewAllActivity = () => {
    Alert.alert('Actividad Completa', 'Función próximamente disponible');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Panel de Administración</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('es-DO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <IconSymbol
              name="shippingbox.fill"
              size={24}
              color={colors.primary}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Pedidos</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>
              +12% vs mes anterior
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              name="clock.fill"
              size={24}
              color={colors.warning}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pedidos Pendientes</Text>
            <Text style={[styles.statChange, { color: colors.error }]}>
              +3 desde ayer
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              name="dollarsign.circle.fill"
              size={24}
              color={colors.success}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>
              {formatCurrency(stats.totalRevenue).replace('DOP', 'RD$')}
            </Text>
            <Text style={styles.statLabel}>Ingresos del Mes</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>
              +18% vs mes anterior
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={24}
              color={colors.error}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{stats.lowStockItems}</Text>
            <Text style={styles.statLabel}>Stock Bajo</Text>
            <Text style={[styles.statChange, { color: colors.error }]}>
              Requiere atención
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              name="person.2.fill"
              size={24}
              color={colors.accent}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{stats.activeUsers}</Text>
            <Text style={styles.statLabel}>Usuarios Activos</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>
              +8% vs mes anterior
            </Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              name="checkmark.circle.fill"
              size={24}
              color={colors.success}
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{stats.completionRate}%</Text>
            <Text style={styles.statLabel}>Tasa de Completación</Text>
            <Text style={[styles.statChange, { color: colors.success }]}>
              +2.1% vs mes anterior
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
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
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Alerts Section */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Alertas Importantes</Text>
          
          <View style={styles.alertCard}>
            <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.card} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Stock Crítico</Text>
              <Text style={styles.alertDescription}>
                8 vacunas tienen stock por debajo del mínimo requerido
              </Text>
            </View>
          </View>

          <View style={[styles.alertCard, { backgroundColor: colors.warning }]}>
            <IconSymbol name="clock.fill" size={24} color={colors.card} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Pedidos Pendientes</Text>
              <Text style={styles.alertDescription}>
                23 pedidos requieren procesamiento inmediato
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            <TouchableOpacity onPress={handleViewAllActivity}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <IconSymbol
                  name={getActivityIcon(activity.type)}
                  size={20}
                  color={getActivityColor(activity.type)}
                  style={styles.activityIcon}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                  <Text style={styles.activityTime}>
                    {formatTime(activity.timestamp)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(activity.priority) },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {activity.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
