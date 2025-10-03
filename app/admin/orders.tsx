
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
import { colors, commonStyles, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { Order } from '@/types/vaccine';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.card,
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  ordersList: {
    flex: 1,
    padding: spacing.lg,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  customerName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
    textTransform: 'uppercase',
  },
  orderDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  assignButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  updateButton: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function AdminOrdersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'assign' | 'update' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    courier: '',
    status: '',
    notes: '',
  });

  // Sample orders data for admin
  const [orders] = useState<(Order & { customerName: string; customerPhone: string })[]>([
    {
      id: 'VE-2024-001',
      userId: 'user-1',
      customerName: 'María González',
      customerPhone: '+1 (809) 555-0123',
      items: [
        {
          vaccineId: 'influenza',
          vaccineName: 'Influenza',
          dose: '1ª Dosis',
          quantity: 1,
          price: 25.00,
        },
        {
          vaccineId: 'hep-b',
          vaccineName: 'Hepatitis B',
          dose: 'Refuerzo',
          quantity: 1,
          price: 45.00,
        },
      ],
      totalAmount: 70.00,
      status: 'pending',
      orderDate: '2024-01-20T14:30:00Z',
      trackingNumber: 'VE20240120001',
    },
    {
      id: 'VE-2024-002',
      userId: 'user-2',
      customerName: 'Carlos Rodríguez',
      customerPhone: '+1 (809) 555-0456',
      items: [
        {
          vaccineId: 'vph',
          vaccineName: 'VPH',
          dose: '1ª Dosis',
          quantity: 1,
          price: 180.00,
        },
      ],
      totalAmount: 180.00,
      status: 'confirmed',
      orderDate: '2024-01-20T10:15:00Z',
      trackingNumber: 'VE20240120002',
    },
    {
      id: 'VE-2024-003',
      userId: 'user-3',
      customerName: 'Ana Martínez',
      customerPhone: '+1 (809) 555-0789',
      items: [
        {
          vaccineId: 'tdap',
          vaccineName: 'Tdap',
          dose: 'Refuerzo',
          quantity: 2,
          price: 45.00,
        },
      ],
      totalAmount: 90.00,
      status: 'in_progress',
      orderDate: '2024-01-19T16:45:00Z',
      trackingNumber: 'VE20240119003',
    },
  ]);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'confirmed', label: 'Confirmados' },
    { id: 'in_progress', label: 'En Proceso' },
    { id: 'delivered', label: 'Entregados' },
  ];

  const getFilteredOrders = () => {
    let filtered = orders;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(order => order.status === selectedFilter);
    }

    return filtered;
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'confirmed': return colors.info;
      case 'in_progress': return colors.primary;
      case 'delivered': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'in_progress': return 'En Proceso';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `RD$ ${amount.toFixed(2)}`;
  };

  const handleAcceptOrder = (order: Order) => {
    Alert.alert(
      'Aceptar Pedido',
      `¿Confirmar el pedido ${order.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => {
            console.log('Accepting order:', order.id);
            Alert.alert('Éxito', 'Pedido aceptado y confirmado');
          },
        },
      ]
    );
  };

  const handleRejectOrder = (order: Order) => {
    Alert.alert(
      'Rechazar Pedido',
      `¿Estás seguro de rechazar el pedido ${order.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: () => {
            console.log('Rejecting order:', order.id);
            Alert.alert('Pedido Rechazado', 'El pedido ha sido rechazado');
          },
        },
      ]
    );
  };

  const handleAssignCourier = (order: Order) => {
    setSelectedOrder(order);
    setModalType('assign');
    setFormData({ courier: '', status: '', notes: '' });
    setShowModal(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setModalType('update');
    setFormData({ courier: '', status: order.status, notes: '' });
    setShowModal(true);
  };

  const handleSaveModal = () => {
    if (modalType === 'assign' && !formData.courier) {
      Alert.alert('Error', 'Por favor selecciona un repartidor');
      return;
    }

    if (modalType === 'update' && !formData.status) {
      Alert.alert('Error', 'Por favor selecciona un estado');
      return;
    }

    console.log('Saving:', {
      orderId: selectedOrder?.id,
      type: modalType,
      data: formData,
    });

    Alert.alert(
      'Éxito',
      modalType === 'assign' ? 'Repartidor asignado correctamente' : 'Estado actualizado correctamente'
    );

    setShowModal(false);
    setSelectedOrder(null);
    setModalType(null);
    setFormData({ courier: '', status: '', notes: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Gestión de Pedidos ({getFilteredOrders().length})
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número, cliente o tracking..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
        {getFilteredOrders().map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>#{order.id}</Text>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <Text style={styles.orderDate}>
                  {formatDate(order.orderDate)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Teléfono:</Text>
                <Text style={styles.detailValue}>{order.customerPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(order.totalAmount)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Artículos:</Text>
                <Text style={styles.detailValue}>
                  {order.items.length} vacuna{order.items.length !== 1 ? 's' : ''}
                </Text>
              </View>
              {order.trackingNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tracking:</Text>
                  <Text style={styles.detailValue}>{order.trackingNumber}</Text>
                </View>
              )}
            </View>

            <View style={styles.orderActions}>
              {order.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAcceptOrder(order)}
                  >
                    <Text style={styles.actionButtonText}>Aceptar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectOrder(order)}
                  >
                    <Text style={styles.actionButtonText}>Rechazar</Text>
                  </TouchableOpacity>
                </>
              )}

              {(order.status === 'confirmed' || order.status === 'in_progress') && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.assignButton]}
                  onPress={() => handleAssignCourier(order)}
                >
                  <Text style={styles.actionButtonText}>Asignar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={() => handleUpdateStatus(order)}
              >
                <Text style={styles.actionButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'assign' ? 'Asignar Repartidor' : 'Actualizar Estado'}
            </Text>

            {modalType === 'assign' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Repartidor *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.courier}
                  onChangeText={(text) => setFormData({ ...formData, courier: text })}
                  placeholder="Seleccionar repartidor"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            )}

            {modalType === 'update' && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Estado *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.status}
                  onChangeText={(text) => setFormData({ ...formData, status: text })}
                  placeholder="Nuevo estado"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notas</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Notas adicionales..."
                multiline
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveModal}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
