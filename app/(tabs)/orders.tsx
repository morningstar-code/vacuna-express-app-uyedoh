
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { colors, commonStyles, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { Order } from '@/types/vaccine';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8A8A8E',
  },
  
  // Segmented Control Styles
  segmentedControlContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: 40,
  },
  segmentedControlScrollView: {
    flexGrow: 0,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 7,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#0B60D1',
  },
  segmentInactive: {
    backgroundColor: '#F2F3F5',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  segmentTextInactive: {
    color: '#3A3A3C',
  },
  
  // Order List Styles
  ordersList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  
  // Compact Order Card Styles
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 11,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minHeight: 120,
    maxHeight: 160,
  },
  
  // Header Line
  orderHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Progress Indicator
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0B60D1',
    borderRadius: 2,
  },
  
  // Meta Line
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 14,
    color: '#8A8A8E',
    lineHeight: 18,
  },
  
  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  actionButtonPrimary: {
    backgroundColor: '#0B60D1',
    borderColor: '#0B60D1',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#C7C7CC',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextPrimary: {
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    color: '#8A8A8E',
  },
  
  // Info Banner
  infoBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBannerText: {
    fontSize: 13,
    color: '#856404',
    flex: 1,
    marginRight: 8,
  },
  infoBannerButton: {
    backgroundColor: '#0B60D1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  infoBannerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Badge Styles
  paymentBadge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  paymentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  receiptBadge: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  receiptBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState('todos');

  // Enhanced sample orders data with new status values and additional fields
  const [orders] = useState<Order[]>([
    {
      id: 'VE-2025-001',
      userId: 'user-1',
      items: [
        {
          vaccineId: 'influenza',
          vaccineName: 'Influenza',
          dose: '1ª Dosis',
          quantity: 1,
          price: 840.00,
        },
        {
          vaccineId: 'hep-b',
          vaccineName: 'Hepatitis B',
          dose: 'Refuerzo',
          quantity: 1,
          price: 840.00,
        },
      ],
      totalAmount: 1680.00,
      status: 'in_transit',
      orderDate: '2025-01-20T14:30:00Z',
      deliveryDate: '2025-01-20T18:00:00Z',
      trackingNumber: 'VE20250120001',
      progress: 75,
      eta: '15 min',
      location: 'Av. 27 de Febrero',
      doctorConfirmation: false,
      receiptUploaded: false,
      paymentStatus: 'paid',
    },
    {
      id: 'VE-2025-002',
      userId: 'user-1',
      items: [
        {
          vaccineId: 'vph',
          vaccineName: 'VPH',
          dose: '1ª Dosis',
          quantity: 1,
          price: 1800.00,
        },
      ],
      totalAmount: 1800.00,
      status: 'delivered',
      orderDate: '2025-01-18T10:15:00Z',
      deliveryDate: '2025-01-18T16:30:00Z',
      trackingNumber: 'VE20250118002',
      progress: 100,
      doctorConfirmation: false,
      receiptUploaded: true,
      paymentStatus: 'paid',
    },
    {
      id: 'VE-2025-003',
      userId: 'user-1',
      items: [
        {
          vaccineId: 'tdap',
          vaccineName: 'Tdap',
          dose: 'Refuerzo',
          quantity: 1,
          price: 900.00,
        },
      ],
      totalAmount: 900.00,
      status: 'pending',
      orderDate: '2025-01-22T09:00:00Z',
      trackingNumber: 'VE20250122003',
      progress: 0,
      doctorConfirmation: false,
      receiptUploaded: false,
      paymentStatus: 'pending',
    },
    {
      id: 'VE-2025-004',
      userId: 'user-1',
      items: [
        {
          vaccineId: 'pneumococo',
          vaccineName: 'Neumococo 13',
          dose: '1ª Dosis',
          quantity: 1,
          price: 1200.00,
        },
      ],
      totalAmount: 1200.00,
      status: 'preparing',
      orderDate: '2025-01-21T11:00:00Z',
      trackingNumber: 'VE20250121004',
      progress: 25,
      doctorConfirmation: false,
      receiptUploaded: false,
      paymentStatus: 'paid',
    },
  ]);

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'pendientes', label: 'Pendientes' },
    { id: 'en_proceso', label: 'En proceso' },
    { id: 'entregados', label: 'Entregados' },
  ];

  const getFilteredOrders = () => {
    if (selectedFilter === 'todos') return orders;
    
    switch (selectedFilter) {
      case 'pendientes':
        return orders.filter(order => order.status === 'pending');
      case 'en_proceso':
        return orders.filter(order => 
          ['confirmed', 'preparing', 'dispatched', 'in_transit'].includes(order.status)
        );
      case 'entregados':
        return orders.filter(order => 
          ['delivered', 'received'].includes(order.status)
        );
      default:
        return orders;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#C7C7CC';
      case 'confirmed': 
      case 'preparing':
      case 'dispatched':
      case 'in_transit': return '#0B60D1';
      case 'delivered':
      case 'received': return '#19C37D';
      case 'cancelled': return '#C7C7CC';
      default: return '#C7C7CC';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'PENDIENTE';
      case 'confirmed': return 'ACEPTADO';
      case 'preparing': return 'PREPARANDO';
      case 'dispatched': return 'DESPACHADO';
      case 'in_transit': return 'EN CAMINO';
      case 'delivered': return 'ENTREGADO';
      case 'received': return 'RECIBIDO';
      case 'cancelled': return 'CANCELADO';
      default: return 'DESCONOCIDO';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `RD$ ${amount.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getVaccineCount = (items: any[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getMetaText = (order: Order) => {
    if (order.status === 'in_transit' && order.eta && order.location) {
      return `🚚 En camino — ETA ${order.eta} • ${order.location}`;
    }
    if (order.status === 'preparing') {
      return `⚗️ Preparando pedido en laboratorio`;
    }
    if (order.status === 'dispatched') {
      return `📦 Despachado — En camino al destino`;
    }
    if (order.status === 'delivered') {
      return `✅ Entregado el ${formatDate(order.deliveryDate || order.orderDate)}`;
    }
    if (order.status === 'pending') {
      return `⏳ Esperando confirmación`;
    }
    return '';
  };

  const handleTrackOrder = (order: Order) => {
    if (['confirmed', 'preparing', 'dispatched', 'in_transit'].includes(order.status)) {
      router.push(`/delivery-tracking?orderId=${order.id}`);
    } else {
      Alert.alert(
        'Seguimiento no disponible',
        'El seguimiento en tiempo real solo está disponible para pedidos en proceso de entrega.'
      );
    }
  };

  const handleViewReceipt = (order: Order) => {
    if (order.receiptUploaded) {
      Alert.alert('Ver Recibo', `Mostrando recibo del pedido ${order.id}`);
    } else {
      Alert.alert('Recibo no disponible', 'El recibo aún no ha sido subido por el repartidor.');
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    Alert.alert('Descargar Factura', `Descargando factura del pedido ${order.id}...`);
    console.log('Downloading invoice for order:', order.id);
  };

  const handleReorder = (order: Order) => {
    Alert.alert(
      'Reordenar',
      `¿Deseas agregar los artículos del pedido ${order.id} al carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reordenar',
          onPress: () => {
            console.log('Reordering:', order.items);
            Alert.alert('Éxito', 'Artículos agregados al carrito');
          },
        },
      ]
    );
  };

  const handleMarkAsReceived = (order: Order) => {
    Alert.alert(
      'Marcar como Recibido',
      '¿Confirmas que has recibido este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            console.log('Marking order as received:', order.id);
            Alert.alert('Confirmado', 'Pedido marcado como recibido');
          },
        },
      ]
    );
  };

  const renderOrderCard = (order: Order) => {
    const vaccineCount = getVaccineCount(order.items);
    const showDoctorConfirmation = order.status === 'delivered' && !order.doctorConfirmation;
    
    return (
      <View key={order.id} style={styles.orderCard}>
        {/* Header Line */}
        <View style={styles.orderHeaderLine}>
          <Text style={styles.orderHeaderText}>
            Pedido #{order.id} • {vaccineCount} vacuna{vaccineCount !== 1 ? 's' : ''} • {formatCurrency(order.totalAmount)}
            {order.paymentStatus === 'pending' && (
              <View style={styles.paymentBadge}>
                <Text style={styles.paymentBadgeText}>Pago pendiente</Text>
              </View>
            )}
            {!order.receiptUploaded && order.status === 'delivered' && (
              <View style={styles.receiptBadge}>
                <Text style={styles.receiptBadgeText}>Recibo pendiente</Text>
              </View>
            )}
          </Text>
          <View style={[styles.statusChip, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusChipText}>{getStatusText(order.status)}</Text>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${order.progress || 0}%` }
              ]} 
            />
          </View>
        </View>

        {/* Meta Line */}
        <View style={styles.metaLine}>
          <Text style={styles.metaText}>{getMetaText(order)}</Text>
        </View>

        {/* Doctor Confirmation Banner */}
        {showDoctorConfirmation && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>Esperando confirmación del doctor</Text>
            <TouchableOpacity 
              style={styles.infoBannerButton}
              onPress={() => handleMarkAsReceived(order)}
            >
              <Text style={styles.infoBannerButtonText}>Marcar como Recibido</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          {['confirmed', 'preparing', 'dispatched', 'in_transit'].includes(order.status) && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => handleTrackOrder(order)}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                Rastrear
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => handleViewReceipt(order)}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              {order.receiptUploaded ? 'Ver Recibo' : 'Ver Firma'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => handleDownloadInvoice(order)}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              Factura
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => handleReorder(order)}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              Reordenar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredOrders = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControlContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentedControlScrollView}
        >
          <View style={styles.segmentedControl}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.segment,
                  selectedFilter === filter.id ? styles.segmentActive : styles.segmentInactive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    selectedFilter === filter.id ? styles.segmentTextActive : styles.segmentTextInactive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView 
        style={styles.ordersList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrderCard)
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol
              name="shippingbox"
              size={64}
              color={colors.textTertiary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No hay pedidos</Text>
            <Text style={styles.emptyDescription}>
              {selectedFilter === 'todos'
                ? 'Aún no has realizado ningún pedido.\n¡Explora nuestro catálogo de vacunas!'
                : `No tienes pedidos ${filters.find(f => f.id === selectedFilter)?.label.toLowerCase()}.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
