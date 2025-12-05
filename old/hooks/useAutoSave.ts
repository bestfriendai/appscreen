import { useEffect, useState, useCallback } from 'react';
import { ProjectData } from '../utils/exportUtils';
import { autoSaveProject } from '../utils/storageUtils';
import { AUTO_SAVE_DEBOUNCE_MS, AUTO_SAVE_PERIODIC_MS } from '../constants/timing';
import { logger } from '../utils/logger';

/**
 * Auto-save hook with debouncing
 * Saves after debounce period of inactivity + periodic backup
 */
export const useAutoSave = (
  data: ProjectData | null,
  enabled: boolean = true
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced save function (now async for IndexedDB)
  const saveNow = useCallback(async () => {
    if (!data || !enabled) return;

    setIsSaving(true);
    try {
      await autoSaveProject(data);
      setLastSaved(new Date());
      logger.info('Auto-save completed');
    } catch (error) {
      logger.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [data, enabled]);

  // Debounced save on changes
  useEffect(() => {
    if (!data || !enabled || data.slides.length === 0) return;

    const timeoutId = setTimeout(() => {
      saveNow();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [data, enabled, saveNow]);

  // Periodic backup
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (data && data.slides.length > 0) {
        saveNow();
      }
    }, AUTO_SAVE_PERIODIC_MS);

    return () => clearInterval(interval);
  }, [data, enabled, saveNow]);

  return {
    lastSaved,
    isSaving,
    saveNow,
  };
};
