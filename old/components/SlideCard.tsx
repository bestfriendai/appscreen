/**
 * SlideCard Component
 *
 * @deprecated This component was created for future refactoring but is not currently used.
 * @future Will be integrated when App.tsx is refactored to extract slide rendering logic.
 *
 * This component encapsulates individual slide rendering with hover controls,
 * providing a cleaner separation of concerns. It consolidates:
 * - Slide preview rendering
 * - Hover overlay with action buttons
 * - Loading states during updates
 *
 * **Integration Plan:**
 * Replace the inline slide rendering in App.tsx (lines ~1030-1060) with this component
 * to reduce the App.tsx file size from 1,230+ lines to under 800 lines.
 */
import React from 'react';
import { Edit2, Sparkles, ImageIcon, Layout, Layers, Copy, Trash2, Loader2 } from 'lucide-react';
import { GeneratedSlide, DesignTheme, ThemeMode, FrameStyle, DeviceColor, FontStyle } from '../types';
import CanvasPreview from './CanvasPreview';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface SlideCardProps {
  slide: GeneratedSlide;
  index: number;
  totalSlides: number;
  scale: number;
  // Design settings
  designTheme: DesignTheme;
  themeMode: ThemeMode;
  frameStyle: FrameStyle;
  deviceColor: DeviceColor;
  fontStyle: FontStyle;
  accentColor: string;
  isPanoramic: boolean;
  // State
  isUpdating: boolean;
  updatingMessage?: string;
  // Actions
  onEdit: (slide: GeneratedSlide) => void;
  onRethinkCopy: (slide: GeneratedSlide) => void;
  onRegenerateBackground: (slide: GeneratedSlide) => void;
  onCycleLayout: (slide: GeneratedSlide) => void;
  onEditFloatingElements: (slide: GeneratedSlide) => void;
  onDuplicate: (slide: GeneratedSlide) => void;
  onDelete: (slide: GeneratedSlide) => void;
}

const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  index,
  totalSlides,
  scale,
  designTheme,
  themeMode,
  frameStyle,
  deviceColor,
  fontStyle,
  accentColor,
  isPanoramic,
  isUpdating,
  updatingMessage,
  onEdit,
  onRethinkCopy,
  onRegenerateBackground,
  onCycleLayout,
  onEditFloatingElements,
  onDuplicate,
  onDelete,
}) => {
  return (
    <div
      key={slide.id}
      className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 group relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="relative shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] bg-black overflow-hidden rounded-md"
        style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale }}
        data-slide-id={slide.id}
      >
        <CanvasPreview
          {...slide}
          theme={designTheme}
          themeMode={themeMode}
          frameStyle={frameStyle}
          deviceColor={deviceColor}
          fontStyle={fontStyle}
          accentColor={accentColor}
          scale={scale}
          index={index}
          totalSlides={totalSlides}
          isPanoramic={isPanoramic}
          backgroundUrl={slide.backgroundUrl}
        />
      </div>

      {/* LOADING OVERLAY */}
      {isUpdating ? (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-md animate-in fade-in duration-200">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            {updatingMessage}
          </span>
        </div>
      ) : (
        /* HOVER OVERLAY */
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 rounded-md">
          <div className="flex items-center gap-2 flex-wrap justify-center px-4">
            <button
              onClick={() => onEdit(slide)}
              className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg"
              title="Edit Text"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRethinkCopy(slide)}
              className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg"
              title="AI Rewrite Copy"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRegenerateBackground(slide)}
              className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg"
              title="Regenerate Background"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCycleLayout(slide)}
              className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg"
              title="Change Layout"
            >
              <Layout className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEditFloatingElements(slide)}
              className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg"
              title="Edit Floating Elements"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate(slide)}
              className="p-3 bg-green-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
              title="Duplicate Slide"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(slide)}
              className="p-3 bg-red-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
              title="Delete Slide"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">
            Slide {index + 1} of {totalSlides}
          </span>
        </div>
      )}
    </div>
  );
};

export default SlideCard;
