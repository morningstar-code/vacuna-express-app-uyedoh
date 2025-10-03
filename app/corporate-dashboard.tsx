
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

const { width } = Dimensions.get('window');

const corporateData = {
  company: {
    name: 'Empresa ABC S.A.',
    employees: 150,
    activeEmployees: 142,
    vaccinationCoverage: 85,
  },
  campaigns: [
    {
      id: 'campaign-1',
      name: 'Campaña Influenza 2024',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      targetEmployees: 150,
      vaccinatedEmployees: 128,
      vaccines: ['influenza'],
    },
    {
      id: 'campaign-2',
      name: 'Vacunación COVID-19 Refuerzo',
      status: 'completed',
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      targetEmployees: 145,
      vaccinatedEmployees: 140,
      vaccines: ['covid-19'],
    },
  ],
  departments: [
    { name: 'Administración', employees: 25, vaccinated: 23, coverage: 92 },
    { name: 'Ventas', employees: 40, vaccinated: 35, coverage: 87.5 },
    { name: 'Producción', employees: 60, vaccinated: 48, coverage: 80 },
    { name: 'IT', employees: 15, vaccinated: 14, coverage: 93.3 },
    { name: 'RRHH', employees: 10, vaccinated: 10, coverage: 100 },
  ],
  recentActivity: [
    {
      id: 'activity-1',
      type: 'vaccination',
      message: '15 empleados vacunados contra influenza',
      timestamp: '2024-01-20T10:30:00Z',
    },
    {
      id: 'activity-2',
      type: 'campaign',
      message: 'Nueva campaña de vacunación iniciada',
      timestamp: '2024-01-18T14:00:00Z',
    },
    {
      id: 'activity-3',
      type: 'report',
      message: 'Reporte mensual generado',
      timestamp: '2024-01-15T09:00:00Z',
    },
  ],
};

export default function CorporateDashboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return colors.accent;
    if (coverage >= 70) return colors.warning;
    return colors.error;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return 'syringe.fill';
      case 'campaign':
        return 'megaphone.fill';
      case 'report':
        return 'doc.text.fill';
      default:
        return 'bell.fill';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleExportReport = () => {
    Alert.alert(
      'Exportar Reporte',
      'Selecciona el formato del reporte',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'PDF', onPress: () => console.log('Export PDF') },
        { text: 'Excel', onPress: () => console.log('Export Excel') },
      ]
    );
  };

  const handleCreateCampaign = () => {
    Alert.alert(
      'Nueva Campaña',
      'Esta función te permitirá crear una nueva campaña de vacunación',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => console.log('Create campaign') },
      ]
    );
  };

  const renderStatsCard = (title: string, value: string, subtitle: string, icon: string, color: string) => (
    <View style={[styles.statsCard, commonStyles.card]}>
      <View style={[styles.statsIcon, { backgroundColor: color }]}>
        <IconSymbol name={icon as any} size={20} color={colors.card} />
      </View>
      <View style={styles.statsContent}>
        <Text style={[commonStyles.text, { fontSize: 24, fontWeight: '700', color }]}>
          {value}
        </Text>
        <Text style={[commonStyles.heading, { fontSize: 14 }]}>{title}</Text>
        <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>{subtitle}</Text>
      </View>
    </View>
  );

  const renderCampaignCard = (campaign: any) => (
    <View key={campaign.id} style={[commonStyles.card, styles.campaignCard]}>
      <View style={styles.campaignHeader}>
        <View style={styles.campaignInfo}>
          <Text style={commonStyles.heading}>{campaign.name}</Text>
          <Text style={commonStyles.textSecondary}>
            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
          </Text>
        </View>
        <View style={[
          styles.campaignStatus,
          { backgroundColor: campaign.status === 'active' ? colors.accent : colors.textSecondary }
        ]}>
          <Text style={styles.campaignStatusText}>
            {campaign.status === 'active' ? 'Activa' : 'Completada'}
          </Text>
        </View>
      </View>

      <View style={styles.campaignProgress}>
        <View style={styles.progressInfo}>
          <Text style={commonStyles.textSecondary}>Progreso</Text>
          <Text style={commonStyles.text}>
            {campaign.vaccinatedEmployees}/{campaign.targetEmployees} empleados
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(campaign.vaccinatedEmployees / campaign.targetEmployees) * 100}%`,
                backgroundColor: getCoverageColor((campaign.vaccinatedEmployees / campaign.targetEmployees) * 100),
              },
            ]}
          />
        </View>
        <Text style={[commonStyles.textSmall, { textAlign: 'right' }]}>
          {Math.round((campaign.vaccinatedEmployees / campaign.targetEmployees) * 100)}%
        </Text>
      </View>
    </View>
  );

  const renderDepartmentCard = (department: any) => (
    <View key={department.name} style={[commonStyles.card, styles.departmentCard]}>
      <View style={styles.departmentHeader}>
        <Text style={commonStyles.heading}>{department.name}</Text>
        <Text style={[
          commonStyles.text,
          { color: getCoverageColor(department.coverage), fontWeight: '700' }
        ]}>
          {department.coverage.toFixed(1)}%
        </Text>
      </View>
      <Text style={commonStyles.textSecondary}>
        {department.vaccinated}/{department.employees} empleados vacunados
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${department.coverage}%`,
              backgroundColor: getCoverageColor(department.coverage),
            },
          ]}
        />
      </View>
    </View>
  );

  const renderActivityItem = (activity: any) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: colors.primary }]}>
        <IconSymbol
          name={getActivityIcon(activity.type)}
          size={16}
          color={colors.card}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={commonStyles.text}>{activity.message}</Text>
        <Text style={commonStyles.textSmall}>
          {formatDate(activity.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Dashboard Corporativo',
          headerShown: true,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <ScrollView style={commonStyles.container}>
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={commonStyles.title}>{corporateData.company.name}</Text>
              <Text style={commonStyles.textSecondary}>
                {corporateData.company.employees} empleados • {corporateData.company.vaccinationCoverage}% cobertura
              </Text>
            </View>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportReport}>
              <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsGrid}>
            {renderStatsCard(
              'Empleados Activos',
              corporateData.company.activeEmployees.toString(),
              `de ${corporateData.company.employees} total`,
              'person.2.fill',
              colors.primary
            )}
            {renderStatsCard(
              'Cobertura General',
              `${corporateData.company.vaccinationCoverage}%`,
              'vacunación completa',
              'shield.checkered',
              colors.accent
            )}
          </View>

          {/* Active Campaigns */}
          <View style={styles.section}>
            <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 16 }]}>
              <Text style={commonStyles.heading}>Campañas Activas</Text>
              <TouchableOpacity onPress={handleCreateCampaign}>
                <Text style={[commonStyles.text, { color: colors.primary }]}>
                  + Nueva
                </Text>
              </TouchableOpacity>
            </View>
            {corporateData.campaigns.map(renderCampaignCard)}
          </View>

          {/* Department Coverage */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Cobertura por Departamento
            </Text>
            {corporateData.departments.map(renderDepartmentCard)}
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Actividad Reciente
            </Text>
            <View style={[commonStyles.card, styles.activityCard]}>
              {corporateData.recentActivity.map(renderActivityItem)}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Acciones Rápidas
            </Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={[commonStyles.card, styles.quickActionCard]}>
                <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
                <Text style={[commonStyles.text, { marginTop: 8, textAlign: 'center' }]}>
                  Agregar Empleados
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[commonStyles.card, styles.quickActionCard]}>
                <IconSymbol name="calendar.badge.plus" size={24} color={colors.accent} />
                <Text style={[commonStyles.text, { marginTop: 8, textAlign: 'center' }]}>
                  Programar Campaña
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[commonStyles.card, styles.quickActionCard]}>
                <IconSymbol name="chart.bar.fill" size={24} color={colors.warning} />
                <Text style={[commonStyles.text, { marginTop: 8, textAlign: 'center' }]}>
                  Ver Reportes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  exportButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.card,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadow,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statsCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  campaignCard: {
    marginBottom: 12,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  campaignStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  campaignProgress: {
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
  departmentCard: {
    marginBottom: 12,
    padding: 16,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityCard: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
});
