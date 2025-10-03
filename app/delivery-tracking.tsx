
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router, useLocalSearchParams } from 'expo-router';

interface DeliveryStatus {
  id: string;
  status: 'preparing' | 'dispatched' | 'in_transit' | 'nearby' | 'delivered';
  timestamp: string;
  location?: string;
  description: string;
}

interface CourierInfo {
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    height: 300,
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholder: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 20,
    ...commonStyles.shadow,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  etaContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  etaText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  courierCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    ...commonStyles.shadow,
  },
  courierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courierInfo: {
    marginLeft: 12,
    flex: 1,
  },
  courierName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  courierDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  callButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  messageButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  timelineContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    ...commonStyles.shadow,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timelineTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  orderSummary: {
    backgroundColor: colors.card,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    ...commonStyles.shadow,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});

export default function DeliveryTrackingScreen() {
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;

  const [currentStatus, setCurrentStatus] = useState<DeliveryStatus['status']>('in_transit');
  const [estimatedArrival, setEstimatedArrival] = useState('15-20 min');
  const [progress, setProgress] = useState(65);

  const courierInfo: CourierInfo = {
    name: 'Carlos Rodríguez',
    phone: '+1 (809) 555-0123',
    vehicle: 'Motocicleta Honda',
    plateNumber: 'A123456',
    rating: 4.8,
  };

  const deliveryTimeline: DeliveryStatus[] = [
    {
      id: '1',
      status: 'preparing',
      timestamp: '2024-01-20T14:30:00Z',
      description: 'Pedido confirmado y en preparación',
    },
    {
      id: '2',
      status: 'dispatched',
      timestamp: '2024-01-20T15:00:00Z',
      description: 'Pedido despachado desde el centro de distribución',
    },
    {
      id: '3',
      status: 'in_transit',
      timestamp: '2024-01-20T15:30:00Z',
      location: 'Av. 27 de Febrero',
      description: 'En camino hacia tu ubicación',
    },
  ];

  const orderSummary = {
    orderNumber: orderId || 'VE-2024-001',
    items: [
      { name: 'Influenza - 1ª Dosis', quantity: 1 },
      { name: 'Hepatitis B - Refuerzo', quantity: 1 },
    ],
    total: 'RD$ 1,680.00',
    deliveryAddress: 'Calle Principal #123, Santo Domingo',
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 5, 100));
        
        if (progress >= 90) {
          setCurrentStatus('nearby');
          setEstimatedArrival('2-5 min');
        } else if (progress >= 100) {
          setCurrentStatus('delivered');
          setEstimatedArrival('Entregado');
        }
      }
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, [progress]);

  const getStatusColor = (status: DeliveryStatus['status']) => {
    switch (status) {
      case 'preparing': return colors.warning;
      case 'dispatched': return colors.primary;
      case 'in_transit': return colors.primary;
      case 'nearby': return colors.success;
      case 'delivered': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: DeliveryStatus['status']) => {
    switch (status) {
      case 'preparing': return 'clock.fill';
      case 'dispatched': return 'shippingbox.fill';
      case 'in_transit': return 'car.fill';
      case 'nearby': return 'location.fill';
      case 'delivered': return 'checkmark.circle.fill';
      default: return 'circle.fill';
    }
  };

  const getStatusText = (status: DeliveryStatus['status']) => {
    switch (status) {
      case 'preparing': return 'Preparando Pedido';
      case 'dispatched': return 'Despachado';
      case 'in_transit': return 'En Camino';
      case 'nearby': return 'Cerca de Ti';
      case 'delivered': return 'Entregado';
      default: return 'Desconocido';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCallCourier = () => {
    Alert.alert(
      'Llamar al Repartidor',
      `¿Deseas llamar a ${courierInfo.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => console.log('Calling courier...') },
      ]
    );
  };

  const handleMessageCourier = () => {
    Alert.alert(
      'Mensaje al Repartidor',
      'Función de mensajería próximamente disponible',
      [{ text: 'OK' }]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconSymbol
          key={i}
          name={i <= rating ? 'star.fill' : 'star'}
          size={14}
          color={i <= rating ? colors.warning : colors.border}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Seguimiento de Entrega',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Container */}
        <View style={styles.mapContainer}>
          <IconSymbol name="map.fill" size={48} color={colors.textSecondary} />
          <Text style={styles.mapPlaceholder}>
            Los mapas en tiempo real no están disponibles en Natively en este momento.
            {'\n\n'}
            En una implementación completa, aquí verías:
            {'\n'}• Ubicación del repartidor en tiempo real
            {'\n'}• Ruta optimizada de entrega
            {'\n'}• Tu ubicación de destino
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <IconSymbol
              name={getStatusIcon(currentStatus)}
              size={24}
              color={getStatusColor(currentStatus)}
            />
            <Text style={styles.statusTitle}>{getStatusText(currentStatus)}</Text>
          </View>

          <View style={styles.etaContainer}>
            <Text style={styles.etaText}>
              Tiempo estimado de llegada: {estimatedArrival}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% completado</Text>
          </View>
        </View>

        {/* Courier Info */}
        <View style={styles.courierCard}>
          <View style={styles.courierHeader}>
            <IconSymbol name="person.circle.fill" size={48} color={colors.primary} />
            <View style={styles.courierInfo}>
              <Text style={styles.courierName}>{courierInfo.name}</Text>
              <Text style={styles.courierDetails}>
                {courierInfo.vehicle} • {courierInfo.plateNumber}
              </Text>
              <View style={styles.ratingContainer}>
                {renderStars(courierInfo.rating)}
                <Text style={styles.ratingText}>({courierInfo.rating})</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton} onPress={handleCallCourier}>
              <Text style={styles.buttonText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton} onPress={handleMessageCourier}>
              <Text style={styles.buttonText}>Mensaje</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Historial de Entrega</Text>
          {deliveryTimeline.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineIcon,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <IconSymbol
                  name={getStatusIcon(item.status)}
                  size={12}
                  color={colors.card}
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>
                  {getStatusText(item.status)}
                </Text>
                <Text style={styles.timelineTime}>
                  {formatTime(item.timestamp)}
                  {item.location && ` • ${item.location}`}
                </Text>
                <Text style={styles.timelineDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Número de Pedido:</Text>
            <Text style={styles.summaryValue}>{orderSummary.orderNumber}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Artículos:</Text>
            <Text style={styles.summaryValue}>{orderSummary.items.length} vacunas</Text>
          </View>

          {orderSummary.items.map((item, index) => (
            <View key={index} style={[styles.summaryRow, { marginLeft: 16 }]}>
              <Text style={styles.summaryLabel}>• {item.name}</Text>
              <Text style={styles.summaryValue}>x{item.quantity}</Text>
            </View>
          ))}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={[styles.summaryValue, { fontWeight: '700' }]}>
              {orderSummary.total}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dirección:</Text>
          </View>
          <Text style={[styles.summaryValue, { marginTop: 4 }]}>
            {orderSummary.deliveryAddress}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
