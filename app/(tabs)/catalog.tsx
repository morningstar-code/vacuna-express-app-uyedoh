
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
    const discountedPrice = promotion && vaccine.price 
      ? vaccine.price * (1 - promotion.discountValue / 100) 
      : vaccine.price;

    return (
      <View key={vaccine.id} style={[commonStyles.card, styles.vaccineCard]}>
        <View style={styles.vaccineHeader}>
          <View style={styles.vaccineInfo}>
            <Text style={commonStyles.heading}>{vaccine.name}</Text>
            <Text style={commonStyles.textSecondary}>{vaccine.ageGroup}</Text>
            {promotion && (
              <View style={[commonStyles.badge, { backgroundColor: colors.warning }]}>
                <Text style={commonStyles.badgeText}>
                  -{promotion.discountValue}%
                </Text>
              </View>
            )}
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

        <View style={styles.stockInfo}>
          {inventory && (
            <View style={[commonStyles.row, commonStyles.spaceBetween]}>
              <Text style={commonStyles.textSmall}>
                Stock: {inventory.stockLevel} disponibles
              </Text>
              {isLowStock && (
                <Text style={[commonStyles.textSmall, { color: colors.warning }]}>
                  ¡Pocas unidades!
                </Text>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            commonStyles.card,
            { 
              backgroundColor: inventory?.isAvailable ? colors.primary : colors.secondary,
              marginTop: 12,
              padding: 12,
            }
          ]}
          onPress={() => inventory?.isAvailable && addToCart(vaccine.id)}
          disabled={!inventory?.isAvailable}
        >
          <Text style={[commonStyles.buttonText, commonStyles.center]}>
            {inventory?.isAvailable ? 'Agregar al Carrito' : 'No Disponible'}
          </Text>
        </TouchableOpacity>
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
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vaccineInfo: {
    flex: 1,
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
    marginBottom: 8,
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
