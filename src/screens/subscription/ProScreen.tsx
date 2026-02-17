import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../types';
import {
  X,
  Plant,
  Calendar,
  Bell,
  Brain,
  BookOpen,
  Check,
  Crown,
} from 'phosphor-react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../hooks';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkPremiumStatus,
} from '../../services/revenueCat';

const { width: SW } = Dimensions.get('window');
const HERO_HEIGHT = 150;

const FEATURES = [
  { icon: Plant, label: 'Full plant identification' },
  { icon: Calendar, label: 'Smart care plans' },
  { icon: Bell, label: 'Gentle smart reminders' },
  { icon: Brain, label: 'Advanced plant insights' },
  { icon: BookOpen, label: 'Full plant wiki access' },
];

const PRO_CLOSE_COUNT_KEY = '@plantus_pro_close_count';

export default function ProScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'Pro'>>();
  const insets = useSafeAreaInsets();
  const { isPro, setIsPro } = useAppStore();
  const { theme, isDark } = useTheme();
  const isFirstStep = route.params?.isFirstStep ?? false;

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPlanKey, setSelectedPlanKey] = useState<'annual' | 'monthly'>('annual');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const result = await getOfferings();
      if (result.success && result.data) {
        let allPkgs: PurchasesPackage[] = [];
        const { current, all } = result.data;
        if (current?.availablePackages?.length) {
          allPkgs = [...current.availablePackages];
        }
        if (all) {
          Object.values(all).forEach((offering: any) => {
            if (offering?.availablePackages) {
              offering.availablePackages.forEach((pkg: PurchasesPackage) => {
                if (!allPkgs.find((p) => p.identifier === pkg.identifier)) allPkgs.push(pkg);
              });
            }
          });
        }
        allPkgs.sort((a, b) => {
          const order: Record<string, number> = { ANNUAL: 0, MONTHLY: 1 };
          return (order[a.packageType] ?? 2) - (order[b.packageType] ?? 2);
        });
        setPackages(allPkgs);
      }
    } catch (e) {
      console.error('Load offerings error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Select a plan', 'Please tap Annual or Monthly plan first, then Start trial.');
      return;
    }
    setPurchasing(true);
    try {
      const result = await purchasePackage(selectedPackage);
      if (result.success) {
        const statusResult = await checkPremiumStatus();
        setIsPro(statusResult.isPro);
        Alert.alert('Success', 'Thank you for upgrading to Pro!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else if (result.cancelled) {
        // User closed the sheet – no alert
      } else {
        const msg = result.error instanceof Error ? result.error.message : (result.error ? String(result.error) : 'Please check your connection and try again.');
        Alert.alert('Purchase failed', msg);
      }
    } catch (e) {
      console.error('Purchase error:', e);
      Alert.alert(
        'Error',
        'Subscription is unavailable. Please check your connection or try again later.'
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      const statusResult = await checkPremiumStatus();
      setIsPro(statusResult.isPro);
      if (statusResult.isPro) {
        Alert.alert('Success', 'Your purchases have been restored!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Info', 'No previous purchases found');
      }
    } catch (e) {
      console.error('Restore error:', e);
      Alert.alert('Error', 'Failed to restore purchases');
    } finally {
      setRestoring(false);
    }
  };

  const handleClose = async () => {
    if (isPro) {
      navigation.goBack();
      return;
    }
    if (isFirstStep) {
      navigation.navigate('OneTimeOffer', { fromFirstTime: true });
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(PRO_CLOSE_COUNT_KEY);
      const count = Math.max(0, parseInt(raw || '0', 10)) + 1;
      await AsyncStorage.setItem(PRO_CLOSE_COUNT_KEY, String(count));
      if (count % 10 === 0) {
        navigation.navigate('OneTimeOffer', { fromFirstTime: false });
      } else {
        navigation.goBack();
      }
    } catch {
      navigation.goBack();
    }
  };

  if (isPro) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
        <View style={[styles.closeRowAbs, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <X size={24} color={theme.text} weight="bold" />
          </TouchableOpacity>
        </View>
        <View style={[styles.alreadyProWrap, { backgroundColor: theme.background }]}>
          <View style={styles.proBadgeCircle}>
            <Plant size={48} color="#fff" />
          </View>
          <Text style={[styles.alreadyProTitle, { color: theme.text }]}>You're a Pro!</Text>
          <Text style={[styles.alreadyProDesc, { color: theme.textSecondary }]}>
            You already have access to all premium features. Thank you for your support!
          </Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: theme.primary }]} onPress={handleClose}>
            <Text style={[styles.doneBtnText, { color: theme.textLight }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const annualPkg = packages.find((p) => p.packageType === 'ANNUAL' || p.identifier === '$rc_annual');
  const monthlyPkg = packages.find((p) => p.packageType === 'MONTHLY' || p.identifier === '$rc_monthly');

  // Selected package for purchase (from current plan key)
  const selectedPackage = selectedPlanKey === 'annual' ? (annualPkg ?? null) : (monthlyPkg ?? null);

  // All prices from RevenueCat product (localized priceString from App Store)
  const annualPrice = annualPkg?.product?.priceString ?? '—';
  const annualPerWeek =
    annualPkg?.product?.price != null
      ? (annualPkg.product.price / 52).toFixed(2)
      : '—';
  const monthlyPrice = monthlyPkg?.product?.priceString ?? '—';

  // Radio: one plan selected by key (works even when offerings haven't loaded)
  const isAnnualSelected = selectedPlanKey === 'annual';
  const isMonthlySelected = selectedPlanKey === 'monthly';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.closeRowAbs, { top: insets.top + 8 }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <X size={24} color={theme.text} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        {/* Hero: plant photo under status bar (transparent app bar) + Trust image */}
        <View style={[styles.heroWrap, { height: HERO_HEIGHT + insets.top }]}>
          <ImageBackground
            source={require('../../../assets/unsplash_LOXYdaej5eo.png')}
            style={styles.heroBgImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={isDark ? ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', theme.background] : ['rgba(255,255,255,0)', 'rgba(255,255,255,0.6)', '#FFFFFF']}
              locations={[0, 0.5, 1]}
              style={styles.heroGradient}
              pointerEvents="none"
            />
            <View style={[styles.heroOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.88)' }]} />
            <View style={[styles.trustImageWrap, { paddingTop: insets.top }]}>
              <Image
                source={require('../../../assets/Trust.png')}
                style={styles.trustImage}
                resizeMode="contain"
              />
            </View>
          </ImageBackground>
        </View>

        <View style={[styles.mainBlock, { backgroundColor: theme.background }]}>
          <Text style={[styles.mainTitle, { color: theme.text }]} numberOfLines={2}>Care for your plants like a pro gardener</Text>

          <View style={styles.featuresWrap}>
            {FEATURES.map(({ icon: Icon, label }) => (
              <View key={label} style={styles.featureRow}>
                <View style={[styles.featureIconWrap, { backgroundColor: theme.backgroundSecondary }]}>
                  <Icon size={20} color={theme.text} />
                </View>
                <Text style={[styles.featureLabel, { color: theme.text }]} numberOfLines={1}>{label}</Text>
              </View>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 12 }} />
          ) : (
          <View style={styles.plansWrap}>
            <TouchableOpacity
              style={[
                styles.planCard,
                { backgroundColor: theme.card, borderColor: theme.borderLight },
                isAnnualSelected && { ...styles.planCardSelected, backgroundColor: isDark ? theme.backgroundSecondary : '#F0FDF4', borderColor: theme.primary },
              ]}
              onPress={() => setSelectedPlanKey('annual')}
              activeOpacity={0.85}
            >
              <View style={styles.bestBadge}>
                <Crown size={12} color="#fff" weight="fill" />
                <Text style={styles.bestBadgeText}>Best value</Text>
              </View>
              <View style={styles.planLeft}>
                <Text style={[styles.planName, { color: theme.text }]}>Annual Plan</Text>
                <Text style={[styles.planDesc, { color: theme.textSecondary }]}>
                  {annualPrice === '—' ? '—' : `${annualPrice} / year (${annualPerWeek === '—' ? '—' : `$${annualPerWeek}`}/week)`}
                </Text>
              </View>
              <View style={[styles.radioOuter, { borderColor: theme.borderLight }, isAnnualSelected && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                {isAnnualSelected && <Check size={18} color="#fff" weight="bold" />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.planCard,
                { backgroundColor: theme.card, borderColor: theme.borderLight },
                isMonthlySelected && { ...styles.planCardSelected, backgroundColor: isDark ? theme.backgroundSecondary : '#F0FDF4', borderColor: theme.primary },
              ]}
              onPress={() => setSelectedPlanKey('monthly')}
              activeOpacity={0.85}
            >
              <View style={styles.planLeft}>
                <Text style={[styles.planName, { color: theme.text }]}>Monthly Plan</Text>
                <Text style={[styles.planDesc, { color: theme.textSecondary }]}>
                  {monthlyPrice === '—' ? '—' : `3 days free trial, then ${monthlyPrice} / month`}
                </Text>
              </View>
              <View style={[styles.radioOuter, { borderColor: theme.borderLight }, isMonthlySelected && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                {isMonthlySelected && <Check size={18} color="#fff" weight="bold" />}
              </View>
            </TouchableOpacity>
          </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: theme.primary }, purchasing && { opacity: 0.7 }]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPackage}
          activeOpacity={0.85}
        >
          {purchasing ? (
            <ActivityIndicator color={theme.textLight} />
          ) : (
            <Text style={[styles.ctaBtnText, { color: theme.textLight }]}>
              {selectedPlanKey === 'monthly' ? 'Start my 3-day trial' : 'Start my 7-day trial'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://plantus.app/privacy-policy/')}>
            <Text style={[styles.footerLinkText, { color: theme.textSecondary }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRestore} disabled={restoring}>
            {restoring ? (
              <ActivityIndicator size="small" color={theme.textSecondary} />
            ) : (
              <Text style={[styles.footerLinkText, { color: theme.textSecondary }]}>Restore</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://plantus.app/terms-of-use/')}>
            <Text style={[styles.footerLinkText, { color: theme.textSecondary }]}>Terms of Use</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  closeRowAbs: {
    position: 'absolute',
    left: SPACING.lg,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroWrap: {
    height: HERO_HEIGHT,
    width: SW,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBgImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    zIndex: 1,
  },
  trustImageWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  trustImage: {
    width: SW * 0.7,
    maxWidth: 280,
    height: 90,
    zIndex: 1,
  },
  mainBlock: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: SPACING.xl,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  featuresWrap: {
    gap: SPACING.sm,
    flexShrink: 0,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  plansWrap: {
    gap: SPACING.md,
    flexShrink: 0,
    marginTop: SPACING.lg,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
    minHeight: 68,
  },
  planCardSelected: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  bestBadge: {
    position: 'absolute',
    top: -10,
    left: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    gap: 6,
  },
  bestBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  planLeft: {
    flex: 1,
  },
  planName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  planDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  radioSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.xl,
    minHeight: 52,
    paddingVertical: 16,
    marginBottom: SPACING.sm,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    flexShrink: 0,
  },
  footerLinkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  alreadyProWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  proBadgeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  alreadyProTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  alreadyProDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: RADIUS.round,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
