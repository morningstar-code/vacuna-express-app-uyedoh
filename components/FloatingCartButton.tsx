
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
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

const { width: screenWidth } = Dimensions.get('window');

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
      // Navigate to cart/checkout screen
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
              <IconSymbol name="cart.fill" size={20} color="#FFFFFF" />
              <Text style={styles.itemText}>
                Carrito ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Text>
            </View>
            
            <View style={styles.rightSection}>
              <Text style={styles.totalText}>
                Total: ${totalAmount.toFixed(2)}
              </Text>
              <IconSymbol name="arrow.right" size={16} color="#FFFFFF" />
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
    bottom: Platform.OS === 'ios' ? 90 : 80, // Above tab bar
    left: 0,
    right: 0,
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3)',
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
