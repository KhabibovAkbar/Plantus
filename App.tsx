import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Navigation from './src/navigation';
import { useAppStore } from './src/store/appStore';
import { supabase } from './src/services/supabase';
import { initializeRevenueCat, identifyUser } from './src/services/revenueCat';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { setUser, setSession, initializePersistedState, setIsInited, darkMode } = useAppStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialCommunityIcons.font,
        });

        // Initialize persisted state from AsyncStorage
        await initializePersistedState();

        // Initialize RevenueCat
        await initializeRevenueCat();

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
          await identifyUser(session.user.id);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session) {
            setSession(session);
            setUser(session.user);
            await identifyUser(session.user.id);
          } else {
            setSession(null);
            setUser(null);
          }
        });

        setIsInited(true);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
