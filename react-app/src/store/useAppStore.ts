import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type {
  AppState,
  AppStore,
  Screenshot,
  BackgroundType,
  GradientSettings,
  GradientStop,
  ScreenshotPosition,
  ShadowSettings,
  BorderSettings,
  DeviceMode,
  DeviceFrame,
  TextStyleSettings,
  LanguageCode,
  OutputDevice,
  ExportSettings,
  TransferOptions,
  PositionPreset,
  LocalizedImage,
} from '../types';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_SCREENSHOT,
  DEFAULT_DEVICE,
  DEFAULT_NOISE,
  DEFAULT_TEXT,
  DEFAULT_EXPORT,
  POSITION_PRESETS,
} from '../types';
import { saveProject, loadProject, getProjects, deleteProjectFromDB, createNewProject } from '../lib/db';
import type { Template } from '../data/templates';

// Generate unique ID
const generateId = () => uuidv4();

// Read file as data URL
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get image dimensions
const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
};

// Initial state
const initialState: AppState = {
  // Project
  currentProjectId: null,
  projects: [],

  // Screenshots
  screenshots: [],
  selectedIndex: 0,

  // Output
  outputDevice: 'iphone-6.7',
  currentLanguage: 'en',
  projectLanguages: ['en'],

  // Defaults
  defaults: {
    background: { ...DEFAULT_BACKGROUND },
    screenshot: { ...DEFAULT_SCREENSHOT },
    device: { ...DEFAULT_DEVICE },
    noise: { ...DEFAULT_NOISE },
    text: { ...DEFAULT_TEXT },
  },

  // Export
  export: { ...DEFAULT_EXPORT },

  // UI state
  isLoading: false,
  isSaving: false,
  activeTab: 'background',
  showSettingsModal: false,
  showAboutModal: false,
  showProjectModal: false,
  showTranslationsModal: false,
  showLanguageModal: false,
  showExportModal: false,

  // Canvas state
  canvasReady: false,
  previewScale: 1,

  // Drag state
  isDragging: false,
  dragTarget: null,
};

export const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    ...initialState,

    // ==================== PROJECT ACTIONS ====================

    createProject: async (name: string) => {
      const project = await createNewProject(name);
      set((state) => {
        state.projects.push(project);
        state.currentProjectId = project.id;
        state.screenshots = [];
        state.selectedIndex = 0;
        state.defaults = {
          background: { ...DEFAULT_BACKGROUND },
          screenshot: { ...DEFAULT_SCREENSHOT },
          device: { ...DEFAULT_DEVICE },
          noise: { ...DEFAULT_NOISE },
          text: { ...DEFAULT_TEXT },
        };
      });
    },

    deleteProject: async (id: string) => {
      await deleteProjectFromDB(id);
      set((s) => {
        s.projects = s.projects.filter((p) => p.id !== id);
        if (s.currentProjectId === id) {
          s.currentProjectId = s.projects[0]?.id || null;
        }
      });
      // Load the new current project if exists
      const newState = get();
      if (newState.currentProjectId) {
        await get().switchProject(newState.currentProjectId);
      }
    },

    switchProject: async (id: string) => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const projectData = await loadProject(id);
        if (projectData) {
          set((state) => {
            state.currentProjectId = id;
            state.screenshots = projectData.screenshots;
            state.selectedIndex = projectData.selectedIndex;
            state.outputDevice = projectData.outputDevice;
            state.currentLanguage = projectData.currentLanguage;
            state.projectLanguages = projectData.projectLanguages;
            state.defaults = projectData.defaults;
            state.export = projectData.export;
            state.isLoading = false;
          });
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    renameProject: async (id: string, name: string) => {
      set((state) => {
        const project = state.projects.find((p) => p.id === id);
        if (project) {
          project.name = name;
          project.updatedAt = Date.now();
        }
      });
      await get().saveState();
    },

    loadProjects: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const projects = await getProjects();
        set((state) => {
          state.projects = projects;
          state.isLoading = false;
        });
        // Load first project if exists and none selected
        if (projects.length > 0 && !get().currentProjectId) {
          await get().switchProject(projects[0].id);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    // ==================== SCREENSHOT ACTIONS ====================

    addScreenshots: async (files: File[]) => {
      const newScreenshots: Screenshot[] = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        try {
          const dataUrl = await readFileAsDataURL(file);
          const dimensions = await getImageDimensions(dataUrl);

          const screenshot: Screenshot = {
            id: generateId(),
            filename: file.name,
            localizedImages: {
              [get().currentLanguage]: {
                dataUrl,
                filename: file.name,
                width: dimensions.width,
                height: dimensions.height,
              },
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          newScreenshots.push(screenshot);
        } catch (error) {
          console.error('Failed to process file:', file.name, error);
        }
      }

      if (newScreenshots.length > 0) {
        set((state) => {
          state.screenshots.push(...newScreenshots);
          state.selectedIndex = state.screenshots.length - 1;
        });
        await get().saveState();
      }
    },

    removeScreenshot: (id: string) => {
      set((state) => {
        const index = state.screenshots.findIndex((s) => s.id === id);
        if (index !== -1) {
          state.screenshots.splice(index, 1);
          if (state.selectedIndex >= state.screenshots.length) {
            state.selectedIndex = Math.max(0, state.screenshots.length - 1);
          }
        }
      });
      get().saveState();
    },

    selectScreenshot: (index: number) => {
      set((state) => {
        if (index >= 0 && index < state.screenshots.length) {
          state.selectedIndex = index;
        }
      });
    },

    reorderScreenshots: (fromIndex: number, toIndex: number) => {
      set((state) => {
        const [removed] = state.screenshots.splice(fromIndex, 1);
        state.screenshots.splice(toIndex, 0, removed);
        // Update selected index if needed
        if (state.selectedIndex === fromIndex) {
          state.selectedIndex = toIndex;
        } else if (fromIndex < state.selectedIndex && toIndex >= state.selectedIndex) {
          state.selectedIndex--;
        } else if (fromIndex > state.selectedIndex && toIndex <= state.selectedIndex) {
          state.selectedIndex++;
        }
      });
      get().saveState();
    },

    duplicateScreenshot: (id: string) => {
      set((state) => {
        const screenshot = state.screenshots.find((s) => s.id === id);
        if (screenshot) {
          const duplicate: Screenshot = {
            ...JSON.parse(JSON.stringify(screenshot)),
            id: generateId(),
            filename: `${screenshot.filename} (copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          const index = state.screenshots.findIndex((s) => s.id === id);
          state.screenshots.splice(index + 1, 0, duplicate);
          state.selectedIndex = index + 1;
        }
      });
      get().saveState();
    },

    // ==================== LOCALIZED IMAGE ACTIONS ====================

    addLocalizedImage: async (screenshotId: string, language: LanguageCode, file: File) => {
      try {
        const dataUrl = await readFileAsDataURL(file);
        const dimensions = await getImageDimensions(dataUrl);

        const localizedImage: LocalizedImage = {
          dataUrl,
          filename: file.name,
          width: dimensions.width,
          height: dimensions.height,
        };

        set((state) => {
          const screenshot = state.screenshots.find((s) => s.id === screenshotId);
          if (screenshot) {
            screenshot.localizedImages[language] = localizedImage;
            screenshot.updatedAt = Date.now();
          }
        });
        await get().saveState();
      } catch (error) {
        console.error('Failed to add localized image:', error);
      }
    },

    removeLocalizedImage: (screenshotId: string, language: LanguageCode) => {
      set((state) => {
        const screenshot = state.screenshots.find((s) => s.id === screenshotId);
        if (screenshot && screenshot.localizedImages[language]) {
          delete screenshot.localizedImages[language];
          screenshot.updatedAt = Date.now();
        }
      });
      get().saveState();
    },

    // ==================== BACKGROUND ACTIONS ====================

    setBackgroundType: (type: BackgroundType) => {
      set((state) => {
        state.defaults.background.type = type;
      });
      get().saveState();
    },

    setBackgroundColor: (color: string) => {
      set((state) => {
        state.defaults.background.color = color;
      });
      get().saveState();
    },

    setGradient: (gradient: Partial<GradientSettings>) => {
      set((state) => {
        Object.assign(state.defaults.background.gradient, gradient);
      });
      get().saveState();
    },

    addGradientStop: (stop: GradientStop) => {
      set((state) => {
        state.defaults.background.gradient.stops.push(stop);
        state.defaults.background.gradient.stops.sort((a, b) => a.position - b.position);
      });
      get().saveState();
    },

    updateGradientStop: (id: string, updates: Partial<GradientStop>) => {
      set((state) => {
        const stop = state.defaults.background.gradient.stops.find((s) => s.id === id);
        if (stop) {
          Object.assign(stop, updates);
          state.defaults.background.gradient.stops.sort((a, b) => a.position - b.position);
        }
      });
      get().saveState();
    },

    removeGradientStop: (id: string) => {
      set((state) => {
        if (state.defaults.background.gradient.stops.length > 2) {
          state.defaults.background.gradient.stops = state.defaults.background.gradient.stops.filter(
            (s) => s.id !== id
          );
        }
      });
      get().saveState();
    },

    setBackgroundImage: async (file: File) => {
      try {
        const dataUrl = await readFileAsDataURL(file);
        const dimensions = await getImageDimensions(dataUrl);

        set((state) => {
          state.defaults.background.image = {
            dataUrl,
            originalWidth: dimensions.width,
            originalHeight: dimensions.height,
          };
          state.defaults.background.type = 'image';
        });
        await get().saveState();
      } catch (error) {
        console.error('Failed to set background image:', error);
      }
    },

    clearBackgroundImage: () => {
      set((state) => {
        state.defaults.background.image = null;
        if (state.defaults.background.type === 'image') {
          state.defaults.background.type = 'gradient';
        }
      });
      get().saveState();
    },

    setImageBlur: (blur: number) => {
      set((state) => {
        state.defaults.background.imageBlur = blur;
      });
      get().saveState();
    },

    setImageOverlay: (color: string, opacity: number) => {
      set((state) => {
        state.defaults.background.imageOverlayColor = color;
        state.defaults.background.imageOverlayOpacity = opacity;
      });
      get().saveState();
    },

    // ==================== SCREENSHOT SETTINGS ACTIONS ====================

    setScreenshotPosition: (position: Partial<ScreenshotPosition>) => {
      set((state) => {
        Object.assign(state.defaults.screenshot.position, position);
      });
      get().saveState();
    },

    setScreenshotScale: (scale: number) => {
      set((state) => {
        state.defaults.screenshot.scale = scale;
      });
      get().saveState();
    },

    setScreenshotRotation: (rotation: number) => {
      set((state) => {
        state.defaults.screenshot.rotation = rotation;
      });
      get().saveState();
    },

    setScreenshotCornerRadius: (radius: number) => {
      set((state) => {
        state.defaults.screenshot.cornerRadius = radius;
      });
      get().saveState();
    },

    setShadowSettings: (settings: Partial<ShadowSettings>) => {
      set((state) => {
        Object.assign(state.defaults.screenshot.shadow, settings);
      });
      get().saveState();
    },

    setBorderSettings: (settings: Partial<BorderSettings>) => {
      set((state) => {
        Object.assign(state.defaults.screenshot.border, settings);
      });
      get().saveState();
    },

    applyPositionPreset: (preset: PositionPreset) => {
      const presetConfig = POSITION_PRESETS[preset];
      set((state) => {
        Object.assign(state.defaults.screenshot, presetConfig.settings);
      });
      get().saveState();
    },

    // ==================== DEVICE ACTIONS ====================

    setDeviceMode: (mode: DeviceMode) => {
      set((state) => {
        state.defaults.device.mode = mode;
      });
      get().saveState();
    },

    setDeviceFrame: (frame: DeviceFrame) => {
      set((state) => {
        state.defaults.device.frame = frame;
        state.defaults.device.showFrame = frame !== 'none';
      });
      get().saveState();
    },

    setDevice3DRotation: (rotation: { x?: number; y?: number; z?: number }) => {
      set((state) => {
        if (rotation.x !== undefined) state.defaults.device.rotationX = rotation.x;
        if (rotation.y !== undefined) state.defaults.device.rotationY = rotation.y;
        if (rotation.z !== undefined) state.defaults.device.rotationZ = rotation.z;
      });
      get().saveState();
    },

    setDevice3DScale: (scale: number) => {
      set((state) => {
        state.defaults.device.scale3d = scale;
      });
      get().saveState();
    },

    // ==================== NOISE ACTIONS ====================

    setNoiseEnabled: (enabled: boolean) => {
      set((state) => {
        state.defaults.noise.enabled = enabled;
      });
      get().saveState();
    },

    setNoiseOpacity: (opacity: number) => {
      set((state) => {
        state.defaults.noise.opacity = opacity;
      });
      get().saveState();
    },

    setNoiseScale: (scale: number) => {
      set((state) => {
        state.defaults.noise.scale = scale;
      });
      get().saveState();
    },

    // ==================== TEXT ACTIONS ====================

    setHeadlineEnabled: (enabled: boolean) => {
      set((state) => {
        state.defaults.text.headline.enabled = enabled;
      });
      get().saveState();
    },

    setSubheadlineEnabled: (enabled: boolean) => {
      set((state) => {
        state.defaults.text.subheadline.enabled = enabled;
      });
      get().saveState();
    },

    setHeadlineStyle: (style: Partial<TextStyleSettings>) => {
      set((state) => {
        Object.assign(state.defaults.text.headline, style);
      });
      get().saveState();
    },

    setSubheadlineStyle: (style: Partial<TextStyleSettings>) => {
      set((state) => {
        Object.assign(state.defaults.text.subheadline, style);
      });
      get().saveState();
    },

    setHeadlineText: (language: LanguageCode, text: string) => {
      set((state) => {
        state.defaults.text.headlines[language] = text;
      });
      get().saveState();
    },

    setSubheadlineText: (language: LanguageCode, text: string) => {
      set((state) => {
        state.defaults.text.subheadlines[language] = text;
      });
      get().saveState();
    },

    setUsePerScreenshotText: (use: boolean) => {
      set((state) => {
        state.defaults.text.usePerScreenshot = use;
      });
      get().saveState();
    },

    // ==================== LANGUAGE ACTIONS ====================

    setCurrentLanguage: (language: LanguageCode) => {
      set((state) => {
        state.currentLanguage = language;
      });
      get().saveState();
    },

    addProjectLanguage: (language: LanguageCode) => {
      set((state) => {
        if (!state.projectLanguages.includes(language)) {
          state.projectLanguages.push(language);
        }
      });
      get().saveState();
    },

    removeProjectLanguage: (language: LanguageCode) => {
      set((state) => {
        if (state.projectLanguages.length > 1) {
          state.projectLanguages = state.projectLanguages.filter((l) => l !== language);
          if (state.currentLanguage === language) {
            state.currentLanguage = state.projectLanguages[0];
          }
        }
      });
      get().saveState();
    },

    // ==================== OUTPUT DEVICE ====================

    setOutputDevice: (device: OutputDevice) => {
      set((state) => {
        state.outputDevice = device;
      });
      get().saveState();
    },

    // ==================== EXPORT ACTIONS ====================

    setExportSettings: (settings: Partial<ExportSettings>) => {
      set((state) => {
        Object.assign(state.export, settings);
      });
      get().saveState();
    },

    exportCurrent: async () => {
      // Will be implemented with canvas rendering
      console.log('Export current screenshot');
    },

    exportAll: async () => {
      // Will be implemented with canvas rendering
      console.log('Export all screenshots');
    },

    exportSelected: async (indices: number[]) => {
      // Will be implemented with canvas rendering
      console.log('Export selected screenshots:', indices);
    },

    // ==================== STYLE TRANSFER ====================

    transferStyle: (fromId: string, toIds: string[], options: TransferOptions) => {
      const state = get();
      const sourceScreenshot = state.screenshots.find((s) => s.id === fromId);
      if (!sourceScreenshot) return;

      set((s) => {
        for (const targetId of toIds) {
          const target = s.screenshots.find((sc) => sc.id === targetId);
          if (!target) continue;

          if (options.background && sourceScreenshot.background) {
            target.background = { ...sourceScreenshot.background };
          }
          if (options.screenshot && sourceScreenshot.screenshot) {
            target.screenshot = { ...sourceScreenshot.screenshot };
          }
          if (options.device && sourceScreenshot.device) {
            target.device = { ...sourceScreenshot.device };
          }
          if (options.noise && sourceScreenshot.noise) {
            target.noise = { ...sourceScreenshot.noise };
          }
          if (options.text && sourceScreenshot.text) {
            target.text = JSON.parse(JSON.stringify(sourceScreenshot.text));
          }
          target.updatedAt = Date.now();
        }
      });
      get().saveState();
    },

    applyStyleToAll: (options: TransferOptions) => {
      const state = get();
      const currentScreenshot = state.screenshots[state.selectedIndex];
      if (!currentScreenshot) return;

      const otherIds = state.screenshots
        .filter((s) => s.id !== currentScreenshot.id)
        .map((s) => s.id);

      get().transferStyle(currentScreenshot.id, otherIds, options);
    },

    // ==================== UI ACTIONS ====================

    setActiveTab: (tab: 'background' | 'device' | 'text') => {
      set((state) => {
        state.activeTab = tab;
      });
    },

    setShowSettingsModal: (show: boolean) => {
      set((state) => {
        state.showSettingsModal = show;
      });
    },

    setShowAboutModal: (show: boolean) => {
      set((state) => {
        state.showAboutModal = show;
      });
    },

    setShowProjectModal: (show: boolean) => {
      set((state) => {
        state.showProjectModal = show;
      });
    },

    setShowTranslationsModal: (show: boolean) => {
      set((state) => {
        state.showTranslationsModal = show;
      });
    },

    setShowLanguageModal: (show: boolean) => {
      set((state) => {
        state.showLanguageModal = show;
      });
    },

    setShowExportModal: (show: boolean) => {
      set((state) => {
        state.showExportModal = show;
      });
    },

    setPreviewScale: (scale: number) => {
      set((state) => {
        state.previewScale = scale;
      });
    },

    // ==================== PERSISTENCE ====================

    saveState: async () => {
      const state = get();
      if (!state.currentProjectId) return;

      set((s) => {
        s.isSaving = true;
      });

      try {
        await saveProject(state.currentProjectId, {
          id: state.currentProjectId,
          name: state.projects.find((p) => p.id === state.currentProjectId)?.name || 'Untitled',
          screenshots: state.screenshots,
          selectedIndex: state.selectedIndex,
          outputDevice: state.outputDevice,
          currentLanguage: state.currentLanguage,
          projectLanguages: state.projectLanguages,
          defaults: state.defaults,
          export: state.export,
          createdAt: state.projects.find((p) => p.id === state.currentProjectId)?.createdAt || Date.now(),
          updatedAt: Date.now(),
        });

        // Update project metadata
        set((s) => {
          const project = s.projects.find((p) => p.id === state.currentProjectId);
          if (project) {
            project.screenshotCount = state.screenshots.length;
            project.updatedAt = Date.now();
          }
          s.isSaving = false;
        });
      } catch (error) {
        console.error('Failed to save state:', error);
        set((s) => {
          s.isSaving = false;
        });
      }
    },

    loadState: async () => {
      await get().loadProjects();
    },

    // ==================== RESET ====================

    resetToDefaults: () => {
      set((state) => {
        state.defaults = {
          background: { ...DEFAULT_BACKGROUND },
          screenshot: { ...DEFAULT_SCREENSHOT },
          device: { ...DEFAULT_DEVICE },
          noise: { ...DEFAULT_NOISE },
          text: { ...DEFAULT_TEXT },
        };
      });
      get().saveState();
    },

    // ==================== TEMPLATE ACTIONS ====================

    applyTemplate: (template: Template) => {
      set((state) => {
        // Apply background settings
        if (template.background) {
          if (template.background.type) {
            state.defaults.background.type = template.background.type;
          }
          if (template.background.gradient) {
            state.defaults.background.gradient = {
              ...state.defaults.background.gradient,
              ...template.background.gradient,
            };
          }
          if (template.background.color) {
            state.defaults.background.color = template.background.color;
          }
        }

        // Apply screenshot settings
        if (template.screenshot) {
          Object.assign(state.defaults.screenshot, template.screenshot);
        }

        // Apply text settings
        if (template.text) {
          if (template.text.headline) {
            Object.assign(state.defaults.text.headline, template.text.headline);
          }
          if (template.text.subheadline) {
            Object.assign(state.defaults.text.subheadline, template.text.subheadline);
          }
        }
      });
      get().saveState();
    },
  }))
);

// Selector hooks for performance
export const useScreenshots = () => useAppStore((state) => state.screenshots);
export const useSelectedIndex = () => useAppStore((state) => state.selectedIndex);
export const useCurrentScreenshot = () =>
  useAppStore((state) => state.screenshots[state.selectedIndex]);
export const useDefaults = () => useAppStore((state) => state.defaults);
export const useBackground = () => useAppStore((state) => state.defaults.background);
export const useScreenshotSettings = () => useAppStore((state) => state.defaults.screenshot);
export const useDeviceSettings = () => useAppStore((state) => state.defaults.device);
export const useNoiseSettings = () => useAppStore((state) => state.defaults.noise);
export const useTextSettings = () => useAppStore((state) => state.defaults.text);
export const useCurrentLanguage = () => useAppStore((state) => state.currentLanguage);
export const useProjectLanguages = () => useAppStore((state) => state.projectLanguages);
export const useOutputDevice = () => useAppStore((state) => state.outputDevice);
export const useExportSettings = () => useAppStore((state) => state.export);
export const useProjects = () => useAppStore((state) => state.projects);
export const useCurrentProjectId = () => useAppStore((state) => state.currentProjectId);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useIsSaving = () => useAppStore((state) => state.isSaving);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
