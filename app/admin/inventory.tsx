
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { vaccines, inventory } from '@/data/vaccines';
import { Vaccine, InventoryItem } from '@/types/vaccine';

interface InventoryItemWithVaccine extends InventoryItem {
  vaccine: Vaccine;
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
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.card,
  },
  inventoryList: {
    padding: 16,
  },
  inventoryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  vaccineCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  vaccineAge: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockLevel: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  stockLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.card,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  editButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  deleteButton: {
    borderColor: colors.error,
    backgroundColor: colors.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.secondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function AdminInventoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemWithVaccine | null>(null);
  const [formData, setFormData] = useState({
    stockLevel: '',
    lowStockThreshold: '',
    price: '',
  });

  // Combine inventory with vaccine data
  const inventoryWithVaccines: InventoryItemWithVaccine[] = inventory.map(item => ({
    ...item,
    vaccine: vaccines.find(v => v.id === item.vaccineId)!,
  })).filter(item => item.vaccine);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'low_stock', label: 'Stock Bajo' },
    { id: 'out_of_stock', label: 'Agotado' },
    { id: 'available', label: 'Disponible' },
  ];

  const getFilteredInventory = () => {
    let filtered = inventoryWithVaccines;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vaccine.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'low_stock':
        filtered = filtered.filter(item => 
          item.stockLevel <= item.lowStockThreshold && item.stockLevel > 0
        );
        break;
      case 'out_of_stock':
        filtered = filtered.filter(item => item.stockLevel === 0);
        break;
      case 'available':
        filtered = filtered.filter(item => 
          item.stockLevel > item.lowStockThreshold
        );
        break;
    }

    return filtered;
  };

  const getStockStatus = (item: InventoryItemWithVaccine) => {
    if (item.stockLevel === 0) {
      return { status: 'Agotado', color: colors.error };
    } else if (item.stockLevel <= item.lowStockThreshold) {
      return { status: 'Stock Bajo', color: colors.warning };
    } else {
      return { status: 'Disponible', color: colors.success };
    }
  };

  const getStockColor = (item: InventoryItemWithVaccine) => {
    if (item.stockLevel === 0) return colors.error;
    if (item.stockLevel <= item.lowStockThreshold) return colors.warning;
    return colors.success;
  };

  const handleEditItem = (item: InventoryItemWithVaccine) => {
    setEditingItem(item);
    setFormData({
      stockLevel: item.stockLevel.toString(),
      lowStockThreshold: item.lowStockThreshold.toString(),
      price: item.vaccine.price?.toString() || '',
    });
    setShowModal(true);
  };

  const handleDeleteItem = (item: InventoryItemWithVaccine) => {
    Alert.alert(
      'Eliminar Vacuna',
      `¿Estás seguro de que deseas eliminar ${item.vaccine.name} del inventario?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting item:', item.vaccineId);
            Alert.alert('Éxito', 'Vacuna eliminada del inventario');
          },
        },
      ]
    );
  };

  const handleSaveItem = () => {
    if (!formData.stockLevel || !formData.lowStockThreshold) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    console.log('Saving item:', {
      vaccineId: editingItem?.vaccineId,
      stockLevel: parseInt(formData.stockLevel),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      price: parseFloat(formData.price) || 0,
    });

    Alert.alert('Éxito', 'Inventario actualizado correctamente');
    setShowModal(false);
    setEditingItem(null);
    setFormData({ stockLevel: '', lowStockThreshold: '', price: '' });
  };

  const handleAddNewItem = () => {
    Alert.alert('Agregar Vacuna', 'Función próximamente disponible');
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `RD$ ${price.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventario ({getFilteredInventory().length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNewItem}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar vacunas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
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

      {/* Inventory List */}
      <ScrollView style={styles.inventoryList} showsVerticalScrollIndicator={false}>
        {getFilteredInventory().map((item) => {
          const stockStatus = getStockStatus(item);
          
          return (
            <View key={item.vaccineId} style={styles.inventoryCard}>
              <View style={styles.cardHeader}>
                <View style={styles.vaccineInfo}>
                  <Text style={styles.vaccineName}>{item.vaccine.name}</Text>
                  <Text style={styles.vaccineCategory}>{item.vaccine.category}</Text>
                  <Text style={styles.vaccineAge}>{item.vaccine.ageGroup}</Text>
                  <View
                    style={[styles.statusBadge, { backgroundColor: stockStatus.color }]}
                  >
                    <Text style={styles.statusText}>{stockStatus.status}</Text>
                  </View>
                </View>
                <View style={styles.stockInfo}>
                  <Text
                    style={[styles.stockLevel, { color: getStockColor(item) }]}
                  >
                    {item.stockLevel}
                  </Text>
                  <Text style={styles.stockLabel}>unidades</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <Text style={styles.priceText}>
                  {formatPrice(item.vaccine.price)}
                </Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditItem(item)}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteItem(item)}
                  >
                    <Text style={styles.actionButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? `Editar ${editingItem.vaccine.name}` : 'Agregar Vacuna'}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Stock Actual *</Text>
              <TextInput
                style={styles.input}
                value={formData.stockLevel}
                onChangeText={(text) => setFormData({ ...formData, stockLevel: text })}
                placeholder="Cantidad en stock"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Umbral de Stock Bajo *</Text>
              <TextInput
                style={styles.input}
                value={formData.lowStockThreshold}
                onChangeText={(text) => setFormData({ ...formData, lowStockThreshold: text })}
                placeholder="Mínimo requerido"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Precio (RD$)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="Precio por unidad"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveItem}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
