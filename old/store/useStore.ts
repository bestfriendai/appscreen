import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo';
import {
  UploadedImage,
  GeneratedSlide,
  FrameStyle,
  DesignTheme,
  ThemeMode,
  DeviceColor,
  FontStyle,
  FloatingElement,
} from '../types';
import { AppStrategy } from '../types/AppStrategy';

interface AppState {
  // Screenshots
  screenshots: UploadedImage[];
  addScreenshots: (screenshots: UploadedImage[]) => void;
  removeScreenshot: (id: string) => void;

  // Slides (V1, V2, V3)
  slidesV1: GeneratedSlide[];
  slidesV2: GeneratedSlide[];
  slidesV3: GeneratedSlide[];
  setSlidesV1: (slides: GeneratedSlide[]) => void;
  setSlidesV2: (slides: GeneratedSlide[]) => void;
  setSlidesV3: (slides: GeneratedSlide[]) => void;
  updateSlide: (version: 'v1' | 'v2' | 'v3', slideId: string, updates: Partial<GeneratedSlide>) => void;
  duplicateSlide: (version: 'v1' | 'v2' | 'v3', slideId: string) => void;
  deleteSlide: (version: 'v1' | 'v2' | 'v3', slideId: string) => void;

  // App Info
  appName: string;
  description: string;
  setAppName: (name: string) => void;
  setDescription: (desc: string) => void;

  // Backgrounds
  generatedBackgrounds: string[];
  selectedBackground: string | null;
  visualPrompt: string;
  setGeneratedBackgrounds: (backgrounds: string[]) => void;
  addGeneratedBackground: (background: string) => void;
  setSelectedBackground: (background: string | null) => void;
  setVisualPrompt: (prompt: string) => void;

  // Design Settings
  frameStyle: FrameStyle;
  designTheme: DesignTheme;
  themeMode: ThemeMode;
  deviceColor: DeviceColor;
  fontStyle: FontStyle;
  accentColor: string;
  isPanoramic: boolean;
  forcedCategory: string;
  toneOfVoice: 'PROFESSIONAL' | 'PLAYFUL' | 'URGENT' | 'MINIMAL';
  appStrategy: AppStrategy | null; // NEW: Global cohesive strategy
  setFrameStyle: (style: FrameStyle) => void;
  setDesignTheme: (theme: DesignTheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setDeviceColor: (color: DeviceColor) => void;
  setFontStyle: (style: FontStyle) => void;
  setAccentColor: (color: string) => void;
  setIsPanoramic: (panoramic: boolean) => void;
  setForcedCategory: (category: string) => void;
  setToneOfVoice: (tone: 'PROFESSIONAL' | 'PLAYFUL' | 'URGENT' | 'MINIMAL') => void;
  setAppStrategy: (strategy: AppStrategy | null) => void;

  // UI State
  isGenerating: boolean;
  statusMessage: string;
  showManualControls: boolean;
  updatingSlideState: { id: string; message: string } | null;
  setIsGenerating: (generating: boolean) => void;
  setStatusMessage: (message: string) => void;
  setShowManualControls: (show: boolean) => void;
  setUpdatingSlideState: (state: { id: string; message: string } | null) => void;

  // Modal State
  editingSlide: GeneratedSlide | null;
  editTitle: string;
  editSubtitle: string;
  editingFloatingElementsSlide: GeneratedSlide | null;
  tempFloatingElements: FloatingElement[];
  showExportModal: boolean;
  showProjects: boolean;
  showStrategyReport: boolean;
  strategyData: any | null;
  setEditingSlide: (slide: GeneratedSlide | null) => void;
  setEditTitle: (title: string) => void;
  setEditSubtitle: (subtitle: string) => void;
  setEditingFloatingElementsSlide: (slide: GeneratedSlide | null) => void;
  setTempFloatingElements: (elements: FloatingElement[]) => void;
  setShowExportModal: (show: boolean) => void;
  setShowProjects: (show: boolean) => void;
  setShowStrategyReport: (show: boolean) => void;
  setStrategyData: (data: any | null) => void;

  // Custom Background
  customColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  setCustomColor: (color: string) => void;
  setGradientStart: (color: string) => void;
  setGradientEnd: (color: string) => void;
  setGradientAngle: (angle: number) => void;

  // Generation Progress
  generationSteps: Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
    progress?: number;
  }>;
  showGenerationProgress: boolean;
  setGenerationSteps: (steps: AppState['generationSteps']) => void;
  setShowGenerationProgress: (show: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  screenshots: [],
  slidesV1: [],
  slidesV2: [],
  slidesV3: [],
  appName: '',
  description: '',
  generatedBackgrounds: [],
  selectedBackground: null,
  visualPrompt: '',
  frameStyle: FrameStyle.FRAMELESS,
  designTheme: 'MODERN_MINIMAL' as DesignTheme,
  themeMode: 'DARK' as ThemeMode,
  deviceColor: DeviceColor.MIDNIGHT,
  fontStyle: 'MODERN_CLEAN' as FontStyle,
  accentColor: '#4F46E5',
  isPanoramic: true,
  forcedCategory: '',
  toneOfVoice: 'PROFESSIONAL' as 'PROFESSIONAL' | 'PLAYFUL' | 'URGENT' | 'MINIMAL',
  appStrategy: null,
  isGenerating: false,
  statusMessage: '',
  showManualControls: false,
  updatingSlideState: null,
  editingSlide: null,
  editTitle: '',
  editSubtitle: '',
  editingFloatingElementsSlide: null,
  tempFloatingElements: [],
  showExportModal: false,
  showProjects: false,
  showStrategyReport: false,
  strategyData: null,
  customColor: '#667eea',
  gradientStart: '#667eea',
  gradientEnd: '#f093fb',
  gradientAngle: 135,
  generationSteps: [],
  showGenerationProgress: false,
};

export const useStore = create<AppState>()(
  temporal(
    immer((set) => ({
      ...initialState,

      // Screenshots
      addScreenshots: (screenshots) =>
        set((state) => {
          state.screenshots.push(...screenshots);
        }),
      removeScreenshot: (id) =>
        set((state) => {
          state.screenshots = state.screenshots.filter((s) => s.id !== id);
        }),

      // Slides
      setSlidesV1: (slides) => set((state) => { state.slidesV1 = slides; }),
      setSlidesV2: (slides) => set((state) => { state.slidesV2 = slides; }),
      setSlidesV3: (slides) => set((state) => { state.slidesV3 = slides; }),

      updateSlide: (version, slideId, updates) =>
        set((state) => {
          const slidesKey = version === 'v1' ? 'slidesV1' : version === 'v2' ? 'slidesV2' : 'slidesV3';
          const slideIndex = state[slidesKey].findIndex((s) => s.id === slideId);
          if (slideIndex !== -1) {
            state[slidesKey][slideIndex] = { ...state[slidesKey][slideIndex], ...updates };
          }
        }),

      duplicateSlide: (version, slideId) =>
        set((state) => {
          const slidesKey = version === 'v1' ? 'slidesV1' : version === 'v2' ? 'slidesV2' : 'slidesV3';
          const slideIndex = state[slidesKey].findIndex((s) => s.id === slideId);
          if (slideIndex !== -1) {
            const newSlide = {
              ...state[slidesKey][slideIndex],
              id: Math.random().toString(36).substr(2, 9),
            };
            state[slidesKey].splice(slideIndex + 1, 0, newSlide);
          }
        }),

      deleteSlide: (version, slideId) =>
        set((state) => {
          const slidesKey = version === 'v1' ? 'slidesV1' : version === 'v2' ? 'slidesV2' : 'slidesV3';
          state[slidesKey] = state[slidesKey].filter((s) => s.id !== slideId);
        }),

      // App Info
      setAppName: (name) => set((state) => { state.appName = name; }),
      setDescription: (desc) => set((state) => { state.description = desc; }),

      // Backgrounds
      setGeneratedBackgrounds: (backgrounds) => set((state) => { state.generatedBackgrounds = backgrounds; }),
      addGeneratedBackground: (background) =>
        set((state) => {
          state.generatedBackgrounds.unshift(background);
        }),
      setSelectedBackground: (background) => set((state) => { state.selectedBackground = background; }),
      setVisualPrompt: (prompt) => set((state) => { state.visualPrompt = prompt; }),

      // Design Settings
      setFrameStyle: (style) => set((state) => { state.frameStyle = style; }),
      setDesignTheme: (theme) => set((state) => { state.designTheme = theme; }),
      setThemeMode: (mode) => set((state) => { state.themeMode = mode; }),
      setDeviceColor: (color) => set((state) => { state.deviceColor = color; }),
      setFontStyle: (style) => set((state) => { state.fontStyle = style; }),
      setAccentColor: (color) => set((state) => { state.accentColor = color; }),
      setIsPanoramic: (panoramic) => set((state) => { state.isPanoramic = panoramic; }),
      setForcedCategory: (category) => set((state) => { state.forcedCategory = category; }),
      setToneOfVoice: (tone) => set((state) => { state.toneOfVoice = tone; }),
      setAppStrategy: (strategy) => set((state) => { state.appStrategy = strategy; }),

      // UI State
      setIsGenerating: (generating) => set((state) => { state.isGenerating = generating; }),
      setStatusMessage: (message) => set((state) => { state.statusMessage = message; }),
      setShowManualControls: (show) => set((state) => { state.showManualControls = show; }),
      setUpdatingSlideState: (slideState) => set((state) => { state.updatingSlideState = slideState; }),

      // Modal State
      setEditingSlide: (slide) => set((state) => { state.editingSlide = slide; }),
      setEditTitle: (title) => set((state) => { state.editTitle = title; }),
      setEditSubtitle: (subtitle) => set((state) => { state.editSubtitle = subtitle; }),
      setEditingFloatingElementsSlide: (slide) => set((state) => { state.editingFloatingElementsSlide = slide; }),
      setTempFloatingElements: (elements) => set((state) => { state.tempFloatingElements = elements; }),
      setShowExportModal: (show) => set((state) => { state.showExportModal = show; }),
      setShowProjects: (show) => set((state) => { state.showProjects = show; }),
      setShowStrategyReport: (show) => set((state) => { state.showStrategyReport = show; }),
      setStrategyData: (data) => set((state) => { state.strategyData = data; }),

      // Custom Background
      setCustomColor: (color) => set((state) => { state.customColor = color; }),
      setGradientStart: (color) => set((state) => { state.gradientStart = color; }),
      setGradientEnd: (color) => set((state) => { state.gradientEnd = color; }),
      setGradientAngle: (angle) => set((state) => { state.gradientAngle = angle; }),

      // Generation Progress
      setGenerationSteps: (steps) => set((state) => { state.generationSteps = steps; }),
      setShowGenerationProgress: (show) => set((state) => { state.showGenerationProgress = show; }),

      // Reset
      reset: () => set(initialState),
    })),
    {
      limit: 50,
      partialize: (state) => {
        const {
          slidesV1,
          slidesV2,
          slidesV3,
          themeMode,
          frameStyle,
          deviceColor,
          fontStyle,
          accentColor,
          isPanoramic,
          selectedBackground,
          appStrategy
        } = state;
        return {
          slidesV1,
          slidesV2,
          slidesV3,
          themeMode,
          frameStyle,
          deviceColor,
          fontStyle,
          accentColor,
          isPanoramic,
          selectedBackground,
          appStrategy
        };
      },
    }
  )
);
