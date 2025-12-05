import React, { useState, useEffect } from 'react';
import { X, Type, Palette, Layout as LayoutIcon, Award, Star, Shield, Download, Zap, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import Button from './Button';
import LayoutPicker from './LayoutPicker';
import { GeneratedSlide, LayoutType, Widget } from '../types';

interface SlideEditorProps {
  slide: GeneratedSlide;
  onSave: (updates: Partial<GeneratedSlide>) => void;
  onClose: () => void;
}

const WIDGET_TYPES = [
  { value: 'rating', label: 'Rating', icon: Star, defaultText: '4.9 ★★★★★' },
  { value: 'award', label: 'Award', icon: Award, defaultText: 'Editor\'s Choice' },
  { value: 'download', label: 'Downloads', icon: Download, defaultText: '10M+ Downloads' },
  { value: 'security', label: 'Security', icon: Shield, defaultText: 'Bank-Level Security' },
  { value: 'speed', label: 'Speed', icon: Zap, defaultText: 'Lightning Fast' },
];

const TEXT_COLORS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#F3F4F6', label: 'Light Gray' },
  { value: '#1F2937', label: 'Dark Gray' },
  { value: '#00D1FF', label: 'Primary' },
  { value: '#FF3D00', label: 'Red' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
];

export const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onSave, onClose }) => {
  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle);
  const [layout, setLayout] = useState<LayoutType>(slide.layout);
  const [customTextColor, setCustomTextColor] = useState(slide.customTextColor || '');
  const [customFontSize, setCustomFontSize] = useState(slide.customFontSize || 0);
  const [widgets, setWidgets] = useState<Widget[]>(slide.widgets || []);
  const [activeTab, setActiveTab] = useState<'text' | 'layout' | 'style' | 'widgets'>('text');
  const [showPreview, setShowPreview] = useState(true);

  const handleSave = () => {
    onSave({
      title,
      subtitle,
      layout,
      customTextColor: customTextColor || undefined,
      customFontSize: customFontSize || undefined,
      widgets,
    });
    onClose();
  };

  const addWidget = (type: string) => {
    const widgetType = WIDGET_TYPES.find(w => w.value === type);
    if (!widgetType) return;

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: type as Widget['type'],
      text: widgetType.defaultText,
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const updateWidget = (id: string, text: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, text } : w));
  };

  const tabs = [
    { id: 'text', label: 'Text', icon: Type, tooltip: 'Edit headline and subtitle text' },
    { id: 'layout', label: 'Layout', icon: LayoutIcon, tooltip: 'Choose from 30+ layout styles' },
    { id: 'style', label: 'Style', icon: Palette, tooltip: 'Customize text color and size' },
    { id: 'widgets', label: 'Badges', icon: Award, tooltip: 'Add social proof badges' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-surfaceHighlight border border-white/10 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_-12px_rgba(0,209,255,0.2)] animate-in zoom-in-95 backdrop-blur-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutIcon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide font-display">SLIDE EDITOR</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400'}`}
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors p-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-white/5 bg-black/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                title={tab.tooltip}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TEXT TAB */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block mb-2">
                  Title (2-3 words recommended)
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none font-bold text-xl transition-all"
                  placeholder="Crave. Discover."
                />
                <p className="text-xs text-gray-500 mt-1">{title.split(' ').length} words</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block mb-2">
                  Subtitle (4-8 words recommended)
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none resize-none h-24 transition-all"
                  placeholder="Your next craving awaits"
                />
                <p className="text-xs text-gray-500 mt-1">{subtitle.split(' ').filter(w => w).length} words</p>
              </div>

              {/* Quick Title Suggestions */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Quick Suggestions</label>
                <div className="flex flex-wrap gap-2">
                  {['Crave. Discover.', 'Taste Smarter', 'Order Easy', 'Go Further', 'Level Up', 'Start Now'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setTitle(suggestion)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-primary/20 hover:border-primary/30 hover:text-white transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <LayoutPicker
                currentLayout={layout}
                onLayoutChange={setLayout}
              />
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Text Color */}
              <div>
                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block mb-3">
                  Text Color Override
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    value={customTextColor || '#FFFFFF'}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-white/10 cursor-pointer bg-black"
                  />
                  <input
                    type="text"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    placeholder="Auto (based on background)"
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 outline-none font-mono"
                  />
                  {customTextColor && (
                    <button
                      onClick={() => setCustomTextColor('')}
                      title="Clear custom color - Use automatic text color"
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCustomTextColor(color.value)}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                        customTextColor === color.value
                          ? 'border-primary bg-primary/20'
                          : 'border-white/10 hover:border-white/30 bg-black/40'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded border border-white/20"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs text-gray-300">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block mb-3">
                  Font Size Override: {customFontSize ? `${customFontSize}px` : 'Auto'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={customFontSize}
                    onChange={(e) => setCustomFontSize(Number(e.target.value))}
                    className="flex-1 accent-primary h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={customFontSize}
                    onChange={(e) => setCustomFontSize(Number(e.target.value))}
                    placeholder="Auto"
                    className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:border-primary/50 outline-none font-mono"
                  />
                  {customFontSize > 0 && (
                    <button
                      onClick={() => setCustomFontSize(0)}
                      title="Reset font size - Use automatic sizing"
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  {[60, 80, 100, 120, 140, 160].map((size) => (
                    <button
                      key={size}
                      onClick={() => setCustomFontSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        customFontSize === size
                          ? 'bg-primary text-black'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WIDGETS TAB */}
          {activeTab === 'widgets' && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block mb-3">
                  Add Social Proof Badges
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {WIDGET_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isAdded = widgets.some(w => w.type === type.value);
                    return (
                      <button
                        key={type.value}
                        onClick={() => !isAdded && addWidget(type.value)}
                        disabled={isAdded}
                        title={isAdded ? `${type.label} badge already added` : `Add ${type.label} badge - ${type.defaultText}`}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                          isAdded
                            ? 'border-green-500/50 bg-green-500/10 text-green-400'
                            : 'border-white/10 bg-black/40 text-gray-400 hover:border-primary/50 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Widgets */}
              {widgets.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">
                    Active Badges ({widgets.length})
                  </label>
                  <div className="space-y-3">
                    {widgets.map((widget) => {
                      const typeInfo = WIDGET_TYPES.find(t => t.value === widget.type);
                      const Icon = typeInfo?.icon || Star;
                      return (
                        <div
                          key={widget.id}
                          className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-lg"
                        >
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <input
                            value={widget.text}
                            onChange={(e) => updateWidget(widget.id, e.target.value)}
                            className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-primary/50 outline-none"
                          />
                          <button
                            onClick={() => removeWidget(widget.id)}
                            title="Remove this badge"
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {widgets.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
                  <Award className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No badges added yet</p>
                  <p className="text-xs text-gray-600">Click a badge type above to add</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex gap-3 bg-black/20">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary" className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideEditor;
