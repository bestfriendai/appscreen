/**
 * AI Agent System for App Store Screenshots
 * Multi-agent pipeline for intelligent design generation
 * Supports multiple AI providers: Google Gemini, Anthropic Claude, OpenAI GPT
 */

/**
 * Agent Definitions
 */
const AGENTS = {
    CREATIVE_DIRECTOR: {
        id: 'creative_director',
        name: 'Creative Director',
        description: 'Plans overall design narrative and selects layouts',
        phase: 1
    },
    BACKGROUND_ARTIST: {
        id: 'background_artist',
        name: 'Background Artist',
        description: 'Generates background style recommendations',
        phase: 2
    },
    ART_DIRECTOR: {
        id: 'art_director',
        name: 'Art Director',
        description: 'Refines visual composition and polish',
        phase: 3
    },
    VISUAL_CRITIC: {
        id: 'visual_critic',
        name: 'Visual Critic',
        description: 'Reviews designs for contrast and layout variety',
        phase: 4
    },
    COPYWRITER: {
        id: 'copywriter',
        name: 'Copywriter',
        description: 'Optimizes headlines for App Store conversion',
        phase: 5
    },
    DETAILER: {
        id: 'detailer',
        name: 'Detailer',
        description: 'Fine-tunes specific design elements',
        phase: 6
    }
};

/**
 * Generation stages for progress tracking
 */
const GENERATION_STAGES = [
    { id: 'analyzing', name: 'Analyzing Screenshots', agent: 'CREATIVE_DIRECTOR' },
    { id: 'planning', name: 'Planning Design Strategy', agent: 'CREATIVE_DIRECTOR' },
    { id: 'backgrounds', name: 'Selecting Backgrounds', agent: 'BACKGROUND_ARTIST' },
    { id: 'composing', name: 'Composing Layouts', agent: 'ART_DIRECTOR' },
    { id: 'reviewing', name: 'Reviewing Design', agent: 'VISUAL_CRITIC' },
    { id: 'copywriting', name: 'Optimizing Copy', agent: 'COPYWRITER' },
    { id: 'finalizing', name: 'Finalizing Details', agent: 'DETAILER' }
];

/**
 * Make API call to Gemini
 */
async function callAI(prompt, options = {}) {
    // Use the configured Gemini 3 API key (localStorage > .env.local)
    const apiKey = localStorage.getItem('googleApiKey') || window.ENV?.GOOGLE_API_KEY;
    // Use getSelectedModel() for validated model selection - Gemini 3 only
    const model = typeof getSelectedModel === 'function'
        ? getSelectedModel()
        : 'gemini-3-pro-preview';

    if (window.Utils?.DEBUG) {
        console.log('[callAI] Using Gemini');
        console.log('[callAI] Model:', model);
        console.log('[callAI] API Key present:', !!apiKey);
        console.log('[callAI] Options:', { json: options.json, images: options.images?.length || 0, temperature: options.temperature });
    }

    if (!apiKey) {
        throw new Error('No Gemini API key configured. Please add your API key in Settings.');
    }

    return callGemini(apiKey, model, prompt, options);
}

// API request timeout in milliseconds (30 seconds default)
const API_TIMEOUT_MS = 30000;

/**
 * Call Google Gemini API
 */
async function callGemini(apiKey, model, prompt, options = {}) {
    const modelToUse = model || 'gemini-3-pro-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`;

    if (window.Utils?.DEBUG) {
        console.log('[Gemini API] Model:', modelToUse);
        console.log('[Gemini API] URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    }

    const contents = [{
        parts: [{ text: prompt }]
    }];

    // Add images if provided
    if (options.images && options.images.length > 0) {
        for (const img of options.images) {
            if (img.base64) {
                contents[0].parts.push({
                    inline_data: {
                        mime_type: 'image/jpeg',
                        data: img.base64.replace(/^data:image\/\w+;base64,/, '')
                    }
                });
            }
        }
    }

    const requestBody = {
        contents,
        generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 8192
        }
    };

    if (window.Utils?.DEBUG) {
        console.log('[Gemini API] Request config:', requestBody.generationConfig);
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeout = options.timeout || API_TIMEOUT_MS;
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', errorData);
            throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        if (window.Utils?.DEBUG) {
            console.log('Gemini response:', data);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!text) {
            throw new Error('Empty response from Gemini API');
        }

        if (options.json) {
            // Try to extract JSON from the response (may be wrapped in markdown)
            let jsonText = text;
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            } else {
                // Try to find raw JSON
                const startIdx = text.indexOf('{');
                const endIdx = text.lastIndexOf('}');
                if (startIdx !== -1 && endIdx !== -1) {
                    jsonText = text.substring(startIdx, endIdx + 1);
                }
            }
            return JSON.parse(jsonText);
        }

        return text;
    } catch (error) {
        // Handle timeout/abort errors
        if (error.name === 'AbortError') {
            console.error('Gemini API call timed out after', timeout, 'ms');
            throw new Error('API request timed out. Please try again.');
        }
        console.error('Gemini call failed:', error);
        throw error;
    } finally {
        // Always clear the timeout
        clearTimeout(timeoutId);
    }
}

/**
 * AGENT 1: Creative Director
 * Plans overall design strategy and layout sequence
 */
async function runCreativeDirector(appName, appDescription, screenshots, onProgress) {
    console.log('[Creative Director] Starting...');
    console.log('[Creative Director] App:', appName);
    console.log('[Creative Director] Description:', appDescription?.substring(0, 100) + '...');
    console.log('[Creative Director] Screenshots:', screenshots?.length);

    onProgress?.('Analyzing app and planning design strategy...');

    const category = window.CategoryDetection?.detectAppCategory(appDescription) || 'generic';
    const headlinePatterns = window.CategoryDetection?.getHeadlinePatternsForCategory(category) || [];
    console.log('[Creative Director] Detected category:', category);
    console.log('[Creative Director] Headline patterns:', headlinePatterns.slice(0, 3));

    const prompt = `You are the Lead Creative Director at Apple's App Store Design Team.

APP: "${appName}"
DESCRIPTION: "${appDescription}"
CATEGORY: ${category}
SCREENSHOTS: ${screenshots.length}

YOUR MISSION: Create a design plan that maximizes App Store conversion.

CRITICAL RULES:
1. First 3 screenshots appear in search results - they MUST be impactful
2. NEVER repeat the same layout twice
3. Headlines must be 2-3 words max (punchy, not descriptive)
4. Use these headline patterns: ${headlinePatterns.slice(0, 5).join(', ')}

Return a JSON object with this structure:
{
  "appVibe": "brief description of the app's personality",
  "designTheme": "MODERN_MINIMAL" or "SWISS_BRUTALISM" or "NEON_CYBER" or "SOFT_LUXURY" or "GLASS_MORPHISM" or "CLEAN_PRO",
  "themeMode": "LIGHT" or "DARK",
  "accentColor": "#hexcolor",
  "fontStyle": "MODERN_CLEAN" or "EDITORIAL_SERIF" or "BOLD_IMPACT" or "MINIMAL_TECH" or "GEOMETRIC_SANS",
  "slides": [
    {
      "screenshotIndex": 0,
      "layout": "hero_large",
      "title": "2-3 word punchy headline",
      "subtitle": "4-6 word benefit statement"
    }
  ]
}

Available layouts: hero_large, classic, offset_right, offset_left, panoramic_right, panoramic_left, zoom_top, zoom_bottom, tilted_dynamic, duo_overlap, duo_side_by_side, minimal_type, magazine_cover, bento_grid, poster_hero

Ensure EVERY slide has a DIFFERENT layout.`;

    // Convert screenshot images to base64
    console.log('[Creative Director] Converting screenshots to base64...');
    const images = [];
    for (let i = 0; i < Math.min(screenshots.length, 3); i++) {
        const s = screenshots[i];
        try {
            console.log(`[Creative Director] Processing screenshot ${i + 1}...`);
            const base64 = await getScreenshotBase64(s);
            if (base64) {
                console.log(`[Creative Director] Screenshot ${i + 1} converted, length: ${base64.length}`);
                images.push({ base64 });
            } else {
                console.log(`[Creative Director] Screenshot ${i + 1} returned null`);
            }
        } catch (e) {
            console.warn(`[Creative Director] Could not convert screenshot ${i + 1}:`, e);
        }
    }
    console.log(`[Creative Director] Total images prepared: ${images.length}`);

    try {
        console.log('[Creative Director] Calling AI...');
        const result = await callAI(prompt, { json: true, images, temperature: 0.8 });
        console.log('[Creative Director] AI response received:', result);
        return result;
    } catch (error) {
        console.error('[Creative Director] AI call failed:', error);
        throw error;
    }
}

/**
 * Convert a screenshot to base64
 */
async function getScreenshotBase64(screenshot) {
    console.log('[getScreenshotBase64] Starting conversion...');
    console.log('[getScreenshotBase64] Screenshot keys:', Object.keys(screenshot || {}));

    // Check localizedImages first (primary storage)
    if (screenshot.localizedImages) {
        const lang = localStorage.getItem('currentLanguage') || 'en';
        console.log('[getScreenshotBase64] Checking localizedImages for lang:', lang);
        console.log('[getScreenshotBase64] Available langs:', Object.keys(screenshot.localizedImages));

        const localizedData = screenshot.localizedImages[lang] ||
            screenshot.localizedImages['en'] ||
            Object.values(screenshot.localizedImages)[0];
        if (localizedData?.src && localizedData.src.startsWith('data:')) {
            console.log('[getScreenshotBase64] Found dataUrl in localizedImages, length:', localizedData.src.length);
            return localizedData.src;
        }
    }

    // If we have a dataUrl stored directly, use it
    if (screenshot.dataUrl && screenshot.dataUrl.startsWith('data:')) {
        console.log('[getScreenshotBase64] Found direct dataUrl, length:', screenshot.dataUrl.length);
        return screenshot.dataUrl;
    }

    // Get the image element from language utils or directly
    console.log('[getScreenshotBase64] Trying to get image element...');
    const img = window.getScreenshotImage?.(screenshot) || screenshot.image;
    if (!img) {
        console.log('[getScreenshotBase64] No image element found');
        return null;
    }
    if (!img.complete) {
        console.log('[getScreenshotBase64] Image not loaded yet');
        return null;
    }
    console.log('[getScreenshotBase64] Image found, size:', img.naturalWidth, 'x', img.naturalHeight);

    // Draw to canvas and get base64
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 300;
    canvas.height = img.naturalHeight || img.height || 600;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('[getScreenshotBase64] Canvas conversion successful, length:', dataUrl.length);
        return dataUrl;
    } catch (e) {
        // CORS issue - try with original dataUrl if available
        console.warn('[getScreenshotBase64] Canvas tainted, cannot export:', e);
        return null;
    }
}

/**
 * AGENT 2: Background Artist
 * Recommends background styles based on app category
 */
async function runBackgroundArtist(designPlan, category, onProgress) {
    onProgress?.('Selecting optimal background styles...');

    const presets = window.BackgroundPresets?.getPresetsForCategory(category) || [];
    const presetNames = presets.slice(0, 5).map(p => p.name).join(', ');

    const prompt = `You are a Background Artist specializing in App Store screenshots.

DESIGN PLAN: ${JSON.stringify(designPlan)}
CATEGORY: ${category}
AVAILABLE PRESETS: ${presetNames}

Recommend a background approach that:
1. Matches the app's vibe and category
2. Ensures text readability
3. Creates visual hierarchy

Return JSON:
{
  "recommendedPreset": "preset name or 'custom'",
  "customColors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex"
  },
  "style": "gradient" or "organic" or "minimal" or "bold" or "neon",
  "themeMode": "light" or "dark"
}`;

    try {
        return await callAI(prompt, { json: true, temperature: 0.6 });
    } catch (error) {
        console.error('Background Artist error:', error);
        // Return default
        const preset = window.BackgroundPresets?.getBestPresetForCategory(category);
        return {
            recommendedPreset: preset?.name || 'Universal Dark',
            customColors: preset?.colors || { primary: '#6366F1', secondary: '#8B5CF6', background: '#0F0F1A' },
            style: 'gradient',
            themeMode: 'dark'
        };
    }
}

/**
 * AGENT 3: Visual Critic
 * Reviews design for issues before finalizing
 */
async function runVisualCritic(designPlan, onProgress) {
    onProgress?.('Reviewing design for improvements...');

    const prompt = `You are a Visual Critic reviewing App Store screenshot designs.

DESIGN PLAN: ${JSON.stringify(designPlan)}

Check for these issues:
1. Layout repetition (same layout used twice)
2. Headline length (should be 2-3 words max)
3. Visual variety across slides
4. Theme appropriateness for category

Return JSON:
{
  "overallScore": 1-10,
  "issues": [
    {
      "slideIndex": 0,
      "issue": "description",
      "severity": "LOW" or "MEDIUM" or "HIGH",
      "suggestion": "how to fix"
    }
  ],
  "improvements": ["list of suggested improvements"]
}`;

    try {
        return await callAI(prompt, { json: true, temperature: 0.5 });
    } catch (error) {
        console.error('Visual Critic error:', error);
        return { overallScore: 7, issues: [], improvements: [] };
    }
}

/**
 * AGENT 4: Copywriter
 * Optimizes headlines for conversion
 */
async function runCopywriter(designPlan, appName, category, onProgress) {
    onProgress?.('Optimizing headlines for conversion...');

    const headlinePatterns = window.CategoryDetection?.getHeadlinePatternsForCategory(category) || [];

    const prompt = `You are an ELITE ASO Copywriter for Apple's featured apps.

APP: ${appName}
CATEGORY: ${category}
CURRENT HEADLINES: ${designPlan.slides?.map(s => s.title).join(', ')}

MANDATORY RULES:
- Titles: EXACTLY 2-3 words
- Pattern: "Verb." or "Verb. Verb." or "Verb Noun"
- Must be PUNCHY and EMOTIONAL
- NO generic words: "Find", "Get", "Use", "Try", "Check"

GOOD EXAMPLES: ${headlinePatterns.slice(0, 6).join(', ')}
BAD EXAMPLES: "Find Food", "Get Started", "Learn More"

Return JSON:
{
  "slides": [
    {
      "originalTitle": "old title",
      "newTitle": "improved 2-3 word title",
      "originalSubtitle": "old subtitle",
      "newSubtitle": "improved 4-6 word subtitle"
    }
  ]
}`;

    try {
        return await callAI(prompt, { json: true, temperature: 0.8 });
    } catch (error) {
        console.error('Copywriter error:', error);
        return { slides: [] };
    }
}

/**
 * Main Magic Design Pipeline
 * Runs all agents in sequence
 */
async function runMagicDesign(appName, appDescription, screenshots, onProgress, onStageChange) {
    console.log('=== MAGIC DESIGN STARTED ===');
    console.log('App Name:', appName);
    console.log('App Description:', appDescription);
    console.log('Screenshots count:', screenshots?.length);
    console.log('Provider:', localStorage.getItem('aiProvider'));
    console.log('Model:', localStorage.getItem('googleModel') || localStorage.getItem('anthropicModel') || localStorage.getItem('openaiModel'));
    console.log('API Key present:', !!localStorage.getItem('googleApiKey') || !!localStorage.getItem('claudeApiKey') || !!localStorage.getItem('openaiApiKey'));

    const stages = [...GENERATION_STAGES];
    let _currentStage = 0;

    const updateStage = (index) => {
        _currentStage = index;
        console.log(`>>> Stage ${index + 1}/${stages.length}: ${stages[index]?.name}`);
        onStageChange?.(stages[index], index, stages.length);
    };

    try {
        // Stage 1: Creative Director - Analyze and Plan
        updateStage(0);
        onProgress?.('Analyzing your screenshots...');
        await new Promise(r => setTimeout(r, 500));

        updateStage(1);
        console.log('Calling Creative Director...');
        const designPlan = await runCreativeDirector(appName, appDescription, screenshots, onProgress);
        console.log('Creative Director result:', designPlan);

        // Stage 2: Background Artist
        updateStage(2);
        const category = window.CategoryDetection?.detectAppCategory(appDescription) || 'generic';
        console.log('Detected category:', category);
        console.log('Calling Background Artist...');
        const backgroundPlan = await runBackgroundArtist(designPlan, category, onProgress);
        console.log('Background Artist result:', backgroundPlan);

        // Stage 3: Art Director (Layout composition)
        updateStage(3);
        onProgress?.('Composing visual layouts...');
        console.log('Art Director stage (layout composition)...');
        await new Promise(r => setTimeout(r, 300));

        // Stage 4: Visual Critic
        updateStage(4);
        console.log('Calling Visual Critic...');
        const critique = await runVisualCritic(designPlan, onProgress);
        console.log('Visual Critic result:', critique);

        // Stage 5: Copywriter
        updateStage(5);
        console.log('Calling Copywriter...');
        const copyOptimizations = await runCopywriter(designPlan, appName, category, onProgress);
        console.log('Copywriter result:', copyOptimizations);

        // Stage 6: Finalize
        updateStage(6);
        onProgress?.('Finalizing your design...');
        await new Promise(r => setTimeout(r, 300));

        // Merge all results
        const finalPlan = {
            ...designPlan,
            background: backgroundPlan,
            critique,
            category,
            slides: designPlan.slides?.map((slide, i) => ({
                ...slide,
                title: copyOptimizations.slides?.[i]?.newTitle || slide.title,
                subtitle: copyOptimizations.slides?.[i]?.newSubtitle || slide.subtitle
            }))
        };

        console.log('=== MAGIC DESIGN COMPLETE ===');
        console.log('Final plan:', finalPlan);
        return finalPlan;

    } catch (error) {
        console.error('=== MAGIC DESIGN FAILED ===');
        console.error('Error:', error);
        console.error('Stack:', error.stack);
        throw error;
    }
}

/**
 * Apply generated design plan to state
 */
function applyDesignPlan(plan, state) {
    console.log('[applyDesignPlan] Starting...');
    console.log('[applyDesignPlan] Plan:', plan);
    console.log('[applyDesignPlan] State exists:', !!state);

    if (!plan || !state) {
        console.error('[applyDesignPlan] Missing plan or state');
        return state;
    }

    // Apply theme
    if (plan.designTheme && window.ThemeEngine) {
        console.log('[applyDesignPlan] Applying theme:', plan.designTheme);
        try {
            state = window.ThemeEngine.applyTheme(plan.designTheme, plan.themeMode || 'DARK', state);
        } catch (e) {
            console.error('[applyDesignPlan] Theme error:', e);
        }
    }

    // Apply background
    if (plan.background && state.background) {
        console.log('[applyDesignPlan] Applying background');
        try {
            const preset = window.BackgroundPresets?.getPresetsForCategory(plan.category)?.[0];
            if (preset) {
                window.BackgroundPresets.applyPresetToState(preset.id, state);
            } else if (plan.background.customColors && state.background.gradient) {
                state.background.gradient.stops = [
                    { color: plan.background.customColors.background || '#1a1a2e', position: 0 },
                    { color: plan.background.customColors.primary || '#4a4a6a', position: 50 },
                    { color: plan.background.customColors.secondary || '#2a2a4e', position: 100 }
                ];
            }
        } catch (e) {
            console.error('[applyDesignPlan] Background error:', e);
        }
    }

    // Apply slides
    if (plan.slides && state.screenshots) {
        console.log('[applyDesignPlan] Applying', plan.slides.length, 'slides to', state.screenshots.length, 'screenshots');
        try {
            plan.slides.forEach((slide, index) => {
                if (state.screenshots[index]) {
                    // Apply layout
                    if (slide.layout && window.LayoutEngine) {
                        const layoutConfig = window.LayoutEngine.getLayoutConfig(slide.layout);
                        if (layoutConfig && layoutConfig.device) {
                            state.screenshots[index].scale = (layoutConfig.device.scale || 1) * 100;
                            state.screenshots[index].x = layoutConfig.device.x || 0;
                            state.screenshots[index].y = layoutConfig.device.y || 0;
                            state.screenshots[index].rotation = layoutConfig.device.rotation || 0;
                            state.screenshots[index].layout = slide.layout;
                            console.log(`[applyDesignPlan] Slide ${index}: layout=${slide.layout}`);
                        }
                    }

                    // Apply per-screenshot text
                    const lang = state.currentLanguage || 'en';
                    if (!state.screenshots[index].text) {
                        state.screenshots[index].text = { headlines: {}, subheadlines: {} };
                    }
                    if (slide.title) {
                        state.screenshots[index].text.headlines[lang] = slide.title;
                    }
                    if (slide.subtitle) {
                        state.screenshots[index].text.subheadlines[lang] = slide.subtitle;
                    }
                    console.log(`[applyDesignPlan] Slide ${index}: "${slide.title}" - "${slide.subtitle}"`);
                }
            });
        } catch (e) {
            console.error('[applyDesignPlan] Slides error:', e);
        }

        // Also update global text with first slide
        try {
            if (plan.slides[0] && state.text) {
                const lang = state.currentLanguage || 'en';
                if (!state.text.headlines) state.text.headlines = {};
                if (!state.text.subheadlines) state.text.subheadlines = {};
                state.text.headlines[lang] = plan.slides[0].title;
                state.text.subheadlines[lang] = plan.slides[0].subtitle;
            }
        } catch (e) {
            console.error('[applyDesignPlan] Global text error:', e);
        }
    }

    // Store accent color
    if (plan.accentColor) {
        state.accentColor = plan.accentColor;
    }

    console.log('[applyDesignPlan] Complete!');
    return state;
}

// Export for use in app.js
window.AIAgents = {
    AGENTS,
    GENERATION_STAGES,
    callAI,
    runCreativeDirector,
    runBackgroundArtist,
    runVisualCritic,
    runCopywriter,
    runMagicDesign,
    applyDesignPlan
};

// Export API timeout constant for testing
window.API_TIMEOUT_MS = API_TIMEOUT_MS;
