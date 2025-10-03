
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
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { Order } from '@/types/vaccine';

// Mock orders data with updated structure
const mockOrders: Order[] = [
  {
    id: 'VE-2025-001',
    userId: 'user1',
    items: [
      { vaccineId: 'hep-b', vaccineName: 'Hepatitis B', dose: 'Refuerzo', quantity: 1, price: 45.00 },
      { vaccineId: 'influenza', vaccineName: 'Influenza', dose: '1ª Dosis', quantity: 1, price: 25.50 },
    ],
    totalAmount: 70.50,
    status: 'in_transit',
    orderDate: '2025-01-15T10:30:00Z',
    deliveryDate: '2025-01-15T16:00:00Z',
    trackingNumber: 'VE001234567',
    progress: 75,
    eta: '15 min',
    location: 'Av. 27 de Febrero',
    doctorConfirmation: false,
    receiptUploaded: true,
    paymentStatus: 'paid',
  },
  {
    id: 'VE-2025-002',
    userId: 'user1',
    items: [
      { vaccineId: 'covid-19', vaccineName: 'COVID-19', dose: 'Refuerzo', quantity: 2, price: 35.00 },
    ],
    totalAmount: 70.00,
    status: 'delivered',
    orderDate: '2025-01-14T14:20:00Z',
    deliveryDate: '2025-01-14T18:30:00Z',
    trackingNumber: 'VE001234568',
    progress: 100,
    doctorConfirmation: false,
    receiptUploaded: true,
    paymentStatus: 'paid',
  },
  {
    id: 'VE-2025-003',
    userId: 'user1',
    items: [
      { vaccineId: 'pneumococcal', vaccineName: 'Neumococo 13', dose: '1ª Dosis', quantity: 1, price: 55.00 },
    ],
    totalAmount: 55.00,
    status: 'preparing',
    orderDate: '2025-01-15T09:15:00Z',
    trackingNumber: 'VE001234569',
    progress: 25,
    paymentStatus: 'paid',
  },
  {
    id: 'VE-2025-004',
    userId: 'user1',
    items: [
      { vaccineId: 'tdap', vaccineName: 'Tdap', dose: 'Refuerzo', quantity: 1, price: 40.00 },
    ],
    totalAmount: 40.00,
    status: 'received',
    orderDate: '2025-01-13T11:00:00Z',
    deliveryDate: '2025-01-13T17:30:00Z',
    trackingNumber: 'VE001234570',
    progress: 100,
    doctorConfirmation: true,
    receiptUploaded: true,
    paymentStatus: 'paid',
    receivedAt: '2025-01-13T17:45:00Z',
  },
];

type OrderStatus = 'all' | 'pending' | 'in_process' | 'delivered';

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState(mockOrders);

  const tabs = [
    { id: 'all' as OrderStatus, label: 'Todos' },
    { id: 'pending' as OrderStatus, label: 'Pendientes' },
    { id: 'in_process' as OrderStatus, label: 'En proceso' },
    { id: 'delivered' as OrderStatus, label: 'Entregados' },
  ];

  const getFilteredOrders = () => {
    switch (selectedTab) {
      case 'pending':
        return orders.filter(order => ['pending', 'confirmed'].includes(order.status));
      case 'in_process':
        return orders.filter(order => ['preparing', 'dispatched', 'in_transit'].includes(order.status));
      case 'delivered':
        return orders.filter(order => ['delivered', 'received'].includes(order.status));
      default:
        return orders;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return '#C7C7CC'; // Gray for pending
      case 'preparing':
      case 'dispatched':
      case 'in_transit':
        return '#0B60D1'; // Primary for current
      case 'delivered':
        return '#19C37D'; // Success for delivered
      case 'received':
        return '#19C37D'; // Success for received
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'PENDIENTE',
      confirmed: 'ACEPTADO',
      preparing: 'PREPARANDO',
      dispatched: 'DESPACHADO',
      in_transit: 'EN CAMINO',
      delivered: 'ENTREGADO',
      received: 'RECIBIDO',
      cancelled: 'CANCELADO',
    };
    return statusMap[status] || status.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-DO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `RD$ ${amount.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
  };

  const getVaccineCount = (items: any[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    return `${totalQuantity} ${totalQuantity === 1 ? 'vacuna' : 'vacunas'}`;
  };

  const getMetaText = (order: Order) => {
    if (order.status === 'in_transit' && order.eta && order.location) {
      return `🚚 En camino — ETA ${order.eta} • ${order.location}`;
    }
    if (order.status === 'preparing') {
      return '⏳ Preparando pedido en farmacia';
    }
    if (order.status === 'delivered' && !order.doctorConfirmation) {
      return '✅ Entregado — Esperando confirmación del doctor';
    }
    if (order.status === 'received' && order.receivedAt) {
      return `✔ Recibido por el doctor — ${formatDateTime(order.receivedAt)}`;
    }
    return `📅 Pedido realizado el ${formatDate(order.orderDate)}`;
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      router.push(`/delivery-tracking?orderId=${order.id}&trackingNumber=${order.trackingNumber}`);
    }
  };

  const handleViewReceipt = (order: Order) => {
    if (order.receiptUploaded) {
      Alert.alert('Recibo', 'Ver recibo de entrega firmado');
    } else {
      Alert.alert('Recibo pendiente', 'El recibo de entrega aún no ha sido subido');
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    Alert.alert('Factura', `Descargar factura del pedido ${order.id}`);
  };

  const handleReorder = (order: Order) => {
    Alert.alert(
      'Reordenar',
      `¿Deseas agregar los artículos del pedido ${order.id} al carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reordenar', onPress: () => router.push('/(tabs)/catalog') },
      ]
    );
  };

  const handleMarkAsReceived = (order: Order) => {
    Alert.alert(
      'Confirmar recepción',
      `¿Confirmas que has recibido el pedido ${order.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            // Optimistic update
            const updatedOrders = orders.map(o => 
              o.id === order.id 
                ? { 
                    ...o, 
                    status: 'received' as Order['status'], 
                    doctorConfirmation: true,
                    receivedAt: new Date().toISOString()
                  }
                : o
            );
            setOrders(updatedOrders);
            
            // Show success toast
            Alert.alert('Confirmado', 'Pedido marcado como recibido');
            
            // Here you would make the API call
            console.log('POST /orders/${order.id}/confirm-received', {
              receivedAt: new Date().toISOString(),
              userId: order.userId
            });
          }
        },
      ]
    );
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={styles.orderCard}>
      {/* Header Line */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>
          Pedido #{order.id} • {getVaccineCount(order.items)} • {formatCurrency(order.totalAmount)}
        </Text>
        <View style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}>
          {order.status === 'received' && (
            <IconSymbol name="checkmark" size={12} color="#FFFFFF" style={{ marginRight: 2 }} />
          )}
          <Text style={styles.statusChipText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${order.progress || 0}%`,
                backgroundColor: getStatusColor(order.status),
              },
            ]}
          />
        </View>
      </View>

      {/* Meta Information */}
      <Text style={styles.metaText}>{getMetaText(order)}</Text>

      {/* Payment Status */}
      {order.paymentStatus === 'pending' && (
        <View style={styles.paymentPending}>
          <IconSymbol name="exclamationmark.triangle.fill" size={14} color={colors.warning} />
          <Text style={styles.paymentPendingText}>Pago pendiente</Text>
        </View>
      )}

      {/* Doctor Confirmation Banner */}
      {order.status === 'delivered' && !order.doctorConfirmation && (
        <View style={styles.confirmationBanner}>
          <Text style={styles.confirmationText}>⌛ Esperando confirmación del doctor</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleMarkAsReceived(order)}
          >
            <Text style={styles.confirmButtonText}>Marcar como Recibido</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success Banner for Received Orders */}
      {order.status === 'received' && order.doctorConfirmation && order.receivedAt && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>
            ✔ Recibido por el doctor — {formatDateTime(order.receivedAt)}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {(order.status === 'in_transit' || order.status === 'dispatched') && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleTrackOrder(order)}
          >
            <Text style={styles.actionButtonText}>Rastrear</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, !order.receiptUploaded && styles.actionButtonDisabled]}
          onPress={() => handleViewReceipt(order)}
        >
          <Text style={[styles.actionButtonText, !order.receiptUploaded && styles.actionButtonTextDisabled]}>
            {order.receiptUploaded ? 'Ver Recibo' : 'Recibo Pendiente'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDownloadInvoice(order)}
        >
          <Text style={styles.actionButtonText}>Factura</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={() => handleReorder(order)}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>Reordenar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Mis Pedidos</Text>
        </View>

        {/* Compact Segmented Control Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  selectedTab === tab.id && styles.tabActive,
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.id && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ordersContent}
        >
          {getFilteredOrders().length > 0 ? (
            getFilteredOrders().map(renderOrderCard)
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="shippingbox" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No hay pedidos</Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedTab === 'all'
                  ? 'Aún no has realizado ningún pedido'
                  : `No tienes pedidos ${tabs.find(t => t.id === selectedTab)?.label.toLowerCase()}`}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // Compact Segmented Control Tabs (36-40dp height)
  tabsContainer: {
    paddingVertical: spacing.sm,
  },
  tabsContent: {
    paddingHorizontal: spacing.lg, // 16dp horizontal padding
    gap: spacing.sm, // 8dp gap between segments
  },
  tab: {
    paddingHorizontal: spacing.lg, // 12-16dp horizontal padding
    paddingVertical: 10,
    borderRadius: spacing.lg, // 16dp radius for pill shape
    backgroundColor: '#F2F3F5', // Inactive background
    minHeight: 36, // 36-40dp total height
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0B60D1', // Primary blue for active
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A3A3C', // Inactive text color
  },
  tabTextActive: {
    color: '#FFFFFF', // White text for active
    fontWeight: '600',
  },

  // Orders List
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl, // 24-32dp bottom padding to avoid tab bar overlap
  },

  // Compact Order Cards (marginBottom: 14dp, padding: 14-16dp)
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl, // 12dp radius
    padding: 16, // 14-16dp padding
    marginBottom: 14, // 14dp vertical spacing - cards never touch
    borderWidth: 1,
    borderColor: '#E5E5EA',
    maxHeight: 160, // Keep under 160dp as specified
  },

  // Header Line (single row) - Format: "Pedido #VE-2025-001 • 2 vacunas • RD$ 1,680.00"
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderTitle: {
    fontSize: 16, // 16sp bold
    fontWeight: '700', // Weight 700 for title
    lineHeight: 22, // 22-24 line height
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },

  // Status Chip (24dp height, radius 12, paddingHorizontal 10)
  statusChip: {
    paddingHorizontal: 10, // 10dp horizontal padding
    paddingVertical: 4,
    borderRadius: 12, // 12dp radius
    minHeight: 24, // 24dp height
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusChipText: {
    fontSize: 12, // 12sp chip text
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Progress Bar (3-4dp height, marginTop 8dp)
  progressContainer: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4, // 3-4dp height
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing.sm, // 8dp marginTop
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Meta Information (14sp, #374151, marginTop 6-8dp)
  metaText: {
    fontSize: 14, // 14sp
    color: '#374151', // Specified color
    marginTop: spacing.sm, // 6-8dp marginTop
    marginBottom: spacing.sm,
    lineHeight: 18,
  },

  // Payment Status
  paymentPending: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  paymentPendingText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '600',
  },

  // Doctor Confirmation Banner (bg #FFF6D6, padding 10dp, radius 10dp, marginTop 10dp)
  confirmationBanner: {
    backgroundColor: '#FFF6D6', // Specified background
    borderRadius: borderRadius.lg, // 10dp radius
    padding: borderRadius.lg, // 10dp padding
    marginTop: borderRadius.lg, // 10dp marginTop
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmationText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  confirmButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },

  // Success Banner for received orders
  successBanner: {
    backgroundColor: '#F0F9FF',
    borderRadius: borderRadius.lg,
    padding: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },

  // Action Buttons (marginTop 10-12dp, gap 8dp, wrap allowed, height 36-40dp)
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm, // 8dp gap
    marginTop: spacing.md, // 10-12dp marginTop
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    minHeight: 36, // 36-40dp button height
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtonTextPrimary: {
    color: colors.card,
  },
  actionButtonTextDisabled: {
    color: colors.textTertiary,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyStateTitle: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
