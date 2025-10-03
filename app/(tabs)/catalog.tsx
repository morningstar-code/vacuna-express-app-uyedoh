
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
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { vaccines, getVaccinesByCategory, getInventoryForVaccine, getPromotionForVaccine } from '@/data/vaccines';
import { Vaccine } from '@/types/vaccine';
import { router } from 'expo-router';

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

  const renderVaccineCard = (vaccine: Vaccine) => {
    const inventory = getInventoryForVaccine(vaccine.id);
    const promotion = getPromotionForVaccine(vaccine.id);
    const isLowStock = inventory && inventory.stockLevel <= inventory.lowStockThreshold;
    const isOutOfStock = inventory && !inventory.isAvailable;
    const discountedPrice = promotion && vaccine.price 
      ? vaccine.price * (1 - promotion.discountValue / 100) 
      : vaccine.price;

    return (
      <View key={vaccine.id} style={[commonStyles.card, styles.vaccineCard]}>
        {/* Status Badges */}
        <View style={styles.badgesContainer}>
          {promotion && (
            <View style={[styles.promotionBadge, { backgroundColor: colors.warning }]}>
              <IconSymbol name="tag.fill" size={12} color={colors.card} />
              <Text style={styles.badgeText}>-{promotion.discountValue}%</Text>
            </View>
          )}
          {isOutOfStock && (
            <View style={[styles.stockBadge, { backgroundColor: colors.error }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={12} color={colors.card} />
              <Text style={styles.badgeText}>Agotado</Text>
            </View>
          )}
          {isLowStock && !isOutOfStock && (
            <View style={[styles.stockBadge, { backgroundColor: colors.warning }]}>
              <IconSymbol name="clock.fill" size={12} color={colors.card} />
              <Text style={styles.badgeText}>Pocas unidades</Text>
            </View>
          )}
        </View>

        <View style={styles.vaccineHeader}>
          <View style={styles.vaccineInfo}>
            <Text style={commonStyles.heading}>{vaccine.name}</Text>
            <Text style={commonStyles.textSecondary}>{vaccine.category} • {vaccine.ageGroup}</Text>
          </View>
          <View style={styles.priceContainer}>
            {promotion && vaccine.price && (
              <Text style={styles.originalPrice}>${vaccine.price.toFixed(2)}</Text>
            )}
            <Text style={styles.price}>
              ${discountedPrice?.toFixed(2) || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.dosesContainer}>
          <Text style={commonStyles.textSmall}>Dosis disponibles:</Text>
          <View style={styles.dosesRow}>
            {vaccine.doses.map((dose, index) => (
              <View key={index} style={styles.doseChip}>
                <Text style={styles.doseText}>{dose.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Enhanced Stock Information */}
        {inventory && (
          <View style={styles.stockInfo}>
            <View style={styles.stockHeader}>
              <Text style={commonStyles.textSmall}>
                Stock: {inventory.stockLevel} unidades
              </Text>
              <Text style={[
                commonStyles.textSmall,
                { 
                  color: isOutOfStock ? colors.error : isLowStock ? colors.warning : colors.accent,
                  fontWeight: '600'
                }
              ]}>
                {isOutOfStock ? 'Agotado' : isLowStock ? 'Bajo stock' : 'Disponible'}
              </Text>
            </View>
            
            {/* Stock Progress Bar */}
            <View style={styles.stockProgressBar}>
              <View
                style={[
                  styles.stockProgressFill,
                  {
                    width: `${Math.min((inventory.stockLevel / 100) * 100, 100)}%`,
                    backgroundColor: isOutOfStock ? colors.error : isLowStock ? colors.warning : colors.accent,
                  },
                ]}
              />
            </View>
            
            {inventory.estimatedRestockDate && isOutOfStock && (
              <Text style={[commonStyles.textSmall, { color: colors.primary, marginTop: 4 }]}>
                Restock estimado: {new Date(inventory.estimatedRestockDate).toLocaleDateString('es-DO')}
              </Text>
            )}
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
              `Categoría: ${vaccine.category}\nEdad recomendada: ${vaccine.ageGroup}\nDosis disponibles: ${vaccine.doses.map(d => d.name).join(', ')}\n\nVacuna certificada y refrigerada para máxima efectividad. Cumple con todos los estándares internacionales de calidad.`,
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

        {/* Cart Summary */}
        {Object.keys(cart).length > 0 && (
          <View style={styles.cartSummary}>
            <View style={[commonStyles.row, commonStyles.spaceBetween]}>
              <Text style={commonStyles.heading}>
                Carrito ({Object.values(cart).reduce((a, b) => a + b, 0)} items)
              </Text>
              <TouchableOpacity style={styles.viewCartButton}>
                <Text style={[commonStyles.buttonText, { color: colors.primary }]}>
                  Ver Carrito
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  vaccineCard: {
    marginBottom: 16,
    position: 'relative',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  promotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: 8,
  },
  vaccineInfo: {
    flex: 1,
    paddingRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  dosesContainer: {
    marginBottom: 12,
  },
  dosesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  doseChip: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  doseText: {
    fontSize: 12,
    color: colors.text,
  },
  stockInfo: {
    marginBottom: 12,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stockProgressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  stockProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
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
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartSummary: {
    backgroundColor: colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewCartButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
