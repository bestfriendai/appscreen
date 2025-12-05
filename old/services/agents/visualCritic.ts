import { Type } from "@google/genai";
import { z } from "zod";
import { DesignPlan, CritiqueManifest } from "../../types";
import { logger } from "../../utils/logger";
import { getAIService } from "../ai/AIService";
import { retryWithBackoff } from "../utils";

const CritiqueItemSchema = z.object({
    slideIndex: z.number(),
    issue: z.string(),
    suggestion: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

const CritiqueManifestSchema = z.object({
    overallVibeMatch: z.boolean(),
    contrastScore: z.number(),
    layoutVarietyScore: z.number(),
    critiqueItems: z.array(CritiqueItemSchema),
});

/**
 * AGENT 2: THE VISUAL CRITIC (Feedback)
 */
export const generateVisualCritique = async (
    v1Plan: DesignPlan,
    appName: string
): Promise<CritiqueManifest> => {
    const service = getAIService();

    const prompt = `
    You are "The Visual Critic", a harsh but fair Design QA lead.
    APP: ${appName}
    V1 PLAN: ${JSON.stringify(v1Plan)}

    Your job is to find flaws BEFORE we render.
    
    CRITERIA:
    1. **Layout Repetition**: Did the designer use the same layout twice in a row? (Severity: HIGH)
    2. **Vibe Match**: Does the theme match the app category? (e.g. 'Neon Cyber' for a 'Yoga' app is a mismatch).
    3. **Contrast Risk**: Is there white text on a light background?
    4. **Clutter**: Are there too many floating elements (max 2 allowed)?
    5. **Readability**: Are titles too long (max 3 words)?

    OUTPUT: JSON CritiqueManifest.
  `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            overallVibeMatch: { type: Type.BOOLEAN },
            contrastScore: { type: Type.NUMBER },
            layoutVarietyScore: { type: Type.NUMBER },
            critiqueItems: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        slideIndex: { type: Type.NUMBER },
                        issue: { type: Type.STRING },
                        suggestion: { type: Type.STRING },
                        severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
                    }
                }
            }
        }
    };

    try {
        const raw = await retryWithBackoff(() => service.generateJson<unknown>(prompt, schema));
        return CritiqueManifestSchema.parse(raw) as CritiqueManifest;
    } catch (error) {
        logger.error("Critique generation error:", error);
        // Return a dummy critique if failed so pipeline continues
        return { overallVibeMatch: true, contrastScore: 5, layoutVarietyScore: 5, critiqueItems: [] };
    }
};
