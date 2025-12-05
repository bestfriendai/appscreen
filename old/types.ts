
export interface UploadedImage {
  id: string;
  url: string;
  file: File;
}

export interface Widget {
  id?: string;
  type: 'rating' | 'award' | 'download' | 'security' | 'speed' | 'custom';
  text: string;
  icon?: string;
}

export interface FloatingElement {
  id: string;
  type: 'pill' | 'card' | 'notification' | 'icon_bubble' | 'review' | 'image';
  text?: string;
  subtext?: string;
  icon?: string; // lucide icon name
  imageUrl?: string; // For type 'image'
  position: { x: number, y: number, rotate: number, scale: number };
}

export interface GeneratedSlide {
  id: string;
  screenshotId: string;
  screenshotUrl: string;
  secondaryScreenshotUrl?: string; // For double phone layouts
  title: string;
  subtitle: string;
  keywords: string[]; // ASO Keywords to highlight
  backgroundUrl: string;
  layout: LayoutType;
  colorAccent?: string;
  widgets?: Widget[];
  floatingElements?: FloatingElement[]; // NEW: For that "Buffer" look
  deviceOffset?: { x: number; y: number }; // NEW: Manual drag offset for device
  textOffset?: { x: number; y: number }; // NEW: Manual drag offset for text
  customTextColor?: string; // NEW: Manual override for text color
  customFontSize?: number; // NEW: Manual override for font size
}

export type LayoutType =
  | 'classic'
  | 'minimal_float'
  | 'zoom_top'
  | 'zoom_bottom'
  | 'tilted_dynamic'
  | 'isometric_stack'
  | 'off_axis_left'
  | 'double_phones'
  | 'bento_grid'
  | 'magazine_cover'
  | 'spiral_stack'
  | 'overlapping_cards'
  | 'diagonal_flow'
  | 'perspective_spread'
  | 'split_screen'
  | 'device_grid'
  | 'feature_list'
  | 'floating_hero'
  | 'duo_overlap'
  | 'tri_stack_angle'
  | 'quad_grid'
  | 'landscape_float'
  | 'card_focus'
  | 'minimal_type'
  | 'poster_hero'
  // Panoramic layouts - device spans between frames
  | 'panoramic_right'      // Device at right edge, continues to next frame
  | 'panoramic_left'       // Device at left edge, continues from previous frame
  | 'panoramic_center_right' // Device splits between frames 50/50
  // Hero/offset layouts
  | 'offset_right'         // Device offset to right with rotation
  | 'offset_left'          // Device offset to left with rotation
  | 'hero_large'           // Large centered device, high impact
  // Duo layouts
  | 'duo_side_by_side';    // Two devices side by side

export type DesignTheme =
  | 'MODERN_MINIMAL'  // Clean, gradients, soft shadows
  | 'SWISS_BRUTALISM' // Bold, solid colors, huge text, flat frames
  | 'NEON_CYBER'      // Dark, grids, glows, HUDs
  | 'SOFT_LUXURY'     // Beige, serif, elegant, noise
  | 'GLASS_MORPHISM'  // Frosty, airy, translucent
  | 'CLEAN_PRO';      // NEW: White/Gray, Matte Clay, Crisp Typography (Buffer Style)

export type ThemeMode = 'LIGHT' | 'DARK';

export type StoryArchetype =
  | 'PROBLEM_SOLUTION' // Slide 1: Problem, Slide 2: Solution...
  | 'FEATURE_BLITZ'    // Fast paced feature showcase
  | 'LIFESTYLE_VIBE'   // Focus on feelings and results
  | 'USER_JOURNEY';    // Step 1, Step 2, Step 3...

export interface AppState {
  screenshots: UploadedImage[];
  slidesV1: GeneratedSlide[];
  slidesV2: GeneratedSlide[];
  slidesV3: GeneratedSlide[]; // NEW: Final ASO Polish
  appName: string;
  appDescription: string;
  generatedBackgrounds: string[];
  selectedBackground: string | null;
  frameStyle: FrameStyle;
  designTheme: DesignTheme;
  themeMode: ThemeMode; // NEW
  deviceColor: DeviceColor;
  fontStyle: FontStyle;
  isPanoramic: boolean;
  isGenerating: boolean;
  generationStage: 'IDLE' | 'ANALYZING' | 'RENDERING_V1' | 'CRITIQUING' | 'RENDERING_V2' | 'POLISHING_COPY' | 'DONE';
}

export enum FrameStyle {
  FRAMELESS = 'FRAMELESS',
  GLOW = 'GLOW',
  GLASS_FROST = 'GLASS_FROST',
  CERAMIC = 'CERAMIC',
  TITANIUM = 'TITANIUM',
  FLAT = 'FLAT',
  OUTLINE = 'OUTLINE',
  MATTE = 'MATTE', // NEW: Clay style
  PREMIUM_GLASS = 'PREMIUM_GLASS' // NEW: High-end glass look
}

export enum DeviceColor {
  MIDNIGHT = '#1c1c1e',
  SILVER = '#e3e3e3',
  DEEP_PURPLE = '#483D58',
  GOLD = '#fae7cf',
  NEON_BLUE = '#00f2ff',
  NEON_PINK = '#ff0099',
  TITANIUM_NATURAL = '#bebdb8',
  OFF_WHITE = '#f5f5f7', // For Light Mode Clay
  MATTE_BLACK = '#111111' // For Dark Mode Clay
}

export type FontStyle = 'MODERN_CLEAN' | 'EDITORIAL_SERIF' | 'BOLD_IMPACT' | 'MINIMAL_TECH' | 'GEOMETRIC_SANS' | 'CLASSIC_SERIF';
export type ToneOfVoice = 'PROFESSIONAL' | 'PLAYFUL' | 'URGENT' | 'MINIMAL';

export interface DesignPlan {
  appVibe: string;
  designTheme: DesignTheme;
  themeMode: ThemeMode;
  storyArchetype: StoryArchetype;
  visualPrompt: string;
  isPanoramic?: boolean; // NEW: Auto-enable panoramic mode
  visualKeywords?: string[]; // Specific objects e.g. "dumbbells"
  accentColor: string;
  fontStyle: FontStyle;
  slides: {
    screenshotId: string;
    title: string;
    subtitle: string;
    keywords: string[];
    layout: LayoutType;
    widgets?: Widget[];
    floatingElements?: FloatingElement[];
  }[];
  critique?: string; // AI feedback on V1
  critiqueManifest?: CritiqueManifest; // Structured critique from Visual Critic agent
}

// Re-exports from other modules
export type { VisionInsights } from './services/visionAnalysis';
export type { GenerationStep } from './components/GenerationProgress';
export type { AppCategory } from './utils/categoryDetection';

// CritiqueManifest interface for visual critic agent
export interface CritiqueManifest {
  overallVibeMatch: boolean;
  contrastScore: number;
  layoutVarietyScore: number;
  critiqueItems: Array<{
    slideIndex: number;
    issue: string;
    suggestion: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}
