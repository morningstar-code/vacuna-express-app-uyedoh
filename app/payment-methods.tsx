
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { PaymentMethod } from '@/types/vaccine';

const samplePaymentMethods: PaymentMethod[] = [
  {
    id: 'card-1',
    type: 'card',
    provider: 'stripe',
    name: 'Visa **** 4242',
    isDefault: true,
    currency: 'DOP',
  },
  {
    id: 'bank-1',
    type: 'bank',
    provider: 'banco_popular',
    name: 'Banco Popular',
    isDefault: false,
    currency: 'DOP',
  },
  {
    id: 'wallet-1',
    type: 'digital_wallet',
    provider: 'paypal',
    name: 'PayPal',
    isDefault: false,
    currency: 'USD',
  },
];

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState(samplePaymentMethods);
  const [installmentPlansEnabled, setInstallmentPlansEnabled] = useState(true);

  const getProviderIcon = (provider: PaymentMethod['provider']) => {
    switch (provider) {
      case 'banco_popular':
        return 'building.columns.fill';
      case 'santa_cruz':
        return 'building.columns.fill';
      case 'promerica':
        return 'building.columns.fill';
      case 'paypal':
        return 'creditcard.fill';
      case 'stripe':
        return 'creditcard.fill';
      default:
        return 'creditcard';
    }
  };

  const getProviderColor = (provider: PaymentMethod['provider']) => {
    switch (provider) {
      case 'banco_popular':
        return '#E31E24';
      case 'santa_cruz':
        return '#0066CC';
      case 'promerica':
        return '#FF6B35';
      case 'paypal':
        return '#0070BA';
      case 'stripe':
        return '#635BFF';
      default:
        return colors.primary;
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    Alert.alert('Éxito', 'Método de pago predeterminado actualizado');
  };

  const handleDeleteMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    if (method?.isDefault) {
      Alert.alert('Error', 'No puedes eliminar el método de pago predeterminado');
      return;
    }

    Alert.alert(
      'Eliminar Método de Pago',
      '¿Estás seguro de que deseas eliminar este método de pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Agregar Método de Pago',
      'Selecciona el tipo de método de pago que deseas agregar',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tarjeta de Crédito/Débito', onPress: () => console.log('Add card') },
        { text: 'Cuenta Bancaria', onPress: () => console.log('Add bank') },
        { text: 'Billetera Digital', onPress: () => console.log('Add wallet') },
      ]
    );
  };

  const renderPaymentMethodCard = (method: PaymentMethod) => (
    <View key={method.id} style={[commonStyles.card, styles.paymentCard]}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <View style={[styles.providerIcon, { backgroundColor: getProviderColor(method.provider) }]}>
            <IconSymbol
              name={getProviderIcon(method.provider)}
              size={20}
              color={colors.card}
            />
          </View>
          <View style={styles.paymentDetails}>
            <Text style={commonStyles.heading}>{method.name}</Text>
            <Text style={commonStyles.textSecondary}>
              {method.type === 'card' ? 'Tarjeta' : method.type === 'bank' ? 'Banco' : 'Billetera Digital'} • {method.currency}
            </Text>
          </View>
        </View>
        
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Predeterminado</Text>
          </View>
        )}
      </View>

      <View style={styles.paymentActions}>
        {!method.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(method.id)}
          >
            <Text style={[commonStyles.text, { color: colors.primary }]}>
              Establecer como predeterminado
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMethod(method.id)}
        >
          <IconSymbol name="trash" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: 'Métodos de Pago',
          headerShown: true,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <ScrollView style={commonStyles.container}>
        <View style={commonStyles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={commonStyles.title}>Métodos de Pago</Text>
            <Text style={commonStyles.textSecondary}>
              Gestiona tus métodos de pago y configuraciones
            </Text>
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 16 }]}>
              <Text style={commonStyles.heading}>Métodos Guardados</Text>
              <TouchableOpacity onPress={handleAddPaymentMethod}>
                <Text style={[commonStyles.text, { color: colors.primary }]}>
                  + Agregar
                </Text>
              </TouchableOpacity>
            </View>
            
            {paymentMethods.map(renderPaymentMethodCard)}
          </View>

          {/* Payment Settings */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Configuraciones de Pago
            </Text>
            
            <View style={[commonStyles.card, styles.settingCard]}>
              <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                <View style={styles.settingInfo}>
                  <Text style={commonStyles.text}>Planes de Cuotas</Text>
                  <Text style={commonStyles.textSecondary}>
                    Habilitar pagos en cuotas para pedidos grandes
                  </Text>
                </View>
                <Switch
                  value={installmentPlansEnabled}
                  onValueChange={setInstallmentPlansEnabled}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.card}
                />
              </View>
            </View>

            <View style={[commonStyles.card, styles.settingCard]}>
              <View style={styles.settingInfo}>
                <Text style={commonStyles.text}>Moneda Preferida</Text>
                <Text style={commonStyles.textSecondary}>DOP (Peso Dominicano)</Text>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={[commonStyles.text, { color: colors.primary }]}>
                  Cambiar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Supported Payment Providers */}
          <View style={styles.section}>
            <Text style={[commonStyles.heading, { marginBottom: 16 }]}>
              Proveedores Soportados
            </Text>
            
            <View style={[commonStyles.card, styles.providersCard]}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
                Bancos Locales
              </Text>
              <View style={styles.providersList}>
                <View style={styles.providerItem}>
                  <IconSymbol name="building.columns.fill" size={16} color="#E31E24" />
                  <Text style={styles.providerText}>Banco Popular</Text>
                </View>
                <View style={styles.providerItem}>
                  <IconSymbol name="building.columns.fill" size={16} color="#0066CC" />
                  <Text style={styles.providerText}>Santa Cruz</Text>
                </View>
                <View style={styles.providerItem}>
                  <IconSymbol name="building.columns.fill" size={16} color="#FF6B35" />
                  <Text style={styles.providerText}>Promerica</Text>
                </View>
              </View>
              
              <Text style={[commonStyles.textSecondary, { marginTop: 16, marginBottom: 12 }]}>
                Billeteras Digitales
              </Text>
              <View style={styles.providersList}>
                <View style={styles.providerItem}>
                  <IconSymbol name="creditcard.fill" size={16} color="#0070BA" />
                  <Text style={styles.providerText}>PayPal</Text>
                </View>
                <View style={styles.providerItem}>
                  <IconSymbol name="creditcard.fill" size={16} color="#635BFF" />
                  <Text style={styles.providerText}>Stripe</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  providersCard: {
    padding: 16,
  },
  providersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  providerText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
});
