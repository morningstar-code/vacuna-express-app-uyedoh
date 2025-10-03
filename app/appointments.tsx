
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack } from 'expo-router';
import { Appointment } from '@/types/vaccine';

// Sample appointments
const sampleAppointments: Appointment[] = [
  {
    id: 'apt-1',
    userId: 'user-1',
    type: 'clinic',
    vaccineIds: ['influenza', 'tdap'],
    scheduledDate: '2024-02-15',
    scheduledTime: '10:00',
    status: 'scheduled',
    location: {
      name: 'Clínica VacunaExpress Centro',
      address: 'Av. 27 de Febrero, Santo Domingo',
      latitude: 18.4861,
      longitude: -69.9312,
    },
    notes: 'Traer cédula y tarjeta de seguro',
  },
  {
    id: 'apt-2',
    userId: 'user-1',
    type: 'home',
    vaccineIds: ['hepatitis-b'],
    scheduledDate: '2024-02-20',
    scheduledTime: '14:30',
    status: 'confirmed',
    notes: 'Servicio a domicilio - 2do piso',
  },
];

// Sample clinic locations
const clinicLocations = [
  {
    id: 'clinic-1',
    name: 'Clínica VacunaExpress Centro',
    address: 'Av. 27 de Febrero, Santo Domingo',
    phone: '(809) 555-0101',
    hours: 'Lun-Vie: 8:00-17:00, Sáb: 8:00-12:00',
    distance: '2.5 km',
    rating: 4.8,
  },
  {
    id: 'clinic-2',
    name: 'Clínica VacunaExpress Naco',
    address: 'Av. Tiradentes, Naco, Santo Domingo',
    phone: '(809) 555-0102',
    hours: 'Lun-Vie: 7:00-18:00, Sáb: 8:00-14:00',
    distance: '4.1 km',
    rating: 4.6,
  },
  {
    id: 'clinic-3',
    name: 'Clínica VacunaExpress Piantini',
    address: 'Av. Abraham Lincoln, Piantini',
    phone: '(809) 555-0103',
    hours: 'Lun-Vie: 8:00-16:00',
    distance: '6.8 km',
    rating: 4.9,
  },
];

export default function AppointmentsScreen() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'history' | 'schedule'>('upcoming');
  const [appointments] = useState(sampleAppointments);
  const [selectedService, setSelectedService] = useState<'clinic' | 'home'>('clinic');
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  );
  
  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

  const availableVaccines = [
    { id: 'influenza', name: 'Influenza', price: 25 },
    { id: 'hepatitis-b', name: 'Hepatitis B', price: 45 },
    { id: 'tdap', name: 'Tdap', price: 45 },
    { id: 'vph', name: 'VPH', price: 180 },
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return colors.warning;
      case 'confirmed':
        return colors.primary;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Programada';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de que deseas cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => console.log('Cancel appointment:', appointmentId)
        },
      ]
    );
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    Alert.alert(
      'Reprogramar Cita',
      'Serás redirigido para seleccionar una nueva fecha y hora.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => setSelectedTab('schedule') },
      ]
    );
  };

  const handleScheduleAppointment = () => {
    if (!selectedVaccines.length || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    Alert.alert(
      'Confirmar Cita',
      `¿Deseas programar tu cita para el ${selectedDate} a las ${selectedTime}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            console.log('Schedule appointment:', {
              service: selectedService,
              vaccines: selectedVaccines,
              date: selectedDate,
              time: selectedTime,
              notes,
            });
            Alert.alert('Éxito', 'Tu cita ha sido programada exitosamente.');
            // Reset form
            setSelectedVaccines([]);
            setSelectedDate('');
            setSelectedTime('');
            setNotes('');
            setSelectedTab('upcoming');
          }
        },
      ]
    );
  };

  const toggleVaccineSelection = (vaccineId: string) => {
    setSelectedVaccines(prev => 
      prev.includes(vaccineId)
        ? prev.filter(id => id !== vaccineId)
        : [...prev, vaccineId]
    );
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <View key={appointment.id} style={[commonStyles.card, styles.appointmentCard]}>
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentInfo}>
          <Text style={commonStyles.heading}>
            {appointment.type === 'clinic' ? 'Cita en Clínica' : 'Servicio a Domicilio'}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {formatDate(appointment.scheduledDate)} • {appointment.scheduledTime}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="syringe" size={16} color={colors.textSecondary} />
          <Text style={commonStyles.textSecondary}>
            Vacunas: {appointment.vaccineIds.map(id => 
              availableVaccines.find(v => v.id === id)?.name
            ).join(', ')}
          </Text>
        </View>

        {appointment.location && (
          <View style={styles.detailRow}>
            <IconSymbol name="location" size={16} color={colors.textSecondary} />
            <Text style={commonStyles.textSecondary}>
              {appointment.location.name}
            </Text>
          </View>
        )}

        {appointment.notes && (
          <View style={styles.detailRow}>
            <IconSymbol name="note.text" size={16} color={colors.textSecondary} />
            <Text style={commonStyles.textSecondary}>
              {appointment.notes}
            </Text>
          </View>
        )}
      </View>

      {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
        <View style={styles.appointmentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRescheduleAppointment(appointment.id)}
          >
            <IconSymbol name="calendar" size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Reprogramar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelAppointment(appointment.id)}
          >
            <IconSymbol name="xmark" size={16} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderClinicCard = (clinic: any) => (
    <View key={clinic.id} style={[commonStyles.card, styles.clinicCard]}>
      <View style={styles.clinicHeader}>
        <View style={styles.clinicInfo}>
          <Text style={commonStyles.heading}>{clinic.name}</Text>
          <Text style={commonStyles.textSecondary}>{clinic.address}</Text>
        </View>
        <View style={styles.clinicMeta}>
          <Text style={[commonStyles.textSmall, { color: colors.primary }]}>
            {clinic.distance}
          </Text>
          <View style={styles.rating}>
            <IconSymbol name="star.fill" size={12} color={colors.warning} />
            <Text style={[commonStyles.textSmall, { marginLeft: 4 }]}>
              {clinic.rating}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.clinicDetails}>
        <View style={styles.detailRow}>
          <IconSymbol name="phone" size={16} color={colors.textSecondary} />
          <Text style={commonStyles.textSecondary}>{clinic.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <IconSymbol name="clock" size={16} color={colors.textSecondary} />
          <Text style={commonStyles.textSecondary}>{clinic.hours}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.selectClinicButton}>
        <Text style={[commonStyles.buttonText, { color: colors.primary }]}>
          Seleccionar Clínica
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderScheduleForm = () => (
    <ScrollView style={styles.scheduleForm} showsVerticalScrollIndicator={false}>
      {/* Service Type */}
      <View style={styles.formSection}>
        <Text style={[commonStyles.heading, styles.sectionTitle]}>Tipo de Servicio</Text>
        <View style={styles.serviceSelector}>
          <TouchableOpacity
            style={[
              styles.serviceOption,
              selectedService === 'clinic' && styles.serviceOptionActive
            ]}
            onPress={() => setSelectedService('clinic')}
          >
            <IconSymbol name="building.2" size={24} color={
              selectedService === 'clinic' ? colors.card : colors.primary
            } />
            <Text style={[
              styles.serviceOptionText,
              selectedService === 'clinic' && styles.serviceOptionTextActive
            ]}>
              En Clínica
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.serviceOption,
              selectedService === 'home' && styles.serviceOptionActive
            ]}
            onPress={() => setSelectedService('home')}
          >
            <IconSymbol name="house" size={24} color={
              selectedService === 'home' ? colors.card : colors.primary
            } />
            <Text style={[
              styles.serviceOptionText,
              selectedService === 'home' && styles.serviceOptionTextActive
            ]}>
              A Domicilio
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vaccine Selection */}
      <View style={styles.formSection}>
        <Text style={[commonStyles.heading, styles.sectionTitle]}>Seleccionar Vacunas</Text>
        {availableVaccines.map(vaccine => (
          <TouchableOpacity
            key={vaccine.id}
            style={[
              styles.vaccineOption,
              selectedVaccines.includes(vaccine.id) && styles.vaccineOptionActive
            ]}
            onPress={() => toggleVaccineSelection(vaccine.id)}
          >
            <View style={styles.vaccineInfo}>
              <Text style={commonStyles.text}>{vaccine.name}</Text>
              <Text style={commonStyles.textSecondary}>${vaccine.price}</Text>
            </View>
            <IconSymbol 
              name={selectedVaccines.includes(vaccine.id) ? 'checkmark.circle.fill' : 'circle'} 
              size={24} 
              color={selectedVaccines.includes(vaccine.id) ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Clinic Selection (if clinic service) */}
      {selectedService === 'clinic' && (
        <View style={styles.formSection}>
          <Text style={[commonStyles.heading, styles.sectionTitle]}>Seleccionar Clínica</Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            ⚠️ Los mapas no están disponibles en Natively. Selecciona la clínica más cercana a tu ubicación.
          </Text>
          {clinicLocations.map(renderClinicCard)}
        </View>
      )}

      {/* Date Selection */}
      <View style={styles.formSection}>
        <Text style={[commonStyles.heading, styles.sectionTitle]}>Fecha</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Seleccionar fecha (DD/MM/YYYY)"
          value={selectedDate}
          onChangeText={setSelectedDate}
        />
      </View>

      {/* Time Selection */}
      <View style={styles.formSection}>
        <Text style={[commonStyles.heading, styles.sectionTitle]}>Hora</Text>
        <View style={styles.timeSlots}>
          {timeSlots.map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.timeSlotActive
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[
                styles.timeSlotText,
                selectedTime === time && styles.timeSlotTextActive
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.formSection}>
        <Text style={[commonStyles.heading, styles.sectionTitle]}>Notas (Opcional)</Text>
        <TextInput
          style={[commonStyles.input, styles.notesInput]}
          placeholder="Agregar notas especiales..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Schedule Button */}
      <TouchableOpacity
        style={[
          styles.scheduleButton,
          (!selectedVaccines.length || !selectedDate || !selectedTime) && styles.scheduleButtonDisabled
        ]}
        onPress={handleScheduleAppointment}
        disabled={!selectedVaccines.length || !selectedDate || !selectedTime}
      >
        <Text style={commonStyles.buttonText}>Programar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Citas',
          headerBackTitle: 'Atrás',
        }}
      />
      
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Citas Médicas</Text>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'upcoming' && styles.tabActive]}
              onPress={() => setSelectedTab('upcoming')}
            >
              <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.tabTextActive]}>
                Próximas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'history' && styles.tabActive]}
              onPress={() => setSelectedTab('history')}
            >
              <Text style={[styles.tabText, selectedTab === 'history' && styles.tabTextActive]}>
                Historial
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'schedule' && styles.tabActive]}
              onPress={() => setSelectedTab('schedule')}
            >
              <Text style={[styles.tabText, selectedTab === 'schedule' && styles.tabTextActive]}>
                Programar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {selectedTab === 'upcoming' && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(renderAppointmentCard)
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="calendar" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tienes citas programadas
                </Text>
                <TouchableOpacity 
                  style={styles.scheduleNewButton}
                  onPress={() => setSelectedTab('schedule')}
                >
                  <Text style={[commonStyles.buttonText, { color: colors.primary }]}>
                    Programar Nueva Cita
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {selectedTab === 'history' && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {pastAppointments.length > 0 ? (
              pastAppointments.map(renderAppointmentCard)
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="clock" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tienes historial de citas
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {selectedTab === 'schedule' && renderScheduleForm()}
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
  appointmentCard: {
    marginBottom: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appointmentInfo: {
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
  appointmentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentActions: {
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
  cancelButton: {
    borderColor: colors.error,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  scheduleNewButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  scheduleForm: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  serviceSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  serviceOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  serviceOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  serviceOptionTextActive: {
    color: colors.card,
  },
  vaccineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: 8,
  },
  vaccineOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  vaccineInfo: {
    flex: 1,
  },
  clinicCard: {
    marginBottom: 12,
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicMeta: {
    alignItems: 'flex-end',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  clinicDetails: {
    marginBottom: 12,
  },
  selectClinicButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  timeSlotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  timeSlotTextActive: {
    color: colors.card,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  scheduleButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
});
