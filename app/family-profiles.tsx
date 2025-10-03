
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { FamilyMember, VaccinationRecord } from '@/types/vaccine';

const sampleFamilyMembers: FamilyMember[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    name: 'María González',
    relationship: 'Esposa',
    birthDate: '1985-03-15',
    gender: 'female',
    vaccinationRecords: [
      {
        id: 'record-1',
        userId: 'user-1',
        vaccineId: 'influenza',
        dose: '1ª Dosis',
        administeredDate: '2023-10-15',
        nextDueDate: '2024-10-15',
        certificateUrl: 'https://example.com/cert1.pdf',
        providerId: 'provider-1',
        batchNumber: 'FLU2023-001',
        notes: 'Sin reacciones adversas',
      },
    ],
  },
  {
    id: 'member-2',
    userId: 'user-1',
    name: 'Carlos González',
    relationship: 'Hijo',
    birthDate: '2015-07-22',
    gender: 'male',
    vaccinationRecords: [
      {
        id: 'record-2',
        userId: 'user-1',
        vaccineId: 'dpt',
        dose: 'Refuerzo',
        administeredDate: '2023-09-10',
        nextDueDate: '2028-09-10',
        certificateUrl: 'https://example.com/cert2.pdf',
        providerId: 'provider-2',
        batchNumber: 'DPT2023-045',
        notes: 'Aplicada en brazo izquierdo',
      },
      {
        id: 'record-3',
        userId: 'user-1',
        vaccineId: 'influenza',
        dose: '1ª Dosis',
        administeredDate: '2023-11-05',
        nextDueDate: '2024-11-05',
        certificateUrl: 'https://example.com/cert3.pdf',
        providerId: 'provider-1',
        batchNumber: 'FLU2023-012',
        notes: 'Reacción leve en el sitio de aplicación',
      },
    ],
  },
  {
    id: 'member-3',
    userId: 'user-1',
    name: 'Ana González',
    relationship: 'Hija',
    birthDate: '2018-12-03',
    gender: 'female',
    vaccinationRecords: [
      {
        id: 'record-4',
        userId: 'user-1',
        vaccineId: 'srp',
        dose: '1ª Dosis',
        administeredDate: '2019-12-03',
        nextDueDate: '2024-12-03',
        certificateUrl: 'https://example.com/cert4.pdf',
        providerId: 'provider-3',
        batchNumber: 'SRP2019-078',
        notes: 'Aplicada según calendario',
      },
    ],
  },
];

export default function FamilyProfilesScreen() {
  const [familyMembers, setFamilyMembers] = useState(sampleFamilyMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female' | 'other',
  });

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

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'person.fill';
      case 'female':
        return 'person.fill';
      default:
        return 'person.fill';
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male':
        return colors.primary;
      case 'female':
        return '#FF69B4';
      default:
        return colors.textSecondary;
    }
  };

  const getVaccinationStatus = (member: FamilyMember) => {
    const age = calculateAge(member.birthDate);
    const records = member.vaccinationRecords;
    
    // Simple logic to determine vaccination status
    if (age < 2 && records.length < 5) return 'incomplete';
    if (age >= 2 && age < 18 && records.length < 8) return 'incomplete';
    if (age >= 18 && records.length < 3) return 'incomplete';
    
    // Check for overdue vaccines
    const now = new Date();
    const hasOverdue = records.some(record => {
      if (!record.nextDueDate) return false;
      return new Date(record.nextDueDate) < now;
    });
    
    if (hasOverdue) return 'overdue';
    return 'up-to-date';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up-to-date':
        return colors.accent;
      case 'overdue':
        return colors.error;
      case 'incomplete':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up-to-date':
        return 'Al día';
      case 'overdue':
        return 'Atrasado';
      case 'incomplete':
        return 'Incompleto';
      default:
        return 'Desconocido';
    }
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship || !newMember.birthDate) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    const member: FamilyMember = {
      id: `member-${Date.now()}`,
      userId: 'user-1',
      name: newMember.name,
      relationship: newMember.relationship,
      birthDate: newMember.birthDate,
      gender: newMember.gender,
      vaccinationRecords: [],
    };

    setFamilyMembers(prev => [...prev, member]);
    setNewMember({ name: '', relationship: '', birthDate: '', gender: 'male' });
    setShowAddModal(false);
    Alert.alert('Éxito', 'Miembro familiar agregado exitosamente');
  };

  const handleDeleteMember = (memberId: string) => {
    Alert.alert(
      'Eliminar Miembro',
      '¿Estás seguro de que deseas eliminar este miembro familiar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
          },
        },
      ]
    );
  };

  const handleViewRecords = (member: FamilyMember) => {
    router.push({
      pathname: '/vaccination-records',
      params: { memberId: member.id },
    } as any);
  };

  const renderMemberCard = (member: FamilyMember) => {
    const age = calculateAge(member.birthDate);
    const status = getVaccinationStatus(member);
    
    return (
      <View key={member.id} style={[commonStyles.card, styles.memberCard]}>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <View style={[styles.avatarContainer, { backgroundColor: getGenderColor(member.gender) }]}>
              <IconSymbol
                name={getGenderIcon(member.gender)}
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.memberDetails}>
              <Text style={commonStyles.heading}>{member.name}</Text>
              <Text style={commonStyles.textSecondary}>
                {member.relationship} • {age} años
              </Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        </View>

        <View style={styles.memberStats}>
          <View style={styles.statItem}>
            <Text style={commonStyles.textSmall}>Vacunas</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {member.vaccinationRecords.length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={commonStyles.textSmall}>Última vacuna</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {member.vaccinationRecords.length > 0
                ? new Date(member.vaccinationRecords[member.vaccinationRecords.length - 1].administeredDate)
                    .toLocaleDateString('es-DO', { month: 'short', day: 'numeric' })
                : 'N/A'
              }
            </Text>
          </View>
        </View>

        <View style={styles.memberActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewRecords(member)}
          >
            <IconSymbol name="doc.text" size={16} color={colors.primary} />
            <Text style={[commonStyles.text, { color: colors.primary, marginLeft: 8 }]}>
              Ver Historial
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteMember(member.id)}
          >
            <IconSymbol name="trash" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAddMemberModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[commonStyles.text, { color: colors.primary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <Text style={commonStyles.heading}>Agregar Miembro</Text>
            <TouchableOpacity onPress={handleAddMember}>
              <Text style={[commonStyles.text, { color: colors.primary, fontWeight: '600' }]}>
                Guardar
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre Completo *</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ingrese el nombre completo"
                value={newMember.name}
                onChangeText={(text) => setNewMember(prev => ({ ...prev, name: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Relación Familiar *</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="Ej: Esposa, Hijo, Madre, etc."
                value={newMember.relationship}
                onChangeText={(text) => setNewMember(prev => ({ ...prev, relationship: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Fecha de Nacimiento *</Text>
              <TextInput
                style={commonStyles.input}
                placeholder="YYYY-MM-DD"
                value={newMember.birthDate}
                onChangeText={(text) => setNewMember(prev => ({ ...prev, birthDate: text }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Género</Text>
              <View style={styles.genderSelector}>
                {[
                  { value: 'male', label: 'Masculino' },
                  { value: 'female', label: 'Femenino' },
                  { value: 'other', label: 'Otro' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      newMember.gender === option.value && styles.genderOptionSelected,
                    ]}
                    onPress={() => setNewMember(prev => ({ ...prev, gender: option.value as any }))}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      newMember.gender === option.value && styles.genderOptionTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Perfiles Familiares',
          headerShown: true,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <View>
              <Text style={commonStyles.title}>Familia</Text>
              <Text style={commonStyles.textSecondary}>
                {familyMembers.length} miembro{familyMembers.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <IconSymbol name="plus" size={20} color={colors.card} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Family Members List */}
        <ScrollView style={styles.membersList}>
          {familyMembers.length > 0 ? (
            familyMembers.map(renderMemberCard)
          ) : (
            <View style={[commonStyles.center, { marginTop: 50 }]}>
              <IconSymbol name="person.2.fill" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No hay miembros familiares
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                Agrega miembros de tu familia para gestionar sus vacunas
              </Text>
              <TouchableOpacity
                style={[buttonStyles.primary, { marginTop: 16 }]}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={commonStyles.buttonText}>Agregar Primer Miembro</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Summary Card */}
        {familyMembers.length > 0 && (
          <View style={[commonStyles.card, styles.summaryCard]}>
            <Text style={[commonStyles.heading, { marginBottom: 12 }]}>
              Resumen Familiar
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSmall}>Al día</Text>
                <Text style={[commonStyles.text, { color: colors.accent, fontWeight: '700' }]}>
                  {familyMembers.filter(m => getVaccinationStatus(m) === 'up-to-date').length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSmall}>Atrasados</Text>
                <Text style={[commonStyles.text, { color: colors.error, fontWeight: '700' }]}>
                  {familyMembers.filter(m => getVaccinationStatus(m) === 'overdue').length}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={commonStyles.textSmall}>Incompletos</Text>
                <Text style={[commonStyles.text, { color: colors.warning, fontWeight: '700' }]}>
                  {familyMembers.filter(m => getVaccinationStatus(m) === 'incomplete').length}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {renderAddMemberModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  membersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  memberCard: {
    marginBottom: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
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
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  genderOptionTextSelected: {
    color: colors.card,
    fontWeight: '600',
  },
});
