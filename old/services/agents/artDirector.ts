import { Type } from "@google/genai";
import { z } from "zod";
import { DesignPlan, CritiqueManifest } from "../../types";
import { logger } from "../../utils/logger";
import { getAIService } from "../ai/AIService";
import { retryWithBackoff } from "../utils";

// Re-using schemas from Creative Director for consistency, but defining here for isolation
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
 * AGENT 3: THE ART DIRECTOR (Refinement)
 */
export const generateV2Refinement = async (
    v1Plan: DesignPlan,
    critique: CritiqueManifest,
    appName: string
): Promise<DesignPlan> => {
    const service = getAIService();

    // Merge critique into context
    const context = {
        plan: v1Plan,
        critique: critique
    };

    const prompt = `
    You are a Senior Art Director.
    APP: ${appName}
    CONTEXT: ${JSON.stringify(context)}

    TASK: REFACTOR V1 PLAN BASED ON CRITIQUE.
    
    Specific Critique items to fix:
    ${critique.critiqueItems.map(i => `- Slide ${i.slideIndex + 1}: ${i.issue} -> ${i.suggestion}`).join('\n')}

    ADDITIONAL POLISH:
    1. **Depth**: Ensure elements layer nicely.
    2. **Data**: Floating elements must have realistic numbers/text (e.g. "$4,200" instead of "Value").
    3. **Safe Zones**: No headers covering the device notch.
    4. **Consistency**: Ensure fonts and colors align with the theme.

    STRICT CONSTRAINTS:
    - Widget Types MUST be one of: 'rating', 'award', 'download', 'security', 'speed', 'custom'.
    - Floating Element Types MUST be one of: 'pill', 'card', 'notification', 'icon_bubble', 'image'.
    - For 'image' types, ensure 'icon' is set to a descriptive object name (e.g. 'burger', 'pizza').
    - **CRITICAL**: You MUST return a COMPLETE DesignPlan. Do not omit any fields (subtitle, keywords, layout, etc.). Copy values from V1 if they are not changing.

    OUTPUT: Refined V2 DesignPlan.
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
                        floatingElements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, text: { type: Type.STRING }, subtext: { type: Type.STRING }, icon: { type: Type.STRING }, imageUrl: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, rotate: { type: Type.NUMBER }, scale: { type: Type.NUMBER } }, required: ['x', 'y', 'rotate', 'scale'] } }, required: ['id', 'type', 'position'] } }
                    },
                    required: ['screenshotId', 'title', 'subtitle', 'keywords', 'layout']
                }
            }
        },
        required: ['appVibe', 'designTheme', 'themeMode', 'storyArchetype', 'visualPrompt', 'accentColor', 'fontStyle', 'slides']
    };

    try {
        const raw = await retryWithBackoff(() => service.generateJson<DesignPlan>(prompt, schema));

        // Ensure all required fields are present by merging with v1Plan
        const mergedPlan = {
            ...v1Plan,
            ...raw,
            // Ensure critical fields are present
            themeMode: raw.themeMode || v1Plan.themeMode || 'DARK',
            storyArchetype: raw.storyArchetype || v1Plan.storyArchetype || 'Feature Showcase',
            visualPrompt: raw.visualPrompt || v1Plan.visualPrompt || '',
            slides: (raw.slides || []).map((slide: any, index: number) => ({
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
                    icon: elem.icon || '',
                    imageUrl: elem.imageUrl || ''
                }))
            }))
        };

        // We manually attach the critique manifest to the result for debugging/display
        const plan = DesignPlanSchema.parse(mergedPlan) as DesignPlan;
        plan.critiqueManifest = critique;
        return plan;
    } catch (error) {
        logger.error("V2 generation error:", error);
        // Return v1Plan with critique attached as fallback
        const fallbackPlan = { ...v1Plan };
        fallbackPlan.critiqueManifest = critique;
        return fallbackPlan;
    }
};
