import React from 'react';
import { Smartphone, Loader2, Sparkles, ImageIcon, Edit2, Copy, Trash2, Layout as LayoutIcon, Layers, RefreshCw } from 'lucide-react';
import CanvasPreview from '../../../../components/CanvasPreview';
import SlidePlaceholder from '../../../../components/SlidePlaceholder';
import { useStore } from '../../../../store/useStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../../../constants';
import { GeneratedSlide, LayoutType } from '../../../../types';
import { generateBackground, regenerateSlideCopy } from '../../../../services/geminiService';
import { logger } from '../../../../utils/logger';
import { toast } from 'react-hot-toast';

export const Workspace = () => {
    const {
        slidesV1, slidesV2, slidesV3,
        isGenerating, screenshots,
        designTheme, themeMode, frameStyle, deviceColor, fontStyle, accentColor, isPanoramic,
        appStrategy, // NEW
        generatedBackgrounds, setGeneratedBackgrounds,
        setSlidesV2, setSlidesV3,
        setEditingSlide, setEditTitle, setEditSubtitle,
        updatingSlideState, setUpdatingSlideState,
        setEditingFloatingElementsSlide, setTempFloatingElements,
        duplicateSlide: duplicateSlideStore,
        deleteSlide: deleteSlideStore
    } = useStore();

    // Slightly larger preview scale for better quality display
    const PREVIEW_SCALE = 0.28;

    // --- LOGIC MOVED FROM APP.TSX ---

    const handleSwapBackground = (slide: GeneratedSlide) => {
        if (generatedBackgrounds.length === 0) return;
        const currentIndex = generatedBackgrounds.indexOf(slide.backgroundUrl);
        const nextIndex = (currentIndex + 1) % generatedBackgrounds.length;
        const nextBg = generatedBackgrounds[nextIndex];
        const updateState = (prev: GeneratedSlide[]) => prev.map(s => s.id === slide.id ? { ...s, backgroundUrl: nextBg } : s);
        setSlidesV3(updateState(slidesV3));
        setSlidesV2(updateState(slidesV2));
    };

    const handleChooseBackground = (slide: GeneratedSlide, bg: string) => {
        const updateState = (prev: GeneratedSlide[]) => prev.map(s => s.id === slide.id ? { ...s, backgroundUrl: bg } : s);
        setSlidesV3(updateState(slidesV3));
        setSlidesV2(updateState(slidesV2));
    };

    const updateSlideDeviceOffset = (slide: GeneratedSlide, delta: { x: number; y: number }) => {
        const apply = (prev: GeneratedSlide[]) => prev.map(s => {
          if (s.id !== slide.id) return s;
          const current = s.deviceOffset || { x: 0, y: 0 };
          return { ...s, deviceOffset: { x: current.x + delta.x, y: current.y + delta.y } };
        });
        setSlidesV3(apply(slidesV3));
        setSlidesV2(apply(slidesV2));
    };

    const updateSlideTextOffset = (slide: GeneratedSlide, delta: { x: number; y: number }) => {
        const apply = (prev: GeneratedSlide[]) => prev.map(s => {
          if (s.id !== slide.id) return s;
          const current = s.textOffset || { x: 0, y: 0 };
          return { ...s, textOffset: { x: current.x + delta.x, y: current.y + delta.y } };
        });
        setSlidesV3(apply(slidesV3));
        setSlidesV2(apply(slidesV2));
    };

    const openEditModal = (slide: GeneratedSlide) => {
        setEditingSlide(slide);
        setEditTitle(slide.title);
        setEditSubtitle(slide.subtitle);
    };

    const handleRethinkCopy = async (slide: GeneratedSlide) => {
        setUpdatingSlideState({ id: slide.id, message: "Rewriting Copy..." });
        try {
          const newCopy = await regenerateSlideCopy(slide.title, slide.subtitle, "App", designTheme);
          const updateState = (prev: GeneratedSlide[]) => prev.map(s =>
            s.id === slide.id ? { ...s, title: newCopy.title, subtitle: newCopy.subtitle } : s
          );
          setSlidesV3(updateState(slidesV3));
          setSlidesV2(updateState(slidesV2));
        } catch (e) {
          logger.error('Failed to rethink copy:', e);
        } finally {
          setUpdatingSlideState(null);
        }
    };

    const handleRegenerateBackground = async (slide: GeneratedSlide) => {
        setUpdatingSlideState({ id: slide.id, message: "Rendering Background..." });
        try {
          // Note: using App Name from store would be better but we don't have it in scope easily without adding to destructure
          const newBg = await generateBackground("App", "App Description", accentColor, "");
          const updateState = (prev: GeneratedSlide[]) => prev.map(s => s.id === slide.id ? { ...s, backgroundUrl: newBg } : s);
          setSlidesV3(updateState(slidesV3));
          setSlidesV2(updateState(slidesV2));
          setGeneratedBackgrounds([newBg, ...generatedBackgrounds]);
        } catch (e) {
          logger.error('Failed to regenerate background:', e);
        } finally {
          setUpdatingSlideState(null);
        }
    };

    const cycleLayout = (slide: GeneratedSlide) => {
        const layouts: LayoutType[] = [
          'classic', 'minimal_float', 'zoom_top', 'zoom_bottom', 'tilted_dynamic', 'isometric_stack',
          'off_axis_left', 'magazine_cover', 'bento_grid', 'double_phones', 'spiral_stack',
          'overlapping_cards', 'diagonal_flow', 'perspective_spread', 'split_screen', 'device_grid',
          'feature_list', 'floating_hero', 'duo_overlap', 'tri_stack_angle', 'quad_grid',
          'landscape_float', 'card_focus', 'minimal_type'
        ];
        const currentIdx = layouts.indexOf(slide.layout);
        const nextLayout = layouts[(currentIdx + 1) % layouts.length];
        const updateState = (prev: GeneratedSlide[]) => prev.map(s => s.id === slide.id ? { ...s, layout: nextLayout } : s);
        setSlidesV3(updateState(slidesV3));
        setSlidesV2(updateState(slidesV2));
    };

    const openFloatingElementsModal = (slide: GeneratedSlide) => {
        setEditingFloatingElementsSlide(slide);
        setTempFloatingElements(JSON.parse(JSON.stringify(slide.floatingElements || [])));
    };

    const duplicateSlide = (slide: GeneratedSlide) => {
        // Since store needs version, and we display mostly V3...
        // We'll duplicate in V3 and V2
        duplicateSlideStore('v3', slide.id);
        duplicateSlideStore('v2', slide.id);
        toast.success('Slide duplicated');
    };

    const deleteSlide = (slide: GeneratedSlide) => {
         // Logic from App.tsx check
         const slidesToCheck = slidesV3.length > 0 ? slidesV3 : slidesV2.length > 0 ? slidesV2 : slidesV1;
         if (slidesToCheck.length <= 1) {
            toast.error('Cannot delete the last slide');
            return;
         }
         if (window.confirm('Are you sure you want to delete this slide?')) {
            deleteSlideStore('v3', slide.id);
            deleteSlideStore('v2', slide.id);
            deleteSlideStore('v1', slide.id);
            toast.success('Slide deleted');
         }
    };

    return (
        <div className="flex-1 overflow-auto bg-surface relative p-12">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2] pointer-events-none"></div>
            <div className="absolute inset-0 bg-glow-gradient opacity-20 pointer-events-none"></div>

            {slidesV1.length === 0 && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-6">
                <div className="w-32 h-32 rounded-[2rem] bg-black/50 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group animate-in fade-in zoom-in-50 duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <Smartphone className="w-12 h-12 text-gray-700 group-hover:text-primary transition-colors duration-500" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-mono">Upload screens to initialize...</p>
              </div>
            ) : slidesV1.length === 0 && isGenerating ? (
              <div className="space-y-16 pb-20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-primary w-12 animate-pulse"></div>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">Generating...</span>
                  </div>
                  <div className="flex items-start gap-8 overflow-x-auto pb-4">
                    {screenshots.map((_, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0"
                        style={{ width: CANVAS_WIDTH * PREVIEW_SCALE, height: CANVAS_HEIGHT * PREVIEW_SCALE }}
                      >
                        <SlidePlaceholder index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
                <div className="space-y-16 pb-20">
                     {/* PROGRESSIVE RENDERING: Show the best available version */}
                    {(() => {
                        const currentSlides = slidesV3.length > 0 ? slidesV3 : slidesV2.length > 0 ? slidesV2 : slidesV1;
                        const currentVersionLabel = slidesV3.length > 0 ? "V3: ASO & Copy Polish" : slidesV2.length > 0 ? "V2: Art Director Refinement" : "V1: Initial Layout Structure";
                        
                        return (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-primary w-12 shadow-[0_0_10px_rgba(0,209,255,0.5)]"></div>
                                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest font-mono">{currentVersionLabel}</span>
                                    {slidesV3.length === 0 && isGenerating && <Loader2 className="w-3 h-3 text-primary animate-spin ml-2" />}
                                </div>
                                <div className="flex items-start gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                    {currentSlides.map((slide, index) => (
                                    <div key={slide.id} className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-700 group relative" style={{ animationDelay: `${index * 100}ms` }}>
                                        <div
                                        className="relative shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] bg-black overflow-hidden rounded-md border border-white/5 group-hover:border-primary/50 transition-colors"
                                        style={{ width: CANVAS_WIDTH * PREVIEW_SCALE, height: CANVAS_HEIGHT * PREVIEW_SCALE }}
                                        data-slide-id={slide.id}
                                        >
                                        <CanvasPreview
                                            {...slide}
                                            theme={designTheme} themeMode={themeMode} frameStyle={frameStyle} deviceColor={deviceColor} fontStyle={fontStyle} accentColor={accentColor}
                                            appStrategy={appStrategy} // Pass strategy
                                            scale={PREVIEW_SCALE} index={index} totalSlides={currentSlides.length} isPanoramic={isPanoramic}
                                            backgroundUrl={slide.backgroundUrl}
                                            deviceOffset={slide.deviceOffset}
                                            textOffset={slide.textOffset}
                                            onRegenerateBackground={() => handleSwapBackground(slide)}
                                            availableBackgrounds={generatedBackgrounds}
                                            onChooseBackground={(bg) => handleChooseBackground(slide, bg)}
                                            onDeviceTransformChange={(offset) => updateSlideDeviceOffset(slide, offset)}
                                            onTextTransformChange={(offset) => updateSlideTextOffset(slide, offset)}
                                        />
                                        </div>

                                        {/* LOADING OVERLAY */}
                                        {updatingSlideState?.id === slide.id ? (
                                        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-md animate-in fade-in duration-200 border border-primary/20">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{updatingSlideState.message}</span>
                                        </div>
                                        ) : (
                                        /* HOVER OVERLAY */
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 border border-primary/30 rounded-md">
                                            <div className="flex items-center gap-2 flex-wrap justify-center max-w-[80%]">
                                            <button onClick={() => openEditModal(slide)} className="p-3 bg-surfaceHighlight rounded-lg text-white hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg border border-white/10" title="Edit Slide - Change text, layout, colors, badges"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleRethinkCopy(slide)} className="p-3 bg-surfaceHighlight rounded-lg text-white hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg border border-white/10" title="AI Rewrite Copy - Generate new headlines with AI" disabled={!!updatingSlideState}>{updatingSlideState?.id === slide.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}</button>
                                            <button onClick={() => handleRegenerateBackground(slide)} className="p-3 bg-surfaceHighlight rounded-lg text-white hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg border border-white/10" title="Regenerate Background - Generate a new AI background" disabled={!!updatingSlideState}>{updatingSlideState?.id === slide.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}</button>
                                            <button onClick={() => cycleLayout(slide)} className="p-3 bg-surfaceHighlight rounded-lg text-white hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg border border-white/10" title="Cycle Layout - Quick switch to next layout style"><LayoutIcon className="w-4 h-4" /></button>
                                            <button onClick={() => openFloatingElementsModal(slide)} className="p-3 bg-surfaceHighlight rounded-lg text-white hover:bg-white hover:text-black hover:scale-105 transition-all shadow-lg border border-white/10" title="Edit Floating Elements - Add cards, badges, notifications"><Layers className="w-4 h-4" /></button>
                                            <button onClick={() => duplicateSlide(slide)} className="p-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg hover:bg-green-500 hover:text-white hover:scale-105 transition-all shadow-lg" title="Duplicate Slide - Create a copy of this slide"><Copy className="w-4 h-4" /></button>
                                            <button onClick={() => deleteSlide(slide)} className="p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white hover:scale-105 transition-all shadow-lg" title="Delete Slide - Remove this slide permanently"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] font-mono mt-2">-- CLICK TO CONFIGURE --</span>
                                        </div>
                                        )}
                                    </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};
