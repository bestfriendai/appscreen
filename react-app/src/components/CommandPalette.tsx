import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Download,
  Settings,
  Keyboard,
  Image,
  Palette,
  Type,
  Smartphone,
  FolderOpen,
  Trash2,
  Copy,
  Home,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'editor' | 'help';
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    setShowExportModal,
    setShowSettingsModal,
    setShowAboutModal,
    setActiveTab,
    screenshots,
    selectedIndex: screenshotIndex,
    duplicateScreenshot,
    removeScreenshot,
  } = useAppStore();

  const currentScreenshot = screenshots[screenshotIndex];

  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: 'dashboard',
        label: 'Go to Dashboard',
        description: 'View all projects',
        icon: <Home className="w-4 h-4" />,
        action: () => {
          navigate('/dashboard');
          onClose();
        },
        category: 'navigation',
      },
      {
        id: 'projects',
        label: 'Open Projects',
        description: 'Browse and switch projects',
        icon: <FolderOpen className="w-4 h-4" />,
        shortcut: '⌘P',
        action: () => {
          navigate('/dashboard');
          onClose();
        },
        category: 'navigation',
      },

      // Actions
      {
        id: 'export',
        label: 'Export Screenshot',
        description: 'Export current or all screenshots',
        icon: <Download className="w-4 h-4" />,
        shortcut: '⌘E',
        action: () => {
          setShowExportModal(true);
          onClose();
        },
        category: 'actions',
      },
      {
        id: 'duplicate',
        label: 'Duplicate Screenshot',
        description: 'Create a copy of the current screenshot',
        icon: <Copy className="w-4 h-4" />,
        shortcut: '⌘D',
        action: () => {
          if (currentScreenshot) {
            duplicateScreenshot(currentScreenshot.id);
          }
          onClose();
        },
        category: 'actions',
      },
      {
        id: 'delete',
        label: 'Delete Screenshot',
        description: 'Remove the current screenshot',
        icon: <Trash2 className="w-4 h-4" />,
        shortcut: '⌫',
        action: () => {
          if (currentScreenshot) {
            removeScreenshot(currentScreenshot.id);
          }
          onClose();
        },
        category: 'actions',
      },
      {
        id: 'settings',
        label: 'Open Settings',
        description: 'Configure API keys and preferences',
        icon: <Settings className="w-4 h-4" />,
        shortcut: '⌘,',
        action: () => {
          setShowSettingsModal(true);
          onClose();
        },
        category: 'actions',
      },

      // Editor tabs
      {
        id: 'background-tab',
        label: 'Background Settings',
        description: 'Edit background colors and gradients',
        icon: <Palette className="w-4 h-4" />,
        action: () => {
          setActiveTab('background');
          onClose();
        },
        category: 'editor',
      },
      {
        id: 'device-tab',
        label: 'Device Settings',
        description: 'Configure device frame and 3D options',
        icon: <Smartphone className="w-4 h-4" />,
        action: () => {
          setActiveTab('device');
          onClose();
        },
        category: 'editor',
      },
      {
        id: 'text-tab',
        label: 'Text Settings',
        description: 'Edit headlines and text styles',
        icon: <Type className="w-4 h-4" />,
        action: () => {
          setActiveTab('text');
          onClose();
        },
        category: 'editor',
      },

      // Help
      {
        id: 'shortcuts',
        label: 'Keyboard Shortcuts',
        description: 'View all keyboard shortcuts',
        icon: <Keyboard className="w-4 h-4" />,
        shortcut: '?',
        action: () => {
          onClose();
          // Will trigger the ? key handler
        },
        category: 'help',
      },
      {
        id: 'about',
        label: 'About AppScreen',
        description: 'Version info and features',
        icon: <HelpCircle className="w-4 h-4" />,
        action: () => {
          setShowAboutModal(true);
          onClose();
        },
        category: 'help',
      },
    ],
    [
      navigate,
      onClose,
      setShowExportModal,
      setShowSettingsModal,
      setShowAboutModal,
      setActiveTab,
      currentScreenshot,
      duplicateScreenshot,
      removeScreenshot,
    ]
  );

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    const lowerQuery = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery)
    );
  }, [commands, query]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {
      navigation: [],
      actions: [],
      editor: [],
      help: [],
    };

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = filteredCommands[selectedIndex];
        if (command) {
          command.action();
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector('[data-selected="true"]');
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    actions: 'Actions',
    editor: 'Editor',
    help: 'Help',
  };

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-xl bg-bg-secondary border border-border shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-text-secondary" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary"
              />
              <kbd className="px-2 py-1 text-xs text-text-secondary bg-bg-tertiary rounded border border-border">
                ESC
              </kbd>
            </div>

            {/* Command list */}
            <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-text-secondary">
                  <p className="text-sm">No commands found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, cmds]) => {
                  if (cmds.length === 0) return null;

                  return (
                    <div key={category} className="mb-2">
                      <div className="px-3 py-1.5 text-xs font-medium text-text-secondary uppercase tracking-wide">
                        {categoryLabels[category]}
                      </div>
                      {cmds.map((cmd) => {
                        const isSelected = globalIndex === selectedIndex;
                        const currentIndex = globalIndex++;

                        return (
                          <button
                            key={cmd.id}
                            data-selected={isSelected}
                            onClick={() => cmd.action()}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
                              ${isSelected ? 'bg-accent/10 text-text-primary' : 'text-text-secondary hover:bg-bg-tertiary'}
                            `}
                          >
                            <div
                              className={`
                              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                              ${isSelected ? 'bg-accent/20 text-accent' : 'bg-bg-tertiary'}
                            `}
                            >
                              {cmd.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{cmd.label}</p>
                              {cmd.description && (
                                <p className="text-xs text-text-secondary truncate">{cmd.description}</p>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <kbd className="px-2 py-1 text-xs text-text-secondary bg-bg-tertiary rounded border border-border">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-text-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">↵</kbd>
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">ESC</kbd>
                to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
