import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Button, Input } from '../ui';
import { geminiService } from '../../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      geminiService.configure({ apiKey: savedKey });
    }
  }, []);

  const handleSave = () => {
    setError(null);

    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    // Save to localStorage
    localStorage.setItem('gemini_api_key', apiKey);

    // Configure Gemini service
    geminiService.configure({ apiKey });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    geminiService.configure({ apiKey: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-bg-secondary border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* API Keys Section */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Keys
                </h3>

                {/* Gemini API Key */}
                <div className="space-y-2">
                  <label className="text-xs text-text-secondary">Gemini API Key</label>
                  <div className="relative">
                    <Input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="pr-10"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {showKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-2xs text-text-secondary">
                    Get your API key from{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>

                  {error && (
                    <div className="flex items-center gap-1.5 text-red-500 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {error}
                    </div>
                  )}

                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-green-500 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      API key saved successfully
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-xs text-text-secondary">
                  <strong className="text-text-primary">Privacy:</strong> Your API key is stored locally in your browser and is only used to communicate directly with Google's Gemini API. It is never sent to our servers.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear Key
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
