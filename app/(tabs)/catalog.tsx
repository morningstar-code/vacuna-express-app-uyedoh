
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { vaccines, getVaccinesByCategory, getInventoryForVaccine, getPromotionForVaccine } from '@/data/vaccines';
import { Vaccine } from '@/types/vaccine';
import { router } from 'expo-router';
import FloatingCartButton from '@/components/FloatingCartButton';

const categories = ['Universal', 'Niños', 'Adolescentes', 'Adultos'];

export default function CatalogScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Universal');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});

  const filteredVaccines = getVaccinesByCategory(selectedCategory).filter(vaccine =>
    vaccine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (vaccineId: string) => {
    setCart(prev => ({
      ...prev,
      [vaccineId]: (prev[vaccineId] || 0) + 1
    }));
    Alert.alert('Agregado', 'Vacuna agregada al carrito');
  };

  // Calculate cart totals
  const cartItemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = Object.entries(cart).reduce((total, [vaccineId, quantity]) => {
    const vaccine = vaccines.find(v => v.id === vaccineId);
    const promotion = getPromotionForVaccine(vaccineId);
    const price = vaccine?.price || 0;
    const discountedPrice = promotion ? price * (1 - promotion.discountValue / 100) : price;
    return total + (discountedPrice * quantity);
  }, 0);

  const renderVaccineCard = (vaccine: Vaccine) => {
    const inventory = getInventoryForVaccine(vaccine.id);
    const promotion = getPromotionForVaccine(vaccine.id);
    const isLowStock = inventory && inventory.stockLevel <= inventory.lowStockThreshold;
    const isOutOfStock = inventory && !inventory.isAvailable;
    const originalPrice = vaccine.price || 0;
    const discountedPrice = promotion ? originalPrice * (1 - promotion.discountValue / 100) : originalPrice;

    return (
      <View key={vaccine.id} style={styles.vaccineCard}>
        {/* Discount Badge - Positioned in top-right corner with proper spacing */}
        {promotion && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{promotion.discountValue}%</Text>
          </View>
        )}

        {/* Main Card Content */}
        <View style={styles.cardContent}>
          {/* Header with vaccine info and price block */}
          <View style={styles.vaccineHeader}>
            <View style={styles.vaccineInfo}>
              <Text style={styles.vaccineName}>{vaccine.name}</Text>
              <Text style={styles.vaccineCategory}>{vaccine.category} • {vaccine.ageGroup}</Text>
            </View>
            
            {/* Price Block - Right aligned with proper spacing from discount badge */}
            <View style={styles.priceBlock}>
              {promotion && originalPrice > 0 && (
                <Text style={styles.originalPrice}>
                  ${originalPrice.toFixed(2)}
                </Text>
              )}
              <Text style={styles.discountedPrice}>
                ${discountedPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Doses Information */}
          <View style={styles.dosesContainer}>
            <Text style={styles.dosesLabel}>Dosis disponibles:</Text>
            <View style={styles.dosesRow}>
              {vaccine.doses.slice(0, 3).map((dose, index) => (
                <View key={index} style={styles.doseChip}>
                  <Text style={styles.doseText}>{dose.name}</Text>
                </View>
              ))}
              {vaccine.doses.length > 3 && (
                <View style={styles.doseChip}>
                  <Text style={styles.doseText}>+{vaccine.doses.length - 3}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stock Information */}
          {inventory && (
            <View style={styles.stockContainer}>
              <Text style={styles.stockText}>
                Stock: {inventory.stockLevel} unidades
              </Text>
              <Text style={[
                styles.stockStatus,
                { 
                  color: isOutOfStock ? colors.error : isLowStock ? colors.warning : colors.success,
                }
              ]}>
                {isOutOfStock ? 'Agotado' : isLowStock ? 'Pocas unidades' : 'Disponible'}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.addButton,
                isOutOfStock ? styles.preOrderButton : styles.normalButton
              ]}
              onPress={() => addToCart(vaccine.id)}
            >
              <IconSymbol 
                name={isOutOfStock ? "clock.fill" : "cart.badge.plus"} 
                size={16} 
                color={colors.card} 
              />
              <Text style={styles.addButtonText}>
                {isOutOfStock ? 'Pre-ordenar' : 'Agregar'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => Alert.alert(
                vaccine.name,
                `Categoría: ${vaccine.category}\nEdad recomendada: ${vaccine.ageGroup}\nDosis disponibles: ${vaccine.doses.map(d => d.name).join(', ')}\n\nVacuna certificada y refrigerada para máxima efectividad.`,
                [
                  { text: 'Cerrar', style: 'cancel' },
                  { text: 'Ver Más Info', onPress: () => router.push('/(tabs)/education') },
                ]
              )}
            >
              <IconSymbol name="info.circle" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Catálogo de Vacunas</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar vacunas..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryTabText,
                selectedCategory === category && styles.categoryTabTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vaccines List */}
        <ScrollView 
          style={styles.vaccinesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: cartItemCount > 0 ? 100 : 20 }}
        >
          {filteredVaccines.length > 0 ? (
            filteredVaccines.map(renderVaccineCard)
          ) : (
            <View style={[commonStyles.center, { marginTop: 50 }]}>
              <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                No se encontraron vacunas para "{searchQuery}"
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Cart Button */}
        <FloatingCartButton
          itemCount={cartItemCount}
          totalAmount={cartTotal}
          onPress={() => router.push('/cart')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  categoryTabs: {
    maxHeight: 60,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryTabTextActive: {
    color: colors.card,
  },
  vaccinesList: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Updated Product Card Layout
  vaccineCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
    overflow: 'visible',
    ...shadows.sm,
  },
  
  // Discount Badge - Fixed positioning with proper spacing
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#19C37D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 2,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Card Content with proper padding
  cardContent: {
    padding: 14,
    paddingTop: 16, // Extra space for discount badge
  },
  
  // Header with vaccine info and price
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 60, // Space for discount badge
  },
  vaccineInfo: {
    flex: 1,
    paddingRight: 12,
  },
  
  // Typography according to specifications
  vaccineName: {
    fontSize: 17, // 16-17sp
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
    marginBottom: 2,
  },
  vaccineCategory: {
    fontSize: 14, // 13-14sp
    fontWeight: '500',
    color: '#6B7280', // Muted color as specified
    lineHeight: 18,
  },
  
  // Price Block - Right aligned with proper typography
  priceBlock: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    minWidth: 80,
  },
  originalPrice: {
    fontSize: 13, // 12-13sp as specified
    color: '#8A8A8E',
    textDecorationLine: 'line-through',
    marginBottom: 2,
    lineHeight: 16,
  },
  discountedPrice: {
    fontSize: 16, // Exactly 16sp as specified (NOT larger)
    fontWeight: '700',
    color: '#0B60D1', // Primary color as specified
    lineHeight: 20,
  },
  
  // Doses section
  dosesContainer: {
    marginBottom: 12,
  },
  dosesLabel: {
    fontSize: 13, // 12-13sp for doses/stock
    color: colors.textSecondary,
    marginBottom: 6,
  },
  dosesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  doseChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  doseText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },

  // Stock information
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockText: {
    fontSize: 13, // 12-13sp for stock info
    color: colors.textSecondary,
  },
  stockStatus: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    minHeight: 44, // Accessibility requirement ≥ 44dp
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    minHeight: 44, // Accessibility requirement
  },
  normalButton: {
    backgroundColor: colors.primary,
  },
  preOrderButton: {
    backgroundColor: colors.warning,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  infoButton: {
    width: 44, // Accessibility requirement ≥ 44dp
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
