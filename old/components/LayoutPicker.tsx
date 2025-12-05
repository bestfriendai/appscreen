import React, { memo, useState } from 'react';
import { LayoutType } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LayoutOption {
  key: LayoutType;
  name: string;
  preview: string;
  description: string;
  category: 'hero' | 'panoramic' | 'offset' | 'zoom' | 'dual' | '3d' | 'minimal' | 'grid';
}

interface LayoutPickerProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  compact?: boolean;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  // HERO LAYOUTS (Best for first slide)
  { key: 'hero_large', name: 'Hero Large', preview: '🦸', description: 'Large centered device - maximum impact', category: 'hero' },
  { key: 'classic', name: 'Classic', preview: '📱', description: 'Centered phone with headline above', category: 'hero' },
  { key: 'magazine_cover', name: 'Magazine', preview: '📰', description: 'Editorial style, text overlaps device', category: 'hero' },
  { key: 'minimal_type', name: 'Minimal Text', preview: '✨', description: 'Large text, small device below', category: 'minimal' },
  { key: 'poster_hero', name: 'Poster', preview: '🎨', description: 'Text/graphics only, no device', category: 'minimal' },

  // PANORAMIC LAYOUTS (Device spans frames)
  { key: 'panoramic_right', name: 'Pan Right', preview: '➡️', description: 'Device at right edge, continues to next slide', category: 'panoramic' },
  { key: 'panoramic_left', name: 'Pan Left', preview: '⬅️', description: 'Device at left edge, continues from previous', category: 'panoramic' },
  { key: 'panoramic_center_right', name: 'Pan Center', preview: '↔️', description: 'Device splits 50/50 between frames', category: 'panoramic' },

  // OFFSET LAYOUTS (Device to one side)
  { key: 'offset_right', name: 'Offset Right', preview: '↗️', description: 'Device offset right, text on left', category: 'offset' },
  { key: 'offset_left', name: 'Offset Left', preview: '↖️', description: 'Device offset left, text on right', category: 'offset' },
  { key: 'off_axis_left', name: 'Off Axis', preview: '↪️', description: 'Angled device with rotation', category: 'offset' },

  // ZOOM LAYOUTS (Cropped device showing detail)
  { key: 'zoom_top', name: 'Zoom Top', preview: '⬆️', description: 'Zoomed to show top of screen', category: 'zoom' },
  { key: 'zoom_bottom', name: 'Zoom Bottom', preview: '⬇️', description: 'Zoomed to show bottom of screen', category: 'zoom' },

  // DUAL DEVICE LAYOUTS
  { key: 'duo_overlap', name: 'Duo Overlap', preview: '📱📱', description: 'Two overlapping devices at angles', category: 'dual' },
  { key: 'duo_side_by_side', name: 'Duo Side', preview: '📲📲', description: 'Two devices side by side', category: 'dual' },
  { key: 'double_phones', name: 'Double', preview: '👯', description: 'Classic two phone layout', category: 'dual' },

  // 3D/PERSPECTIVE LAYOUTS
  { key: 'tilted_dynamic', name: 'Tilted 3D', preview: '🎭', description: '3D perspective rotation', category: '3d' },
  { key: 'isometric_stack', name: 'Iso Stack', preview: '📚', description: 'Stacked 3D depth effect', category: '3d' },
  { key: 'spiral_stack', name: 'Spiral', preview: '🌀', description: 'Fanned card deck effect', category: '3d' },
  { key: 'diagonal_flow', name: 'Diagonal', preview: '⤴️', description: '3D diagonal arrangement', category: '3d' },
  { key: 'perspective_spread', name: 'Spread', preview: '🎪', description: '3-phone perspective spread', category: '3d' },

  // GRID/CARD LAYOUTS
  { key: 'bento_grid', name: 'Bento', preview: '🎛️', description: 'Card-based bento layout', category: 'grid' },
  { key: 'overlapping_cards', name: 'Cards', preview: '🃏', description: 'Overlapping card style', category: 'grid' },
  { key: 'device_grid', name: 'Grid', preview: '⊞', description: 'Multiple devices in grid', category: 'grid' },

  // OTHER LAYOUTS
  { key: 'minimal_float', name: 'Float', preview: '🎈', description: 'Floating minimal device', category: 'minimal' },
  { key: 'floating_hero', name: 'Float Hero', preview: '🚀', description: 'Hero with floating effect', category: 'hero' },
  { key: 'split_screen', name: 'Split', preview: '⬛⬜', description: 'Split screen layout', category: 'grid' },
  { key: 'feature_list', name: 'Features', preview: '📋', description: 'Feature showcase layout', category: 'grid' },
  { key: 'tri_stack_angle', name: 'Tri Stack', preview: '🔺', description: 'Three devices angled', category: '3d' },
  { key: 'quad_grid', name: 'Quad', preview: '⊞⊞', description: 'Four device grid', category: 'grid' },
  { key: 'landscape_float', name: 'Landscape', preview: '🖼️', description: 'Landscape orientation', category: 'minimal' },
  { key: 'card_focus', name: 'Card Focus', preview: '🎴', description: 'Focused card style', category: 'grid' },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  hero: { label: 'Hero', color: 'bg-purple-500' },
  panoramic: { label: 'Panoramic', color: 'bg-blue-500' },
  offset: { label: 'Offset', color: 'bg-green-500' },
  zoom: { label: 'Zoom', color: 'bg-yellow-500' },
  dual: { label: 'Dual Device', color: 'bg-pink-500' },
  '3d': { label: '3D Effects', color: 'bg-orange-500' },
  minimal: { label: 'Minimal', color: 'bg-gray-500' },
  grid: { label: 'Grid/Cards', color: 'bg-cyan-500' },
};

const LayoutPickerComponent: React.FC<LayoutPickerProps> = ({ currentLayout, onLayoutChange, compact = false }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(!compact);

  // Group layouts by category
  const groupedLayouts = LAYOUT_OPTIONS.reduce((acc, layout) => {
    if (!acc[layout.category]) acc[layout.category] = [];
    acc[layout.category].push(layout);
    return acc;
  }, {} as Record<string, LayoutOption[]>);

  // Get current layout info
  const currentLayoutInfo = LAYOUT_OPTIONS.find(l => l.key === currentLayout);

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Layout</label>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            {showAll ? 'Collapse' : 'Show All'}
            {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Current layout display */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/20 border border-primary/30">
          <span className="text-2xl">{currentLayoutInfo?.preview}</span>
          <div>
            <div className="text-sm font-bold text-white">{currentLayoutInfo?.name}</div>
            <div className="text-xs text-gray-400">{currentLayoutInfo?.description}</div>
          </div>
        </div>

        {showAll && (
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
            {LAYOUT_OPTIONS.map((layout) => (
              <button
                key={layout.key}
                onClick={() => onLayoutChange(layout.key)}
                className={`p-2 rounded-lg border transition-all text-center ${
                  currentLayout === layout.key
                    ? 'border-primary bg-primary/20 ring-2 ring-primary/30'
                    : 'border-white/10 hover:border-primary/50 bg-black/40'
                }`}
                title={layout.description}
              >
                <div className="text-xl">{layout.preview}</div>
                <div className="text-[8px] font-bold uppercase tracking-wider text-gray-400 truncate">
                  {layout.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Layout Style ({LAYOUT_OPTIONS.length} layouts)</label>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(CATEGORY_LABELS).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
              expandedCategory === key
                ? `${color} text-white`
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {label} ({groupedLayouts[key]?.length || 0})
          </button>
        ))}
      </div>

      {/* Layout grid - show filtered or all */}
      <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
        {(expandedCategory ? groupedLayouts[expandedCategory] : LAYOUT_OPTIONS).map((layout) => (
          <button
            key={layout.key}
            onClick={() => onLayoutChange(layout.key)}
            className={`p-3 rounded-lg border transition-all text-center relative ${
              currentLayout === layout.key
                ? 'border-primary bg-primary/20 ring-2 ring-primary/30 shadow-[0_0_10px_rgba(0,209,255,0.3)]'
                : 'border-white/10 hover:border-primary/50 bg-black/40'
            }`}
            title={layout.description}
          >
            <div className="text-2xl mb-1">{layout.preview}</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              {layout.name}
            </div>
            {/* Category indicator */}
            <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${CATEGORY_LABELS[layout.category].color}`} />
          </button>
        ))}
      </div>

      {/* Current selection info */}
      {currentLayoutInfo && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentLayoutInfo.preview}</span>
            <div>
              <div className="text-sm font-bold text-white">{currentLayoutInfo.name}</div>
              <div className="text-xs text-gray-400">{currentLayoutInfo.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(LayoutPickerComponent, (prev, next) => {
  return prev.currentLayout === next.currentLayout && prev.compact === next.compact;
});
