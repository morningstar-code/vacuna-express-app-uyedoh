
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors, commonStyles, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    monthly: { month: string; amount: number }[];
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  vaccines: {
    topSelling: { name: string; quantity: number; revenue: number }[];
    categories: { category: string; percentage: number; color: string }[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retention: number;
  };
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  periodButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.card,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: (width - spacing.lg * 3) / 2,
    ...shadows.md,
  },
  metricIcon: {
    marginBottom: spacing.md,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  topVaccinesCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  vaccineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  vaccineQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  vaccineRevenue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
  categoryDistribution: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  exportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.sm,
  },
  exportButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function AdminAnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mes' },
    { id: 'quarter', label: 'Trimestre' },
    { id: 'year', label: 'Año' },
  ];

  const analyticsData: AnalyticsData = {
    revenue: {
      total: 2847500,
      growth: 18.5,
      monthly: [
        { month: 'Ene', amount: 180000 },
        { month: 'Feb', amount: 220000 },
        { month: 'Mar', amount: 285000 },
        { month: 'Abr', amount: 310000 },
        { month: 'May', amount: 275000 },
        { month: 'Jun', amount: 320000 },
      ],
    },
    orders: {
      total: 1247,
      completed: 1156,
      pending: 68,
      cancelled: 23,
    },
    vaccines: {
      topSelling: [
        { name: 'Influenza', quantity: 245, revenue: 61250 },
        { name: 'Hepatitis B', quantity: 189, revenue: 85050 },
        { name: 'VPH', quantity: 156, revenue: 280800 },
        { name: 'Tdap', quantity: 134, revenue: 60300 },
        { name: 'Neumococo 13', quantity: 98, revenue: 73500 },
      ],
      categories: [
        { category: 'Adultos', percentage: 45, color: colors.primary },
        { category: 'Niños', percentage: 30, color: colors.success },
        { category: 'Adolescentes', percentage: 15, color: colors.warning },
        { category: 'Universal', percentage: 10, color: colors.accent },
      ],
    },
    customers: {
      total: 3421,
      new: 287,
      returning: 2134,
      retention: 78.5,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
    }).format(amount).replace('DOP', 'RD$');
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? colors.success : colors.error;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? 'arrow.up.right' : 'arrow.down.right';
  };

  const handleExportReport = () => {
    console.log('Exporting analytics report for period:', selectedPeriod);
    // In a real app, this would generate and download a report
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Análisis y Reportes</Text>
        <Text style={styles.headerSubtitle}>
          Métricas de rendimiento del negocio
        </Text>
      </View>

      {/* Period Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.periodSelector}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <IconSymbol
              name="dollarsign.circle.fill"
              size={32}
              color={colors.success}
              style={styles.metricIcon}
            />
            <Text style={styles.metricValue}>
              {formatCurrency(analyticsData.revenue.total)}
            </Text>
            <Text style={styles.metricLabel}>Ingresos Totales</Text>
            <Text
              style={[
                styles.metricChange,
                { color: getChangeColor(analyticsData.revenue.growth) },
              ]}
            >
              <IconSymbol
                name={getChangeIcon(analyticsData.revenue.growth)}
                size={12}
                color={getChangeColor(analyticsData.revenue.growth)}
              />
              {' '}+{analyticsData.revenue.growth}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <IconSymbol
              name="shippingbox.fill"
              size={32}
              color={colors.primary}
              style={styles.metricIcon}
            />
            <Text style={styles.metricValue}>{analyticsData.orders.total}</Text>
            <Text style={styles.metricLabel}>Pedidos Totales</Text>
            <Text style={[styles.metricChange, { color: colors.success }]}>
              <IconSymbol
                name="checkmark.circle.fill"
                size={12}
                color={colors.success}
              />
              {' '}{analyticsData.orders.completed} completados
            </Text>
          </View>

          <View style={styles.metricCard}>
            <IconSymbol
              name="person.2.fill"
              size={32}
              color={colors.accent}
              style={styles.metricIcon}
            />
            <Text style={styles.metricValue}>{analyticsData.customers.total}</Text>
            <Text style={styles.metricLabel}>Clientes Totales</Text>
            <Text style={[styles.metricChange, { color: colors.success }]}>
              <IconSymbol
                name="plus.circle.fill"
                size={12}
                color={colors.success}
              />
              {' '}+{analyticsData.customers.new} nuevos
            </Text>
          </View>

          <View style={styles.metricCard}>
            <IconSymbol
              name="arrow.clockwise"
              size={32}
              color={colors.warning}
              style={styles.metricIcon}
            />
            <Text style={styles.metricValue}>{analyticsData.customers.retention}%</Text>
            <Text style={styles.metricLabel}>Retención</Text>
            <Text style={[styles.metricChange, { color: colors.success }]}>
              <IconSymbol
                name="arrow.up.right"
                size={12}
                color={colors.success}
              />
              {' '}+2.3% vs anterior
            </Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ingresos por Mes</Text>
          <View style={styles.chartPlaceholder}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={colors.textSecondary} />
            <Text style={styles.chartPlaceholderText}>
              Gráfico de ingresos mensuales{'\n'}
              (Implementación de gráficos próximamente)
            </Text>
          </View>
        </View>

        {/* Top Selling Vaccines */}
        <View style={styles.topVaccinesCard}>
          <Text style={styles.chartTitle}>Vacunas Más Vendidas</Text>
          {analyticsData.vaccines.topSelling.map((vaccine, index) => (
            <View
              key={vaccine.name}
              style={[
                styles.vaccineItem,
                index === analyticsData.vaccines.topSelling.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <View style={styles.vaccineInfo}>
                <Text style={styles.vaccineName}>{vaccine.name}</Text>
                <Text style={styles.vaccineQuantity}>
                  {vaccine.quantity} unidades vendidas
                </Text>
              </View>
              <Text style={styles.vaccineRevenue}>
                {formatCurrency(vaccine.revenue)}
              </Text>
            </View>
          ))}
        </View>

        {/* Category Distribution */}
        <View style={styles.categoryDistribution}>
          <Text style={styles.chartTitle}>Distribución por Categoría</Text>
          {analyticsData.vaccines.categories.map((category) => (
            <View key={category.category} style={styles.categoryItem}>
              <View
                style={[styles.categoryColor, { backgroundColor: category.color }]}
              />
              <Text style={styles.categoryLabel}>{category.category}</Text>
              <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportButton} onPress={handleExportReport}>
          <Text style={styles.exportButtonText}>Exportar Reporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
