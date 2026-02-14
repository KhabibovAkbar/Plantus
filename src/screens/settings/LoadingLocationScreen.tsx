import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'phosphor-react-native';

import { COLORS, FONT_SIZES, SPACING } from '../../utils/theme';
import { useTheme } from '../../hooks';
import { useAppStore } from '../../store/appStore';
import { fetchLocation as fetchLocationAPI } from '../../services/api';
import { getCurrentLocation } from '../../utils/helpers';

export default function LoadingLocationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { setLocation } = useAppStore();

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      const locationResult = await getCurrentLocation();

      if (locationResult.success && locationResult.coords) {
        const apiResult = await fetchLocationAPI(
          locationResult.coords.latitude,
          locationResult.coords.longitude
        );

        if (apiResult.success && apiResult.data) {
          setLocation({
            name: apiResult.data.country,
            code: apiResult.data.countryCode,
            lat: locationResult.coords.latitude,
            lon: locationResult.coords.longitude,
          });
        }
      }
    } catch (error) {
      console.error('Detect location error:', error);
    } finally {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapPin size={44} color={COLORS.primary} />
        </View>
        <ActivityIndicator size="large" color={theme.textSecondary} style={styles.loader} />
        <Text style={[styles.title, { color: theme.text }]}>Detecting Location</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Please wait while we determine your location...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  loader: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
