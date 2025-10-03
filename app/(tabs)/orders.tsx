
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
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.card,
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
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
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.card,
    textTransform: 'uppercase',
  },
  statusIcon: {
    marginTop: spacing.xs,
  },
  orderItems: {
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
  },
  trackButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reorderButton: {
    backgroundColor: 'transparent',
    borderColor: colors.accent,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: colors.error,
  },
  downloadButton: {
    backgroundColor: 'transparent',
    borderColor: colors.secondary,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trackButtonText: {
    color: colors.card,
  },
  reorderButtonText: {
    color: colors.accent,
  },
  cancelButtonText: {
    color: colors.error,
  },
  downloadButtonText: {
    color: colors.secondary,
  },
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
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample orders data
  const [orders] = useState<Order[]>([
    {
      id: 'VE-2024-001',
      userId: 'user-1',
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
      status: 'in_progress',
      orderDate: '2024-01-20T14:30:00Z',
      deliveryDate: '2024-01-20T18:00:00Z',
      trackingNumber: 'VE20240120001',
    },
    {
      id: 'VE-2024-002',
      userId: 'user-1',
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
      status: 'delivered',
      orderDate: '2024-01-18T10:15:00Z',
      deliveryDate: '2024-01-18T16:30:00Z',
      trackingNumber: 'VE20240118002',
    },
    {
      id: 'VE-2024-003',
      userId: 'user-1',
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
      status: 'pending',
      orderDate: '2024-01-22T09:00:00Z',
      trackingNumber: 'VE20240122003',
    },
  ]);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'in_progress', label: 'En Proceso' },
    { id: 'delivered', label: 'Entregados' },
    { id: 'cancelled', label: 'Cancelados' },
  ];

  const getFilteredOrders = () => {
    if (selectedFilter === 'all') return orders;
    return orders.filter(order => order.status === selectedFilter);
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'clock.fill';
      case 'confirmed': return 'checkmark.circle.fill';
      case 'in_progress': return 'car.fill';
      case 'delivered': return 'checkmark.seal.fill';
      case 'cancelled': return 'xmark.circle.fill';
      default: return 'circle.fill';
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
    return `RD$ ${amount.toFixed(2)}`;
  };

  const handleTrackOrder = (order: Order) => {
    if (order.status === 'in_progress' || order.status === 'confirmed') {
      router.push(`/delivery-tracking?orderId=${order.id}`);
    } else {
      Alert.alert(
        'Seguimiento no disponible',
        'El seguimiento en tiempo real solo está disponible para pedidos en proceso de entrega.'
      );
    }
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

  const handleCancelOrder = (order: Order) => {
    if (order.status === 'delivered' || order.status === 'cancelled') {
      Alert.alert('Error', 'No se puede cancelar este pedido');
      return;
    }

    Alert.alert(
      'Cancelar Pedido',
      `¿Estás seguro de que deseas cancelar el pedido ${order.id}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => {
            console.log('Cancelling order:', order.id);
            Alert.alert('Pedido Cancelado', 'Tu pedido ha sido cancelado exitosamente');
          },
        },
      ]
    );
  };

  const handleDownloadInvoice = (order: Order) => {
    Alert.alert(
      'Descargar Factura',
      `Descargando factura del pedido ${order.id}...`,
      [{ text: 'OK' }]
    );
    console.log('Downloading invoice for order:', order.id);
  };

  const renderOrderCard = (order: Order) => {
    const canTrack = order.status === 'in_progress' || order.status === 'confirmed';
    const canCancel = order.status === 'pending' || order.status === 'confirmed';
    
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>#{order.id}</Text>
            <Text style={styles.orderDate}>
              Pedido el {formatDate(order.orderDate)}
            </Text>
            <Text style={styles.orderAmount}>
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>
          <View style={styles.statusContainer}>
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
            <IconSymbol
              name={getStatusIcon(order.status)}
              size={24}
              color={getStatusColor(order.status)}
              style={styles.statusIcon}
            />
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.vaccineName} - {item.dose}
              </Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.orderActions}>
          {canTrack && (
            <TouchableOpacity
              style={[styles.actionButton, styles.trackButton]}
              onPress={() => handleTrackOrder(order)}
            >
              <Text style={[styles.actionButtonText, styles.trackButtonText]}>
                Rastrear
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.reorderButton]}
            onPress={() => handleReorder(order)}
          >
            <Text style={[styles.actionButtonText, styles.reorderButtonText]}>
              Reordenar
            </Text>
          </TouchableOpacity>

          {canCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelOrder(order)}
            >
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={() => handleDownloadInvoice(order)}
          >
            <Text style={[styles.actionButtonText, styles.downloadButtonText]}>
              Factura
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

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={{ paddingRight: spacing.lg }}
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
              {selectedFilter === 'all'
                ? 'Aún no has realizado ningún pedido.\n¡Explora nuestro catálogo de vacunas!'
                : `No tienes pedidos ${filters.find(f => f.id === selectedFilter)?.label.toLowerCase()}.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
