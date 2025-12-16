import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

interface KeyboardShortcutsOptions {
  enabled?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const { enabled = true } = options;

  const {
    screenshots,
    selectedIndex,
    selectScreenshot,
    removeScreenshot,
    duplicateScreenshot,
    setShowExportModal,
    setShowSettingsModal,
    setShowAboutModal,
    setPreviewScale,
    previewScale,
  } = useAppStore();

  const currentScreenshot = screenshots[selectedIndex];

  // Navigation
  const selectPrevious = useCallback(() => {
    if (selectedIndex > 0) {
      selectScreenshot(selectedIndex - 1);
    }
  }, [selectedIndex, selectScreenshot]);

  const selectNext = useCallback(() => {
    if (selectedIndex < screenshots.length - 1) {
      selectScreenshot(selectedIndex + 1);
    }
  }, [selectedIndex, screenshots.length, selectScreenshot]);

  // Zoom
  const zoomIn = useCallback(() => {
    setPreviewScale(Math.min(previewScale + 0.1, 2));
  }, [previewScale, setPreviewScale]);

  const zoomOut = useCallback(() => {
    setPreviewScale(Math.max(previewScale - 0.1, 0.25));
  }, [previewScale, setPreviewScale]);

  const resetZoom = useCallback(() => {
    setPreviewScale(1);
  }, [setPreviewScale]);

  const fitToScreen = useCallback(() => {
    // Will be calculated based on canvas size
    setPreviewScale(1);
  }, [setPreviewScale]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const isInputFocused =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.hasAttribute('contenteditable');

      // Don't trigger shortcuts when typing in inputs
      if (isInputFocused && !cmdOrCtrl) return;

      // Command/Ctrl + Z: Undo
      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        options.onUndo?.();
      }

      // Command/Ctrl + Shift + Z: Redo
      if (cmdOrCtrl && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        options.onRedo?.();
      }

      // Command/Ctrl + E: Export current
      if (cmdOrCtrl && e.key === 'e' && !e.shiftKey) {
        e.preventDefault();
        setShowExportModal(true);
      }

      // Command/Ctrl + Shift + E: Export all
      if (cmdOrCtrl && e.key === 'e' && e.shiftKey) {
        e.preventDefault();
        setShowExportModal(true);
      }

      // Command/Ctrl + D: Duplicate
      if (cmdOrCtrl && e.key === 'd') {
        e.preventDefault();
        if (currentScreenshot) {
          duplicateScreenshot(currentScreenshot.id);
        }
      }

      // Command/Ctrl + ,: Settings
      if (cmdOrCtrl && e.key === ',') {
        e.preventDefault();
        setShowSettingsModal(true);
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowExportModal(false);
        setShowSettingsModal(false);
        setShowAboutModal(false);
      }

      // Delete/Backspace: Remove screenshot (when not in input)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputFocused) {
        e.preventDefault();
        if (currentScreenshot && screenshots.length > 0) {
          removeScreenshot(currentScreenshot.id);
        }
      }

      // Arrow keys for navigation
      if (!cmdOrCtrl && !isInputFocused) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          selectPrevious();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          selectNext();
        }
      }

      // Zoom shortcuts
      if (cmdOrCtrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
      }
      if (cmdOrCtrl && e.key === '-') {
        e.preventDefault();
        zoomOut();
      }
      if (cmdOrCtrl && e.key === '0') {
        e.preventDefault();
        fitToScreen();
      }
      if (cmdOrCtrl && e.key === '1') {
        e.preventDefault();
        resetZoom();
      }

      // Question mark for help
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        setShowAboutModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    currentScreenshot,
    screenshots.length,
    selectedIndex,
    previewScale,
    options,
    selectPrevious,
    selectNext,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    duplicateScreenshot,
    removeScreenshot,
    setShowExportModal,
    setShowSettingsModal,
    setShowAboutModal,
  ]);

  return {
    selectPrevious,
    selectNext,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
  };
}

// Keyboard shortcut configuration for display
export const KEYBOARD_SHORTCUTS = [
  {
    category: 'General',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['⌘', ','], description: 'Open settings' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal' },
    ],
  },
  {
    category: 'Editor',
    shortcuts: [
      { keys: ['⌘', 'Z'], description: 'Undo' },
      { keys: ['⌘', '⇧', 'Z'], description: 'Redo' },
      { keys: ['⌘', 'E'], description: 'Export current' },
      { keys: ['⌘', '⇧', 'E'], description: 'Export all' },
      { keys: ['⌘', 'D'], description: 'Duplicate screenshot' },
      { keys: ['Delete'], description: 'Remove screenshot' },
    ],
  },
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['←'], description: 'Previous screenshot' },
      { keys: ['→'], description: 'Next screenshot' },
      { keys: ['⌘', '+'], description: 'Zoom in' },
      { keys: ['⌘', '-'], description: 'Zoom out' },
      { keys: ['⌘', '0'], description: 'Fit to screen' },
      { keys: ['⌘', '1'], description: 'Reset zoom (100%)' },
    ],
  },
];
