import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl bg-bg-secondary border border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Keyboard Shortcuts</h2>
                  <p className="text-sm text-text-secondary">Navigate faster with shortcuts</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {KEYBOARD_SHORTCUTS.map((category) => (
                <div key={category.category}>
                  <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bg-tertiary transition-colors"
                      >
                        <span className="text-sm text-text-primary">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <kbd
                              key={keyIndex}
                              className="min-w-[24px] h-6 px-2 flex items-center justify-center text-xs font-medium text-text-primary bg-bg-primary border border-border rounded shadow-sm"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-bg-tertiary/50">
              <p className="text-xs text-text-secondary text-center">
                Press <kbd className="px-1.5 py-0.5 mx-1 text-xs bg-bg-primary border border-border rounded">?</kbd> to show this modal anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
