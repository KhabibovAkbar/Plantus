import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../utils/theme';
import { useAppStore } from '../../store/appStore';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const onboardingData = [
  {
    id: '1',
    title: 'Identify the plant',
    description:
      'Plants can look alike.\nWe show you the closest matches\nwith confidence levels, not guesses.',
    image: require('../../../assets/images/Image.png'),
  },
  {
    id: '2',
    title: 'Care made simple',
    description:
      'We break plant care into clear, simple steps\nso you always know exactly what to do next,\nconfidently.',
    image: require('../../../assets/images/Image2.png'),
  },
  {
    id: '3',
    title: 'Never forget plant care',
    description:
      'Get gentle reminders and simple checklists\nright when your plant truly needs attention most,\nnaturally',
    image: require('../../../assets/images/Image3.png'),
  },
  {
    id: '4',
    title: 'Never forget plant care',
    description:
      'Get gentle reminders and simple checklists\nright when your plant truly needs attention most,\nnaturally',
    image: require('../../../assets/images/Image3.png'),
  },
];

const DOT_SIZE = 8;
const ACTIVE_DOT_WIDTH = 24;
const DOT_SPACING = 4;

const AnimatedDot = ({ index, scrollX }: { index: number; scrollX: Animated.Value }) => {
  const inputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const dotWidth = scrollX.interpolate({
    inputRange,
    outputRange: [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE],
    extrapolate: 'clamp',
  });

  const dotOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  const dotColor = scrollX.interpolate({
    inputRange,
    outputRange: [COLORS.accent3, COLORS.text, COLORS.accent3],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: dotWidth,
          opacity: dotOpacity,
          backgroundColor: dotColor,
        },
      ]}
    />
  );
};

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { setIsFirstStep } = useAppStore();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    setIsFirstStep(false);
    navigation.navigate('Started');
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
          <Text style={styles.skipArrow}> →</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <AnimatedDot key={index} index={index} scrollX={scrollX} />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    fontWeight: '500',
  },
  skipArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    fontWeight: '500',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  imageContainer: {
    width: width * 0.75,
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: DOT_SPACING,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
});
