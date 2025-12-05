import { Type } from "@google/genai";
import { z } from "zod";
import { DesignPlan, AppCategory, LayoutType } from "../../types";
import { detectAppCategory, getVisualPromptForCategory } from "../../utils/categoryDetection";
import { logger } from "../../utils/logger";
import { getAIService } from "../ai/AIService";
import { retryWithBackoff } from "../utils";
import { generateSmartLayoutSequence, needsSecondaryScreenshot } from "../../utils/smartLayoutSelection";

const WidgetSchema = z.object({
    type: z.enum(['rating', 'award', 'download', 'security', 'speed', 'custom']),
    text: z.string(),
    icon: z.string().optional(),
});

const FloatingElementSchema = z.object({
    id: z.string(),
    type: z.enum(['pill', 'card', 'notification', 'icon_bubble', 'image']),
    text: z.string().optional(),
    subtext: z.string().optional(),
    icon: z.string().optional(),
    imageUrl: z.string().optional(),
    position: z.object({
        x: z.number(),
        y: z.number(),
        rotate: z.number(),
        scale: z.number(),
    }),
});

const SlideSchema = z.object({
    screenshotId: z.string(),
    title: z.string(),
    subtitle: z.string(),
    keywords: z.array(z.string()),
    layout: z.string(),
    widgets: z.array(WidgetSchema).optional(),
    floatingElements: z.array(FloatingElementSchema).optional(),
});

const DesignPlanSchema = z.object({
    appVibe: z.string(),
    designTheme: z.string(),
    themeMode: z.string(),
    storyArchetype: z.string(),
    visualPrompt: z.string(),
    isPanoramic: z.boolean().optional(),
    accentColor: z.string(),
    fontStyle: z.string(),
    slides: z.array(SlideSchema),
    critique: z.string().optional(),
    critiqueManifest: z.any().optional(),
});

/**
 * AGENT 1: THE CREATIVE DIRECTOR (Concept)
 */
export const generateShowcasePlan = async (
    appName: string,
    description: string,
    screenshots: { id: string, base64: string }[],
    totalScreenshots: number,
    forcedCategory?: string
): Promise<DesignPlan> => {
    const service = getAIService();
    const sampleScreens = screenshots.slice(0, 3);
    const detectedCategory = (forcedCategory && forcedCategory.trim() !== '' ? forcedCategory : detectAppCategory(description)) as AppCategory;
    const categoryVisualHint = getVisualPromptForCategory(detectedCategory);

    const prompt = `
    You are the Lead Creative Director at Apple's App Store Design Team, creating screenshots that convert.
    CLIENT APP: "${appName}"
    DESCRIPTION: "${description}"
    CATEGORY: ${detectedCategory} (${categoryVisualHint})
    SLIDES: ${totalScreenshots}
    
    === 2025 APP STORE BEST PRACTICES ===
    CRITICAL: The first 3 screenshots appear in search results - they MUST be the most impactful!
    - Slide 1: HERO - Maximum impact, brand hook (use "hero_large", "magazine_cover", or "minimal_type")
    - Slide 2-3: KEY FEATURES - Show your best differentiators
    - Slide 4+: Supporting features, social proof, CTA
    
    PHASE 1: VISUAL ANALYSIS
    - Identify brand color. Upgrade it (e.g. Blue -> Electric Indigo).
    - Category moods: Fintech = Trust/Premium, Fitness = Energy/Power, Food = Warmth/Appetite, Social = Warmth/Connection

    PHASE 2: LAYOUT ARCHITECTURE - CRITICAL FOR VISUAL IMPACT

    ⚠️ MANDATORY LAYOUT RULES:
    1. NEVER repeat the same layout twice
    2. Each slide MUST use a DIFFERENT layout
    3. Create visual rhythm by alternating device positions

    === REQUIRED LAYOUT SEQUENCE FOR ${totalScreenshots} SLIDES ===

    SLIDE 1 (HERO): Use one of: "hero_large", "panoramic_right", "offset_right"
    - This appears in search results - MAXIMUM IMPACT required

    SLIDE 2: Use one of: "offset_left", "zoom_top", "panoramic_center_right" (opposite of slide 1)

    SLIDE 3+: Alternate between: "tilted_dynamic", "classic", "bento_grid", "zoom_bottom"

    LAST SLIDE: Use one of: "duo_overlap", "duo_side_by_side", "poster_hero"
    - Shows app depth as final impression

    === LAYOUT VARIETY EXAMPLES ===
    ✅ GOOD: hero_large → offset_left → zoom_top → tilted_dynamic → duo_overlap
    ✅ GOOD: panoramic_right → classic → offset_right → bento_grid → duo_side_by_side
    ❌ BAD: classic → classic → classic → classic → classic (NO variety!)
    ❌ BAD: offset_right → offset_right → offset_right (repetitive!)

    PHASE 3: HEADLINE STRATEGY (CRITICAL FOR CONVERSION)

    MANDATORY: Copy these EXACT headline patterns. DO NOT create generic headlines.

    APPROVED HEADLINES BY CATEGORY:
    * Food: "Crave. Discover.", "Taste Smarter", "Savor More", "Order. Enjoy.", "Fresh Finds"
    * Finance: "Grow Wealth", "Invest Smart", "Track. Thrive.", "Money Moves", "Earn More"
    * Fitness: "Push Further", "Transform Now", "Train Hard", "Get Stronger", "Level Up"
    * Social: "Connect Now", "Share More", "Meet People", "Stay Close", "Be You"
    * Productivity: "Do More", "Work Smart", "Stay Focused", "Get Done", "Own Today"
    * Travel: "Go Further", "Explore More", "Wander Free", "Book Easy", "Adventure On"

    HEADLINE RULES:
    - EXACTLY 2-3 words per title (NO EXCEPTIONS)
    - Pattern: "Verb." or "Verb. Verb." or "Verb Noun" or "Adjective Noun"
    - Must be PUNCHY and EMOTIONAL, not descriptive

    ❌ BANNED HEADLINES (generic, boring):
    - "Find Food", "Match Your Taste", "Explore Nearby", "Read Reviews"
    - "Get Started", "Learn More", "Check Out", "See More"
    - Any headline that describes what the app does instead of the benefit

    SUBTITLES: 4-6 words max. Emotional benefit, not feature description.
    ✅ "Your next craving awaits"
    ❌ "Find restaurants near you"

    PHASE 4: VISUAL STYLE
    - Background: Abstract 3D prompt (Octane render, flowing organic shapes, mesh gradients).
    - For ${detectedCategory}: Use category-appropriate colors and mood.
    - If total slides >= 4, set isPanoramic = true for continuous background flow.

    STRICT CONSTRAINTS:
    - Widget Types: 'rating', 'award', 'download', 'security', 'speed', 'custom'
    - Floating Element Types: 'pill', 'card', 'notification', 'icon_bubble' (DO NOT use 'image' type - looks cheap)
    - Keep floating elements MINIMAL: max 1-2 per slide, prefer clean designs with NO floating elements

    OUTPUT: JSON DesignPlan optimized for maximum App Store conversion.
  `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            appVibe: { type: Type.STRING },
            designTheme: { type: Type.STRING, enum: ['MODERN_MINIMAL', 'SWISS_BRUTALISM', 'NEON_CYBER', 'SOFT_LUXURY', 'GLASS_MORPHISM', 'CLEAN_PRO'] },
            themeMode: { type: Type.STRING, enum: ['LIGHT', 'DARK'] },
            storyArchetype: { type: Type.STRING, enum: ['PROBLEM_SOLUTION', 'FEATURE_BLITZ', 'LIFESTYLE_VIBE', 'USER_JOURNEY'] },
            visualPrompt: { type: Type.STRING },
            isPanoramic: { type: Type.BOOLEAN },
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
                        layout: { type: Type.STRING, enum: ['classic', 'minimal_float', 'zoom_top', 'zoom_bottom', 'tilted_dynamic', 'isometric_stack', 'off_axis_left', 'double_phones', 'bento_grid', 'magazine_cover', 'spiral_stack', 'overlapping_cards', 'diagonal_flow', 'perspective_spread', 'split_screen', 'device_grid', 'feature_list', 'floating_hero', 'duo_overlap', 'tri_stack_angle', 'quad_grid', 'landscape_float', 'card_focus', 'minimal_type', 'poster_hero', 'panoramic_right', 'panoramic_left', 'panoramic_center_right', 'offset_right', 'offset_left', 'hero_large', 'duo_side_by_side'] },
                        widgets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, text: { type: Type.STRING }, icon: { type: Type.STRING } }, required: ['type', 'text'] } },
                        floatingElements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, text: { type: Type.STRING }, subtext: { type: Type.STRING }, icon: { type: Type.STRING }, imageUrl: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, rotate: { type: Type.NUMBER }, scale: { type: Type.NUMBER } }, required: ['x', 'y', 'rotate', 'scale'] } }, required: ['id', 'type', 'position'] } }
                    },
                    required: ['screenshotId', 'title', 'subtitle', 'keywords', 'layout']
                }
            }
        },
        required: ['appVibe', 'designTheme', 'themeMode', 'storyArchetype', 'visualPrompt', 'accentColor', 'fontStyle', 'slides']
    };

    try {
        const raw = await retryWithBackoff(() => service.generateJson<DesignPlan>(prompt, schema, sampleScreens));

        // Generate smart layout recommendations as fallback
        const smartLayouts = generateSmartLayoutSequence(
            detectedCategory,
            totalScreenshots,
            raw.isPanoramic || totalScreenshots >= 4
        );

        // Ensure all required fields have defaults and validate/enhance layouts
        const usedLayouts: LayoutType[] = [];
        const planWithDefaults = {
            ...raw,
            themeMode: raw.themeMode || 'DARK',
            storyArchetype: raw.storyArchetype || 'FEATURE_BLITZ',
            visualPrompt: raw.visualPrompt || categoryVisualHint,
            isPanoramic: raw.isPanoramic || totalScreenshots >= 4,
            slides: (raw.slides || []).map((slide: any, index: number) => {
                // Use AI's layout if valid, otherwise fallback to smart recommendation
                let layout = slide.layout as LayoutType;
                
                // If layout is repeated too often (kills visual variety), use smart fallback
                const layoutCount = usedLayouts.filter(l => l === layout).length;
                if (layoutCount >= 2) {
                    layout = smartLayouts[index]?.layout || 'classic';
                    logger.info(`Layout "${slide.layout}" used too often, using smart fallback: ${layout}`);
                }
                
                usedLayouts.push(layout);
                
                return {
                    ...slide,
                    layout,
                    widgets: (slide.widgets || []).map((widget: any) => ({
                        type: widget.type || 'custom',
                        text: widget.text || '',
                        icon: widget.icon
                    })),
                    floatingElements: (slide.floatingElements || []).map((elem: any) => ({
                        ...elem,
                        text: elem.text || '',
                        subtext: elem.subtext || '',
                        icon: elem.icon || '',
                        imageUrl: elem.imageUrl || ''
                    }))
                };
            })
        };

        // Validate with Zod
        return DesignPlanSchema.parse(planWithDefaults) as DesignPlan;
    } catch (error) {
        logger.error("Plan generation error:", error);
        throw error;
    }
};
