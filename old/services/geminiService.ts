import { Type } from "@google/genai";
import { LayoutType, FontStyle, DesignPlan, DesignTheme, ThemeMode } from "../types";
import { AppStrategy } from "../types/AppStrategy";
import { detectAppCategory, getVisualPromptForCategory, AppCategory } from "../utils/categoryDetection";
import { logger } from "../utils/logger";
import { getProfessionalPalette, getRandomPrimaryColor, getRandomAccentColor } from "../utils/professionalColors";
import { buildBackgroundPrompt, buildNegativePrompt, generateFallbackBackground, getRecommendedBackgroundType, getPhotographySpecs, StudioBackgroundType, StudioBackgroundConfig } from "../utils/studioBackgrounds";
import { getCachedBackground, cacheBackground } from "../utils/indexedDBStorage";
import { getAIService } from "./ai/AIService";

/**
 * Retry logic with exponential backoff for API calls
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;

      const errorMessage = error?.message || error?.toString() || '';

      if (errorMessage.includes('INVALID_API_KEY') || errorMessage.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your .env.local file');
      }

      if (errorMessage.includes('INVALID_ARGUMENT')) {
        throw error;
      }

      if (isLastAttempt) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(`API call failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`, errorMessage);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Retry logic failed unexpectedly');
}

/**
 * THE CREATIVE DIRECTOR AGENT (V1)
 * Analyzes screens -> Determines "Vibe" -> Plans the V1 photoset.
 */
export const generateShowcasePlan = async (
  appName: string,
  description: string,
  screenshots: { id: string, base64: string }[],
  totalScreenshots: number,
  forcedCategory?: string,
  appStrategy?: AppStrategy
): Promise<DesignPlan> => {
  const service = getAIService();
  const sampleScreens = screenshots.slice(0, 3);

  const detectedCategory = appStrategy?.category || (forcedCategory && forcedCategory.trim() !== '' ? forcedCategory : detectAppCategory(description)) as AppCategory;
  const categoryVisualHint = getVisualPromptForCategory(detectedCategory);

  const strategyContext = appStrategy ? `
    === STRATEGIC MANDATE (STRICTLY FOLLOW) ===
    - CATEGORY: ${appStrategy.category}
    - VIBE: ${appStrategy.vibe}
    - PALETTE: ${JSON.stringify(appStrategy.palette)}
    - TYPOGRAPHY: ${JSON.stringify(appStrategy.typography)}
    - LAYOUT PREFERENCE: ${JSON.stringify(appStrategy.layoutPreference)}

    You MUST use the defined palette colors and font styles.
  ` : '';

  const prompt = `
    You are the Lead Creative Director at Apple's App Store Design Team.
    You create "Editor's Choice" worthy assets that drive downloads.

    CLIENT APP: "${appName}"
    DESCRIPTION: "${description}"
    DETECTED CATEGORY: ${detectedCategory}
    CATEGORY VISUAL DIRECTION: ${categoryVisualHint}
    TOTAL SLIDES NEEDED: ${totalScreenshots}
    ${strategyContext}

    === PHASE 1: APP ANALYSIS ===
    Study the screenshots to understand:
    1. CORE VALUE: What specific problem does THIS app solve?
    2. UNIQUE FEATURES: What makes THIS app different?
    3. BRAND PERSONALITY: Is it playful, professional, premium, minimal?
    4. COLOR PALETTE: Extract the primary brand color from the UI.

    === PHASE 2: COPYWRITING RULES (CRITICAL) ===
    Headlines must be SPECIFIC to this app's value proposition:

    ✅ GOOD EXAMPLES (Specific + Action-Oriented):
    - Food app: "Order. Track. Enjoy." / "Discover Local Gems"
    - Finance app: "Track Every Dollar" / "Grow Your Wealth"
    - Fitness app: "Crush Your Goals" / "Train Smarter"
    - Productivity: "Focus Mode On" / "Get More Done"

    ❌ BAD EXAMPLES (Generic + Vague):
    - "The Best App" / "Download Now" / "Amazing Features"
    - "Fast. Simple. Easy." (too generic for any app)

    RULES:
    - Titles: 2-3 WORDS MAX. Must reflect app's SPECIFIC benefit.
    - Subtitles: 5-8 words. Expand on the title with concrete value.
    - Use VERBS: Start with action words when possible.
    - Be SPECIFIC: Mention what users actually DO in the app.

    === PHASE 3: LAYOUT STRATEGY (GOLD STANDARD) ===
    **Goal: Create a cohesive visual narrative that looks like a Top 10 App.**

    ARCHETYPE SELECTION (Choose one "Vibe" for the whole set):
    A. "THE BOUTIQUE" (Lifestyle, Food, Travel) -> Large typography, pastel gradients, floating cards, 'soft_luxury' feel.
    B. "THE POWERHOUSE" (Finance, Productivity, Utilities) -> Dark mode, neon/gold accents, 3D tilted devices, 'clean_pro' feel.
    C. "THE ARCADE" (Games, Entertainment) -> Vibrant colors, dynamic device angles, maximalist elements.

    LAYOUT RULES:
    1. **Slide 1 (THE HOOK):** MUST be 'hero_large' or 'tilted_dynamic'. NO small devices. Big impact.
    2. **Slide 2 (THE FEATURES):** Use 'bento_grid' (if 2+ features) or 'offset_right' (if 1 feature).
    3. **Slide 3 (THE DEPTH):** Use 'isometric_stack' or 'double_phones' to show volume/content.
    4. **Slide 4 (THE CLOSE):** Use 'minimal_type' or 'panoramic_right' for a strong CTA.

    **CRITICAL LAYOUT RESTRICTIONS:**
    - DO NOT use 'classic' for more than 1 slide (it's boring).
    - DO NOT use 'zoom_top' or 'zoom_bottom' unless highlighting a VERY specific UI detail.
    - PRIORITIZE 'bento_grid' and 'tilted_dynamic' for that "Premium Template" look.

    If 'layoutPreference' was provided in STRATEGIC MANDATE, prioritize those layouts.

    === PHASE 4: BACKGROUND PROMPT ===
    Write an abstract 3D background prompt that:
    - Matches the app's CATEGORY and MOOD
    - Uses colors that complement the app's brand
    - Is CLEAN with 80% empty center for text
    - Food apps: Warm coral/orange gradients (NO actual food)
    - Finance: Deep navy/gold geometric
    - Fitness: Dynamic neon streaks on dark
    - Productivity: Clean white/blue minimal

    === PHASE 5: THEME SELECTION ===
    Choose the design theme that MATCHES the app category:
    - Finance/Business: 'CLEAN_PRO' + 'DARK' mode
    - Food/Lifestyle: 'SOFT_LUXURY' or 'MODERN_MINIMAL' + 'LIGHT' mode
    - Fitness/Gaming: 'NEON_CYBER' + 'DARK' mode
    - Productivity: 'GLASS_MORPHISM' + 'LIGHT' mode

    OUTPUT: JSON DesignPlan with app-specific, compelling copy.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      appVibe: { type: Type.STRING },
      designTheme: { type: Type.STRING, enum: ['MODERN_MINIMAL', 'SWISS_BRUTALISM', 'NEON_CYBER', 'SOFT_LUXURY', 'GLASS_MORPHISM', 'CLEAN_PRO'] },
      themeMode: { type: Type.STRING, enum: ['LIGHT', 'DARK'] },
      storyArchetype: { type: Type.STRING, enum: ['PROBLEM_SOLUTION', 'FEATURE_BLITZ', 'LIFESTYLE_VIBE', 'USER_JOURNEY'] },
      visualPrompt: { type: Type.STRING, description: "Midjourney style prompt for abstract 3D background texture" },
      isPanoramic: { type: Type.BOOLEAN, description: "Set to true for continuous background across slides" },
      accentColor: { type: Type.STRING },
      fontStyle: { type: Type.STRING, enum: ['MODERN_CLEAN', 'EDITORIAL_SERIF', 'BOLD_IMPACT', 'MINIMAL_TECH', 'GEOMETRIC_SANS', 'CLASSIC_SERIF'] },
      slides: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            screenshotId: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            layout: { type: Type.STRING, enum: ['classic', 'minimal_float', 'zoom_top', 'zoom_bottom', 'tilted_dynamic', 'isometric_stack', 'off_axis_left', 'double_phones', 'bento_grid', 'magazine_cover', 'spiral_stack', 'overlapping_cards', 'diagonal_flow', 'perspective_spread', 'split_screen', 'device_grid', 'feature_list', 'floating_hero', 'duo_overlap', 'tri_stack_angle', 'quad_grid', 'landscape_float', 'card_focus', 'minimal_type'] },
            widgets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['rating', 'award', 'download', 'security', 'speed', 'custom'] },
                  text: { type: Type.STRING },
                  icon: { type: Type.STRING }
                }
              }
            },
            floatingElements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['pill', 'card', 'notification', 'icon_bubble'] },
                  text: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  position: {
                    type: Type.OBJECT,
                    properties: {
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      rotate: { type: Type.NUMBER },
                      scale: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  try {
    return await retryWithBackoff(() => service.generateJson<DesignPlan>(prompt, schema, sampleScreens));
  } catch (error) {
    logger.error("Plan generation error:", error);
    throw error;
  }
};

/**
 * THE ART DIRECTOR AGENT (V2)
 */
export const generateV2Refinement = async (
  v1Plan: DesignPlan,
  appName: string
): Promise<DesignPlan> => {
  const service = getAIService();
  const prompt = `
    You are a Senior Art Director reviewing a Junior Designer's work.
    APP: ${appName}
    CATEGORY: ${v1Plan.appVibe}
    CURRENT PLAN: ${JSON.stringify(v1Plan)}

    TASK: REFACTOR FOR "TOP CHART" QUALITY.
    
    --- RULESET: LAYOUT & COMPOSITION ---
    1. **ELIMINATE BOREDOM**: If slides 2 and 3 have the same layout, CHANGE ONE.
    2. **DEPTH LAYERING**: Ensure the sequence has rhythm.
    
    --- RULESET: DATA-DRIVEN DECORATION ---
    1. **CONTEXT IS KING**: The floating elements MUST contain realistic data.
    2. **SOCIAL PROOF**: Occasionally use a "review" widget.
    
    --- RULESET: SAFE ZONES ---
    1. **NO HEADER CLASH**: Floating elements MUST generally be in the bottom half.
    2. **NO CENTER CLASH**: Avoid the dead center.
    3. **QUANTITY**: Maximum 2 floating elements per slide.

    OUTPUT: Visual Redesign DesignPlan.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      critique: { type: Type.STRING },
      appVibe: { type: Type.STRING },
      designTheme: { type: Type.STRING },
      themeMode: { type: Type.STRING },
      storyArchetype: { type: Type.STRING },
      visualPrompt: { type: Type.STRING },
      accentColor: { type: Type.STRING },
      fontStyle: { type: Type.STRING },
      slides: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            screenshotId: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            layout: { type: Type.STRING },
            widgets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, text: { type: Type.STRING }, icon: { type: Type.STRING } } } },
            floatingElements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, text: { type: Type.STRING }, subtext: { type: Type.STRING }, icon: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, rotate: { type: Type.NUMBER }, scale: { type: Type.NUMBER } } } } } }
          }
        }
      }
    }
  };

  try {
    return await retryWithBackoff(() => service.generateJson<DesignPlan>(prompt, schema));
  } catch (error) {
    logger.error("V2 generation error:", error);
    return v1Plan;
  }
};

/**
 * THE MARKETING EXPERT AGENT (V3)
 */
export const generateV3CopyPolish = async (
  v2Plan: DesignPlan,
  appName: string,
  tone: 'PROFESSIONAL' | 'PLAYFUL' | 'URGENT' | 'MINIMAL' = 'PROFESSIONAL'
): Promise<DesignPlan> => {
  const service = getAIService();
  const prompt = `
    You are a World-Class ASO Copywriter for the Apple App Store.
    APP: ${appName}
    VISUALS: ${JSON.stringify(v2Plan)}
    TONE OF VOICE: ${tone}

    TASK: V3 FINAL POLISH.
    Rewrite the headers to be aggressive, conversion-focused, and "Punchy".
    
    --- PSYCHOLOGY RULES ---
    1. **VERBS FIRST**: Start titles with verbs when possible.
    2. **MICRO-COPY**: MAX 2-3 WORDS for Titles. MAX 8 words for Subtitles.
    3. **BENEFIT OVER FEATURE**.

    --- ASO KEYWORDS ---
    Identify the top 1-2 keywords for this app category and inject them into the 'keywords' array.

    OUTPUT: Final ASO Polished DesignPlan.
  `;

  // Schema is same as V2 but strictly needed for type safety
  const schema = {
    type: Type.OBJECT,
    properties: {
      critique: { type: Type.STRING },
      appVibe: { type: Type.STRING },
      designTheme: { type: Type.STRING },
      themeMode: { type: Type.STRING },
      storyArchetype: { type: Type.STRING },
      visualPrompt: { type: Type.STRING },
      accentColor: { type: Type.STRING },
      fontStyle: { type: Type.STRING },
      slides: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            screenshotId: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            layout: { type: Type.STRING },
            widgets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, text: { type: Type.STRING }, icon: { type: Type.STRING } } } },
            floatingElements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, text: { type: Type.STRING }, subtext: { type: Type.STRING }, icon: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, rotate: { type: Type.NUMBER }, scale: { type: Type.NUMBER } } } } } }
          }
        }
      }
    }
  };

  try {
    return await retryWithBackoff(() => service.generateJson<DesignPlan>(prompt, schema));
  } catch (error) {
    logger.error("V3 generation error:", error);
    return v2Plan;
  }
};

export const regenerateSlideCopy = async (
  currentTitle: string,
  currentSubtitle: string,
  appName: string,
  theme: string
): Promise<{ title: string; subtitle: string }> => {
  const service = getAIService();
  const prompt = `
    Rewrite this specific App Store Screenshot header to be significantly better.
    APP: ${appName}
    CONTEXT: ${theme}
    OLD TITLE: "${currentTitle}"
    OLD SUBTITLE: "${currentSubtitle}"
    TASK: Make it PUNCHY. 2 WORDS MAX for Title.
  `;
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      subtitle: { type: Type.STRING }
    }
  };

  try {
    return await retryWithBackoff(() => service.generateJson(prompt, schema));
  } catch (e) {
    logger.error("Slide copy regeneration error:", e);
    return { title: currentTitle, subtitle: currentSubtitle };
  }
};

/**
 * SIMPLIFIED AI BACKGROUND GENERATION
 */
export const generateBackground = async (
  appName: string,
  appDescription: string,
  accentColor: string,
  forcedCategory?: string,
  appStrategy?: AppStrategy
): Promise<string> => {
  const service = getAIService();

  // Check cache first
  const cacheKey = `${appName}_${appDescription}_${forcedCategory || ''}_${appStrategy?.background.type || ''}`;
  const cachedBg = await getCachedBackground(cacheKey);
  if (cachedBg) {
    logger.info('Using cached background');
    return cachedBg;
  }

  const categoryForBG = appStrategy?.category || (forcedCategory && forcedCategory.trim() !== '' ? forcedCategory : detectAppCategory(appDescription));
  const bgType = appStrategy?.background.type || getRecommendedBackgroundType(categoryForBG);

  const studioPrompt = buildBackgroundPrompt({
    type: bgType as any,
    category: categoryForBG as any,
    mood: appStrategy?.vibe || 'premium, modern, high-end',
    colors: appStrategy?.palette ? {
        primary: appStrategy.palette.primary,
        secondary: appStrategy.palette.secondary,
        accent: appStrategy.palette.accent
    } : { primary: accentColor, secondary: accentColor, accent: accentColor },
  });

  const negative = buildNegativePrompt({
    type: bgType as any,
    category: categoryForBG as any,
    mood: appStrategy?.vibe || 'premium, modern, high-end',
    colors: { primary: accentColor }
  } as any);

  const professionalPrompt = `
Create a STUNNING, HIGH-QUALITY background for a premium App Store screenshot.
APP: "${appName}"
PURPOSE: "${appDescription}"
BRAND COLOR: ${accentColor}
${studioPrompt}
STYLE: Abstract, Minimalist, Premium, High-End, 3D Render, Octane Render, 8k, Photorealistic.
COMPOSITION: Plenty of negative space in the center for text/devices.
LIGHTING: Soft studio lighting, professional gradient, ambient occlusion.
🚫 STRICTLY AVOID: ${negative}, text, words, letters, screenshots, ui elements, phones, devices, hands, people, faces, messy details, noise, low resolution, pixelated.
🎯 GOAL: Create a background so beautiful it could be featured in Apple's App Store.
  `.trim();

  try {
    const imageData = await retryWithBackoff(() => service.generateImage(professionalPrompt, negative));
    await cacheBackground(cacheKey, imageData);
    return imageData;
  } catch (error) {
    logger.error("Background generation error:", error);
    return createSimpleGradientBackground(accentColor);
  }
};

function createSimpleGradientBackground(color: string): string {
  const darkerColor = adjustColorBrightness(color, -30);
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="1290" height="2796" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${darkerColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `)}`;
}

function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;

  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

export const generateBackgroundVariations = async (
  appName: string,
  appDescription: string,
  accentColor: string,
  count: number = 2,
  forcedCategory?: string,
  appStrategy?: AppStrategy
): Promise<string[]> => {
  const variations: string[] = [];
  const styles = [
    'Abstract 3D Glass Shapes, Soft Pastel Gradients, Minimalist, 8k',
    'Deep Matte Ceramic Texture, Studio Lighting, Premium Tech Vibe, 8k',
    'Neon Cyberpunk Grid, Dark Mode, Glowing Edges, High Contrast, 8k',
    'Natural Organic Shapes, Soft Bokeh, Warm Lighting, Lifestyle Photography, 8k',
    'Brushed Metal and Glass, Industrial Design, Clean Lines, Professional, 8k',
    'Ethereal Smoke and Light, Abstract, Mysterious, High-End Fashion Vibe, 8k'
  ];

  for (let i = 0; i < Math.min(count, styles.length); i++) {
    try {
      const bg = await generateBackground(
        appName,
        `${appDescription}, style: ${styles[i]}`,
        accentColor,
        forcedCategory,
        appStrategy
      );
      variations.push(bg);
    } catch (error) {
      logger.error(`Failed to generate variation ${i + 1}:`, error);
    }
  }
  return variations;
};

/**
 * Regenerate slide visuals based on a natural language instruction
 * @param slide - The slide to regenerate
 * @param instruction - Natural language instruction (e.g., "make it more colorful")
 * @param appName - App name for context
 * @param description - App description for context
 * @param accentColor - Current accent color
 * @param forcedCategory - Optional forced category
 * @returns Partial slide updates
 */
export const regenerateSlideVisuals = async (
  slide: any,
  instruction: string,
  appName: string,
  description: string,
  accentColor: string,
  forcedCategory?: string
): Promise<Partial<any>> => {
  logger.warn('regenerateSlideVisuals: Feature not fully implemented, returning minimal changes');
  // Stub implementation - returns the slide mostly unchanged
  // In a full implementation, this would use AI to interpret the instruction
  // and generate new visual properties
  return {
    colorAccent: accentColor,
    // Could potentially regenerate background, layout, etc. based on instruction
  };
};

/**
 * Generate visual critique for a design plan
 * @param plan - The design plan to critique
 * @param appName - App name for context
 * @returns Critique feedback string
 */
export const generateVisualCritique = async (
  plan: any,
  appName: string
): Promise<string> => {
  logger.warn('generateVisualCritique: Feature not fully implemented, returning generic feedback');
  // Stub implementation - returns generic positive feedback
  // In a full implementation, this would use AI to analyze the plan
  // and provide detailed critique
  return `The design for ${appName} looks solid. Consider enhancing contrast and ensuring text readability across all slides.`;
};
