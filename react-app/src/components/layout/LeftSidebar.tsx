import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Copy,
  ImageIcon,
  Wand2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Upload,
} from 'lucide-react';
import { Button } from '../ui';
import { MagicDesignPanel } from '../sidebar/MagicDesignPanel';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function LeftSidebar() {
  const {
    screenshots,
    selectedIndex,
    currentLanguage,
    addScreenshots,
    removeScreenshot,
    selectScreenshot,
    duplicateScreenshot,
    reorderScreenshots,
  } = useAppStore();

  const [showMagicDesign, setShowMagicDesign] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await addScreenshots(Array.from(files));
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [addScreenshots]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await addScreenshots(Array.from(files));
      }
    },
    [addScreenshots]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  // Get image for screenshot based on current language
  const getScreenshotImage = (screenshot: typeof screenshots[0]) => {
    const localizedImage =
      screenshot.localizedImages[currentLanguage] ||
      screenshot.localizedImages['en'] ||
      Object.values(screenshot.localizedImages)[0];
    return localizedImage?.dataUrl;
  };

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Screenshots
          </span>
          <span className="text-xs text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded-full">
            {screenshots.length}
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="default"
          className="w-full h-9"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Screenshots
        </Button>
      </div>

      {/* Screenshot list */}
      <div
        className={cn(
          'flex-1 overflow-y-auto p-2 scrollbar-thin transition-colors',
          isDraggingOver && 'bg-accent/5'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {screenshots.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all',
              isDraggingOver
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-accent/50'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              animate={{ scale: isDraggingOver ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="h-12 w-12 text-text-secondary mb-3 opacity-50" />
            </motion.div>
            <p className="text-sm text-text-secondary font-medium">
              {isDraggingOver ? 'Drop to upload' : 'Drop screenshots here'}
            </p>
            <p className="text-xs text-text-secondary mt-1 opacity-70">
              or click to browse
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {screenshots.map((screenshot, index) => {
                const imageUrl = getScreenshotImage(screenshot);
                const isSelected = index === selectedIndex;

                return (
                  <motion.div
                    key={screenshot.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'group relative flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all',
                      isSelected
                        ? 'bg-accent/10 ring-1 ring-accent/30'
                        : 'hover:bg-bg-tertiary'
                    )}
                    onClick={() => selectScreenshot(index)}
                    draggable
                    onDragStart={() => setDraggedIndex(index)}
                    onDragEnd={() => setDraggedIndex(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (draggedIndex !== null && draggedIndex !== index) {
                        reorderScreenshots(draggedIndex, index);
                        setDraggedIndex(index);
                      }
                    }}
                  >
                    {/* Drag handle */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4 text-text-secondary" />
                    </div>

                    {/* Thumbnail */}
                    <div className={cn(
                      'relative w-14 aspect-[9/19.5] rounded-md overflow-hidden flex-shrink-0 border',
                      isSelected ? 'border-accent' : 'border-border'
                    )}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={screenshot.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-text-secondary opacity-50" />
                        </div>
                      )}

                      {/* Index badge */}
                      <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded bg-black/70 flex items-center justify-center">
                        <span className="text-2xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">
                        Screen {index + 1}
                      </p>
                      <p className="text-2xs text-text-secondary truncate">
                        {screenshot.filename}
                      </p>
                      {Object.keys(screenshot.localizedImages).length > 1 && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex -space-x-1">
                            {Object.keys(screenshot.localizedImages).slice(0, 3).map((lang) => (
                              <span
                                key={lang}
                                className="w-4 h-4 rounded-full bg-bg-tertiary border border-bg-secondary flex items-center justify-center text-2xs uppercase"
                              >
                                {lang.slice(0, 2)}
                              </span>
                            ))}
                          </div>
                          {Object.keys(screenshot.localizedImages).length > 3 && (
                            <span className="text-2xs text-text-secondary">
                              +{Object.keys(screenshot.localizedImages).length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateScreenshot(screenshot.id);
                        }}
                        title="Duplicate"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScreenshot(screenshot.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Drop zone at bottom */}
            <div
              className={cn(
                'mt-2 p-3 border-2 border-dashed rounded-lg text-center transition-all cursor-pointer',
                isDraggingOver
                  ? 'border-accent bg-accent/10'
                  : 'border-border/50 hover:border-border'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="h-4 w-4 mx-auto text-text-secondary opacity-50 mb-1" />
              <p className="text-2xs text-text-secondary">Add more</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with quick actions */}
      {screenshots.length > 0 && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span className="font-medium">
              <span className="text-text-primary">{selectedIndex + 1}</span>
              <span className="mx-1">/</span>
              <span>{screenshots.length}</span>
            </span>
            <button
              className="text-red-500 hover:text-red-400 transition-colors text-xs"
              onClick={() => {
                const screenshot = screenshots[selectedIndex];
                if (screenshot) {
                  removeScreenshot(screenshot.id);
                }
              }}
            >
              Remove selected
            </button>
          </div>
        </div>
      )}

      {/* Magic Design Panel Toggle */}
      <div className="border-t border-border">
        <button
          onClick={() => setShowMagicDesign(!showMagicDesign)}
          className="w-full p-3 flex items-center justify-between text-sm font-medium text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Wand2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span>Magic Design</span>
            <span className="text-2xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded font-medium">
              AI
            </span>
          </div>
          {showMagicDesign ? (
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          ) : (
            <ChevronUp className="w-4 h-4 text-text-secondary" />
          )}
        </button>
        <AnimatePresence>
          {showMagicDesign && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <MagicDesignPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
