import { GoogleGenAI, Modality } from '@google/genai';
import { logger } from '../utils/logger';
import { getAIService } from './ai/AIService';
import { AppStrategy } from '../types/AppStrategy';

export interface VisionInsights {
  dominantColors: string[];
  keywords: string[];
  categoryGuess?: string;
  designRationale?: string; // "Why"
  audiencePersona?: string; // "Who"
  appStrategy: AppStrategy;
}

export async function analyzeScreenshotsForInsights(
  screens: { id: string; base64: string }[]
): Promise<VisionInsights> {
  try {
    const service = getAIService();
    // Optimize: Only analyze the first 1 screen to avoid timeouts and reduce token usage.
    // 1 screen is sufficient to determine the app's visual style and category.
    const sampleScreens = screens.slice(0, 1);

    const prompt = `
      Analyze these app UI screenshots as a Creative Director.
      Your goal is to define a cohesive "App Strategy" that dictates how we market this app.

      Return a JSON object with the following structure:

      1. 'dominantColors': array of 3-6 hex colors found in the UI.
      2. 'keywords': array of 5-10 short feature nouns/verbs.
      3. 'categoryGuess': single word category.
      4. 'designRationale': 1-2 sentences explaining WHY these visuals work.
      5. 'audiencePersona': 1 short sentence describing the target user.

      6. 'appStrategy': A detailed design system object containing:
         - 'category': Must be one of: ['fitness', 'finance', 'social', 'productivity', 'food', 'travel', 'education', 'entertainment', 'health', 'shopping', 'developer', 'generic']
         - 'vibe': A 3-word string describing the mood (e.g. "Trusted, Corporate, Secure" or "Fun, Energetic, Playful")
         - 'palette': { primary, secondary, accent, background, text } (All HEX codes. 'background' should be a solid color that matches the app's theme, 'text' should be readable on it)
         - 'typography': {
             'fontStyle': One of ['MODERN_CLEAN', 'EDITORIAL_SERIF', 'BOLD_IMPACT', 'MINIMAL_TECH', 'GEOMETRIC_SANS', 'CLASSIC_SERIF'],
             'headingFont': Name of a Google Font that matches the style,
             'bodyFont': Name of a Google Font for body text,
             'weight': { 'heading': number, 'body': number }
           }
         - 'background': {
             'type': One of ['gradient', 'mesh', 'neon', 'organic', 'solid', 'bokeh', 'abstract'],
             'presetName': string (e.g. 'sunset_vibes', 'tech_grid'),
             'patternOpacity': number (0.0 to 1.0)
           }
         - 'layoutPreference': Array of strings. Pick 3-4 suitable layouts from: ['classic', 'minimal_float', 'zoom_top', 'zoom_bottom', 'tilted_dynamic', 'bento_grid', 'magazine_cover', 'panoramic_right', 'panoramic_left', 'offset_right', 'hero_large']
         - 'floatingElementStyle': One of ['pill', 'card', 'minimal']
    `;

    const schema = {
      type: 'OBJECT',
      properties: {
        dominantColors: { type: 'ARRAY', items: { type: 'STRING' } },
        keywords: { type: 'ARRAY', items: { type: 'STRING' } },
        categoryGuess: { type: 'STRING' },
        designRationale: { type: 'STRING' },
        audiencePersona: { type: 'STRING' },
        appStrategy: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING' },
            vibe: { type: 'STRING' },
            palette: {
              type: 'OBJECT',
              properties: {
                primary: { type: 'STRING' },
                secondary: { type: 'STRING' },
                accent: { type: 'STRING' },
                background: { type: 'STRING' },
                text: { type: 'STRING' }
              }
            },
            typography: {
              type: 'OBJECT',
              properties: {
                fontStyle: { type: 'STRING' },
                headingFont: { type: 'STRING' },
                bodyFont: { type: 'STRING' },
                weight: {
                  type: 'OBJECT',
                  properties: {
                    heading: { type: 'NUMBER' },
                    body: { type: 'NUMBER' }
                  }
                }
              }
            },
            background: {
              type: 'OBJECT',
              properties: {
                type: { type: 'STRING' },
                presetName: { type: 'STRING' },
                patternOpacity: { type: 'NUMBER' }
              }
            },
            layoutPreference: { type: 'ARRAY', items: { type: 'STRING' } },
            floatingElementStyle: { type: 'STRING' }
          }
        }
      }
    };

    return await service.generateJson<VisionInsights>(prompt, schema, sampleScreens);

  } catch (e) {
    logger.error('Vision analysis failed', e);
    // Return safe fallback
    return {
      dominantColors: ['#000000', '#ffffff'],
      keywords: [],
      categoryGuess: 'App',
      designRationale: 'General App Design',
      audiencePersona: 'Mobile Users',
      appStrategy: {
        category: 'generic',
        vibe: 'Clean, Simple, Modern',
        palette: { primary: '#000000', secondary: '#333333', accent: '#007AFF', background: '#F5F5F7', text: '#000000' },
        typography: { fontStyle: 'MODERN_CLEAN', headingFont: 'Inter', bodyFont: 'Inter', weight: { heading: 700, body: 400 } },
        background: { type: 'mesh', presetName: 'default', patternOpacity: 0.5 },
        layoutPreference: ['classic', 'minimal_float'],
        floatingElementStyle: 'card'
      }
    };
  }
}
