import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, Sun, Moon, CloudSun, Lightbulb } from 'phosphor-react-native';
import { LightSensor } from 'expo-sensors';

import { FONT_SIZES, SPACING } from '../../utils/theme';
import { useTheme } from '../../hooks';

const MIN_LUX = 0;
const MAX_LUX = 100000;

const LIGHT_LEVELS: { min: number; level: string; color: string; icon: string; description: string }[] = [
  { min: 0, level: 'Very Dark', color: '#1A1A2E', icon: 'moon', description: 'Almost no light detected' },
  { min: 10, level: 'Dark', color: '#16213E', icon: 'moon', description: 'Suitable for night vision' },
  { min: 50, level: 'Dim', color: '#0F4C75', icon: 'cloudsun', description: 'Minimal reading light' },
  { min: 200, level: 'Indoor', color: '#3282B8', icon: 'lightbulb', description: 'Comfortable indoor lighting' },
  { min: 1000, level: 'Bright', color: '#BBE1FA', icon: 'cloudsun', description: 'Bright office or retail space' },
  { min: 10000, level: 'Very Bright', color: '#FFD93D', icon: 'sun', description: 'Overcast outdoor conditions' },
  { min: 50000, level: 'Daylight', color: '#FF6B6B', icon: 'sun', description: 'Direct sunlight exposure' },
];

function getLevelForLux(lux: number) {
  let out = LIGHT_LEVELS[0];
  for (const l of LIGHT_LEVELS) {
    if (lux >= l.min) out = l;
  }
  return out;
}

export default function LightMeterScreen() {
  const navigation = useNavigation<{ goBack: () => void }>();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [lux, setLux] = useState<number>(0);
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);
  const [initializing, setInitializing] = useState(true);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Android: real light sensor
  useEffect(() => {
    if (Platform.OS !== 'android') {
      setSensorAvailable(false);
      setInitializing(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const available = await LightSensor.isAvailableAsync();
        if (!mounted) return;
        if (!available) {
          setSensorAvailable(false);
          setInitializing(false);
          return;
        }
        const perm = await LightSensor.getPermissionsAsync();
        if (!mounted) return;
        if (!perm.granted) {
          const requested = await LightSensor.requestPermissionsAsync();
          if (!mounted) return;
          if (!requested.granted) {
            setSensorAvailable(false);
            setInitializing(false);
            return;
          }
        }
        setSensorAvailable(true);
        setInitializing(false);
        // Android 12+ min interval 200ms
        LightSensor.setUpdateInterval(250);
        const sub = LightSensor.addListener((data: { illuminance: number }) => {
          const value = Math.max(MIN_LUX, Math.min(MAX_LUX, Math.round(Number(data.illuminance) || 0)));
          setLux(value);
        });
        subscriptionRef.current = sub;
      } catch (e) {
        if (mounted) {
          setSensorAvailable(false);
          setInitializing(false);
        }
      }
    })();
    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  // No sensor: demo simulation only (no camera)
  useEffect(() => {
    if (sensorAvailable === true) return;
    if (initializing) return;

    const id = setInterval(() => {
      setLux((prev) => {
        if (prev < 600) return prev + 12;
        return 380 + Math.round(Math.random() * 440);
      });
    }, 200);
    simIntervalRef.current = id;

    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    };
  }, [sensorAvailable, initializing]);

  const levelInfo = getLevelForLux(lux);
  const progress = Math.min(1, Math.max(0, lux / MAX_LUX));

  const IconComponent =
    levelInfo.icon === 'sun'
      ? Sun
      : levelInfo.icon === 'moon'
        ? Moon
        : levelInfo.icon === 'lightbulb'
          ? Lightbulb
          : CloudSun;

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <CaretLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Light Meter</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + SPACING.xxl }]}>
        {initializing ? (
          <View style={[styles.meterCard, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.initText, { color: theme.textSecondary }]}>Initializing light sensor...</Text>
          </View>
        ) : (
          <>
            <View
            style={[
              styles.meterCard,
              {
                backgroundColor: theme.card,
                borderColor: levelInfo.color + '80',
                borderWidth: 2,
                overflow: 'hidden',
              },
            ]}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: levelInfo.color,
                  opacity: isDark ? 0.15 : 0.08,
                },
              ]}
            />
            <View style={[styles.iconCircle, { backgroundColor: levelInfo.color + '33' }]}>
              <IconComponent size={60} color={levelInfo.color} weight="duotone" />
            </View>

            <Text style={[styles.luxValue, { color: levelInfo.color }]}>{Math.round(lux)}</Text>
            <Text style={[styles.luxUnit, { color: levelInfo.color + 'B3' }]}>lux</Text>

            <Text style={[styles.levelName, { color: theme.text }]}>{levelInfo.level}</Text>
            <Text style={[styles.levelDesc, { color: theme.textSecondary }]}>{levelInfo.description}</Text>

            <View style={[styles.progressTrack, { backgroundColor: (isDark ? '#fff' : '#000') + '20' }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: levelInfo.color,
                  },
                ]}
              />
            </View>
            <View style={styles.rangeRow}>
              <Text style={[styles.rangeLabel, { color: theme.textTertiary }]}>0 lux</Text>
              <Text style={[styles.rangeLabel, { color: theme.textTertiary }]}>100k lux</Text>
            </View>

            {sensorAvailable === false && (
              <Text style={[styles.demoLabel, { color: theme.textTertiary }]}>
                Demo — no light sensor on this device
              </Text>
            )}
          </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: SPACING.sm },
  title: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
  placeholder: { width: 40 },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    justifyContent: 'center',
  },
  meterCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minHeight: 400,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  luxValue: {
    fontSize: 72,
    fontWeight: '700',
  },
  luxUnit: {
    fontSize: 24,
    marginTop: 4,
  },
  levelName: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 16,
  },
  levelDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: SPACING.lg,
  },
  progressTrack: {
    height: 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  rangeLabel: {
    fontSize: 12,
  },
  initText: {
    marginTop: 16,
    fontSize: FONT_SIZES.md,
  },
  demoLabel: {
    marginTop: 16,
    fontSize: FONT_SIZES.sm,
  },
});
