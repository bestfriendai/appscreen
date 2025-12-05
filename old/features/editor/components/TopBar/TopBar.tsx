import React from 'react';
import { Download, Save, Upload, Check, Undo, Redo } from 'lucide-react';
import Button from '../../../../components/Button';
import { useStore } from '../../../../store/useStore';
import { exportProjectAsJSON } from '../../../../utils/exportUtils';
import { ProjectData } from '../../../../utils/exportUtils';
import { toast } from 'react-hot-toast';
import { logger } from '../../../../utils/logger';
import { DesignTheme, ThemeMode, FrameStyle, DeviceColor, FontStyle } from '../../../../types';

export const TopBar = () => {
    // Access store via selector to potentially optimize, but direct destructuring works too
    const {
        appName,
        slidesV1, slidesV2, slidesV3,
        setShowProjects, setShowExportModal,
        // For saving/loading
        description, screenshots, designTheme, themeMode, frameStyle, deviceColor, fontStyle, accentColor, isPanoramic,
        setAppName, setDescription, setSlidesV3, setDesignTheme, setThemeMode, setFrameStyle, setDeviceColor, setFontStyle, setAccentColor, setIsPanoramic
    } = useStore();

    // Access temporal store for Undo/Redo
    // zundo exposes temporal state through the main store
    const pastStates = useStore((state) => (state as any).pastStates || []);
    const futureStates = useStore((state) => (state as any).futureStates || []);

    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    const handleUndo = () => {
        (useStore as any).temporal?.getState().undo();
    };

    const handleRedo = () => {
        (useStore as any).temporal?.getState().redo();
    };

    const handleSaveProject = () => {
        const slides = slidesV3.length > 0 ? slidesV3 : slidesV2.length > 0 ? slidesV2 : slidesV1;
        const projectData: ProjectData = {
          version: '1.0',
          appName,
          description,
          screenshots: screenshots.map(s => ({ id: s.id, url: s.url })),
          slides,
          settings: {
            designTheme,
            themeMode,
            frameStyle: frameStyle.toString(),
            deviceColor: deviceColor.toString(),
            fontStyle,
            accentColor,
            isPanoramic,
          },
          timestamp: Date.now(),
        };

        exportProjectAsJSON(projectData);
        toast.success('Project saved successfully');
    };

    const handleLoadProject = async (file: File) => {
        try {
          const text = await file.text();
          const data = JSON.parse(text) as ProjectData;

          setAppName(data.appName);
          setDescription(data.description);
          setSlidesV3(data.slides);
          setDesignTheme(data.settings.designTheme as DesignTheme);
          setThemeMode(data.settings.themeMode as ThemeMode);
          setFrameStyle(data.settings.frameStyle as unknown as FrameStyle);
          setDeviceColor(data.settings.deviceColor as unknown as DeviceColor);
          setFontStyle(data.settings.fontStyle as FontStyle);
          setAccentColor(data.settings.accentColor);
          setIsPanoramic(data.settings.isPanoramic || false);

          toast.success('Project loaded successfully');
        } catch (error) {
          logger.error('Failed to load project:', error);
          toast.error('Failed to load project');
        }
    };

    return (
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-surface/90 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase font-mono">Project: {appName || 'Untitled'}</span>
            {slidesV3.length > 0 && (
              <span className="bg-primary/20 text-primary text-[9px] font-bold px-2 py-1 rounded border border-primary/30 uppercase tracking-wider flex items-center gap-2">
                <Check className="w-3 h-3" /> V3: OPTIMIZED
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Undo/Redo Group */}
            <div className="flex items-center bg-white/5 rounded-lg p-1 mr-4 border border-white/10">
                <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className={`p-2 rounded-md transition-colors ${canUndo ? 'text-white hover:bg-white/10 hover:text-primary' : 'text-gray-600 cursor-not-allowed'}`}
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className={`p-2 rounded-md transition-colors ${canRedo ? 'text-white hover:bg-white/10 hover:text-primary' : 'text-gray-600 cursor-not-allowed'}`}
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowProjects(true)}
              className="bg-surfaceHighlight text-white hover:bg-white/10 hover:border-primary/50 font-bold rounded-lg px-4 text-xs uppercase tracking-wide border border-white/10 transition-all"
            >
              Projects
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveProject}
              disabled={slidesV3.length === 0 && slidesV2.length === 0 && slidesV1.length === 0}
              className="bg-surfaceHighlight text-white hover:bg-white/10 hover:border-primary/50 font-bold rounded-lg px-4 text-xs uppercase tracking-wide border border-white/10 transition-all"
            >
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <label>
              <input
                type="file"
                accept=".json,.screengenius.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleLoadProject(e.target.files[0]);
                  }
                }}
              />
              <span className="bg-surfaceHighlight text-white hover:bg-white/10 hover:border-primary/50 font-bold rounded-lg px-4 text-xs uppercase tracking-wide border border-white/10 cursor-pointer inline-flex items-center gap-2 py-2 transition-all">
                <Upload className="w-4 h-4" /> LOAD
              </span>
            </label>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowExportModal(true)}
              disabled={slidesV3.length === 0 && slidesV2.length === 0 && slidesV1.length === 0}
              className="bg-primary text-black hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] font-bold rounded-lg px-6 text-xs uppercase tracking-wide transition-all border border-transparent"
              data-tour="export-button"
            >
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </header>
    );
};
