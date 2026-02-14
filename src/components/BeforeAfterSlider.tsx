import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  Animated,
  PanResponder,
  StyleSheet,
  ImageSourcePropType,
  Easing,
} from 'react-native';

interface BeforeAfterSliderProps {
  beforeImage: ImageSourcePropType;
  afterImage: ImageSourcePropType;
  width: number;
  height: number;
  dividerColor?: string;
  dividerWidth?: number;
  handleWidth?: number;
  handleHeight?: number;
  handleColor?: string;
  handleBorderRadius?: number;
  initialPosition?: number;
  enableLoop?: boolean;
  loopDuration?: number;
  edgeDelay?: number;
  renderHandle?: () => React.ReactNode;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  width,
  height,
  dividerColor = '#fff',
  dividerWidth = 3,
  handleWidth: hW = 48,
  handleHeight: hH = 48,
  handleColor = '#fff',
  handleBorderRadius = 24,
  initialPosition = 0.5,
  enableLoop = true,
  loopDuration = 2500,
  edgeDelay = 800,
  renderHandle,
}: BeforeAfterSliderProps) {
  const splitX = useRef(new Animated.Value(width * initialPosition)).current;
  const containerPageX = useRef(0);
  const loopAnim = useRef<Animated.CompositeAnimation | null>(null);
  const viewRef = useRef<View>(null);
  const isDragging = useRef(false);

  const stopLoop = useCallback(() => {
    loopAnim.current?.stop();
    loopAnim.current = null;
  }, []);

  const startLoop = useCallback(() => {
    if (width <= 0 || !enableLoop) return;
    stopLoop();

    // Recursive animation instead of Animated.loop to avoid value reset
    const runCycle = () => {
      if (isDragging.current) return;

      const seq = Animated.sequence([
        Animated.timing(splitX, {
          toValue: width,
          duration: loopDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.delay(edgeDelay),
        Animated.timing(splitX, {
          toValue: 0,
          duration: loopDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.delay(edgeDelay),
      ]);

      loopAnim.current = seq;
      seq.start(({ finished }) => {
        // Only continue looping if animation wasn't interrupted
        if (finished && !isDragging.current) {
          runCycle();
        }
      });
    };

    runCycle();
  }, [width, loopDuration, edgeDelay, splitX, enableLoop, stopLoop]);

  useEffect(() => {
    if (enableLoop) {
      startLoop();
    }
    return () => stopLoop();
  }, [enableLoop, width, startLoop, stopLoop]);

  const measureContainer = useCallback(() => {
    viewRef.current?.measure((_x, _y, _w, _h, pageX) => {
      containerPageX.current = pageX ?? 0;
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 3,
      onPanResponderGrant: (evt) => {
        isDragging.current = true;
        stopLoop();
        splitX.stopAnimation();
        measureContainer();
        const x = evt.nativeEvent.pageX - containerPageX.current;
        splitX.setValue(Math.max(0, Math.min(width, x)));
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.pageX - containerPageX.current;
        splitX.setValue(Math.max(0, Math.min(width, x)));
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
        // Resume animation after user releases
        if (enableLoop) {
          startLoop();
        }
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        if (enableLoop) {
          startLoop();
        }
      },
    }),
  ).current;

  const clampedX = splitX.interpolate({
    inputRange: [0, width || 1],
    outputRange: [0, width || 1],
    extrapolate: 'clamp',
  });

  if (width <= 0 || height <= 0) return null;

  return (
    <View
      ref={viewRef}
      style={{ width, height, overflow: 'hidden' }}
      onLayout={measureContainer}
      {...panResponder.panHandlers}
    >
      {/* After image (full width background) */}
      <Image
        source={afterImage}
        style={[StyleSheet.absoluteFill, { width, height, padding: 20, }]}
        resizeMode="cover"
      />

      {/* Before image (clipped from left) */}
      <Animated.View
       style={[StyleSheet.absoluteFill, { width: clampedX, overflow: 'hidden' }]}
      >
        <Image
          source={beforeImage}
          style={{ width, height, padding: 20, }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Divider line */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: dividerWidth,
          backgroundColor: dividerColor,
          left: Animated.subtract(clampedX, dividerWidth / 2),
        }}
      />

      {/* Handle */}
      <Animated.View
        style={[
          styles.handle,
          {
            top: height / 2 - hH / 2,
            width: hW,
            height: hH,
            borderRadius: handleBorderRadius,
            backgroundColor: handleColor,
            left: Animated.subtract(clampedX, hW / 2),
          },
        ]}
      >
        {renderHandle?.()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
});
