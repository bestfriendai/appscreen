// Output device types
export type OutputDevice =
  | 'iphone-6.7'
  | 'iphone-6.5'
  | 'iphone-5.5'
  | 'ipad-13'
  | 'ipad-12.9';

export interface OutputDeviceConfig {
  name: string;
  width: number;
  height: number;
  label: string;
}

export const OUTPUT_DEVICES: Record<OutputDevice, OutputDeviceConfig> = {
  'iphone-6.7': { name: 'iPhone 6.7"', width: 1290, height: 2796, label: '6.7" Display' },
  'iphone-6.5': { name: 'iPhone 6.5"', width: 1284, height: 2778, label: '6.5" Display' },
  'iphone-5.5': { name: 'iPhone 5.5"', width: 1242, height: 2208, label: '5.5" Display' },
  'ipad-13': { name: 'iPad 13"', width: 2064, height: 2752, label: '13" Display' },
  'ipad-12.9': { name: 'iPad 12.9"', width: 2048, height: 2732, label: '12.9" Display' },
};

// Language codes
export type LanguageCode = string; // e.g., 'en', 'de', 'fr', 'ja', 'zh-Hans'

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

// Gradient types
export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0-100
}

export type GradientType = 'linear' | 'radial';

export interface GradientSettings {
  type: GradientType;
  angle: number; // 0-360 for linear
  stops: GradientStop[];
}

// Background types
export type BackgroundType = 'solid' | 'gradient' | 'image';

export interface BackgroundImage {
  dataUrl: string;
  originalWidth: number;
  originalHeight: number;
}

export interface BackgroundSettings {
  type: BackgroundType;
  color: string;
  gradient: GradientSettings;
  image: BackgroundImage | null;
  imageBlur: number;
  imageOverlayColor: string;
  imageOverlayOpacity: number;
}

// Noise settings
export interface NoiseSettings {
  enabled: boolean;
  opacity: number;
  scale: number;
}

// Device frame settings
export type DeviceMode = '2d' | '3d';
export type DeviceFrame = 'none' | 'iphone-15-pro-max' | 'iphone-15-pro' | 'iphone-15';

export interface DeviceSettings {
  mode: DeviceMode;
  frame: DeviceFrame;
  showFrame: boolean;
  frameColor: string;
  // 3D specific
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale3d: number;
}

// Screenshot positioning
export interface ScreenshotPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface ScreenshotSettings {
  position: ScreenshotPosition;
  scale: number; // 0.1 - 2
  rotation: number; // degrees
  cornerRadius: number;
  shadow: ShadowSettings;
  border: BorderSettings;
}

export interface ShadowSettings {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  spread: number;
}

export interface BorderSettings {
  enabled: boolean;
  color: string;
  width: number;
}

// Text settings
export type TextAlignment = 'left' | 'center' | 'right';
export type TextPosition = 'top' | 'bottom';

export interface TextStyleSettings {
  enabled: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  alignment: TextAlignment;
  position: TextPosition;
  offsetY: number;
  letterSpacing: number;
  lineHeight: number;
  maxWidth: number;
}

export interface LocalizedText {
  [languageCode: string]: string;
}

export interface TextSettings {
  headline: TextStyleSettings;
  subheadline: TextStyleSettings;
  headlines: LocalizedText;
  subheadlines: LocalizedText;
  usePerScreenshot: boolean;
}

// Localized image for a screenshot
export interface LocalizedImage {
  dataUrl: string;
  filename: string;
  width: number;
  height: number;
}

export interface LocalizedImages {
  [languageCode: string]: LocalizedImage;
}

// Screenshot entry
export interface Screenshot {
  id: string;
  filename: string;
  localizedImages: LocalizedImages;
  // Per-screenshot overrides (optional)
  background?: Partial<BackgroundSettings>;
  screenshot?: Partial<ScreenshotSettings>;
  device?: Partial<DeviceSettings>;
  noise?: Partial<NoiseSettings>;
  text?: {
    headline?: Partial<TextStyleSettings>;
    subheadline?: Partial<TextStyleSettings>;
    headlines?: LocalizedText;
    subheadlines?: LocalizedText;
  };
  // Creation metadata
  createdAt: number;
  updatedAt: number;
}

// Position presets
export type PositionPreset =
  | 'centered'
  | 'top'
  | 'bottom'
  | 'bleed-top'
  | 'bleed-bottom'
  | 'tilt-left'
  | 'tilt-right'
  | 'perspective'
  | 'float';

export interface PresetConfig {
  name: string;
  icon: string;
  settings: Partial<ScreenshotSettings>;
}

// Export settings
export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type ExportScope = 'current' | 'all' | 'selected';

export interface ExportSettings {
  format: ExportFormat;
  quality: number; // 0-100 for jpeg/webp
  scale: number; // 1, 2, 3 for retina
  includeLanguages: LanguageCode[] | 'all' | 'current';
}

// Project structure
export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  screenshotCount: number;
}

export interface ProjectData {
  id: string;
  name: string;
  screenshots: Screenshot[];
  selectedIndex: number;
  outputDevice: OutputDevice;
  currentLanguage: LanguageCode;
  projectLanguages: LanguageCode[];
  defaults: {
    background: BackgroundSettings;
    screenshot: ScreenshotSettings;
    device: DeviceSettings;
    noise: NoiseSettings;
    text: TextSettings;
  };
  export: ExportSettings;
  createdAt: number;
  updatedAt: number;
}

// App state (extends project data with UI state)
export interface AppState extends Omit<ProjectData, 'id' | 'name' | 'createdAt' | 'updatedAt'> {
  // Current project
  currentProjectId: string | null;
  projects: Project[];

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  activeTab: 'background' | 'device' | 'text';
  showSettingsModal: boolean;
  showAboutModal: boolean;
  showProjectModal: boolean;
  showTranslationsModal: boolean;
  showLanguageModal: boolean;
  showExportModal: boolean;

  // Canvas state
  canvasReady: boolean;
  previewScale: number;

  // Drag state
  isDragging: boolean;
  dragTarget: 'screenshot' | 'gradient-stop' | null;
}

// Actions interface for Zustand store
export interface AppActions {
  // Project actions
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  switchProject: (id: string) => Promise<void>;
  renameProject: (id: string, name: string) => Promise<void>;
  loadProjects: () => Promise<void>;

  // Screenshot actions
  addScreenshots: (files: File[]) => Promise<void>;
  removeScreenshot: (id: string) => void;
  selectScreenshot: (index: number) => void;
  reorderScreenshots: (fromIndex: number, toIndex: number) => void;
  duplicateScreenshot: (id: string) => void;

  // Localized image actions
  addLocalizedImage: (screenshotId: string, language: LanguageCode, file: File) => Promise<void>;
  removeLocalizedImage: (screenshotId: string, language: LanguageCode) => void;

  // Background actions
  setBackgroundType: (type: BackgroundType) => void;
  setBackgroundColor: (color: string) => void;
  setGradient: (gradient: Partial<GradientSettings>) => void;
  addGradientStop: (stop: GradientStop) => void;
  updateGradientStop: (id: string, updates: Partial<GradientStop>) => void;
  removeGradientStop: (id: string) => void;
  setBackgroundImage: (file: File) => Promise<void>;
  clearBackgroundImage: () => void;
  setImageBlur: (blur: number) => void;
  setImageOverlay: (color: string, opacity: number) => void;

  // Screenshot settings actions
  setScreenshotPosition: (position: Partial<ScreenshotPosition>) => void;
  setScreenshotScale: (scale: number) => void;
  setScreenshotRotation: (rotation: number) => void;
  setScreenshotCornerRadius: (radius: number) => void;
  setShadowSettings: (settings: Partial<ShadowSettings>) => void;
  setBorderSettings: (settings: Partial<BorderSettings>) => void;
  applyPositionPreset: (preset: PositionPreset) => void;

  // Device actions
  setDeviceMode: (mode: DeviceMode) => void;
  setDeviceFrame: (frame: DeviceFrame) => void;
  setDevice3DRotation: (rotation: { x?: number; y?: number; z?: number }) => void;
  setDevice3DScale: (scale: number) => void;

  // Noise actions
  setNoiseEnabled: (enabled: boolean) => void;
  setNoiseOpacity: (opacity: number) => void;
  setNoiseScale: (scale: number) => void;

  // Text actions
  setHeadlineEnabled: (enabled: boolean) => void;
  setSubheadlineEnabled: (enabled: boolean) => void;
  setHeadlineStyle: (style: Partial<TextStyleSettings>) => void;
  setSubheadlineStyle: (style: Partial<TextStyleSettings>) => void;
  setHeadlineText: (language: LanguageCode, text: string) => void;
  setSubheadlineText: (language: LanguageCode, text: string) => void;
  setUsePerScreenshotText: (use: boolean) => void;

  // Language actions
  setCurrentLanguage: (language: LanguageCode) => void;
  addProjectLanguage: (language: LanguageCode) => void;
  removeProjectLanguage: (language: LanguageCode) => void;

  // Output device
  setOutputDevice: (device: OutputDevice) => void;

  // Export actions
  setExportSettings: (settings: Partial<ExportSettings>) => void;
  exportCurrent: () => Promise<void>;
  exportAll: () => Promise<void>;
  exportSelected: (indices: number[]) => Promise<void>;

  // Style transfer
  transferStyle: (fromId: string, toIds: string[], options: TransferOptions) => void;
  applyStyleToAll: (options: TransferOptions) => void;

  // UI actions
  setActiveTab: (tab: 'background' | 'device' | 'text') => void;
  setShowSettingsModal: (show: boolean) => void;
  setShowAboutModal: (show: boolean) => void;
  setShowProjectModal: (show: boolean) => void;
  setShowTranslationsModal: (show: boolean) => void;
  setShowLanguageModal: (show: boolean) => void;
  setShowExportModal: (show: boolean) => void;
  setPreviewScale: (scale: number) => void;

  // Persistence
  saveState: () => Promise<void>;
  loadState: () => Promise<void>;

  // Reset
  resetToDefaults: () => void;

  // Template actions
  applyTemplate: (template: import('../data/templates').Template) => void;
}

// Transfer options for style copying
export interface TransferOptions {
  background?: boolean;
  screenshot?: boolean;
  device?: boolean;
  noise?: boolean;
  text?: boolean;
}

// Combined store type
export type AppStore = AppState & AppActions;

// Default values
export const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: 'gradient',
  color: '#1a1a2e',
  gradient: {
    type: 'linear',
    angle: 180,
    stops: [
      { id: '1', color: '#667eea', position: 0 },
      { id: '2', color: '#764ba2', position: 100 },
    ],
  },
  image: null,
  imageBlur: 0,
  imageOverlayColor: '#000000',
  imageOverlayOpacity: 0,
};

export const DEFAULT_SCREENSHOT: ScreenshotSettings = {
  position: { x: 50, y: 50 },
  scale: 0.7,
  rotation: 0,
  cornerRadius: 40,
  shadow: {
    enabled: true,
    color: 'rgba(0, 0, 0, 0.4)',
    blur: 60,
    offsetX: 0,
    offsetY: 30,
    spread: 0,
  },
  border: {
    enabled: false,
    color: '#ffffff',
    width: 2,
  },
};

export const DEFAULT_DEVICE: DeviceSettings = {
  mode: '2d',
  frame: 'none',
  showFrame: false,
  frameColor: '#1a1a1a',
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale3d: 1,
};

export const DEFAULT_NOISE: NoiseSettings = {
  enabled: false,
  opacity: 0.05,
  scale: 1,
};

export const DEFAULT_HEADLINE: TextStyleSettings = {
  enabled: true,
  fontFamily: 'SF Pro Display',
  fontSize: 72,
  fontWeight: 700,
  color: '#ffffff',
  alignment: 'center',
  position: 'top',
  offsetY: 120,
  letterSpacing: -1,
  lineHeight: 1.1,
  maxWidth: 90,
};

export const DEFAULT_SUBHEADLINE: TextStyleSettings = {
  enabled: false,
  fontFamily: 'SF Pro Display',
  fontSize: 36,
  fontWeight: 400,
  color: 'rgba(255, 255, 255, 0.8)',
  alignment: 'center',
  position: 'top',
  offsetY: 200,
  letterSpacing: 0,
  lineHeight: 1.3,
  maxWidth: 80,
};

export const DEFAULT_TEXT: TextSettings = {
  headline: DEFAULT_HEADLINE,
  subheadline: DEFAULT_SUBHEADLINE,
  headlines: { en: '' },
  subheadlines: { en: '' },
  usePerScreenshot: false,
};

export const DEFAULT_EXPORT: ExportSettings = {
  format: 'png',
  quality: 100,
  scale: 1,
  includeLanguages: 'current',
};

// Position presets configuration
export const POSITION_PRESETS: Record<PositionPreset, PresetConfig> = {
  centered: {
    name: 'Centered',
    icon: 'target',
    settings: {
      position: { x: 50, y: 50 },
      scale: 0.7,
      rotation: 0,
    },
  },
  top: {
    name: 'Top',
    icon: 'arrow-up',
    settings: {
      position: { x: 50, y: 25 },
      scale: 0.7,
      rotation: 0,
    },
  },
  bottom: {
    name: 'Bottom',
    icon: 'arrow-down',
    settings: {
      position: { x: 50, y: 75 },
      scale: 0.7,
      rotation: 0,
    },
  },
  'bleed-top': {
    name: 'Bleed Top',
    icon: 'arrow-up-circle',
    settings: {
      position: { x: 50, y: 65 },
      scale: 0.85,
      rotation: 0,
    },
  },
  'bleed-bottom': {
    name: 'Bleed Bottom',
    icon: 'arrow-down-circle',
    settings: {
      position: { x: 50, y: 35 },
      scale: 0.85,
      rotation: 0,
    },
  },
  'tilt-left': {
    name: 'Tilt Left',
    icon: 'rotate-ccw',
    settings: {
      position: { x: 50, y: 50 },
      scale: 0.65,
      rotation: -5,
    },
  },
  'tilt-right': {
    name: 'Tilt Right',
    icon: 'rotate-cw',
    settings: {
      position: { x: 50, y: 50 },
      scale: 0.65,
      rotation: 5,
    },
  },
  perspective: {
    name: 'Perspective',
    icon: 'box',
    settings: {
      position: { x: 50, y: 50 },
      scale: 0.6,
      rotation: -8,
    },
  },
  float: {
    name: 'Float',
    icon: 'cloud',
    settings: {
      position: { x: 50, y: 45 },
      scale: 0.75,
      rotation: 0,
    },
  },
};

// Common languages list
export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
];
