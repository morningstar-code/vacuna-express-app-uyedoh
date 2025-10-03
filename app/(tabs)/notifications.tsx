
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
import { sampleNotifications } from '@/data/vaccines';
import { Notification } from '@/types/vaccine';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');

  const unreadNotifications = notifications.filter(notif => !notif.isRead);
  const displayNotifications = selectedTab === 'all' ? notifications : unreadNotifications;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    Alert.alert('Éxito', 'Todas las notificaciones han sido marcadas como leídas');
  };

  const deleteNotification = (notificationId: string) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de que deseas eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => 
              prev.filter(notif => notif.id !== notificationId)
            );
          }
        },
      ]
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'bell.fill';
      case 'promotion':
        return 'tag.fill';
      case 'shipment':
        return 'shippingbox.fill';
      case 'educational':
        return 'book.fill';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return colors.primary;
      case 'promotion':
        return colors.warning;
      case 'shipment':
        return colors.accent;
      case 'educational':
        return colors.secondary;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-DO', {
          month: 'short',
          day: 'numeric',
        });
      }
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Handle different notification types
    switch (notification.type) {
      case 'reminder':
        Alert.alert(
          'Recordatorio de Vacuna',
          notification.message,
          [
            { text: 'Más Tarde', style: 'cancel' },
            { text: 'Programar Cita', onPress: () => console.log('Schedule appointment') },
          ]
        );
        break;
      case 'promotion':
        Alert.alert(
          'Promoción Especial',
          notification.message,
          [
            { text: 'Cerrar', style: 'cancel' },
            { text: 'Ver Promoción', onPress: () => console.log('View promotion') },
          ]
        );
        break;
      case 'shipment':
        Alert.alert(
          'Actualización de Envío',
          notification.message,
          [
            { text: 'OK', style: 'cancel' },
            { text: 'Rastrear Pedido', onPress: () => console.log('Track order') },
          ]
        );
        break;
      default:
        Alert.alert(notification.title, notification.message);
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        commonStyles.card,
        styles.notificationCard,
        !notification.isRead && styles.unreadCard
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
        {/* Icon */}
        <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(notification.type) }]}>
          <IconSymbol 
            name={getNotificationIcon(notification.type)} 
            size={20} 
            color={colors.card} 
          />
        </View>

        {/* Content */}
        <View style={styles.notificationText}>
          <View style={styles.notificationHeader}>
            <Text style={[
              commonStyles.heading, 
              !notification.isRead && styles.unreadText
            ]}>
              {notification.title}
            </Text>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={[commonStyles.textSecondary, styles.notificationMessage]} numberOfLines={2}>
            {notification.message}
          </Text>
          
          <Text style={[commonStyles.textSmall, styles.notificationTime]}>
            {formatDate(notification.createdAt)}
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(notification.id)}
        >
          <IconSymbol name="xmark" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={[commonStyles.center, { marginTop: 50 }]}>
      <IconSymbol name="bell.slash" size={48} color={colors.textSecondary} />
      <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
        {selectedTab === 'all' ? 'No tienes notificaciones' : 'No tienes notificaciones sin leer'}
      </Text>
      <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
        Las notificaciones aparecerán aquí cuando las recibas
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={commonStyles.title}>Notificaciones</Text>
            {unreadNotifications.length > 0 && (
              <TouchableOpacity 
                onPress={markAllAsRead}
                style={styles.markAllButton}
              >
                <Text style={styles.markAllText}>
                  Marcar todas como leídas
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'all' && styles.tabActive
              ]}
              onPress={() => setSelectedTab('all')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'all' && styles.tabTextActive
              ]}>
                Todas ({notifications.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'unread' && styles.tabActive
              ]}
              onPress={() => setSelectedTab('unread')}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'unread' && styles.tabTextActive
              ]}>
                Sin Leer ({unreadNotifications.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications List */}
        <ScrollView 
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        >
          {displayNotifications.length > 0 ? (
            displayNotifications.map(renderNotificationCard)
          ) : (
            renderEmptyState()
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start to prevent text cutoff
    marginBottom: 16,
    minHeight: 44, // Ensure minimum height for touch target
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary + '10',
    minHeight: 36, // Ensure proper touch target
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Prevent shrinking
    maxWidth: '50%', // Prevent taking too much space
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
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
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  notificationCard: {
    marginBottom: 12,
    paddingVertical: 16,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});
