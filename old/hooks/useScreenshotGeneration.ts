import { useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { logger } from '../utils/logger';
import { validateProjectInputs } from '../utils/validation';
import { fileToBase64, compressImageForAI } from '../utils/fileUtils';
import { analyzeScreenshotsForInsights } from '../services/visionAnalysis';
import { VisionInsights } from '../types';
import {
    generateShowcasePlan,
    generateBackground,
    generateV3CopyPolish,
    generateBackgroundVariations
} from '../services/geminiService';
import { generateV2Refinement } from '../services/agents/artDirector';
import { generateVisualCritique } from '../services/agents/visualCritic';
import { FontStyle, DeviceColor, FrameStyle, GenerationStep } from '../types';
import { MODAL_CLOSE_DELAY_MS } from '../constants/timing';

export const useScreenshotGeneration = () => {
    const {
        screenshots,
        appName, description, forcedCategory, toneOfVoice,
        setSlidesV1, setSlidesV2, setSlidesV3,
        setAccentColor, setFontStyle, setDesignTheme, setThemeMode, setFrameStyle, setVisualPrompt, setDeviceColor,
        setStatusMessage, setGeneratedBackgrounds, setSelectedBackground, setGenerationSteps, setShowGenerationProgress,
        setIsGenerating,
        setStrategyData, setShowStrategyReport,
        strategyData, showStrategyReport
    } = useStore();

    const generateEverything = async () => {
        // Validate inputs
        const validation = validateProjectInputs(appName, description, screenshots.length);
        if (!validation.isValid) {
            validation.errors.forEach(err => toast.error(err.message));
            return;
        }

        // Initialize generation progress
        const steps: GenerationStep[] = [
            { id: 'prep', label: 'Analyzing User Intent & Visuals...', status: 'active', progress: 0 },
            { id: 'v1', label: 'V1: Architecting Core Layouts', status: 'pending' },
            { id: 'critique', label: 'Agent 2: Visual Critic Scan', status: 'pending' },
            { id: 'bg', label: 'Studio: Rendering 3D Environments', status: 'pending' },
            { id: 'v2', label: 'V2: Art Director & Visual Polish', status: 'pending' },
            { id: 'v3', label: 'V3: ASO Copy & Conversion Optimization', status: 'pending' },
        ];
        setGenerationSteps(steps);
        setShowGenerationProgress(true);

        setIsGenerating(true);
        setSlidesV1([]);
        setSlidesV2([]);
        setSlidesV3([]);
        setGeneratedBackgrounds([]);

        try {
            // Update step: Preparing
            setGenerationSteps(
                useStore.getState().generationSteps.map(s => (s.id === 'prep' ? { ...s, progress: 50 } : s))
            );

            // Prepare screens for AI (convert to base64 with compression)
            // Compress images to avoid Vercel's 4.5MB request limit
            const screensForAi = await Promise.all(screenshots.map(async (s) => {
                const source = s.url.startsWith('data:image') ? s.url : s.file;
                const compressedBase64 = await compressImageForAI(source, 800, 800, 0.6);
                return {
                    id: s.id,
                    base64: compressedBase64
                };
            }));

            // --- PHASE 1: ANALYSIS & INSIGHTS ---
            setStatusMessage("Analyzing app DNA and target audience...");
            const insights = await analyzeScreenshotsForInsights(screensForAi);

            // Store insights for report
            setStrategyData(insights);

            const enrichedDescription = `${description}\n
            Dominant Colors: ${insights.dominantColors?.join(', ') || ''}\n
            Keywords: ${(insights.keywords || []).join(', ')}\n
            Rationale: ${insights.designRationale || ''}\n
            Target Persona: ${insights.audiencePersona || ''}`;

            // Complete prep, start V1
            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'prep' ? { ...s, status: 'complete', progress: 100 } :
                        s.id === 'v1' ? { ...s, status: 'active', progress: 20 } : s
                )
            );

            const v1Plan = await generateShowcasePlan(appName, enrichedDescription, screensForAi, screenshots.length, forcedCategory);

            setAccentColor(v1Plan.accentColor);
            setFontStyle(v1Plan.fontStyle as FontStyle);
            setDesignTheme(v1Plan.designTheme);
            setThemeMode(v1Plan.themeMode || 'DARK');
            setFrameStyle(FrameStyle.FRAMELESS);
            setVisualPrompt(v1Plan.visualPrompt);

            if (v1Plan.themeMode === 'LIGHT') {
                setDeviceColor(DeviceColor.OFF_WHITE);
            } else {
                setDeviceColor(DeviceColor.MIDNIGHT);
            }

            // Map Plan to Slides Helper
            const mapPlanToSlides = (plan: any, bg: string) => {
                const clampTitle = (t: string) => (t || '').split(' ').slice(0, 3).join(' ');
                const clampSubtitle = (s: string) => (s || '').split(' ').slice(0, 8).join(' ');
                const limitFloating = (arr: any[]) => (Array.isArray(arr) ? arr.slice(0, 2) : []);

                return screenshots.map((screenshot, index) => {
                    const slidePlan = plan.slides.find((s: any) => s.screenshotId === screenshot.id) || plan.slides[index] || plan.slides[0];
                    const nextIndex = (index + 1) % screenshots.length;
                    const nextShot = screenshots[nextIndex];

                    const safePlan = slidePlan || {
                        title: "Discover Features",
                        subtitle: "Experience the best app experience",
                        layout: 'classic',
                        keywords: [],
                        widgets: [],
                        floatingElements: []
                    };

                    return {
                        id: Math.random().toString(36).substr(2, 9),
                        screenshotId: screenshot.id,
                        screenshotUrl: screenshot.url,
                        secondaryScreenshotUrl: nextShot?.url,
                        title: clampTitle(safePlan.title),
                        subtitle: clampSubtitle(safePlan.subtitle),
                        keywords: safePlan.keywords,
                        backgroundUrl: bg,
                        layout: safePlan.layout as any,
                        colorAccent: plan.accentColor,
                        widgets: safePlan.widgets,
                        floatingElements: limitFloating(safePlan.floatingElements),
                        deviceOffset: { x: 0, y: 0 },
                        textOffset: { x: 0, y: 0 }
                    };
                });
            };

            // --- START PARALLEL TASKS ---
            // 1. Generate Background (Studio)
            // 2. Generate Critique (Agent 2)

            setStatusMessage(`Creating relevant background & analyzing layouts...`);

            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'v1' ? { ...s, status: 'complete' } :
                        s.id === 'critique' ? { ...s, status: 'active', progress: 10 } :
                            s.id === 'bg' ? { ...s, status: 'active', progress: 10 } : s
                )
            );

            const bgPromise = generateBackground(appName, description, v1Plan.accentColor, forcedCategory);
            const critiquePromise = generateVisualCritique(v1Plan, appName);

            // Initial V1 Slides (with placeholder BG)
            const v1Slides = mapPlanToSlides(v1Plan, '');
            setSlidesV1(v1Slides);

            // Wait for Critique first to start V2
            const critique = await critiquePromise;

            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'critique' ? { ...s, status: 'complete' } : s
                )
            );

            // --- PHASE 2: V2 VISUAL REDESIGN (The Art Director - Agent 3) ---
            setStatusMessage("Agent 3 (Art Director): Applying critique & refining...");

            // Start V2 generation
            const v2Promise = generateV2Refinement(v1Plan, critique, appName);

            // Start BG Variations (Parallel with V2) - using V1 accent color
            const variationsPromise = generateBackgroundVariations(appName, description, v1Plan.accentColor, 5, forcedCategory);

            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'v2' ? { ...s, status: 'active', progress: 20 } : s
                )
            );

            // Wait for BG 1 to be done to update V1 slides
            const bg1 = await bgPromise;
            setGeneratedBackgrounds([bg1]);
            setSelectedBackground(bg1);
            setSlidesV1(v1Slides.map(s => ({ ...s, backgroundUrl: bg1 })));

            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'bg' ? { ...s, status: 'complete' } : s
                )
            );

            // Wait for V2 Plan
            const v2Plan = await v2Promise;

            // Wait for Variations
            const variations = await variationsPromise;
            const allBgs = [bg1, ...variations];
            setGeneratedBackgrounds(allBgs);

            const v2Slides = mapPlanToSlides(v2Plan, variations[0] || bg1);
            const distributedV2 = v2Slides.map((slide) => ({
                ...slide,
                backgroundUrl: allBgs[0]
            }));
            setSlidesV2(distributedV2);

            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'v2' ? { ...s, status: 'complete' } :
                        s.id === 'v3' ? { ...s, status: 'active', progress: 60 } : s
                )
            );

            // --- PHASE 3: V3 COPY POLISH (The Copywriter - Agent 4) ---
            setStatusMessage("Agent 4 (Copywriter): Optimizing ASO Keywords & Text...");
            const v3Plan = await generateV3CopyPolish(v2Plan, appName, toneOfVoice);
            const v3SlidesInitial = mapPlanToSlides(v3Plan, variations[0] || bg1);
            const distributedV3 = v3SlidesInitial.map((slide) => ({
                ...slide,
                backgroundUrl: allBgs[0]
            }));
            setSlidesV3(distributedV3);

            setGenerationSteps(
                useStore.getState().generationSteps.map(s =>
                    s.id === 'v3' ? { ...s, status: 'complete', progress: 100 } : s
                )
            );

            setStatusMessage("Done!");
            toast.success('Screenshots generated successfully!');

            setTimeout(() => {
                setShowGenerationProgress(false);
                // Show Strategy Report after generation is done
                setShowStrategyReport(true);
            }, MODAL_CLOSE_DELAY_MS);

        } catch (error) {
            logger.error('Generation failed:', error);
            toast.error("Generation failed: " + (error as Error).message);
            setShowGenerationProgress(false);
        } finally {
            setIsGenerating(false);
            setStatusMessage("");
        }
    };

    return {
        generateEverything,
        strategyData,
        showStrategyReport,
        setShowStrategyReport
    };
};