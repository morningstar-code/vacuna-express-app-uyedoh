
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface FloatingCartButtonProps {
  itemCount: number;
  totalAmount: number;
  onPress?: () => void;
}

export default function FloatingCartButton({
  itemCount,
  totalAmount,
  onPress,
}: FloatingCartButtonProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  React.useEffect(() => {
    if (itemCount > 0) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(50, { duration: 200 });
    }
  }, [itemCount, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate directly to cart screen (no modal)
      router.push('/cart');
    }
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.content}>
            <View style={styles.leftSection}>
              <View style={styles.cartIconContainer}>
                <IconSymbol name="cart.fill" size={20} color="#0B60D1" />
                {/* Red badge with counter */}
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </Text>
                </View>
              </View>
              <Text style={styles.itemText}>
                Carrito ({itemCount})
              </Text>
            </View>
            
            <View style={styles.rightSection}>
              <Text style={styles.totalText}>
                ${totalAmount.toFixed(2)}
              </Text>
              <IconSymbol name="arrow.right" size={16} color="#0B60D1" />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 80, // Above tab bar with proper spacing
    left: 0,
    right: 0,
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  container: {
    marginHorizontal: 16, // 16dp margins as specified
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FFFFFF', // White background as specified
    borderRadius: 24, // Round floating button
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56, // Ensure good touch target
    borderWidth: 1,
    borderColor: '#E5E5EA', // Light gray border as specified
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30', // Red badge as specified
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    color: '#0B60D1', // Blue text as specified
    fontSize: 16,
    fontWeight: '600',
  },
  totalText: {
    color: '#0B60D1', // Blue text as specified
    fontSize: 16,
    fontWeight: '700',
  },
});
