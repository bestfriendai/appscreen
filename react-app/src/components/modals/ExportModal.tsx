import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Image as ImageIcon,
  FileArchive,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import { OUTPUT_DEVICES, LANGUAGES } from '../../types';
import { cn } from '../../lib/utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportScope = 'current' | 'all' | 'selected';
type ExportFormat = 'png' | 'jpg';
type LanguageScope = 'current' | 'all';

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const {
    screenshots,
    outputDevice,
    currentLanguage,
    projectLanguages,
  } = useAppStore();

  const [exportScope, setExportScope] = useState<ExportScope>('all');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [languageScope, setLanguageScope] = useState<LanguageScope>('current');
  const [includeIndex, setIncludeIndex] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const deviceConfig = OUTPUT_DEVICES[outputDevice];
  const currentLanguageName = LANGUAGES.find((l) => l.code === currentLanguage)?.name || currentLanguage;

  const getExportCount = () => {
    const screenshotCount =
      exportScope === 'current' ? 1 : exportScope === 'all' ? screenshots.length : screenshots.length;
    const languageCount = languageScope === 'all' ? projectLanguages.length : 1;
    return screenshotCount * languageCount;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const totalSteps = getExportCount();
      for (let i = 0; i < totalSteps; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setExportProgress(((i + 1) / totalSteps) * 100);
      }

      // In a real implementation, this would:
      // 1. Render each screenshot to canvas
      // 2. Export as blob
      // 3. Create a ZIP if multiple files
      // 4. Trigger download

      // For now, just show success
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
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
            className="w-full max-w-lg rounded-2xl bg-bg-secondary border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Export</h2>
                  <p className="text-xs text-text-secondary">
                    {deviceConfig.width} × {deviceConfig.height} pixels
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
            <div className="p-4 space-y-6">
              {/* Export Scope */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  What to export
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'current', label: 'Current', icon: ImageIcon },
                    { value: 'all', label: 'All', icon: FileArchive },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setExportScope(option.value as ExportScope)}
                      className={cn(
                        'p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors',
                        exportScope === option.value
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      )}
                    >
                      <option.icon
                        className={cn(
                          'w-5 h-5',
                          exportScope === option.value ? 'text-accent' : 'text-text-secondary'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm',
                          exportScope === option.value ? 'text-accent' : 'text-text-secondary'
                        )}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Scope */}
              {projectLanguages.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Languages
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLanguageScope('current')}
                      className={cn(
                        'p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors',
                        languageScope === 'current'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      )}
                    >
                      <Globe
                        className={cn(
                          'w-4 h-4',
                          languageScope === 'current' ? 'text-accent' : 'text-text-secondary'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm',
                          languageScope === 'current' ? 'text-accent' : 'text-text-secondary'
                        )}
                      >
                        {currentLanguageName}
                      </span>
                    </button>
                    <button
                      onClick={() => setLanguageScope('all')}
                      className={cn(
                        'p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors',
                        languageScope === 'all'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      )}
                    >
                      <Globe
                        className={cn(
                          'w-4 h-4',
                          languageScope === 'all' ? 'text-accent' : 'text-text-secondary'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm',
                          languageScope === 'all' ? 'text-accent' : 'text-text-secondary'
                        )}
                      >
                        All ({projectLanguages.length})
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Format */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Format
                </label>
                <div className="flex gap-2">
                  {(['png', 'jpg'] as ExportFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors uppercase',
                        exportFormat === format
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-text-secondary hover:border-accent/50'
                      )}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-secondary">Include index in filename</span>
                <button
                  onClick={() => setIncludeIndex(!includeIndex)}
                  className={cn(
                    'w-9 h-5 rounded-full transition-colors relative',
                    includeIndex ? 'bg-accent' : 'bg-bg-tertiary'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                      includeIndex ? 'left-4' : 'left-0.5'
                    )}
                  />
                </button>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-lg bg-bg-tertiary">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Files to export:</span>
                  <span className="font-medium text-text-primary">{getExportCount()}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-text-secondary">Estimated size:</span>
                  <span className="font-medium text-text-primary">
                    ~{Math.round(getExportCount() * (exportFormat === 'png' ? 2.5 : 1.2))} MB
                  </span>
                </div>
              </div>

              {/* Progress */}
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Exporting...
                    </span>
                    <span className="text-accent">{Math.round(exportProgress)}%</span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <Button variant="secondary" onClick={onClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting || screenshots.length === 0}>
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export {getExportCount() > 1 ? 'All' : ''}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
