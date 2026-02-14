import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import type { PurchasesOffering } from 'react-native-purchases';
import { ENTITLEMENT_ID } from '../services/revenueCat';

export type PaywallPresentResult = {
  purchased: boolean;
  restored: boolean;
  cancelled: boolean;
  notPresented: boolean;
  error: boolean;
};

/**
 * Present RevenueCat Paywall - shows modal paywall with current offering.
 * Use when user explicitly requests to see subscription options.
 */
export const presentPaywall = async (options?: {
  offering?: PurchasesOffering;
}): Promise<PaywallPresentResult> => {
  try {
    const result = await RevenueCatUI.presentPaywall({
      displayCloseButton: true,
      offering: options?.offering,
    });

    return {
      purchased: result === PAYWALL_RESULT.PURCHASED,
      restored: result === PAYWALL_RESULT.RESTORED,
      cancelled: result === PAYWALL_RESULT.CANCELLED,
      notPresented: result === PAYWALL_RESULT.NOT_PRESENTED,
      error: result === PAYWALL_RESULT.ERROR,
    };
  } catch (e) {
    console.error('[Paywall] presentPaywall error:', e);
    return {
      purchased: false,
      restored: false,
      cancelled: false,
      notPresented: false,
      error: true,
    };
  }
};

/**
 * Present Paywall only if user does NOT have Plantus Pro entitlement.
 * Ideal for "Upgrade" buttons - shows paywall only when needed.
 */
export const presentPaywallIfNeeded = async (): Promise<PaywallPresentResult> => {
  try {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: ENTITLEMENT_ID,
      displayCloseButton: true,
    });

    return {
      purchased: result === PAYWALL_RESULT.PURCHASED,
      restored: result === PAYWALL_RESULT.RESTORED,
      cancelled: result === PAYWALL_RESULT.CANCELLED,
      notPresented: result === PAYWALL_RESULT.NOT_PRESENTED,
      error: result === PAYWALL_RESULT.ERROR,
    };
  } catch (e) {
    console.error('[Paywall] presentPaywallIfNeeded error:', e);
    return {
      purchased: false,
      restored: false,
      cancelled: false,
      notPresented: false,
      error: true,
    };
  }
};

/**
 * Present RevenueCat Customer Center - subscription management UI.
 * Use when user is Pro and wants to manage/cancel subscription.
 */
export const presentCustomerCenter = async (): Promise<void> => {
  try {
    await RevenueCatUI.presentCustomerCenter({
      callbacks: {
        onRestoreCompleted: ({ customerInfo }) => {
          console.log('[CustomerCenter] Restore completed', customerInfo);
        },
        onRestoreFailed: ({ error }) => {
          console.warn('[CustomerCenter] Restore failed', error);
        },
      },
    });
  } catch (e) {
    console.error('[CustomerCenter] presentCustomerCenter error:', e);
  }
};
