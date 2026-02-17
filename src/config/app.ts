/**
 * App-level config.
 * force_update: true – Store’da yangi versiya bo‘lsa, yangilash dialogini ko‘rsatish.
 * androidVersionUrl – Android uchun store versiyasini qaytaradigan backend URL (ixtiyoriy).
 *   Masalan: { "version": "2.0.1" }. Bo‘lmasa iOS’da iTunes, Android’da tekshiruv o‘tkazilmaydi.
 */
export const APP_CONFIG = {
  force_update: true,
  /** Android: backend endpoint that returns { version: "2.0.1" }. iOS uses iTunes Lookup. */
  androidVersionUrl: undefined as string | undefined,
} as const;
