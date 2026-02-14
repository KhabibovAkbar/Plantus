import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';

import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>🌿 Privacy Policy</Text>
          <Text style={styles.introDate}>Last updated: 10.01.2026</Text>
          <Text style={styles.introText}>
            Herbely ("we", "our", or "us") respects your privacy and is committed
            to protecting your personal information. This Privacy Policy explains
            how we collect, use, and protect your data when you use our mobile
            application.
          </Text>
        </View>

        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect only the information necessary to provide a better plant care experience.
          </Text>
          <Text style={styles.subTitle}>a) Information You Provide</Text>
          <Text style={styles.sectionText}>
            {'\u2022'} Plant information (plant type, pot size, soil type){'\n'}
            {'\u2022'} Care preferences (watering, fertilizing, reminders){'\n'}
            {'\u2022'} Environment settings (light level, humidity preference){'\n'}
            {'\u2022'} Optional account details (if you create an account)
          </Text>
          <Text style={styles.subTitle}>b) Automatically Collected Information</Text>
          <Text style={styles.sectionText}>
            {'\u2022'} App usage data (features used, reminder interactions){'\n'}
            {'\u2022'} Device information (OS version, app version){'\n'}
            {'\u2022'} Approximate location (region/country only, not exact address)
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use the information we collect to:{'\n\n'}
            {'\u2022'} Provide, maintain, and improve our services{'\n'}
            {'\u2022'} Process plant identification and diagnosis requests{'\n'}
            {'\u2022'} Send you notifications and reminders{'\n'}
            {'\u2022'} Respond to your comments and questions{'\n'}
            {'\u2022'} Personalize your experience
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.sectionText}>
            We do not sell, trade, or otherwise transfer your personal information
            to outside parties. We may share information with trusted third parties
            who assist us in operating our app, conducting our business, or servicing
            you, as long as those parties agree to keep this information confidential.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement a variety of security measures to maintain the safety of
            your personal information. Your personal data is stored on secure servers
            and is protected using industry-standard encryption.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to:{'\n\n'}
            {'\u2022'} Access your personal data{'\n'}
            {'\u2022'} Correct inaccurate data{'\n'}
            {'\u2022'} Delete your account and data{'\n'}
            {'\u2022'} Export your data{'\n'}
            {'\u2022'} Opt out of marketing communications
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions about this Privacy Policy, please contact us at:{'\n\n'}
            Email: privacy@plantus.app
          </Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  introCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  introTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  introDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  introText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  sectionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
