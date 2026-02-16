import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, MagnifyingGlass } from 'phosphor-react-native';

import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';
import { useTheme } from '../../hooks';
import { useAppStore } from '../../store/appStore';
import { Location } from '../../types';

const allCountries: Location[] = [
  { name: 'Afghanistan', code: 'AFG' },
  { name: 'Albania', code: 'ALB' },
  { name: 'Algeria', code: 'DZA' },
  { name: 'American Samoa', code: 'ASM' },
  { name: 'Andorra', code: 'AND' },
  { name: 'Angola', code: 'AGO' },
  { name: 'Antarctica', code: 'ATA' },
  { name: 'Antigua and Barbuda', code: 'ATG' },
  { name: 'Argentina', code: 'ARG' },
  { name: 'Australia', code: 'AUS' },
  { name: 'Bahamas', code: 'BHS' },
  { name: 'Bahrain', code: 'BHR' },
  { name: 'Bangladesh', code: 'BGD' },
  { name: 'Brazil', code: 'BRA' },
  { name: 'Canada', code: 'CAN' },
  { name: 'China', code: 'CHN' },
  { name: 'France', code: 'FRA' },
  { name: 'Germany', code: 'DEU' },
  { name: 'India', code: 'IND' },
  { name: 'Italy', code: 'ITA' },
  { name: 'Japan', code: 'JPN' },
  { name: 'South Korea', code: 'KOR' },
  { name: 'Spain', code: 'ESP' },
  { name: 'Turkey', code: 'TUR' },
  { name: 'United Kingdom', code: 'GBR' },
  { name: 'United States', code: 'USA' },
  { name: 'Uzbekistan', code: 'UZB' },
];

export default function LocationScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { location, setLocation } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return allCountries;
    return allCountries.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectLocation = (country: Location) => {
    setLocation(country);
    navigation.goBack();
  };

  const handleGetCurrentLocation = () => {
    navigation.navigate('LoadingLocation' as never);
  };

  const renderCountryItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={[styles.countryRow, { backgroundColor: theme.background, borderBottomColor: theme.borderLight }]}
      onPress={() => handleSelectLocation(item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.countryName,
        { color: theme.text },
        location.code === item.code && { color: COLORS.primary, fontWeight: '600' },
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={theme.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Location</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.backgroundSecondary }]}>
          <MagnifyingGlass size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search Country"
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Get Current Location */}
      <TouchableOpacity
        style={[styles.currentLocationRow, { backgroundColor: theme.background }]}
        onPress={handleGetCurrentLocation}
      >
        <MapPin size={20} color={COLORS.primary} />
        <Text style={[styles.currentLocationText, { color: theme.text }]}>Get current location</Text>
      </TouchableOpacity>

      {/* Countries */}
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Countries</Text>
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item.code}
        renderItem={renderCountryItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    padding: 0,
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  currentLocationText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.primary,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  countryRow: {
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  countryName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.text,
  },
  countryNameSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
