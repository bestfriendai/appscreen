import { logger } from "../../utils/logger";
import { getAIService } from "../ai/AIService";
import { retryWithBackoff } from "../utils";
import { detectAppCategory } from "../../utils/categoryDetection";
import { buildBackgroundPrompt, buildNegativePrompt, getRecommendedBackgroundType } from "../../utils/studioBackgrounds";
import { getCachedBackground, cacheBackground } from "../../utils/indexedDBStorage";

/**
 * BACKGROUND GENERATION
 */
export const generateBackground = async (
    appName: string,
    appDescription: string,
    accentColor: string,
    forcedCategory?: string,
    additionalPrompt?: string
): Promise<string> => {
    const service = getAIService();
    const cacheKey = `${appName}_${appDescription}_${forcedCategory || ''}_${additionalPrompt || ''}`;
    const cachedBg = await getCachedBackground(cacheKey);
    if (cachedBg) return cachedBg;

    const categoryForBG = forcedCategory && forcedCategory.trim() !== '' ? forcedCategory : detectAppCategory(appDescription);
    const bgType = getRecommendedBackgroundType(categoryForBG);

    // Use category-specific colors for category backgrounds, accent color only for generic
    const isGenericType = [
        'abstract_3d', 'minimal_studio', 'modern_illustration',
        'solid_color', 'mesh_gradient', 'bold_color_block',
        'dark_cinematic', 'subtle_gradient'
    ].includes(bgType);

    const backgroundColors = isGenericType
        ? { primary: accentColor, secondary: accentColor, accent: accentColor }
        : { primary: '#CATEGORY_SPECIFIC', secondary: '#CATEGORY_SPECIFIC', accent: '#CATEGORY_SPECIFIC' };

    const studioPrompt = buildBackgroundPrompt({
        type: bgType,
        category: categoryForBG,
        mood: 'premium, modern, high-end, VIBRANT, BRIGHT',
        colors: backgroundColors,
    });
    const negative = buildNegativePrompt({
        type: bgType,
        category: categoryForBG,
        mood: 'premium, modern, high-end',
        colors: { primary: accentColor }
    } as any);

    const professionalPrompt = `
    Create an ABSOLUTELY STUNNING, PREMIUM App Store screenshot background.

    ${studioPrompt}
    ${additionalPrompt ? `ADDITIONAL INSTRUCTION: ${additionalPrompt}` : ''}

    === MANDATORY QUALITY STANDARDS ===

    1. **VIBRANT COLORS**: Use BOLD, SATURATED, RICH colors. NOT muted, NOT beige, NOT tan, NOT bland.
    2. **BRIGHTNESS**: High-key lighting. Bright, luminous, radiant. Think Apple keynote quality.
    3. **DEPTH**: Create visual depth with layered gradients, soft glows, and dimensional elements.
    4. **PREMIUM FEEL**: This should look like a $100M app marketing material.
    5. **CLEAN COMPOSITION**: Large clear areas for text. Visual interest at edges, clean center.

    === TECHNICAL REQUIREMENTS ===
    - Resolution: 8K, photorealistic where applicable
    - Lighting: Studio-quality, high-key, volumetric rays where appropriate
    - Materials: Premium - glass, silk, ceramic, brushed metal aesthetics
    - Rendering: Octane/Redshift quality for 3D elements

    === ABSOLUTELY FORBIDDEN ===
    ${negative}
    - Beige, tan, brown, muddy colors
    - Dark, moody, low-contrast backgrounds
    - Cheap, amateur, stock photo appearance
    - Flat, boring, lifeless gradients
    - Unclear, noisy, grainy textures

    OUTPUT: World-class premium background worthy of Apple's App Store featured section.
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

export const generateBackgroundVariations = async (
    appName: string,
    appDescription: string,
    accentColor: string,
    count: number = 2,
    forcedCategory?: string
): Promise<string[]> => {
    const variations: string[] = [];
    const styles = [
        'minimalist 3D abstract art, octane render, glass and light, ethereal, 8k',
        'commercial studio photography, high key lighting, clean background, apple style',
        'premium material texture, brushed metal, matte ceramic, macro detail, 8k',
        'iridescent glass dispersion, soft caustic lighting, abstract geometry, 8k',
        'modern vector illustration, flat design, corporate memphis style, clean lines'
    ];

    for (let i = 0; i < Math.min(count, styles.length); i++) {
        try {
            const bg = await generateBackground(
                appName,
                `${appDescription}, style: ${styles[i]}`,
                accentColor,
                forcedCategory
            );
            variations.push(bg);
        } catch (error) {
            // continue
        }
    }
    return variations;
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
