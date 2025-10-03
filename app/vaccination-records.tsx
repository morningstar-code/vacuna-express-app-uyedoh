
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router } from 'expo-router';
import { VaccinationRecord, FamilyMember } from '@/types/vaccine';

// Sample vaccination records
const sampleRecords: VaccinationRecord[] = [
  {
    id: 'rec-1',
    userId: 'user-1',
    vaccineId: 'influenza',
    dose: '1ª Dosis',
    administeredDate: '2024-01-15',
    nextDueDate: '2025-01-15',
    certificateUrl: 'https://example.com/cert1.pdf',
    providerId: 'clinic-1',
    batchNumber: 'FLU2024-001',
    notes: 'Sin reacciones adversas',
  },
  {
    id: 'rec-2',
    userId: 'user-1',
    vaccineId: 'hepatitis-b',
    dose: '2ª Dosis',
    administeredDate: '2023-12-10',
    nextDueDate: '2024-06-10',
    certificateUrl: 'https://example.com/cert2.pdf',
    providerId: 'clinic-2',
    batchNumber: 'HEP2023-045',
  },
  {
    id: 'rec-3',
    userId: 'user-1',
    vaccineId: 'tdap',
    dose: 'Refuerzo',
    administeredDate: '2023-08-20',
    nextDueDate: '2033-08-20',
    certificateUrl: 'https://example.com/cert3.pdf',
    providerId: 'clinic-1',
    batchNumber: 'TDAP2023-012',
  },
];

// Sample family members
const sampleFamily: FamilyMember[] = [
  {
    id: 'fam-1',
    userId: 'user-1',
    name: 'María Pérez',
    relationship: 'Esposa',
    birthDate: '1985-03-15',
    gender: 'female',
    vaccinationRecords: [
      {
        id: 'rec-fam-1',
        userId: 'fam-1',
        vaccineId: 'vph',
        dose: '1ª Dosis',
        administeredDate: '2024-01-20',
        nextDueDate: '2024-03-20',
        certificateUrl: 'https://example.com/cert-fam1.pdf',
        providerId: 'clinic-1',
        batchNumber: 'VPH2024-008',
      },
    ],
  },
  {
    id: 'fam-2',
    userId: 'user-1',
    name: 'Carlos Pérez',
    relationship: 'Hijo',
    birthDate: '2015-07-10',
    gender: 'male',
    vaccinationRecords: [
      {
        id: 'rec-fam-2',
        userId: 'fam-2',
        vaccineId: 'srp',
        dose: '1ª Dosis',
        administeredDate: '2023-11-15',
        nextDueDate: '2024-11-15',
        certificateUrl: 'https://example.com/cert-fam2.pdf',
        providerId: 'clinic-pediatric',
        batchNumber: 'SRP2023-025',
      },
    ],
  },
];

export default function VaccinationRecordsScreen() {
  const [selectedTab, setSelectedTab] = useState<'personal' | 'family'>('personal');
  const [records] = useState(sampleRecords);
  const [familyMembers] = useState(sampleFamily);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getVaccineName = (vaccineId: string) => {
    const vaccineNames: { [key: string]: string } = {
      'influenza': 'Influenza',
      'hepatitis-b': 'Hepatitis B',
      'tdap': 'Tdap',
      'vph': 'VPH',
      'srp': 'SRP',
    };
    return vaccineNames[vaccineId] || vaccineId;
  };

  const isOverdue = (nextDueDate?: string) => {
    if (!nextDueDate) return false;
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    return today > dueDate;
  };

  const isDueSoon = (nextDueDate?: string) => {
    if (!nextDueDate) return false;
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const handleViewCertificate = (record: VaccinationRecord) => {
    Alert.alert(
      'Certificado de Vacunación',
      `¿Deseas descargar el certificado para ${getVaccineName(record.vaccineId)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descargar', onPress: () => console.log('Download certificate:', record.certificateUrl) },
      ]
    );
  };

  const handleScheduleNext = (record: VaccinationRecord) => {
    Alert.alert(
      'Programar Siguiente Dosis',
      `¿Deseas programar la siguiente dosis de ${getVaccineName(record.vaccineId)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Programar', onPress: () => console.log('Schedule next dose') },
      ]
    );
  };

  const renderVaccinationRecord = (record: VaccinationRecord, isFamily = false) => {
    const overdue = isOverdue(record.nextDueDate);
    const dueSoon = isDueSoon(record.nextDueDate);
    
    return (
      <View key={record.id} style={[commonStyles.card, styles.recordCard]}>
        <View style={styles.recordHeader}>
          <View style={styles.recordInfo}>
            <Text style={commonStyles.heading}>{getVaccineName(record.vaccineId)}</Text>
            <Text style={commonStyles.textSecondary}>{record.dose}</Text>
          </View>
          
          <View style={styles.recordStatus}>
            {overdue && (
              <View style={[styles.statusBadge, { backgroundColor: colors.error }]}>
                <Text style={styles.statusText}>Vencida</Text>
              </View>
            )}
            {dueSoon && !overdue && (
              <View style={[styles.statusBadge, { backgroundColor: colors.warning }]}>
                <Text style={styles.statusText}>Próxima</Text>
              </View>
            )}
            {!overdue && !dueSoon && (
              <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.statusText}>Al día</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.recordDetails}>
          <View style={styles.detailRow}>
            <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
            <Text style={commonStyles.textSecondary}>
              Aplicada: {formatDate(record.administeredDate)}
            </Text>
          </View>
          
          {record.nextDueDate && (
            <View style={styles.detailRow}>
              <IconSymbol name="clock" size={16} color={colors.textSecondary} />
              <Text style={[
                commonStyles.textSecondary,
                overdue && { color: colors.error },
                dueSoon && { color: colors.warning }
              ]}>
                Próxima: {formatDate(record.nextDueDate)}
              </Text>
            </View>
          )}
          
          {record.batchNumber && (
            <View style={styles.detailRow}>
              <IconSymbol name="number" size={16} color={colors.textSecondary} />
              <Text style={commonStyles.textSecondary}>
                Lote: {record.batchNumber}
              </Text>
            </View>
          )}
          
          {record.notes && (
            <View style={styles.detailRow}>
              <IconSymbol name="note.text" size={16} color={colors.textSecondary} />
              <Text style={commonStyles.textSecondary}>
                {record.notes}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.recordActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewCertificate(record)}
          >
            <IconSymbol name="doc.text" size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Certificado
            </Text>
          </TouchableOpacity>
          
          {record.nextDueDate && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              onPress={() => handleScheduleNext(record)}
            >
              <IconSymbol name="calendar.badge.plus" size={16} color={colors.card} />
              <Text style={[styles.actionButtonText, { color: colors.card }]}>
                Programar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderFamilyMember = (member: FamilyMember) => (
    <View key={member.id} style={styles.familySection}>
      <View style={[commonStyles.card, styles.familyHeader]}>
        <View style={styles.familyInfo}>
          <View style={[styles.genderIcon, { backgroundColor: member.gender === 'female' ? colors.accent : colors.primary }]}>
            <IconSymbol 
              name={member.gender === 'female' ? 'person.fill' : 'person.fill'} 
              size={20} 
              color={colors.card} 
            />
          </View>
          <View>
            <Text style={commonStyles.heading}>{member.name}</Text>
            <Text style={commonStyles.textSecondary}>
              {member.relationship} • {calculateAge(member.birthDate)} años
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addRecordButton}>
          <IconSymbol name="plus.circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {member.vaccinationRecords.map(record => renderVaccinationRecord(record, true))}
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Registro de Vacunas',
          headerBackTitle: 'Atrás',
        }}
      />
      
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Registro de Vacunas</Text>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'personal' && styles.tabActive
              ]}
              onPress={() => setSelectedTab('personal')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'personal' && styles.tabTextActive
              ]}>
                Personal ({records.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'family' && styles.tabActive
              ]}
              onPress={() => setSelectedTab('family')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'family' && styles.tabTextActive
              ]}>
                Familia ({familyMembers.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'personal' ? (
            records.length > 0 ? (
              records.map(record => renderVaccinationRecord(record))
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="heart.text.square" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tienes registros de vacunación
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  Tus vacunas aparecerán aquí después de ser administradas
                </Text>
              </View>
            )
          ) : (
            familyMembers.length > 0 ? (
              familyMembers.map(renderFamilyMember)
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="person.2" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tienes miembros de familia registrados
                </Text>
                <TouchableOpacity style={styles.addFamilyButton}>
                  <Text style={[commonStyles.buttonText, { color: colors.primary }]}>
                    Agregar Familiar
                  </Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.card,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recordCard: {
    marginBottom: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recordInfo: {
    flex: 1,
  },
  recordStatus: {
    marginLeft: 12,
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
  recordDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    marginHorizontal: 4,
  },
  primaryAction: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  familySection: {
    marginBottom: 24,
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  familyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  genderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addRecordButton: {
    padding: 8,
  },
  addFamilyButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
});
