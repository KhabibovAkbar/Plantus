import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, StackActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootStackParamList } from '../../types';
import { FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';
import { useTheme } from '../../hooks';

type RouteProps = RouteProp<RootStackParamList, 'OneTimeOffer'>;

export default function OneTimeOfferScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const fromFirstTime = route.params?.fromFirstTime ?? false;

  const handleClose = () => {
    if (fromFirstTime) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } else {
      navigation.dispatch(StackActions.pop(2));
    }
  };

  const handleClaimOffer = () => {
    if (fromFirstTime) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      setTimeout(() => navigation.navigate('Pro', { isFirstStep: false }), 150);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24, backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose} hitSlop={12}>
          <X size={24} color={theme.text} weight="bold" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>ONE TIME OFFER</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>You will never see this again</Text>

        <View style={styles.couponWrap}>
          <Image
            source={require('../../../assets/Ticket.png')}
            style={styles.ticketImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.expireTitle, { color: theme.text }]}>This offer will expire soon</Text>
        <Text style={[styles.expireDesc, { color: theme.textSecondary }]}>
          Once you close your one-time-offer, it's gone! Save 50% with yearly plan compared to the monthly plan.
        </Text>

        <View style={styles.planCardWrap}>
          <LinearGradient
            colors={['#1FC85C', '#00AFFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.planCardBanner}
          >
            <Text style={styles.badgeText}>LOWEST PRICE EVER</Text>
            <View style={[styles.planCardInner, { backgroundColor: theme.background }]}>
              <View style={styles.planLeft}>
                <Text style={[styles.planName, { color: theme.text }]}>Annual Plan</Text>
                <Text style={[styles.planDesc, { color: theme.textSecondary }]}>12 months included</Text>
              </View>
              <View style={styles.planRight}>
                <Text style={[styles.planPrice, { color: theme.text, textDecorationLine: 'line-through' }]}>$19.99</Text>
                <Text style={[styles.planPerMonth, { color: theme.textSecondary }]}>$1.32/month</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <TouchableOpacity style={[styles.claimBtn, { backgroundColor: theme.text }]} onPress={handleClaimOffer} activeOpacity={0.85}>
          <Text style={[styles.claimBtnText, { color: theme.background }]}>Claim Offer</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://plantus.app/privacy-policy/')}>
            <Text style={[styles.footerLink, { color: theme.textTertiary }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://plantus.app/terms-of-use/')}>
            <Text style={[styles.footerLink, { color: theme.textTertiary }]}>Terms Of Use</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  couponWrap: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  ticketImage: {
    width: '100%',
    height: 160,
  },
  expireTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  expireDesc: {
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  planCardWrap: {
    marginBottom: SPACING.xl,
    borderRadius: 16,
    overflow: 'hidden',
  },
  planCardBanner: {
    padding: 2,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  planCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: 14,
  },
  planLeft: {},
  planName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  planDesc: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  planRight: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: FONT_SIZES.md,
  },
  planPerMonth: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  claimBtn: {
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  claimBtnText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  footerLink: {
    fontSize: FONT_SIZES.sm,
  },
});
