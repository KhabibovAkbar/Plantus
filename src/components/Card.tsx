import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({
  children,
  style,
  padding = 'medium',
  onPress,
  elevated = true,
}: CardProps) {
  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: SPACING.sm };
      case 'medium':
        return { padding: SPACING.md };
      case 'large':
        return { padding: SPACING.lg };
      default:
        return { padding: SPACING.md };
    }
  };

  const cardStyle: ViewStyle[] = [
    styles.card,
    getPaddingStyle(),
    elevated && SHADOWS.small,
    style,
  ].filter(Boolean) as ViewStyle[];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
  },
});
