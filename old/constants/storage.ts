/**
 * LocalStorage keys used throughout the application
 */

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding-completed',
  AUTO_SAVE: 'screengenius-autosave',
  SAVE_HISTORY: 'screengenius-save-history',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
