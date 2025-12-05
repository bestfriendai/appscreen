import { Type } from "@google/genai";
import { z } from "zod";
import { GeneratedSlide } from "../../types";
import { logger } from "../../utils/logger";
import { getAIService } from "../ai/AIService";
import { retryWithBackoff } from "../utils";
import { generateBackground } from "./backgroundArtist";

// Re-using schemas
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

// For Magic Edit
const MagicEditPlanSchema = z.object({
    layout: z.string().optional(),
    newBackgroundPrompt: z.string().optional(),
    floatingElements: z.array(FloatingElementSchema).optional(),
});

/**
 * MAGIC EDIT: THE DETAILER AGENT (Visual Refinement)
 */
export const regenerateSlideVisuals = async (
    currentSlide: GeneratedSlide,
    instruction: string,
    appName: string,
    appDescription: string,
    accentColor: string,
    forcedCategory?: string
): Promise<Partial<GeneratedSlide>> => {
    const service = getAIService();

    const prompt = `
    You are "The Detailer" - an AI design assistant focused on perfecting individual App Store slides.
    APP: "${appName}"
    APP DESCRIPTION: "${appDescription}"
    CURRENT SLIDE (JSON): ${JSON.stringify(currentSlide)}
    USER INSTRUCTION: "${instruction}"
    ACCENT COLOR: ${accentColor}
    FORCED CATEGORY: ${forcedCategory || 'None'}

    TASK: Based on the user's instruction, propose a minimal set of changes to the current slide's visual properties.
    Focus on:
    - layout (e.g., changing 'classic' to 'bento_grid')
    - floatingElements (add, remove, modify text/position/type)
    - If the instruction is about the background, propose a 'newBackgroundPrompt'.

    Constraints:
    - ONLY change properties that are directly affected by the instruction.
    - If a new background is requested or implied, generate a descriptive 'newBackgroundPrompt' for an image generation model.
    - DO NOT change title, subtitle, or screenshotId unless explicitly asked AND if it's a visual change (e.g., "make title smaller").
    - If the instruction cannot be fulfilled visually, return an empty object or an object with only a 'feedback' property.

    OUTPUT: JSON object with only the *changed* properties.
    Example: { layout: "bento_grid", floatingElements: [...] } or { newBackgroundPrompt: "a simpler abstract background" }
  `;

    try {
        const rawPlan = await retryWithBackoff(() => service.generateJson(prompt, MagicEditPlanSchema));
        const magicEditPlan = MagicEditPlanSchema.parse(rawPlan);

        const updatedProps: Partial<GeneratedSlide> = { ...magicEditPlan } as any;

        // If a new background prompt is provided, generate the background
        if (magicEditPlan.newBackgroundPrompt) {
            updatedProps.backgroundUrl = await generateBackground(
                appName,
                appDescription + ", " + magicEditPlan.newBackgroundPrompt,
                accentColor,
                forcedCategory,
                magicEditPlan.newBackgroundPrompt // Pass as additional prompt
            );
        }
        return updatedProps;
    } catch (error) {
        logger.error("Slide visual regeneration error:", error);
        throw error;
    }
};
