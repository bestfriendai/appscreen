import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Search, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { templates, type Template } from '../data/templates';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

type Category = Template['category'] | 'all';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Templates' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'dynamic', label: 'Dynamic' },
  { value: 'neon', label: 'Neon' },
  { value: 'soft', label: 'Soft' },
  { value: 'bold', label: 'Bold' },
  { value: 'nature', label: 'Nature' },
  { value: 'glass', label: 'Glass' },
  { value: '3d', label: '3D' },
];

export function TemplateGallery() {
  const navigate = useNavigate();
  const { applyTemplate } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleApplyTemplate = (template: Template) => {
    applyTemplate(template);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-text-primary">Templates</span>
              </div>
            </div>
            <Link to="/editor">
              <Button variant="secondary">
                Open Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Template Gallery</h1>
            <p className="text-text-secondary">
              {filteredTemplates.length} professional templates
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedCategory === category.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="group relative"
            >
              <button
                onClick={() => setSelectedTemplateId(
                  selectedTemplateId === template.id ? null : template.id
                )}
                className={cn(
                  'w-full aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all',
                  selectedTemplateId === template.id
                    ? 'border-accent shadow-lg shadow-accent/20 scale-[1.02]'
                    : 'border-transparent hover:border-accent/50'
                )}
                style={{ background: template.preview }}
              >
                {/* Template Preview Content */}
                <div className="h-full flex flex-col items-center justify-center p-4">
                  {/* Mock Device */}
                  <div className="w-12 h-24 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10 mb-4" />

                  {/* Mock Text */}
                  <div className="h-2 w-20 bg-white/30 rounded mb-1.5" />
                  <div className="h-1.5 w-14 bg-white/20 rounded" />
                </div>

                {/* Selected Checkmark */}
                {selectedTemplateId === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Preview</span>
                </div>
              </button>

              {/* Template Info */}
              <div className="mt-2">
                <p className="text-sm font-medium text-text-primary truncate">
                  {template.name}
                </p>
                <p className="text-xs text-text-secondary capitalize">
                  {template.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
              <Search className="w-6 h-6 text-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">No templates found</h3>
            <p className="text-text-secondary">
              Try a different search term or category
            </p>
          </div>
        )}

        {/* Apply Template Bar */}
        {selectedTemplateId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-bg-secondary/95 backdrop-blur-xl border border-border shadow-xl">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-16 rounded-lg"
                  style={{
                    background: templates.find((t) => t.id === selectedTemplateId)?.preview,
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {templates.find((t) => t.id === selectedTemplateId)?.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Click to apply this template
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  const template = templates.find((t) => t.id === selectedTemplateId);
                  if (template) handleApplyTemplate(template);
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Apply Template
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
