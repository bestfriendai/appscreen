import { Type } from "@google/genai";
import { z } from "zod";
import { DesignPlan } from "../../types";
import { logger } from "../../utils/logger";
import { getAIService } from "../ai/AIService";
import { retryWithBackoff } from "../utils";
import { HEADLINE_TEMPLATES, generateHeadlineSequence, SOCIAL_PROOF_BADGES, getSocialProofForCategory } from "../../utils/headlineTemplates";
import { detectAppCategory } from "../../utils/categoryDetection";

// Re-using schemas
const WidgetSchema = z.object({
    type: z.enum(['rating', 'award', 'download', 'security', 'speed', 'custom']),
    text: z.string(),
    icon: z.string().optional(),
});

const FloatingElementSchema = z.object({
    id: z.string(),
    type: z.enum(['pill', 'card', 'notification', 'icon_bubble']),
    text: z.string().optional(),
    subtext: z.string().optional(),
    icon: z.string().optional(),
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
 * Get headline examples for a category to include in the prompt
 */
const getHeadlineExamplesForPrompt = (category: string): string => {
    const templates = HEADLINE_TEMPLATES[category.toLowerCase()] || HEADLINE_TEMPLATES.generic;
    const examples = templates.slice(0, 4).map(t => `"${t.headline}" / "${t.subtitle || ''}"`).join(', ');
    return examples;
};

/**
 * AGENT 4: THE COPYWRITER (Conversion)
 */
export const generateV3CopyPolish = async (
    v2Plan: DesignPlan,
    appName: string,
    tone: 'PROFESSIONAL' | 'PLAYFUL' | 'URGENT' | 'MINIMAL' = 'PROFESSIONAL'
): Promise<DesignPlan> => {
    const service = getAIService();
    
    // Detect category for headline inspiration
    const detectedCategory = detectAppCategory(v2Plan.appVibe || appName);
    const headlineExamples = getHeadlineExamplesForPrompt(detectedCategory);
    const socialProof = getSocialProofForCategory(detectedCategory);
    
    const prompt = `
    You are an ELITE ASO Copywriter who writes headlines for Apple's featured apps.

    APP: ${appName}
    CATEGORY: ${detectedCategory}
    TONE: ${tone}
    CURRENT PLAN: ${JSON.stringify(v2Plan)}

    === YOUR MISSION ===
    Transform boring, generic headlines into PUNCHY, HIGH-CONVERTING copy that stops scrollers.

    === MANDATORY HEADLINE PATTERNS (COPY THESE EXACTLY) ===

    For ${detectedCategory} apps, use ONLY these proven patterns:
    ${headlineExamples}

    === STRICT HEADLINE RULES ===

    ⚡ TITLES MUST BE:
    - EXACTLY 2-3 WORDS (no exceptions)
    - Pattern: "Verb." or "Verb. Verb." or "Verb Noun"
    - Punchy, bold, memorable
    - Action-oriented and benefit-focused

    ✅ GOOD TITLES: "Crave. Discover.", "Track Everything", "Sleep Better", "Go Further", "Earn More"
    ❌ BAD TITLES: "Find Food", "Match Your Taste", "Read Reviews", "Explore Nearby", "Get Started"

    The difference: Good titles are PUNCHY and EMOTIONAL. Bad titles are GENERIC and BORING.

    ⚡ SUBTITLES MUST BE:
    - 4-6 words maximum
    - One clear benefit
    - Support the title, never repeat it
    - Emotional connection

    ✅ GOOD: "Your next craving awaits", "Taste the difference today"
    ❌ BAD: "Find restaurants near you", "A food delivery service"

    === PER-SLIDE REQUIREMENTS ===

    SLIDE 1 (HERO): Most impactful headline. This appears in search results!
    - Pattern: "Action. Impact." (e.g., "Crave. Discover.")

    SLIDE 2-3: Feature highlights
    - Pattern: "Verb Benefit" (e.g., "Order Smarter", "Track Everything")

    LAST SLIDE: Call to action
    - Pattern: "Start Now", "Join Free", "Try Today"

    === SOCIAL PROOF WIDGETS ===
    Add these where appropriate: ${socialProof.slice(0, 3).map(b => `"${b.text}"`).join(', ')}
    - Slide 1 or 2: Rating badge
    - Last slide: Download count or award

    === ABSOLUTE PROHIBITIONS ===
    ❌ NO generic verbs: "Find", "Get", "Use", "Try", "Check"
    ❌ NO descriptions: "A great app for...", "The best way to..."
    ❌ NO long titles: More than 3 words = REJECTED
    ❌ NO repeated words across slides
    ❌ NO boring corporate speak

    OUTPUT: Return the EXACT same structure as the input, but with DRAMATICALLY better headlines.
    Each title should make someone stop scrolling.
  `;

    const schema = {
        type: Type.OBJECT,
        properties: {
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
                        widgets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, text: { type: Type.STRING }, icon: { type: Type.STRING } }, required: ['type', 'text'] } },
                        floatingElements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, text: { type: Type.STRING }, subtext: { type: Type.STRING }, icon: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, rotate: { type: Type.NUMBER }, scale: { type: Type.NUMBER } }, required: ['x', 'y', 'rotate', 'scale'] } }, required: ['id', 'type', 'position'] } }
                    },
                    required: ['screenshotId', 'title', 'subtitle', 'keywords', 'layout']
                }
            }
        },
        required: ['appVibe', 'designTheme', 'themeMode', 'storyArchetype', 'visualPrompt', 'accentColor', 'fontStyle', 'slides']
    };

    try {
        const raw = await retryWithBackoff(() => service.generateJson<DesignPlan>(prompt, schema));

        // Merge with v2Plan to ensure all required fields are present
        const mergedPlan = {
            ...v2Plan,
            ...raw,
            themeMode: raw.themeMode || v2Plan.themeMode || 'DARK',
            storyArchetype: raw.storyArchetype || v2Plan.storyArchetype || 'Feature Showcase',
            visualPrompt: raw.visualPrompt || v2Plan.visualPrompt || '',
            slides: (raw.slides || []).map((slide: any) => ({
                ...slide,
                widgets: (slide.widgets || []).map((widget: any) => ({
                    type: widget.type || 'custom',
                    text: widget.text || '',
                    icon: widget.icon
                })),
                floatingElements: (slide.floatingElements || []).map((elem: any) => ({
                    ...elem,
                    text: elem.text || '',
                    subtext: elem.subtext || '',
                    icon: elem.icon || ''
                }))
            }))
        };

        return DesignPlanSchema.parse(mergedPlan) as DesignPlan;
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
    Rewrite this header to be PUNCHY.
    APP: ${appName}
    CONTEXT: ${theme}
    OLD: "${currentTitle}" / "${currentSubtitle}"
    TASK: 2 WORDS MAX for Title.
  `;
    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING }
        },
        required: ['title', 'subtitle']
    };

    try {
        return await retryWithBackoff(() => service.generateJson(prompt, schema));
    } catch (e) {
        return { title: currentTitle, subtitle: currentSubtitle };
    }
};
