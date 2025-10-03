
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, commonStyles, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import FloatingCartButton from '@/components/FloatingCartButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Vaccine {
  id: string;
  name: string;
  category: 'Universal' | 'Niños' | 'Adolescentes' | 'Adultos';
  age_group: string;
  description?: string;
  base_price: number;
  is_active: boolean;
}

interface VaccineDose {
  id: string;
  vaccine_id: string;
  name: string;
  description?: string;
  sequence_number: number;
}

interface InventoryItem {
  vaccine_id: string;
  stock_level: number;
  low_stock_threshold: number;
  is_available: boolean;
}

export default function CatalogScreen() {
  const { profile } = useAuth();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [doses, setDoses] = useState<VaccineDose[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');
  const [cartItems, setCartItems] = useState<any[]>([]);

  const categories = ['Todo', 'Universal', 'Niños', 'Adolescentes', 'Adultos'];

  useEffect(() => {
    if (profile) {
      fetchVaccines();
      fetchDoses();
      fetchInventory();
    }
  }, [profile]);

  const fetchVaccines = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccines')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching vaccines:', error);
      } else {
        setVaccines(data || []);
      }
    } catch (error) {
      console.error('Exception fetching vaccines:', error);
    }
  };

  const fetchDoses = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccine_doses')
        .select('*')
        .order('vaccine_id, sequence_number');

      if (error) {
        console.error('Error fetching doses:', error);
      } else {
        setDoses(data || []);
      }
    } catch (error) {
      console.error('Exception fetching doses:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) {
        console.error('Error fetching inventory:', error);
      } else {
        setInventory(data || []);
      }
    } catch (error) {
      console.error('Exception fetching inventory:', error);
    }
  };

  const getFilteredVaccines = () => {
    let filtered = vaccines;

    // Filter by category
    if (selectedCategory !== 'Todo') {
      filtered = filtered.filter(vaccine => vaccine.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vaccine =>
        vaccine.name.toLowerCase().includes(query) ||
        vaccine.age_group.toLowerCase().includes(query) ||
        vaccine.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getVaccineDoses = (vaccineId: string) => {
    return doses.filter(dose => dose.vaccine_id === vaccineId);
  };

  const getVaccineInventory = (vaccineId: string) => {
    return inventory.find(item => item.vaccine_id === vaccineId);
  };

  const getStockStatus = (vaccineId: string) => {
    const inventoryItem = getVaccineInventory(vaccineId);
    if (!inventoryItem || !inventoryItem.is_available) {
      return { status: 'Agotado', color: colors.error };
    }
    if (inventoryItem.stock_level <= inventoryItem.low_stock_threshold) {
      return { status: 'Pocas unidades', color: colors.warning };
    }
    return { status: 'Disponible', color: colors.success };
  };

  const addToCart = (vaccineId: string, dose?: VaccineDose) => {
    const vaccine = vaccines.find(v => v.id === vaccineId);
    if (!vaccine) return;

    const inventoryItem = getVaccineInventory(vaccineId);
    if (!inventoryItem || !inventoryItem.is_available) {
      Alert.alert('No disponible', 'Esta vacuna no está disponible actualmente');
      return;
    }

    const newItem = {
      id: `${vaccineId}-${dose?.id || 'default'}`,
      vaccineId,
      vaccineName: vaccine.name,
      dose: dose?.name || 'Dosis única',
      quantity: 1,
      unitPrice: vaccine.base_price,
      subtotal: vaccine.base_price,
    };

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
        return updated;
      }
      return [...prev, newItem];
    });

    Alert.alert('Agregado', `${vaccine.name} agregado al carrito`);
  };

  const renderVaccineCard = (vaccine: Vaccine) => {
    const vaccineDoses = getVaccineDoses(vaccine.id);
    const stockStatus = getStockStatus(vaccine.id);
    const inventoryItem = getVaccineInventory(vaccine.id);

    return (
      <View key={vaccine.id} style={styles.vaccineCard}>
        <View style={styles.vaccineHeader}>
          <Text style={styles.vaccineName}>{vaccine.name}</Text>
          <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
            <Text style={styles.stockBadgeText}>{stockStatus.status}</Text>
          </View>
        </View>
        
        <Text style={styles.vaccineCategory}>{vaccine.category}</Text>
        <Text style={styles.vaccineAgeGroup}>{vaccine.age_group}</Text>
        
        {vaccine.description && (
          <Text style={styles.vaccineDescription} numberOfLines={2}>
            {vaccine.description}
          </Text>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.price}>RD$ {vaccine.base_price.toLocaleString()}</Text>
        </View>

        {vaccineDoses.length > 0 && (
          <View style={styles.dosesContainer}>
            <Text style={styles.dosesLabel}>Dosis disponibles:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {vaccineDoses.map((dose) => (
                <TouchableOpacity
                  key={dose.id}
                  style={styles.doseChip}
                  onPress={() => addToCart(vaccine.id, dose)}
                  disabled={!inventoryItem?.is_available}
                >
                  <Text style={[
                    styles.doseChipText,
                    !inventoryItem?.is_available && styles.doseChipTextDisabled
                  ]}>
                    {dose.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            !inventoryItem?.is_available && styles.addButtonDisabled
          ]}
          onPress={() => addToCart(vaccine.id)}
          disabled={!inventoryItem?.is_available}
        >
          <Text style={[
            styles.addButtonText,
            !inventoryItem?.is_available && styles.addButtonTextDisabled
          ]}>
            {!inventoryItem?.is_available ? 'Agotado' : 'Agregar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!profile) {
    return null; // This shouldn't happen due to auth guard
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Catálogo de Vacunas</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
          >
            <IconSymbol name="cart.fill" size={24} color={colors.primary} />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, edad o dosis..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Vaccines List */}
        <ScrollView style={styles.vaccinesList} showsVerticalScrollIndicator={false}>
          {getFilteredVaccines().length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyStateTitle}>No se encontraron vacunas</Text>
              <Text style={styles.emptyStateText}>
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </Text>
            </View>
          ) : (
            getFilteredVaccines().map(renderVaccineCard)
          )}
          
          {/* Footer spacing for tab bar */}
          <View style={styles.footerSpacing} />
        </ScrollView>
      </View>

      <FloatingCartButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  cartButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  categoryChip: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryChipTextActive: {
    color: colors.card,
  },
  vaccinesList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  vaccineCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  stockBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  vaccineCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  vaccineAgeGroup: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  vaccineDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  priceContainer: {
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  dosesContainer: {
    marginBottom: spacing.md,
  },
  dosesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  doseChip: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  doseChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  doseChipTextDisabled: {
    color: colors.textTertiary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  addButtonTextDisabled: {
    color: colors.card,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerSpacing: {
    height: spacing.xxl,
  },
});
