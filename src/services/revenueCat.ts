import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

import { useAppStore } from '../store/appStore';

// RevenueCat configuration
const REVENUECAT_API_KEY = 'test_PglJeJukmbdHZTxmckwTtfiTLWX';

/** Entitlement ID for Plantus Pro - must match RevenueCat dashboard */
export const ENTITLEMENT_ID = 'Plantus Pro';

/** Product package types (configure in RevenueCat: Monthly, Yearly, Lifetime) */
export const PACKAGE_MONTHLY = 'MONTHLY';
export const PACKAGE_ANNUAL = 'ANNUAL';
export const PACKAGE_LIFETIME = 'LIFETIME';

let customerInfoListenerRemove: (() => void) | null = null;

/**
 * Sync isPro state from CustomerInfo to app store
 */
const syncProStatus = (customerInfo: CustomerInfo | null) => {
  const setIsPro = useAppStore.getState().setIsPro;
  const hasPro =
    !!customerInfo?.entitlements.active[ENTITLEMENT_ID];
  setIsPro(hasPro);
};

/**
 * Initialize RevenueCat SDK - call once at app startup
 */
export const initializeRevenueCat = async (): Promise<void> => {
  try {
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }

    // Remove previous listener if any
    if (customerInfoListenerRemove) {
      customerInfoListenerRemove();
      customerInfoListenerRemove = null;
    }

    // Listen for customer info updates (purchases, restores, expires)
    customerInfoListenerRemove = Purchases.addCustomerInfoUpdateListener(
      (customerInfo) => {
        syncProStatus(customerInfo);
      }
    );

    // Initial sync - get current customer info and set isPro
    const customerInfo = await Purchases.getCustomerInfo();
    syncProStatus(customerInfo);
  } catch (error) {
    console.error('[RevenueCat] Initialization error:', error);
  }
};

/**
 * Clean up listener (e.g. on app unmount if needed)
 */
export const removeRevenueCatListeners = (): void => {
  if (customerInfoListenerRemove) {
    customerInfoListenerRemove();
    customerInfoListenerRemove = null;
  }
};

/**
 * Get offerings (products) from RevenueCat
 */
export const getOfferings = async (): Promise<{
  success: boolean;
  data?: {
    current: PurchasesOffering | null;
    all: Record<string, PurchasesOffering>;
  };
  error?: unknown;
}> => {
  try {
    const offerings = await Purchases.getOfferings();
    return {
      success: true,
      data: {
        current: offerings.current,
        all: offerings.all,
      },
    };
  } catch (error) {
    console.error('[RevenueCat] Get offerings error:', error);
    return { success: false, error };
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{
  success: boolean;
  data?: CustomerInfo;
  cancelled?: boolean;
  error?: unknown;
}> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return { success: true, data: customerInfo };
  } catch (error: any) {
    if (error?.userCancelled) {
      return { success: false, cancelled: true };
    }
    console.error('[RevenueCat] Purchase error:', error);
    return { success: false, error };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, data: customerInfo };
  } catch (error) {
    console.error('[RevenueCat] Restore purchases error:', error);
    return { success: false, error };
  }
};

/**
 * Get current customer info
 */
export const getCustomerInfo = async (): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return { success: true, data: customerInfo };
  } catch (error) {
    console.error('[RevenueCat] Get customer info error:', error);
    return { success: false, error };
  }
};

/**
 * Check if user has Plantus Pro entitlement
 */
export const checkPremiumStatus = async (): Promise<{
  success: boolean;
  isPro: boolean;
  error?: unknown;
}> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    return { success: true, isPro };
  } catch (error) {
    console.error('[RevenueCat] Check premium status error:', error);
    return { success: false, isPro: false, error };
  }
};

/**
 * Check entitlement - returns true if user has Plantus Pro
 */
export const hasPlantusProEntitlement = (customerInfo: CustomerInfo): boolean =>
  !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

/**
 * Identify user with RevenueCat (call after login for unified subscription across devices)
 */
export const identifyUser = async (userId: string): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return { success: true, data: customerInfo };
  } catch (error) {
    console.error('[RevenueCat] Identify user error:', error);
    return { success: false, error };
  }
};

/**
 * Log out user from RevenueCat (call on app logout)
 */
export const logOutUser = async (): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  try {
    const customerInfo = await Purchases.logOut();
    return { success: true, data: customerInfo };
  } catch (error) {
    console.error('[RevenueCat] Logout user error:', error);
    return { success: false, error };
  }
};
