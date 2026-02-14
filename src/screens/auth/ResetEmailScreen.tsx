import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';

import { RootStackParamList } from '../../types';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';
import { resetPassword } from '../../services/supabase';
import { isValidEmail, showAlert } from '../../utils/helpers';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ResetEmailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(email.trim());

      if (resetError) {
        showAlert('Error', resetError.message);
        return;
      }

      navigation.navigate('Success', {
        message: 'Password reset link sent to your email',
      });
    } catch (err) {
      console.error('Reset password error:', err);
      showAlert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            To reset your password please enter your email
          </Text>

          {/* Email Input */}
          <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textLight} />
            ) : (
              <Text style={styles.submitButtonText}>Send Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  inputWrapper: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: SPACING.xl,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xl,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textLight,
  },
});
