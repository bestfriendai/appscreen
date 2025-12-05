/**
 * Storage utilities - migrated from localStorage to IndexedDB
 * to avoid quota exceeded errors
 */

import { ProjectData } from './exportUtils';
import {
  autoSaveProject as autoSaveToIndexedDB,
  loadAutoSavedProject as loadAutoSavedFromIndexedDB,
  hasAutoSave as hasAutoSaveIndexedDB,
  saveToIndexedDB,
  loadFromIndexedDB,
  getAllKeysFromIndexedDB,
  deleteFromIndexedDB
} from './indexedDBStorage';
import { logger } from './logger';

const AUTO_SAVE_KEY = 'autosave';
const SAVE_HISTORY_PREFIX = 'history_';
const MAX_HISTORY_ITEMS = 5;

/**
 * Auto-save project using IndexedDB
 */
export async function autoSaveProject(data: ProjectData): Promise<void> {
  try {
    await autoSaveToIndexedDB(data);

    // Also add to history
    await addToHistory(data);
    logger.info('Project auto-saved successfully');
  } catch (error) {
    logger.error('Failed to auto-save project:', error);
  }
}

/**
 * Load auto-saved project from IndexedDB
 */
export async function loadAutoSavedProject(): Promise<ProjectData | null> {
  try {
    return await loadAutoSavedFromIndexedDB();
  } catch (error) {
    logger.error('Failed to load auto-saved project:', error);
    return null;
  }
}

/**
 * Clear auto-saved project
 */
export async function clearAutoSave(): Promise<void> {
  try {
    await deleteFromIndexedDB('PROJECTS', AUTO_SAVE_KEY);
    logger.info('Auto-save cleared');
  } catch (error) {
    logger.error('Failed to clear auto-save:', error);
  }
}

/**
 * Check if there's an auto-saved project
 */
export async function hasAutoSave(): Promise<boolean> {
  try {
    return await hasAutoSaveIndexedDB();
  } catch (error) {
    logger.error('Failed to check auto-save:', error);
    return false;
  }
}

/**
 * Add project to history (keep last 5)
 */
async function addToHistory(data: ProjectData): Promise<void> {
  try {
    // Get existing history
    const history = await getSaveHistory();

    // Add new save to beginning with timestamp
    const historyItem = {
      ...data,
      timestamp: Date.now()
    };
    history.unshift(historyItem);

    // Keep only last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    // Save each history item
    for (let i = 0; i < trimmedHistory.length; i++) {
      await saveToIndexedDB('PROJECTS', `${SAVE_HISTORY_PREFIX}${i}`, trimmedHistory[i]);
    }

    // Remove old items if we reduced the history size
    if (trimmedHistory.length < history.length) {
      for (let i = trimmedHistory.length; i < history.length; i++) {
        await deleteFromIndexedDB('PROJECTS', `${SAVE_HISTORY_PREFIX}${i}`);
      }
    }

    logger.info('Added to history, total items:', trimmedHistory.length);
  } catch (error) {
    logger.error('Failed to add to history:', error);
  }
}

/**
 * Get save history
 */
export async function getSaveHistory(): Promise<ProjectData[]> {
  try {
    const history: ProjectData[] = [];

    for (let i = 0; i < MAX_HISTORY_ITEMS; i++) {
      const item = await loadFromIndexedDB<ProjectData>('PROJECTS', `${SAVE_HISTORY_PREFIX}${i}`);
      if (item) {
        history.push(item);
      }
    }

    return history;
  } catch (error) {
    logger.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Load project from history by index
 */
export async function loadFromHistory(index: number): Promise<ProjectData | null> {
  try {
    return await loadFromIndexedDB<ProjectData>('PROJECTS', `${SAVE_HISTORY_PREFIX}${index}`);
  } catch (error) {
    logger.error('Failed to load from history:', error);
    return null;
  }
}

/**
 * Get storage usage estimate
 */
export async function getStorageUsage(): Promise<{ used: number; available: number } | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
      };
    } catch (error) {
      logger.error('Failed to get storage estimate:', error);
      return null;
    }
  }
  return null;
}

/**
 * Migrate old localStorage data to IndexedDB (one-time migration)
 */
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    // Check if we already migrated
    const migrationFlag = localStorage.getItem('screengenius-migrated-to-indexeddb');
    if (migrationFlag === 'true') {
      logger.info('Already migrated to IndexedDB');
      return;
    }

    logger.info('Starting migration from localStorage to IndexedDB...');

    // Migrate auto-save
    const autoSaveData = localStorage.getItem('screengenius-autosave');
    if (autoSaveData) {
      const projectData = JSON.parse(autoSaveData) as ProjectData;
      await autoSaveToIndexedDB(projectData);
      logger.info('Migrated auto-save data');
    }

    // Migrate history
    const historyData = localStorage.getItem('screengenius-history');
    if (historyData) {
      const history = JSON.parse(historyData) as ProjectData[];
      for (let i = 0; i < Math.min(history.length, MAX_HISTORY_ITEMS); i++) {
        await saveToIndexedDB('PROJECTS', `${SAVE_HISTORY_PREFIX}${i}`, history[i]);
      }
      logger.info('Migrated history data:', history.length, 'items');
    }

    // Set migration flag
    localStorage.setItem('screengenius-migrated-to-indexeddb', 'true');

    // Clear old data (optional - can keep as backup)
    // localStorage.removeItem('screengenius-autosave');
    // localStorage.removeItem('screengenius-history');

    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
  }
}

// Run migration on module load (once)
if (typeof window !== 'undefined') {
  migrateFromLocalStorage().catch(err =>
    logger.error('Auto-migration failed:', err)
  );
}
