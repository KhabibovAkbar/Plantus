import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';

import { RootStackParamList } from '../../types';
import { COLORS, FONT_SIZES, SPACING, RADIUS, PLACEHOLDER_IMAGE } from '../../utils/theme';

type RouteProps = RouteProp<RootStackParamList, 'Article'>;
const { width } = Dimensions.get('window');

export default function ArticleScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();

  const { article } = route.params;

  // Parse multilingual fields
  const getTitle = () => {
    if (typeof article.title === 'object') {
      return (article.title as any)?.english || (article.title as any)?.en || Object.values(article.title)[0];
    }
    return article.title;
  };

  const getDescription = () => {
    if (typeof article.description === 'object') {
      return (article.description as any)?.english || (article.description as any)?.en || Object.values(article.description as any)[0];
    }
    return article.description;
  };

  const getContent = () => {
    if (typeof article.content === 'object') {
      return (article.content as any)?.english || (article.content as any)?.en || Object.values(article.content as any)[0];
    }
    return article.content;
  };

  return (
    <View style={styles.container}>
      {/* Full-width image with X button overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: article.image || PLACEHOLDER_IMAGE }}
          style={styles.articleImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + SPACING.sm }]}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      {/* Content in card-like section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{getTitle()}</Text>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{getDescription()}</Text>
        </View>

        {/* Content sections */}
        {getContent() && (
          <View style={styles.contentSection}>
            <Text style={styles.contentText}>{getContent()}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    width,
    height: width * 0.65,
    backgroundColor: COLORS.backgroundTertiary,
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    left: SPACING.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 34,
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  descriptionCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  contentSection: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  contentText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
});
