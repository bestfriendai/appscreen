import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Globe,
  Plus,
  Trash2,
  Check,
  Search,
  Languages,
} from 'lucide-react';
import { Button, Input } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import { LANGUAGES, type LanguageCode } from '../../types';
import { cn } from '../../lib/utils';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const {
    currentLanguage,
    projectLanguages,
    setCurrentLanguage,
    addProjectLanguage,
    removeProjectLanguage,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLanguage, setShowAddLanguage] = useState(false);

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      !projectLanguages.includes(lang.code) &&
      (lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddLanguage = (code: LanguageCode) => {
    addProjectLanguage(code);
    setSearchQuery('');
    setShowAddLanguage(false);
  };

  const handleRemoveLanguage = (code: LanguageCode) => {
    if (projectLanguages.length > 1) {
      removeProjectLanguage(code);
    }
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
            className="w-full max-w-md rounded-2xl bg-bg-secondary border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Languages className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Languages</h2>
                  <p className="text-xs text-text-secondary">
                    Manage project languages
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Current Language */}
              <div>
                <label className="text-xs text-text-secondary font-medium mb-2 block">
                  Current Language
                </label>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {LANGUAGES.find((l) => l.code === currentLanguage)?.name}
                      </p>
                      <p className="text-2xs text-text-secondary">
                        {LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Languages */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-secondary font-medium">
                    Project Languages ({projectLanguages.length})
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddLanguage(!showAddLanguage)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </div>

                {/* Add Language Panel */}
                <AnimatePresence>
                  {showAddLanguage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-3 p-3 rounded-lg bg-bg-tertiary border border-border">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search languages..."
                            className="pl-9"
                          />
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => handleAddLanguage(lang.code)}
                                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-bg-secondary transition-colors text-left"
                              >
                                <span className="text-xs text-text-secondary uppercase w-8">
                                  {lang.code}
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm text-text-primary">{lang.name}</p>
                                  <p className="text-2xs text-text-secondary">
                                    {lang.nativeName}
                                  </p>
                                </div>
                                <Plus className="w-4 h-4 text-accent" />
                              </button>
                            ))
                          ) : (
                            <p className="text-xs text-text-secondary text-center py-4">
                              No languages found
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Language List */}
                <div className="space-y-2">
                  {projectLanguages.map((code) => {
                    const lang = LANGUAGES.find((l) => l.code === code);
                    const isActive = code === currentLanguage;

                    return (
                      <div
                        key={code}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer',
                          isActive
                            ? 'border-accent/30 bg-accent/5'
                            : 'border-border hover:border-accent/20'
                        )}
                        onClick={() => setCurrentLanguage(code)}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold uppercase',
                            isActive
                              ? 'bg-accent text-white'
                              : 'bg-bg-tertiary text-text-secondary'
                          )}
                        >
                          {code.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">
                            {lang?.name || code}
                          </p>
                          <p className="text-2xs text-text-secondary">
                            {lang?.nativeName || code}
                          </p>
                        </div>
                        {isActive && (
                          <Check className="w-4 h-4 text-accent" />
                        )}
                        {projectLanguages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLanguage(code);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-xs text-text-secondary">
                  <strong className="text-text-primary">Tip:</strong> Add multiple languages to create localized App Store screenshots. You can upload different screenshots and text for each language.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
