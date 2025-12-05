import { AppCategory } from '../utils/categoryDetection';
import { FontStyle, LayoutType } from '../types';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TypographyStrategy {
  fontStyle: FontStyle;
  headingFont: string;
  bodyFont: string;
  weight: {
    heading: number;
    body: number;
  };
}

export interface BackgroundStrategy {
  type: 'gradient' | 'mesh' | 'neon' | 'organic' | 'solid' | 'image' | 'bokeh' | 'abstract';
  presetName?: string; // e.g. 'sunset_vibes'
  patternOpacity: number;
}

export interface AppStrategy {
  category: AppCategory;
  vibe: string; // e.g. "Trusted, Corporate, Secure" or "Fun, Energetic, Playful"
  palette: ColorPalette;
  typography: TypographyStrategy;
  background: BackgroundStrategy;
  layoutPreference: LayoutType[]; // Preferred layouts for this app type
  floatingElementStyle: 'pill' | 'card' | 'minimal';
}
