import React, { useRef, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Sidebar } from './features/editor/components/Sidebar/Sidebar';
import { TopBar } from './features/editor/components/TopBar/TopBar';
import { Workspace } from './features/editor/components/Workspace/Workspace';
import ExportModal, { ExportOptions } from './components/ExportModal';
import ProjectsManager from './components/ProjectsManager';
import GenerationProgress, { GenerationStep } from './components/GenerationProgress';
import OnboardingTour from './components/OnboardingTour';
import { StrategyReport } from './components/StrategyReport';
import SlideEditor from './components/SlideEditor';
import Button from './components/Button';
import { Loader2, Sparkles, X, Plus, Move, Trash2, Layers } from 'lucide-react';
import { MODAL_CLOSE_DELAY_MS } from './constants/timing';
import { logger } from './utils/logger';
import { useStore } from './store/useStore';
import { validateProjectInputs } from './utils/validation';
import { fileToBase64, compressImageForAI } from './utils/fileUtils';
import { analyzeScreenshotsForInsights, VisionInsights } from './services/visionAnalysis';
import { generateShowcasePlan, generateBackground, generateV2Refinement, generateV3CopyPolish, generateBackgroundVariations } from './services/geminiService';
import { FontStyle, DeviceColor, FrameStyle, FloatingElement, GeneratedSlide, DesignTheme, ThemeMode } from './types';
import { exportAllSlidesAsZip, exportAllSlidesAsPDF, exportMultipleSizes, DeviceSize } from './utils/exportUtils';

function App() {
  const {
    screenshots,
    slidesV1, setSlidesV1,
    slidesV2, setSlidesV2,
    slidesV3, setSlidesV3,
    appName, description, forcedCategory, toneOfVoice,
    setAppName, setDescription,
    setAccentColor, setFontStyle, setDesignTheme, setThemeMode, setFrameStyle, setVisualPrompt, setDeviceColor,
    setAppStrategy, // NEW: Destructure setAppStrategy
    setStatusMessage, setGeneratedBackgrounds, setSelectedBackground, setGenerationSteps, setShowGenerationProgress,
    setIsGenerating, isGenerating, setIsPanoramic,
    showExportModal, setShowExportModal,
    showProjects, setShowProjects,
    showGenerationProgress, generationSteps,
    // Modals
    editingSlide, setEditingSlide,
    editTitle, setEditTitle,
    editSubtitle, setEditSubtitle,
    editingFloatingElementsSlide, setEditingFloatingElementsSlide,
    tempFloatingElements, setTempFloatingElements
  } = useStore();

  // Strategy Report State
  const [showStrategyReport, setShowStrategyReport] = useState(false);
  const [strategyData, setStrategyData] = useState<VisionInsights | null>(null);

  const handleGenerateEverything = async () => {
    // Validate inputs
    const validation = validateProjectInputs(appName, description, screenshots.length);
    if (!validation.isValid) {
      validation.errors.forEach(err => toast.error(err.message));
      return;
    }

    // Initialize generation progress
    const steps: GenerationStep[] = [
      { id: 'prep', label: 'Analyzing User Intent & Visuals...', status: 'active', progress: 0 },
      { id: 'v1', label: 'V1: Architecting Core Layouts', status: 'pending' },
      { id: 'bg', label: 'Studio: Rendering 3D Environments', status: 'pending' },
      { id: 'v2', label: 'V2: Art Direction & Visual Polish', status: 'pending' },
      { id: 'v3', label: 'V3: ASO Copy & Conversion Optimization', status: 'pending' },
    ];
    setGenerationSteps(steps);
    setShowGenerationProgress(true);

    setIsGenerating(true);
    setSlidesV1([]);
    setSlidesV2([]);
    setSlidesV3([]);
    setGeneratedBackgrounds([]);

    try {
      // Update step: Preparing
      setGenerationSteps(
        useStore.getState().generationSteps.map(s => (s.id === 'prep' ? { ...s, progress: 50 } : s))
      );

      // Prepare screens for AI (convert to base64 with compression)
      // Compress images to avoid Vercel's 4.5MB request limit
      const screensForAi = await Promise.all(screenshots.map(async (s) => {
        const source = s.url.startsWith('data:image') ? s.url : s.file;
        const compressedBase64 = await compressImageForAI(source, 800, 800, 0.6);
        return {
            id: s.id,
            base64: compressedBase64
        };
      }));

      // --- PHASE 1: ANALYSIS & INSIGHTS ---
      setStatusMessage("Analyzing app DNA and target audience...");
      const insights = await analyzeScreenshotsForInsights(screensForAi);

      // Store insights for report and global strategy
      setStrategyData(insights);
      if (insights.appStrategy) {
        setAppStrategy(insights.appStrategy);
      }

      const enrichedDescription = `${description}\n
      Dominant Colors: ${insights.dominantColors?.join(', ') || ''}\n
      Keywords: ${(insights.keywords || []).join(', ')}\n
      Rationale: ${insights.designRationale || ''}\n
      Target Persona: ${insights.audiencePersona || ''}`;

      // Complete prep, start V1
      setGenerationSteps(
        useStore.getState().generationSteps.map(s =>
          s.id === 'prep' ? { ...s, status: 'complete', progress: 100 } :
            s.id === 'v1' ? { ...s, status: 'active', progress: 20 } : s
        )
      );

      const v1Plan = await generateShowcasePlan(
        appName,
        enrichedDescription,
        screensForAi,
        screenshots.length,
        forcedCategory,
        insights.appStrategy // Pass strategy
      );

      setAccentColor(v1Plan.accentColor);
      setFontStyle(v1Plan.fontStyle as FontStyle);
      setDesignTheme(v1Plan.designTheme);
      setThemeMode(v1Plan.themeMode || 'DARK');
      setFrameStyle(FrameStyle.FRAMELESS);
      setVisualPrompt(v1Plan.visualPrompt);

      if (v1Plan.themeMode === 'LIGHT') {
        setDeviceColor(DeviceColor.OFF_WHITE);
      } else {
        setDeviceColor(DeviceColor.MIDNIGHT);
      }

      setStatusMessage(`Creating relevant background for your app...`);
      const bg1 = await generateBackground(
        appName,
        description,
        v1Plan.accentColor,
        forcedCategory,
        insights.appStrategy // Pass strategy
      );
      setGeneratedBackgrounds([bg1]);
      setSelectedBackground(bg1);

      // Map Plan to Slides Helper
      const mapPlanToSlides = (plan: any, bg: string) => {
        const clampTitle = (t: string) => (t || '').split(' ').slice(0, 3).join(' ');
        const clampSubtitle = (s: string) => (s || '').split(' ').slice(0, 8).join(' ');
        const limitFloating = (arr: any[]) => (Array.isArray(arr) ? arr.slice(0, 2) : []);

        return screenshots.map((screenshot, index) => {
          const slidePlan = plan.slides.find((s: any) => s.screenshotId === screenshot.id) || plan.slides[index] || plan.slides[0];
          const nextIndex = (index + 1) % screenshots.length;
          const nextShot = screenshots[nextIndex];

          const safePlan = slidePlan || {
            title: "Discover Features",
            subtitle: "Experience the best app experience",
            layout: 'classic',
            keywords: [],
            widgets: [],
            floatingElements: []
          };

          return {
            id: Math.random().toString(36).substr(2, 9),
            screenshotId: screenshot.id,
            screenshotUrl: screenshot.url,
            secondaryScreenshotUrl: nextShot?.url,
            title: clampTitle(safePlan.title),
            subtitle: clampSubtitle(safePlan.subtitle),
            keywords: safePlan.keywords,
            backgroundUrl: bg,
            layout: safePlan.layout as any,
            colorAccent: plan.accentColor,
            widgets: safePlan.widgets,
            floatingElements: limitFloating(safePlan.floatingElements),
            deviceOffset: { x: 0, y: 0 },
            textOffset: { x: 0, y: 0 }
          };
        });
      };

      const v1Slides = mapPlanToSlides(v1Plan, bg1);
      setSlidesV1(v1Slides);

      // Complete V1, start BG generation
      setGenerationSteps(
        useStore.getState().generationSteps.map(s =>
          s.id === 'v1' ? { ...s, status: 'complete' } :
            s.id === 'bg' ? { ...s, status: 'active', progress: 30 } : s
        )
      );

      // --- PHASE 2: V2 VISUAL REDESIGN (The Art Director) ---
      setStatusMessage("V2 Art Director: Refining Layouts & Visuals...");
      const v2Plan = await generateV2Refinement(v1Plan, appName);

      setGenerationSteps(
        useStore.getState().generationSteps.map(s =>
          s.id === 'bg' ? { ...s, status: 'complete' } :
            s.id === 'v2' ? { ...s, status: 'active', progress: 40 } : s
        )
      );

      setStatusMessage("Creating more background options...");
      const variations = await generateBackgroundVariations(
        appName,
        description,
        v2Plan.accentColor,
        5,
        forcedCategory,
        insights.appStrategy // Pass strategy
      );
      const allBgs = [bg1, ...variations];
      setGeneratedBackgrounds(allBgs);

      const v2Slides = mapPlanToSlides(v2Plan, variations[0] || bg1);
      const distributedV2 = v2Slides.map((slide) => ({
        ...slide,
        backgroundUrl: allBgs[0]
      }));
      setSlidesV2(distributedV2);

      setGenerationSteps(
        useStore.getState().generationSteps.map(s =>
          s.id === 'v2' ? { ...s, status: 'complete' } :
            s.id === 'v3' ? { ...s, status: 'active', progress: 60 } : s
        )
      );

      // --- PHASE 3: V3 COPY POLISH (The Copywriter) ---
      setStatusMessage("V3 Copywriter: Optimizing ASO Keywords & Text...");
      const v3Plan = await generateV3CopyPolish(v2Plan, appName, toneOfVoice);
      const v3SlidesInitial = mapPlanToSlides(v3Plan, variations[0] || bg1);
      const distributedV3 = v3SlidesInitial.map((slide) => ({
        ...slide,
        backgroundUrl: allBgs[0]
      }));
      setSlidesV3(distributedV3);

      setGenerationSteps(
        useStore.getState().generationSteps.map(s =>
          s.id === 'v3' ? { ...s, status: 'complete', progress: 100 } : s
        )
      );

      setStatusMessage("Done!");
      toast.success('Screenshots generated successfully!');

      setTimeout(() => {
        setShowGenerationProgress(false);
        // Show Strategy Report after generation is done
        setShowStrategyReport(true);
      }, MODAL_CLOSE_DELAY_MS);

    } catch (error) {
      logger.error('Generation failed:', error);
      toast.error("Generation failed: " + (error as Error).message);
      setShowGenerationProgress(false);
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  const saveEdit = () => {
    if (!editingSlide) return;
    const updateState = (prev: GeneratedSlide[]) => prev.map(s =>
      s.id === editingSlide.id ? { ...s, title: editTitle, subtitle: editSubtitle } : s
    );
    setSlidesV3(updateState(slidesV3));
    setSlidesV2(updateState(slidesV2));
    setEditingSlide(null);
  };

  // New comprehensive slide update function for SlideEditor
  const handleSlideEditorSave = (updates: Partial<GeneratedSlide>) => {
    if (!editingSlide) return;
    const updateState = (prev: GeneratedSlide[]) => prev.map(s =>
      s.id === editingSlide.id ? { ...s, ...updates } : s
    );
    setSlidesV3(updateState(slidesV3));
    setSlidesV2(updateState(slidesV2));
    setEditingSlide(null);
    toast.success('Slide updated');
  };

  const saveFloatingElements = () => {
    if (!editingFloatingElementsSlide) return;
    const updateState = (prev: GeneratedSlide[]) => prev.map(s =>
      s.id === editingFloatingElementsSlide.id ? { ...s, floatingElements: tempFloatingElements } : s
    );
    setSlidesV3(updateState(slidesV3));
    setSlidesV2(updateState(slidesV2));
    setEditingFloatingElementsSlide(null);
  };

  const addFloatingElement = () => {
    const newElement: FloatingElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'pill',
      text: 'New Element',
      subtext: '',
      icon: 'check',
      position: { x: 600, y: 1800, rotate: 0, scale: 1 }
    };
    setTempFloatingElements([...tempFloatingElements, newElement]);
  };

  const updateFloatingElement = (id: string, field: string, value: any) => {
    setTempFloatingElements(tempFloatingElements.map(el => {
      if (el.id === id) {
        if (['x', 'y', 'rotate', 'scale'].includes(field)) {
          return { ...el, position: { ...el.position, [field]: value } };
        }
        return { ...el, [field]: value };
      }
      return el;
    }));
  };

  const removeFloatingElement = (id: string) => {
    setTempFloatingElements(tempFloatingElements.filter(el => el.id !== id));
  };

  const handleExport = async (options: ExportOptions) => {
    const slidesToExport = slidesV3.length > 0 ? slidesV3 : slidesV2.length > 0 ? slidesV2 : slidesV1;

    if (slidesToExport.length === 0) {
      toast.error('No slides to export');
      return;
    }

    try {
      toast.loading('Preparing export...', { id: 'export' });

      const slideElements: HTMLElement[] = [];
      for (let i = 0; i < slidesToExport.length; i++) {
        const canvasEl = document.querySelector(`[data-slide-id="${slidesToExport[i].id}"]`) as HTMLElement;
        if (canvasEl) {
          slideElements.push(canvasEl);
        }
      }

      if (slideElements.length === 0) {
        toast.error('Could not find slide elements', { id: 'export' });
        return;
      }

      switch (options.exportType) {
        case 'all-zip':
          await exportAllSlidesAsZip(slideElements, appName, {
            format: options.format,
            scale: options.scale,
            quality: options.quality,
          });
          toast.success(`Exported ${slideElements.length} slides as ZIP`, { id: 'export' });
          break;

        case 'all-pdf':
          await exportAllSlidesAsPDF(slideElements, appName, { scale: options.scale });
          toast.success(`Exported ${slideElements.length} slides as PDF`, { id: 'export' });
          break;

        case 'multi-size':
          if (!options.deviceSizes || options.deviceSizes.length === 0) {
            toast.error('Please select at least one device size', { id: 'export' });
            return;
          }

          toast.loading(`Exporting ${slideElements.length} slides in ${options.deviceSizes.length} sizes...`, { id: 'export' });

          for (let i = 0; i < slideElements.length; i++) {
            await exportMultipleSizes(
              slideElements[i],
              i,
              appName,
              options.deviceSizes as DeviceSize[],
              options.format
            );
          }

          toast.success(`Exported ${slideElements.length} slides in ${options.deviceSizes.length} sizes`, { id: 'export' });
          break;

        case 'single':
          toast.success('Click on individual slides to export them', { id: 'export' });
          break;
      }

      setShowExportModal(false);
    } catch (error) {
      logger.error('Export failed:', error);
      toast.error('Export failed: ' + (error as Error).message, { id: 'export' });
    }
  };

  return (
    <div className="flex h-screen bg-background text-gray-100 font-sans overflow-hidden selection:bg-primary/30">

        <Sidebar onGenerate={handleGenerateEverything} />

        <main className="flex-1 flex flex-col bg-surface relative overflow-hidden">
            <TopBar />
            <Workspace />
        </main>

        {/* Strategy Report Modal */}
        <StrategyReport
            isOpen={showStrategyReport}
            onClose={() => setShowStrategyReport(false)}
            category={strategyData?.categoryGuess || 'App'}
            rationale={strategyData?.designRationale || ''}
            persona={strategyData?.audiencePersona || ''}
            colors={strategyData?.dominantColors || []}
        />

        {/* Global Modals - Comprehensive Slide Editor */}
        {editingSlide && (
            <SlideEditor
                slide={editingSlide}
                onSave={handleSlideEditorSave}
                onClose={() => setEditingSlide(null)}
            />
        )}

        {editingFloatingElementsSlide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-surfaceHighlight border border-white/10 rounded-2xl w-full max-w-4xl p-6 shadow-2xl animate-in zoom-in-95 flex flex-col h-[80vh] border-t-4 border-t-primary/50">

                <div className="flex justify-between items-center mb-6 flex-shrink-0 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><Layers className="w-5 h-5 text-primary" /></div>
                    <h3 className="text-lg font-bold text-white font-display tracking-wide">EDIT FLOATING ELEMENTS</h3>
                </div>
                <button onClick={() => setEditingFloatingElementsSlide(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {tempFloatingElements.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 border border-dashed border-white/10 rounded-xl bg-black/20">
                    <Layers className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-mono">No floating elements initialized.</p>
                    </div>
                )}

                {tempFloatingElements.map((el, index) => (
                    <div key={el.id} className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                        <span className="bg-primary/20 text-xs font-bold px-2 py-1 rounded text-primary uppercase tracking-wider font-mono">ID:{index + 1}</span>
                        <select
                            value={el.type}
                            onChange={(e) => updateFloatingElement(el.id, 'type', e.target.value)}
                            className="bg-black/50 border border-white/10 text-white text-xs rounded px-2 py-1 outline-none focus:border-primary"
                        >
                            <option value="pill">Pill</option>
                            <option value="card">Card</option>
                            <option value="notification">Notification</option>
                            <option value="icon_bubble">Icon Bubble</option>
                        </select>
                        <select
                            value={el.icon}
                            onChange={(e) => updateFloatingElement(el.id, 'icon', e.target.value)}
                            className="bg-black/50 border border-white/10 text-white text-xs rounded px-2 py-1 outline-none focus:border-primary"
                        >
                            <option value="check">Check</option>
                            <option value="bell">Bell</option>
                            <option value="card">Card</option>
                            <option value="activity">Activity</option>
                            <option value="shield">Shield</option>
                            <option value="star">Star</option>
                            <option value="heart">Heart</option>
                            <option value="zap">Zap</option>
                            <option value="award">Award</option>
                        </select>
                        </div>
                        <button onClick={() => removeFloatingElement(el.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1 tracking-wider">Text</label>
                        <input
                            value={el.text || ''}
                            onChange={(e) => updateFloatingElement(el.id, 'text', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-primary/50 outline-none transition-colors"
                            placeholder="Main text..."
                        />
                        </div>
                        <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1 tracking-wider">Subtext</label>
                        <input
                            value={el.subtext || ''}
                            onChange={(e) => updateFloatingElement(el.id, 'subtext', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-primary/50 outline-none transition-colors"
                            placeholder="Secondary text..."
                        />
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Move className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Coordinates</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="text-[9px] text-gray-500 block mb-1 font-mono">X</label>
                            <input type="number" value={el.position.x} onChange={(e) => updateFloatingElement(el.id, 'x', Number(e.target.value))} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono focus:border-primary/50" />
                        </div>
                        <div>
                            <label className="text-[9px] text-gray-500 block mb-1 font-mono">Y</label>
                            <input type="number" value={el.position.y} onChange={(e) => updateFloatingElement(el.id, 'y', Number(e.target.value))} className="w-full bg-black border border-white/10 rounded px-2 py-1 text-xs text-white font-mono focus:border-primary/50" />
                        </div>
                        <div>
                            <label className="text-[9px] text-gray-500 block mb-1 font-mono">ROT: {el.position.rotate}°</label>
                            <input type="range" min="-180" max="180" value={el.position.rotate} onChange={(e) => updateFloatingElement(el.id, 'rotate', Number(e.target.value))} className="w-full accent-primary h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        <div>
                            <label className="text-[9px] text-gray-500 block mb-1 font-mono">SCL: {el.position.scale}x</label>
                            <input type="range" min="0.1" max="3" step="0.1" value={el.position.scale} onChange={(e) => updateFloatingElement(el.id, 'scale', Number(e.target.value))} className="w-full accent-primary h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                <div className="pt-6 border-t border-white/10 flex gap-3 mt-auto flex-shrink-0">
                <Button onClick={addFloatingElement} variant="outline" className="flex-1 border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white" icon={<Plus className="w-4 h-4" />}>Add Element</Button>
                <Button onClick={() => setEditingFloatingElementsSlide(null)} variant="secondary" className="flex-1">Cancel</Button>
                <Button onClick={saveFloatingElements} variant="primary" className="flex-1">Save Elements</Button>
                </div>

            </div>
            </div>
        )}

        <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            onExport={handleExport}
            slideCount={slidesV3.length || slidesV2.length || slidesV1.length}
            appName={appName || 'Untitled'}
        />

        <ProjectsManager
            isOpen={showProjects}
            onClose={() => setShowProjects(false)}
            onLoadProject={(data) => {
            setAppName(data.appName);
            setDescription(data.description);
            setSlidesV3(data.slides);
            setDesignTheme(data.settings.designTheme as DesignTheme);
            setThemeMode(data.settings.themeMode as ThemeMode);
            setFrameStyle(data.settings.frameStyle as unknown as FrameStyle);
            setDeviceColor(data.settings.deviceColor as unknown as DeviceColor);
            setFontStyle(data.settings.fontStyle as FontStyle);
            setAccentColor(data.settings.accentColor);
            setIsPanoramic(data.settings.isPanoramic);
            }}
            currentProject={null}
        />

        <GenerationProgress
            steps={generationSteps}
            isOpen={showGenerationProgress}
        />

        <OnboardingTour />

        <Toaster
            position="top-right"
            toastOptions={{
            style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
                iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
                },
            },
            error: {
                iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
                },
            },
            }}
        />

    </div>
  );
}

export default App;
