/**
 * IndexedDB Storage Utilities
 * Replaces localStorage to avoid quota exceeded errors
 */

import { logger } from './logger';

const DB_NAME = 'screengenius-storage';
const DB_VERSION = 1;

const STORE_NAMES = {
  PROJECTS: 'projects',
  BACKGROUNDS: 'backgrounds',
  CACHE: 'cache'
} as const;

let dbInstance: IDBDatabase | null = null;

/**
 * Open or create the IndexedDB database
 */
async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      logger.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_NAMES.PROJECTS)) {
        db.createObjectStore(STORE_NAMES.PROJECTS);
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.BACKGROUNDS)) {
        db.createObjectStore(STORE_NAMES.BACKGROUNDS);
      }
      if (!db.objectStoreNames.contains(STORE_NAMES.CACHE)) {
        db.createObjectStore(STORE_NAMES.CACHE);
      }

      logger.info('IndexedDB stores created successfully');
    };
  });
}

/**
 * Save data to IndexedDB
 */
export async function saveToIndexedDB<T>(
  store: keyof typeof STORE_NAMES,
  key: string,
  data: T
): Promise<void> {
  try {
    const db = await openDB();
    const storeName = STORE_NAMES[store];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    logger.error('Failed to save to IndexedDB:', error);
    throw error;
  }
}

/**
 * Load data from IndexedDB
 */
export async function loadFromIndexedDB<T>(
  store: keyof typeof STORE_NAMES,
  key: string
): Promise<T | null> {
  try {
    const db = await openDB();
    const storeName = STORE_NAMES[store];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    logger.error('Failed to load from IndexedDB:', error);
    return null;
  }
}

/**
 * Delete data from IndexedDB
 */
export async function deleteFromIndexedDB(
  store: keyof typeof STORE_NAMES,
  key: string
): Promise<void> {
  try {
    const db = await openDB();
    const storeName = STORE_NAMES[store];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    logger.error('Failed to delete from IndexedDB:', error);
    throw error;
  }
}

/**
 * Clear all data from a store
 */
export async function clearIndexedDBStore(
  store: keyof typeof STORE_NAMES
): Promise<void> {
  try {
    const db = await openDB();
    const storeName = STORE_NAMES[store];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    logger.error('Failed to clear IndexedDB store:', error);
    throw error;
  }
}

/**
 * Get all keys from a store
 */
export async function getAllKeysFromIndexedDB(
  store: keyof typeof STORE_NAMES
): Promise<string[]> {
  try {
    const db = await openDB();
    const storeName = STORE_NAMES[store];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAllKeys();

      request.onsuccess = () => resolve(request.result.map(String));
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    logger.error('Failed to get keys from IndexedDB:', error);
    return [];
  }
}

/**
 * Compress data before saving (simple JSON stringification)
 */
export function compressData<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    logger.error('Failed to compress data:', error);
    throw error;
  }
}

/**
 * Decompress data after loading
 */
export function decompressData<T>(data: string): T {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error('Failed to decompress data:', error);
    throw error;
  }
}

/**
 * Auto-save with compression
 */
export async function autoSaveProject(projectData: any): Promise<void> {
  try {
    const compressed = compressData(projectData);
    await saveToIndexedDB('PROJECTS', 'autosave', compressed);
    logger.info('Project auto-saved successfully');
  } catch (error) {
    logger.error('Auto-save failed, attempting to clear cache:', error);

    // Fallback: clear cache and retry
    try {
      await clearIndexedDBStore('CACHE');
      const compressed = compressData(projectData);
      await saveToIndexedDB('PROJECTS', 'autosave', compressed);
      logger.info('Project auto-saved successfully after clearing cache');
    } catch (retryError) {
      logger.error('Auto-save failed even after clearing cache:', retryError);
      throw retryError;
    }
  }
}

/**
 * Load auto-saved project
 */
export async function loadAutoSavedProject(): Promise<any | null> {
  try {
    const compressed = await loadFromIndexedDB<string>('PROJECTS', 'autosave');
    if (!compressed) return null;

    return decompressData(compressed);
  } catch (error) {
    logger.error('Failed to load auto-saved project:', error);
    return null;
  }
}

/**
 * Check if auto-save exists
 */
export async function hasAutoSave(): Promise<boolean> {
  try {
    const data = await loadFromIndexedDB('PROJECTS', 'autosave');
    return data !== null;
  } catch (error) {
    logger.error('Failed to check auto-save:', error);
    return false;
  }
}

/**
 * Background cache management
 */
export interface BackgroundCacheEntry {
  prompt: string;
  imageData: string;
  timestamp: number;
}

/**
 * Cache generated background
 */
export async function cacheBackground(prompt: string, imageData: string): Promise<void> {
  const cacheKey = hashPrompt(prompt);
  const entry: BackgroundCacheEntry = {
    prompt,
    imageData,
    timestamp: Date.now()
  };

  await saveToIndexedDB('BACKGROUNDS', cacheKey, entry);
  logger.info('Background cached:', cacheKey);
}

/**
 * Get cached background
 */
export async function getCachedBackground(prompt: string): Promise<string | null> {
  const cacheKey = hashPrompt(prompt);
  const entry = await loadFromIndexedDB<BackgroundCacheEntry>('BACKGROUNDS', cacheKey);

  if (!entry) return null;

  // Check if cache is still valid (30 days)
  const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
  if (Date.now() - entry.timestamp > MAX_AGE) {
    await deleteFromIndexedDB('BACKGROUNDS', cacheKey);
    return null;
  }

  logger.info('Background loaded from cache:', cacheKey);
  return entry.imageData;
}

/**
 * Simple hash function for prompts
 */
function hashPrompt(prompt: string): string {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `bg_${Math.abs(hash).toString(36)}`;
}
