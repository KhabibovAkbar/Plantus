import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

import { useAppStore } from '../store/appStore';

// RevenueCat configuration (test scope APIs commented out)
// const REVENUECAT_API_KEY = 'test_PglJeJukmbdHZTxmckwTtfiTLWX';

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
  // Test scope APIs commented out
  // try {
  //   await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
  //   if (__DEV__) {
  //     Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  //   }
  //   if (customerInfoListenerRemove) {
  //     customerInfoListenerRemove();
  //     customerInfoListenerRemove = null;
  //   }
  //   customerInfoListenerRemove = Purchases.addCustomerInfoUpdateListener(
  //     (customerInfo) => { syncProStatus(customerInfo); }
  //   );
  //   const customerInfo = await Purchases.getCustomerInfo();
  //   syncProStatus(customerInfo);
  // } catch (error) {
  //   console.error('[RevenueCat] Initialization error:', error);
  // }
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
  // const offerings = await Purchases.getOfferings();
  // return { success: true, data: { current: offerings.current, all: offerings.all } };
  return { success: false };
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  _packageToPurchase: PurchasesPackage
): Promise<{
  success: boolean;
  data?: CustomerInfo;
  cancelled?: boolean;
  error?: unknown;
}> => {
  // const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
  // return { success: true, data: customerInfo };
  return { success: false };
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  // const customerInfo = await Purchases.restorePurchases();
  // return { success: true, data: customerInfo };
  return { success: false };
};

/**
 * Get current customer info
 */
export const getCustomerInfo = async (): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  // const customerInfo = await Purchases.getCustomerInfo();
  // return { success: true, data: customerInfo };
  return { success: false };
};

/**
 * Check if user has Plantus Pro entitlement
 */
export const checkPremiumStatus = async (): Promise<{
  success: boolean;
  isPro: boolean;
  error?: unknown;
}> => {
  // const customerInfo = await Purchases.getCustomerInfo();
  // const isPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  // return { success: true, isPro };
  return { success: false, isPro: false };
};

/**
 * Check entitlement - returns true if user has Plantus Pro
 */
export const hasPlantusProEntitlement = (customerInfo: CustomerInfo): boolean =>
  !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];

/**
 * Identify user with RevenueCat (call after login for unified subscription across devices)
 */
export const identifyUser = async (_userId: string): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  // const { customerInfo } = await Purchases.logIn(userId);
  // return { success: true, data: customerInfo };
  return { success: false };
};

/**
 * Log out user from RevenueCat (call on app logout)
 */
export const logOutUser = async (): Promise<{
  success: boolean;
  data?: CustomerInfo;
  error?: unknown;
}> => {
  // const customerInfo = await Purchases.logOut();
  // return { success: true, data: customerInfo };
  return { success: false };
};
