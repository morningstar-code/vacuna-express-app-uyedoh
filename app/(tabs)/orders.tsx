
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
import { Order } from '@/types/vaccine';

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: 'order-001',
    userId: 'user-1',
    items: [
      {
        vaccineId: 'influenza',
        vaccineName: 'Influenza',
        dose: '1ª Dosis',
        quantity: 2,
        price: 25.00,
      },
      {
        vaccineId: 'vph',
        vaccineName: 'VPH',
        dose: '1ª Dosis',
        quantity: 1,
        price: 180.00,
      },
    ],
    totalAmount: 230.00,
    status: 'in_progress',
    orderDate: '2024-01-15T10:30:00Z',
    trackingNumber: 'VE2024001',
  },
  {
    id: 'order-002',
    userId: 'user-1',
    items: [
      {
        vaccineId: 'hepatitis-b',
        vaccineName: 'Hepatitis B',
        dose: '2ª Dosis',
        quantity: 1,
        price: 45.00,
      },
    ],
    totalAmount: 45.00,
    status: 'delivered',
    orderDate: '2024-01-10T14:20:00Z',
    deliveryDate: '2024-01-12T16:45:00Z',
    trackingNumber: 'VE2024002',
  },
  {
    id: 'order-003',
    userId: 'user-1',
    items: [
      {
        vaccineId: 'tdap',
        vaccineName: 'Tdap',
        dose: 'Refuerzo',
        quantity: 3,
        price: 45.00,
      },
    ],
    totalAmount: 135.00,
    status: 'pending',
    orderDate: '2024-01-20T09:15:00Z',
    trackingNumber: 'VE2024003',
  },
];

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'history'>('active');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'confirmed':
        return colors.primary;
      case 'in_progress':
        return colors.accent;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'in_progress':
        return 'En Proceso';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'clock';
      case 'confirmed':
        return 'checkmark.circle';
      case 'in_progress':
        return 'shippingbox';
      case 'delivered':
        return 'checkmark.circle.fill';
      case 'cancelled':
        return 'xmark.circle';
      default:
        return 'questionmark.circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeOrders = sampleOrders.filter(order => 
    order.status !== 'delivered' && order.status !== 'cancelled'
  );

  const orderHistory = sampleOrders.filter(order => 
    order.status === 'delivered' || order.status === 'cancelled'
  );

  const handleTrackOrder = (order: Order) => {
    const trackingSteps = [
      { step: 'Pedido Recibido', completed: true, date: order.orderDate },
      { step: 'Preparando', completed: order.status !== 'pending', date: order.status !== 'pending' ? order.orderDate : null },
      { step: 'En Tránsito', completed: order.status === 'in_progress' || order.status === 'delivered', date: order.status === 'in_progress' || order.status === 'delivered' ? order.orderDate : null },
      { step: 'Entregado', completed: order.status === 'delivered', date: order.deliveryDate },
    ];

    const trackingInfo = trackingSteps.map(step => 
      `${step.completed ? '✅' : '⏳'} ${step.step}${step.date ? ` - ${formatDate(step.date)}` : ''}`
    ).join('\n');

    Alert.alert(
      `Seguimiento - ${order.trackingNumber}`,
      `Estado Actual: ${getStatusText(order.status)}\n\n${trackingInfo}${order.deliveryDate && order.status !== 'delivered' ? `\n\nEntrega estimada: ${formatDate(order.deliveryDate)}` : ''}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Ver Detalles', onPress: () => console.log('View detailed tracking') },
      ]
    );
  };

  const handleReorder = (order: Order) => {
    const itemsList = order.items.map(item => 
      `• ${item.vaccineName} (${item.dose}) x${item.quantity}`
    ).join('\n');

    Alert.alert(
      'Reordenar Pedido',
      `¿Deseas agregar estos productos al carrito?\n\n${itemsList}\n\nTotal: $${order.totalAmount.toFixed(2)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Agregar al Carrito', 
          onPress: () => {
            Alert.alert('¡Agregado!', 'Los productos han sido agregados al carrito');
          }
        },
      ]
    );
  };

  const handleCancelOrder = (order: Order) => {
    if (order.status === 'delivered' || order.status === 'cancelled') {
      Alert.alert('Error', 'Este pedido no se puede cancelar');
      return;
    }

    Alert.alert(
      'Cancelar Pedido',
      `¿Estás seguro de que deseas cancelar el pedido ${order.trackingNumber}?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, Cancelar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Pedido Cancelado', 'Tu pedido ha sido cancelado exitosamente');
          }
        },
      ]
    );
  };

  const handleDownloadInvoice = (order: Order) => {
    Alert.alert(
      'Descargar Factura',
      `¿Deseas descargar la factura del pedido ${order.trackingNumber}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Descargar', 
          onPress: () => {
            Alert.alert('Descargando...', 'La factura se está descargando');
          }
        },
      ]
    );
  };

  const renderOrderCard = (order: Order) => (
    <View key={order.id} style={[commonStyles.card, styles.orderCard]}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={commonStyles.heading}>Pedido #{order.trackingNumber}</Text>
          <Text style={commonStyles.textSecondary}>
            {formatDate(order.orderDate)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <IconSymbol 
            name={getStatusIcon(order.status)} 
            size={16} 
            color={colors.card} 
          />
          <Text style={styles.statusText}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={commonStyles.text}>{item.vaccineName}</Text>
              <Text style={commonStyles.textSecondary}>
                {item.dose} • Cantidad: {item.quantity}
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Order Total */}
      <View style={styles.orderTotal}>
        <Text style={[commonStyles.heading, { color: colors.primary }]}>
          Total: ${order.totalAmount.toFixed(2)}
        </Text>
      </View>

      {/* Order Actions */}
      <View style={styles.orderActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.trackButton]}
          onPress={() => handleTrackOrder(order)}
        >
          <IconSymbol name="location" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
            Rastrear
          </Text>
        </TouchableOpacity>
        
        {order.status === 'delivered' ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.invoiceButton]}
              onPress={() => handleDownloadInvoice(order)}
            >
              <IconSymbol name="doc.text" size={16} color={colors.secondary} />
              <Text style={[styles.actionButtonText, { color: colors.secondary }]}>
                Factura
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.reorderButton]}
              onPress={() => handleReorder(order)}
            >
              <IconSymbol name="arrow.clockwise" size={16} color={colors.card} />
              <Text style={[styles.actionButtonText, { color: colors.card }]}>
                Reordenar
              </Text>
            </TouchableOpacity>
          </>
        ) : order.status !== 'cancelled' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelOrder(order)}
          >
            <IconSymbol name="xmark.circle" size={16} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Mis Pedidos</Text>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'active' && styles.tabActive
              ]}
              onPress={() => setSelectedTab('active')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'active' && styles.tabTextActive
              ]}>
                Activos ({activeOrders.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'history' && styles.tabActive
              ]}
              onPress={() => setSelectedTab('history')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'history' && styles.tabTextActive
              ]}>
                Historial ({orderHistory.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Orders List */}
        <ScrollView 
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'active' ? (
            activeOrders.length > 0 ? (
              activeOrders.map(renderOrderCard)
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="shippingbox" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tienes pedidos activos
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  Explora nuestro catálogo y realiza tu primera compra
                </Text>
              </View>
            )
          ) : (
            orderHistory.length > 0 ? (
              orderHistory.map(renderOrderCard)
            ) : (
              <View style={[commonStyles.center, { marginTop: 50 }]}>
                <IconSymbol name="clock" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                  No tienes historial de pedidos
                </Text>
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
  ordersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderTotal: {
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  trackButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  reorderButton: {
    backgroundColor: colors.primary,
  },
  invoiceButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});
