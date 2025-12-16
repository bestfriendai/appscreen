import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, LeftSidebar, RightSidebar } from '../components/layout';
import { CanvasPreview } from '../components/canvas/CanvasPreview';
import { SettingsModal, ExportModal, LanguageModal, AboutModal } from '../components/modals';
import { CommandPalette } from '../components/CommandPalette';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { useAppStore } from '../store/useAppStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { geminiService } from '../services/geminiService';

export function EditorPage() {
  const navigate = useNavigate();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const {
    currentProjectId,
    isLoading,
    showSettingsModal,
    setShowSettingsModal,
    showExportModal,
    setShowExportModal,
    showLanguageModal,
    setShowLanguageModal,
    showAboutModal,
    setShowAboutModal,
  } = useAppStore();

  // Undo/Redo handlers (placeholder - would connect to history state)
  const handleUndo = useCallback(() => {
    console.log('Undo action');
    // TODO: Implement undo when history state is added
  }, []);

  const handleRedo = useCallback(() => {
    console.log('Redo action');
    // TODO: Implement redo when history state is added
  }, []);

  // Use keyboard shortcuts
  useKeyboardShortcuts({
    enabled: !showSettingsModal && !showExportModal && !showLanguageModal && !showAboutModal && !showCommandPalette,
    onUndo: handleUndo,
    onRedo: handleRedo,
  });

  // Command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Command/Ctrl + K: Open command palette
      if (cmdOrCtrl && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Question mark: Show keyboard shortcuts
      if (e.key === '?' && !e.shiftKey) {
        const isInputFocused =
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement;
        if (!isInputFocused) {
          e.preventDefault();
          setShowKeyboardShortcuts(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Gemini service with saved API key
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      geminiService.configure({ apiKey: savedKey });
    }
  }, []);

  useEffect(() => {
    // Redirect to dashboard if no project is selected
    if (!isLoading && !currentProjectId) {
      navigate('/dashboard');
    }
  }, [currentProjectId, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg-primary">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <CanvasPreview />
        <RightSidebar />
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}
