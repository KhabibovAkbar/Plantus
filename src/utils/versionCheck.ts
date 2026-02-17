import { Platform } from 'react-native';
import * as Application from 'expo-application';

const IOS_BUNDLE_ID = 'com.webnum.plantus';

/**
 * Parse "1.2.3" or "1.2" into [1, 2, 3] for comparison.
 */
function parseVersion(v: string): number[] {
  return v.split('.').map((n) => parseInt(n, 10) || 0);
}

/**
 * Returns true if storeVersion is newer than currentVersion (e.g. "2.0.1" > "2.0.0").
 */
export function isNewerVersion(storeVersion: string, currentVersion: string): boolean {
  const store = parseVersion(storeVersion);
  const current = parseVersion(currentVersion);
  const len = Math.max(store.length, current.length);
  for (let i = 0; i < len; i++) {
    const s = store[i] ?? 0;
    const c = current[i] ?? 0;
    if (s > c) return true;
    if (s < c) return false;
  }
  return false;
}

/**
 * Current app version (from native build).
 */
export function getCurrentVersion(): string | null {
  return Application.nativeApplicationVersion ?? null;
}

/**
 * Fetch latest version from App Store (iOS) or from optional URL (Android).
 * Returns null if fetch fails or not supported.
 */
export async function getStoreVersion(androidVersionUrl?: string): Promise<string | null> {
  if (Platform.OS === 'ios') {
    try {
      const res = await fetch(
        `https://itunes.apple.com/lookup?bundleId=${IOS_BUNDLE_ID}`
      );
      const data = await res.json();
      const version = data?.results?.[0]?.version;
      return typeof version === 'string' ? version : null;
    } catch {
      return null;
    }
  }

  if (Platform.OS === 'android' && androidVersionUrl) {
    try {
      const res = await fetch(androidVersionUrl);
      const data = await res.json();
      const version = data?.version ?? data?.android;
      return typeof version === 'string' ? version : null;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Returns true if the user should be forced to update (store has a newer version).
 */
export async function shouldForceUpdate(androidVersionUrl?: string): Promise<boolean> {
  const current = getCurrentVersion();
  if (!current) return false;

  const store = await getStoreVersion(androidVersionUrl);
  if (!store) return false;

  return isNewerVersion(store, current);
}
