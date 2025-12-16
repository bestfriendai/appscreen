import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Folder,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit3,
  Clock,
  Image,
  Smartphone,
  Search,
  Grid,
  List,
  Sparkles,
  ArrowRight,
  Upload,
  Palette,
  Download,
  Keyboard,
  BookOpen,
  Zap,
} from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

type ViewMode = 'grid' | 'list';

export function Dashboard() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { projects, currentProjectId, createProject, deleteProject, switchProject } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const isInputFocused =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;

      // / to focus search
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Cmd/Ctrl + N for new project
      if (cmdOrCtrl && e.key === 'n') {
        e.preventDefault();
        setIsCreating(true);
      }

      // Cmd/Ctrl + Shift + G for grid view
      if (cmdOrCtrl && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setViewMode('grid');
      }

      // Cmd/Ctrl + Shift + L for list view
      if (cmdOrCtrl && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setViewMode('list');
      }

      // Escape to close create modal
      if (e.key === 'Escape' && isCreating) {
        setIsCreating(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreating]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setIsCreating(false);
    await createProject(newProjectName.trim());
    setNewProjectName('');
    navigate('/editor');
  };

  const handleOpenProject = async (projectId: string) => {
    await switchProject(projectId);
    navigate('/editor');
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(null);
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-text-primary">AppScreen</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Your Projects</h1>
            <p className="text-text-secondary">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <Input
                ref={searchInputRef}
                placeholder="Search projects... (press /)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Start */}
        {filteredProjects.length === 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Main CTA Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 mb-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">Get Started</span>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Create stunning App Store screenshots
                </h2>
                <p className="text-text-secondary mb-6">
                  Upload your app screenshots and let our AI help you create beautiful
                  marketing images in minutes, not hours.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            </div>

            {/* How It Works Steps */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
                How it works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    step: 1,
                    icon: Upload,
                    title: 'Upload Screenshots',
                    description: 'Drag & drop your app screenshots or import from device',
                  },
                  {
                    step: 2,
                    icon: Palette,
                    title: 'Customize Design',
                    description: 'Add backgrounds, text, and choose device frames',
                  },
                  {
                    step: 3,
                    icon: Download,
                    title: 'Export Images',
                    description: 'Download in App Store ready format (PNG or ZIP)',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.step * 0.1 }}
                    className="p-5 rounded-xl bg-bg-secondary border border-border hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-xs font-medium flex items-center justify-center">
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">{item.title}</h4>
                        <p className="text-sm text-text-secondary">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsCreating(true)}
                className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-accent/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1 flex items-center gap-2">
                      Quick Start with AI
                      <span className="px-1.5 py-0.5 text-2xs bg-accent/20 text-accent rounded">New</span>
                    </h4>
                    <p className="text-sm text-text-secondary">Let AI design your screenshots automatically</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                </div>
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-xl bg-bg-secondary border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center">
                    <Keyboard className="w-6 h-6 text-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">Keyboard Shortcuts</h4>
                    <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">⌘N</kbd> New
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">/</kbd> Search
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">?</kbd> Help
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Projects Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* New Project Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsCreating(true)}
              className="aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-accent/50 flex flex-col items-center justify-center gap-3 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-secondary group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
              </div>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                New Project
              </span>
            </motion.button>

            {/* Project Cards */}
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <button
                  onClick={() => handleOpenProject(project.id)}
                  className={cn(
                    'w-full aspect-[4/3] rounded-xl border overflow-hidden transition-all',
                    project.id === currentProjectId
                      ? 'border-accent shadow-lg shadow-accent/20'
                      : 'border-border hover:border-accent/50'
                  )}
                >
                  {/* Preview */}
                  <div className="h-full bg-bg-secondary flex items-center justify-center">
                    {project.screenshotCount > 0 ? (
                      <div className="flex flex-col items-center gap-2 text-text-secondary">
                        <div className="flex gap-1">
                          {[...Array(Math.min(3, project.screenshotCount))].map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-16 bg-bg-tertiary rounded-md"
                            />
                          ))}
                        </div>
                        <span className="text-xs">{project.screenshotCount} screenshots</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-secondary">
                        <Folder className="w-8 h-8" />
                        <span className="text-xs">No screenshots</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-bg-primary/95 to-transparent">
                    <p className="text-sm font-medium text-text-primary truncate text-left">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {project.screenshotCount}
                      </span>
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(project.updatedAt)}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Menu Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === project.id ? null : project.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-secondary transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {menuOpenId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-10 right-0 w-40 rounded-lg bg-bg-secondary border border-border shadow-lg overflow-hidden z-10"
                      >
                        <button className="w-full px-3 py-2 text-sm text-left text-text-primary hover:bg-bg-tertiary flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          Rename
                        </button>
                        <button className="w-full px-3 py-2 text-sm text-left text-text-primary hover:bg-bg-tertiary flex items-center gap-2">
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-bg-tertiary flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredProjects.map((project, index) => (
              <motion.button
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleOpenProject(project.id)}
                className={cn(
                  'w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left',
                  project.id === currentProjectId
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50 hover:bg-bg-secondary/50'
                )}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Folder className="w-5 h-5 text-text-secondary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{project.name}</p>
                  <p className="text-sm text-text-secondary">
                    {project.screenshotCount} screenshot
                    {project.screenshotCount !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDate(project.updatedAt)}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && searchQuery && (
          <div className="py-12 text-center">
            <p className="text-text-secondary">No projects found for "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-bg-secondary border border-border p-6"
            >
              <h2 className="text-xl font-bold text-text-primary mb-4">Create New Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1.5 block">
                    Project Name
                  </label>
                  <Input
                    placeholder="My Awesome App"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim()}
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
