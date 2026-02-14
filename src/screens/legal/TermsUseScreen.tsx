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

export default function TermsUseScreen() {
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
        <Text style={styles.title}>Terms of Use</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>🌿 Terms of Use</Text>
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
          <Text style={styles.sectionTitle}>1. Use of the App</Text>
          <Text style={styles.sectionText}>
            Herbely is designed to help users identify plants and manage plant care
            through reminders, schedules, and educational content.{'\n\n'}
            You agree to use the app:{'\n'}
            {'\u2022'} Only for personal, non-commercial purposes{'\n'}
            {'\u2022'} In compliance with applicable laws{'\n'}
            {'\u2022'} In a respectful and lawful manner
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Plant Care Disclaimer</Text>
          <Text style={styles.sectionText}>
            The information provided in Herbely is for general guidance only.{'\n\n'}
            {'\u2022'} Plant care recommendations are based on common horticultural practices{'\n'}
            {'\u2022'} Results may vary depending on environment and plant condition{'\n'}
            {'\u2022'} We do not guarantee plant health or survival
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. User Account</Text>
          <Text style={styles.sectionText}>
            To use certain features of the app, you must register for an account.
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Content</Text>
          <Text style={styles.sectionText}>
            You retain ownership of any content you submit to the app. By submitting
            content, you grant us a worldwide, non-exclusive, royalty-free license
            to use, reproduce, modify, and distribute your content in connection with
            operating and improving our services.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Subscriptions</Text>
          <Text style={styles.sectionText}>
            Some features require a paid subscription. Subscriptions automatically
            renew unless canceled at least 24 hours before the end of the current
            period. You can manage and cancel your subscriptions through your app
            store account settings.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Contact</Text>
          <Text style={styles.sectionText}>
            For any questions regarding these Terms of Use, please contact us at:{'\n\n'}
            Email: legal@plantus.app
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
  sectionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
