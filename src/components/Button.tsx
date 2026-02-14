import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle[] = [styles.container];

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryContainer);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryContainer);
        break;
      case 'outline':
        baseStyle.push(styles.outlineContainer);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostContainer);
        break;
    }

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallContainer);
        break;
      case 'medium':
        baseStyle.push(styles.mediumContainer);
        break;
      case 'large':
        baseStyle.push(styles.largeContainer);
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    // Disabled
    if (disabled || loading) {
      baseStyle.push(styles.disabledContainer);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle: TextStyle[] = [styles.text];

    // Variant text styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
    }

    // Size text styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallText);
        break;
      case 'medium':
        baseStyle.push(styles.mediumText);
        break;
      case 'large':
        baseStyle.push(styles.largeText);
        break;
    }

    return baseStyle;
  };

  const getLoaderColor = (): string => {
    switch (variant) {
      case 'primary':
        return COLORS.textLight;
      case 'secondary':
        return COLORS.text;
      case 'outline':
      case 'ghost':
        return COLORS.textSecondary;
      default:
        return COLORS.textLight;
    }
  };

  return (
    <TouchableOpacity
      style={[...getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabledContainer: {
    opacity: 0.6,
  },

  // Variant container styles
  primaryContainer: {
    backgroundColor: COLORS.primary,
  },
  secondaryContainer: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },

  // Size container styles
  smallContainer: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  mediumContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  largeContainer: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },

  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.textLight,
  },
  secondaryText: {
    color: COLORS.text,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },

  // Size text styles
  smallText: {
    fontSize: FONT_SIZES.sm,
  },
  mediumText: {
    fontSize: FONT_SIZES.md,
  },
  largeText: {
    fontSize: FONT_SIZES.lg,
  },
});
