
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, spacing, borderRadius, shadows, typography } from '@/styles/commonStyles';
import { vaccines } from '@/data/vaccines';

interface CartItem {
  id: string;
  vaccineId: string;
  vaccineName: string;
  dose: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export default function CartScreen() {
  // Mock cart data - in real app this would come from context/state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      vaccineId: 'hep-b',
      vaccineName: 'Hepatitis B',
      dose: 'Refuerzo',
      quantity: 1,
      unitPrice: 45.00,
      subtotal: 45.00,
    },
    {
      id: '2',
      vaccineId: 'influenza',
      vaccineName: 'Influenza',
      dose: '1ª Dosis',
      quantity: 2,
      unitPrice: 25.50,
      subtotal: 51.00,
    },
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loyaltyPoints] = useState(1250);
  const [usePoints, setUsePoints] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Tarjeta', icon: 'creditcard' },
    { id: 'transfer', name: 'Transferencia', icon: 'building.columns' },
    { id: 'paypal', name: 'PayPal', icon: 'globe' },
    { id: 'installments', name: 'Cuotas', icon: 'calendar' },
  ];

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const promotionDiscount = appliedPromotion ? subtotal * 0.15 : 0; // 15% example discount
  const pointsDiscount = usePoints ? Math.min(loyaltyPoints * 0.01, subtotal * 0.1) : 0; // 1 point = $0.01, max 10%
  const taxes = (subtotal - promotionDiscount - pointsDiscount) * 0.18; // 18% ITBIS
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal - promotionDiscount - pointsDiscount + taxes + shipping;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove item with undo option
      const itemToRemove = cartItems.find(item => item.id === itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      Alert.alert(
        'Artículo eliminado',
        `${itemToRemove?.vaccineName} ha sido eliminado del carrito`,
        [
          {
            text: 'Deshacer',
            onPress: () => {
              setCartItems(prev => [...prev, itemToRemove!]);
            },
          },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity, subtotal: item.unitPrice * newQuantity }
            : item
        )
      );
    }
  };

  const removeItem = (itemId: string) => {
    updateQuantity(itemId, 0);
  };

  const handleConfirmOrder = () => {
    Alert.alert(
      'Confirmar Pedido',
      `Total: $${total.toFixed(2)}\n¿Deseas confirmar este pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Navigate to order confirmation or tracking
            router.push('/(tabs)/orders');
          },
        },
      ]
    );
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.vaccineName}</Text>
          <Text style={styles.itemDose}>{item.dose}</Text>
          <Text style={styles.itemPrice}>${item.unitPrice.toFixed(2)} c/u</Text>
        </View>
        
        <View style={styles.itemActions}>
          <Text style={styles.itemSubtotal}>${item.subtotal.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <IconSymbol name="trash" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quantityContainer}>
        <View style={styles.quantityStepper}>
          <TouchableOpacity
            style={[styles.stepperButton, item.quantity <= 1 && styles.stepperButtonDisabled]}
            onPress={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <IconSymbol name="minus" size={16} color={item.quantity <= 1 ? colors.textTertiary : colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <IconSymbol name="plus" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <IconSymbol name="cart" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyCartTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyCartSubtitle}>
        Explora nuestro catálogo y encuentra las vacunas que necesitas
      </Text>
      <TouchableOpacity
        style={[commonStyles.card, styles.exploreButton]}
        onPress={() => router.push('/(tabs)/catalog')}
      >
        <Text style={styles.exploreButtonText}>Explorar catálogo</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <Stack.Screen
          options={{
            title: '🛒 Carrito',
            headerBackTitle: 'Atrás',
          }}
        />
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: `🛒 Carrito (${cartItems.length} ${cartItems.length === 1 ? 'artículo' : 'artículos'})`,
          headerBackTitle: 'Atrás',
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Artículos</Text>
          {cartItems.map(renderCartItem)}
        </View>

        {/* Promotions & Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promociones y Puntos</Text>
          
          <TouchableOpacity style={styles.promotionButton}>
            <IconSymbol name="tag" size={20} color={colors.primary} />
            <Text style={styles.promotionButtonText}>🏷️ Aplicar promoción</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loyaltyButton, usePoints && styles.loyaltyButtonActive]}
            onPress={() => setUsePoints(!usePoints)}
          >
            <View style={styles.loyaltyContent}>
              <IconSymbol name="star.fill" size={20} color={usePoints ? colors.warning : colors.textSecondary} />
              <View style={styles.loyaltyText}>
                <Text style={[styles.loyaltyTitle, usePoints && styles.loyaltyTitleActive]}>
                  ⭐ Usar puntos de lealtad
                </Text>
                <Text style={styles.loyaltySubtitle}>
                  {loyaltyPoints} puntos disponibles (${(loyaltyPoints * 0.01).toFixed(2)} máximo)
                </Text>
              </View>
            </View>
            <View style={[styles.checkbox, usePoints && styles.checkboxActive]}>
              {usePoints && <IconSymbol name="checkmark" size={12} color={colors.card} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            {promotionDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.success }]}>Descuento aplicado</Text>
                <Text style={[styles.summaryValue, { color: colors.success }]}>-${promotionDiscount.toFixed(2)}</Text>
              </View>
            )}
            
            {pointsDiscount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.warning }]}>Puntos de lealtad</Text>
                <Text style={[styles.summaryValue, { color: colors.warning }]}>-${pointsDiscount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Impuestos (ITBIS 18%)</Text>
              <Text style={styles.summaryValue}>${taxes.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Envío {subtotal > 100 && '(Gratis por compra >$100)'}
              </Text>
              <Text style={[styles.summaryValue, shipping === 0 && { color: colors.success }]}>
                {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method.id && styles.paymentMethodActive
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <IconSymbol name={method.icon} size={20} color={colors.text} />
                <Text style={styles.paymentMethodText}>{method.name}</Text>
                <View style={[styles.radio, selectedPaymentMethod === method.id && styles.radioActive]}>
                  {selectedPaymentMethod === method.id && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.savePaymentRow, savePaymentMethod && styles.savePaymentRowActive]}
            onPress={() => setSavePaymentMethod(!savePaymentMethod)}
          >
            <View style={[styles.checkbox, savePaymentMethod && styles.checkboxActive]}>
              {savePaymentMethod && <IconSymbol name="checkmark" size={12} color={colors.card} />}
            </View>
            <Text style={styles.savePaymentText}>Guardar método como predeterminado</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas para la entrega (opcional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ej: Entregar en recepción, llamar al llegar..."
            value={deliveryNotes}
            onChangeText={setDeliveryNotes}
            multiline
            numberOfLines={3}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Bottom spacing for fixed buttons */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View style={styles.fixedActions}>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={16} color={colors.primary} />
          <Text style={styles.continueShoppingText}>← Seguir comprando</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
        >
          <IconSymbol name="checkmark.circle.fill" size={20} color={colors.card} />
          <Text style={styles.confirmButtonText}>✅ Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Cart Items
  cartItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  itemInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  itemDose: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemSubtotal: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  removeButton: {
    padding: spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },

  // Promotions & Points
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promotionButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
  },
  loyaltyButton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loyaltyButtonActive: {
    borderColor: colors.warning,
    backgroundColor: colors.card,
  },
  loyaltyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loyaltyText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  loyaltyTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  loyaltyTitleActive: {
    color: colors.warning,
    fontWeight: '600',
  },
  loyaltySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // Summary
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },

  // Payment Methods
  paymentMethods: {
    gap: spacing.sm,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentMethodActive: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  savePaymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.md,
  },
  savePaymentRowActive: {
    // Add any active styles if needed
  },
  savePaymentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },

  // Checkbox
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // Notes Input
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
    minHeight: 80,
  },

  // Fixed Actions
  fixedActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
    ...shadows.lg,
  },
  continueShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  continueShoppingText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },

  // Empty Cart
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyCartTitle: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyCartSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  exploreButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
