
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabBarBackground() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.background}>
      {/* Solid white background for consistency */}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF', // Always solid white
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
});
