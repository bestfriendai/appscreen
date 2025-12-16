// Gemini AI Service for Magic Design features
// Uses Google's Gemini 2.0 Flash model for vision analysis and text generation

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.0-flash-exp';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface AppAnalysis {
  category: string;
  subcategory: string;
  primaryFunction: string;
  targetAudience: string;
  visualVibe: 'dark' | 'light' | 'colorful' | 'minimal' | 'professional';
  suggestedTheme: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface ScreenshotAnalysis {
  featureType: string;
  keyElements: string[];
  userBenefits: string[];
  visualWeight: 'top' | 'center' | 'bottom' | 'left' | 'right' | 'full';
  suggestedHeadline: string;
  suggestedSubheadline: string;
  contentDescription: string;
}

export interface HeadlineSet {
  headline: string;
  subheadline: string;
  style: 'punchy' | 'benefit' | 'question' | 'command';
}

export interface MagicDesignResult {
  appAnalysis: AppAnalysis;
  screenshotAnalyses: ScreenshotAnalysis[];
  headlines: HeadlineSet[];
  suggestedLayouts: string[];
  designNotes: string;
}

class GeminiService {
  private apiKey: string | null = null;
  private model: string = DEFAULT_MODEL;

  configure(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    if (config.model) {
      this.model = config.model;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  private async callGemini(prompt: string, images?: string[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key in settings.');
    }

    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // Add images if provided
    if (images && images.length > 0) {
      for (const imageDataUrl of images) {
        // Extract base64 data from data URL
        const base64Data = imageDataUrl.split(',')[1];
        const mimeType = imageDataUrl.split(';')[0].split(':')[1] || 'image/png';

        parts.push({
          inlineData: {
            mimeType,
            data: base64Data,
          },
        });
      }
    }

    // Add text prompt
    parts.push({ text: prompt });

    const response = await fetch(
      `${GEMINI_API_URL}/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to call Gemini API');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async analyzeApp(screenshots: string[]): Promise<AppAnalysis> {
    const prompt = `Analyze these app screenshots and determine:

1. App Category (one of: Fitness, Finance, Productivity, Social, Food, Travel, Education, Entertainment, Health, Shopping, Developer, Gaming, Weather, News, Photo, Video, Utilities, Lifestyle, Kids, Sports, Navigation, Business, Music, Medical)

2. Subcategory (more specific category)

3. Primary Function (what does this app do in 2-3 words)

4. Target Audience (who would use this app)

5. Visual Vibe (one of: dark, light, colorful, minimal, professional)

6. Suggested Theme (one of: MODERN_MINIMAL, SWISS_BRUTALISM, NEON_CYBER, SOFT_LUXURY, GLASS_MORPHISM, CLEAN_PRO)

7. Color Palette - suggest 4 colors that would work well for App Store screenshots:
   - Primary color (main brand color visible in screenshots)
   - Secondary color (complementary)
   - Accent color (for highlights)
   - Background color (for screenshot background)

Respond in this exact JSON format:
{
  "category": "string",
  "subcategory": "string",
  "primaryFunction": "string",
  "targetAudience": "string",
  "visualVibe": "dark|light|colorful|minimal|professional",
  "suggestedTheme": "string",
  "colorPalette": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor",
    "background": "#hexcolor"
  }
}`;

    const response = await this.callGemini(prompt, screenshots);

    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format');
    } catch {
      // Return default analysis if parsing fails
      return {
        category: 'Productivity',
        subcategory: 'General',
        primaryFunction: 'App functionality',
        targetAudience: 'General users',
        visualVibe: 'minimal',
        suggestedTheme: 'MODERN_MINIMAL',
        colorPalette: {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#00d4ff',
          background: '#1a1a2e',
        },
      };
    }
  }

  async analyzeScreenshot(screenshot: string, appContext?: AppAnalysis): Promise<ScreenshotAnalysis> {
    const contextInfo = appContext
      ? `This is a ${appContext.category} app (${appContext.subcategory}) that ${appContext.primaryFunction}.`
      : '';

    const prompt = `${contextInfo}

Analyze this single app screenshot and determine:

1. Feature Type (what specific feature or screen is shown)
2. Key Elements (list 3-5 main UI elements visible)
3. User Benefits (list 2-3 benefits this feature provides)
4. Visual Weight (where is the most important content: top, center, bottom, left, right, or full)
5. Suggested Headline (2-4 word catchy marketing headline for this screen)
6. Suggested Subheadline (4-8 word benefit statement)
7. Content Description (brief description of what's shown)

Respond in this exact JSON format:
{
  "featureType": "string",
  "keyElements": ["string", "string", "string"],
  "userBenefits": ["string", "string"],
  "visualWeight": "top|center|bottom|left|right|full",
  "suggestedHeadline": "string",
  "suggestedSubheadline": "string",
  "contentDescription": "string"
}`;

    const response = await this.callGemini(prompt, [screenshot]);

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format');
    } catch {
      return {
        featureType: 'Main Screen',
        keyElements: ['Interface', 'Content', 'Navigation'],
        userBenefits: ['Easy to use', 'Clear layout'],
        visualWeight: 'center',
        suggestedHeadline: 'Discover More',
        suggestedSubheadline: 'Your perfect companion app',
        contentDescription: 'App screenshot showing main interface',
      };
    }
  }

  async generateHeadlines(
    screenshots: string[],
    appAnalysis: AppAnalysis,
    style: 'punchy' | 'benefit' | 'question' | 'command' = 'punchy'
  ): Promise<HeadlineSet[]> {
    const styleGuide = {
      punchy: 'Short, catchy, 2-3 words maximum. Think Apple-style marketing.',
      benefit: 'Focus on what the user gains. Start with a verb.',
      question: 'Engaging questions that make users curious.',
      command: 'Action-oriented calls to action.',
    };

    const prompt = `Generate marketing headlines for these ${screenshots.length} app screenshots.

App Info:
- Category: ${appAnalysis.category}
- Function: ${appAnalysis.primaryFunction}
- Target: ${appAnalysis.targetAudience}
- Vibe: ${appAnalysis.visualVibe}

Style Guide: ${styleGuide[style]}

For EACH screenshot, create:
1. Headline (2-4 words, ${style} style)
2. Subheadline (4-8 words, benefit-focused)

Requirements:
- Headlines must be unique (no repeats)
- Each should highlight a different aspect/feature
- Match the ${appAnalysis.visualVibe} vibe
- Designed for App Store conversion

Respond as a JSON array with exactly ${screenshots.length} items:
[
  {
    "headline": "string",
    "subheadline": "string",
    "style": "${style}"
  }
]`;

    const response = await this.callGemini(prompt, screenshots);

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid response format');
    } catch {
      // Generate fallback headlines
      return screenshots.map((_, i) => ({
        headline: `Feature ${i + 1}`,
        subheadline: 'Discover what makes this app special',
        style,
      }));
    }
  }

  async suggestLayouts(
    screenshotAnalyses: ScreenshotAnalysis[],
    appAnalysis: AppAnalysis
  ): Promise<string[]> {
    const prompt = `Based on these screenshot analyses, suggest the best layout preset for each screenshot.

App Category: ${appAnalysis.category}
Visual Vibe: ${appAnalysis.visualVibe}

Screenshot Details:
${screenshotAnalyses.map((s, i) => `${i + 1}. Feature: ${s.featureType}, Visual Weight: ${s.visualWeight}, Content: ${s.contentDescription}`).join('\n')}

Available Layout Presets:
- centered: Device centered, standard presentation
- bleed-bottom: Device extends to bottom edge, good for showing more content
- bleed-top: Device extends to top edge
- float-center: Smaller device, more background visible
- tilt-left: Device tilted left, dynamic feel
- tilt-right: Device tilted right, dynamic feel
- perspective: 3D perspective effect
- float-bottom: Small device at bottom

Rules:
- First screenshot should be impactful (centered, perspective, or tilt)
- Avoid repeating layouts consecutively
- Match layout to content (bottom-heavy content = bleed-bottom)
- Mix variety for visual interest

Respond as a JSON array of layout names, one per screenshot:
["layout1", "layout2", ...]`;

    const response = await this.callGemini(prompt);

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const layouts = JSON.parse(jsonMatch[0]);
        return layouts.map((l: string) => l.toLowerCase().replace(/\s+/g, '-'));
      }
      throw new Error('Invalid response format');
    } catch {
      // Fallback layouts
      const defaultLayouts = ['centered', 'bleed-bottom', 'tilt-right', 'perspective', 'bleed-top', 'tilt-left', 'float-center', 'float-bottom'];
      return screenshotAnalyses.map((_, i) => defaultLayouts[i % defaultLayouts.length]);
    }
  }

  async runMagicDesign(screenshots: string[]): Promise<MagicDesignResult> {
    // Stage 1: Analyze the app
    const appAnalysis = await this.analyzeApp(screenshots.slice(0, 3));

    // Stage 2: Analyze each screenshot
    const screenshotAnalyses = await Promise.all(
      screenshots.map(s => this.analyzeScreenshot(s, appAnalysis))
    );

    // Stage 3: Generate headlines
    const headlines = await this.generateHeadlines(screenshots, appAnalysis, 'punchy');

    // Stage 4: Suggest layouts
    const suggestedLayouts = await this.suggestLayouts(screenshotAnalyses, appAnalysis);

    return {
      appAnalysis,
      screenshotAnalyses,
      headlines,
      suggestedLayouts,
      designNotes: `Analyzed ${screenshots.length} screenshots for ${appAnalysis.category} app. Theme: ${appAnalysis.suggestedTheme}, Vibe: ${appAnalysis.visualVibe}.`,
    };
  }

  async translateText(
    text: string,
    targetLanguage: string,
    context?: string
  ): Promise<string> {
    const prompt = `Translate the following text to ${targetLanguage}.
${context ? `Context: This is ${context}` : ''}

Keep the translation:
- Natural and fluent in ${targetLanguage}
- Same length/brevity as original
- Marketing-appropriate tone

Text to translate: "${text}"

Respond with ONLY the translated text, nothing else.`;

    const response = await this.callGemini(prompt);
    return response.trim().replace(/^["']|["']$/g, '');
  }
}

export const geminiService = new GeminiService();
export default geminiService;
