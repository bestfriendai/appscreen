/**
 * AI Engine - Unified AI Pipeline Orchestrator
 * Powers the "Magic Design" feature for complete screenshot generation
 * Analyzes screenshots, generates backgrounds, selects layouts, writes headlines
 */

// AI Engine State
const aiEngineState = {
    isProcessing: false,
    currentStage: null,
    stages: [
        { id: 'analyze', name: 'Analyzing your app', icon: '🔍', status: 'pending' },
        { id: 'strategy', name: 'Planning design strategy', icon: '🎯', status: 'pending' },
        { id: 'backgrounds', name: 'Generating backgrounds', icon: '🌈', status: 'pending' },
        { id: 'layouts', name: 'Selecting layouts', icon: '📐', status: 'pending' },
        { id: 'headlines', name: 'Writing headlines', icon: '✍️', status: 'pending' },
        { id: 'polish', name: 'Final polish', icon: '💎', status: 'pending' }
    ],
    lastAnalysis: null,
    lastStrategy: null
};

/**
 * Main Magic Design function - orchestrates the entire AI pipeline
 * @param {Object} options - Configuration options
 * @param {string} options.category - Override detected category
 * @param {string} options.theme - Override detected theme
 * @param {string} options.headlineStyle - Headline generation style
 * @param {boolean} options.generateBackgroundImages - Whether to generate AI images for backgrounds
 */
async function magicDesign(options = {}) {
    if (aiEngineState.isProcessing) {
        showAppAlert('AI is already processing. Please wait.', 'info');
        return;
    }

    // Validate we have screenshots
    if (!state.screenshots || state.screenshots.length === 0) {
        showAppAlert('Please add some screenshots first.', 'info');
        return;
    }

    // Check API key
    const apiKey = getApiKey();
    if (!apiKey) {
        showAppAlert('Please configure your AI API key in Settings first.', 'error');
        return;
    }

    aiEngineState.isProcessing = true;
    resetAIStages();
    showAIProgressModal();

    try {
        // Stage 1: Analyze Screenshots
        updateAIStage('analyze', 'processing');
        const analysis = await analyzeAppScreenshots(options.category);
        aiEngineState.lastAnalysis = analysis;
        updateAIStage('analyze', 'complete');

        // Stage 2: Plan Design Strategy
        updateAIStage('strategy', 'processing');
        const strategy = await planDesignStrategy(analysis, options);
        aiEngineState.lastStrategy = strategy;
        updateAIStage('strategy', 'complete');

        // Stage 3: Generate/Apply Backgrounds
        updateAIStage('backgrounds', 'processing');
        await applySmartBackgrounds(analysis, strategy, options.generateBackgroundImages);
        updateAIStage('backgrounds', 'complete');

        // Stage 4: Apply Layouts
        updateAIStage('layouts', 'processing');
        await applySmartLayouts(analysis, strategy);
        updateAIStage('layouts', 'complete');

        // Stage 5: Generate Headlines
        updateAIStage('headlines', 'processing');
        await generateSmartHeadlines(analysis, strategy, options.headlineStyle);
        updateAIStage('headlines', 'complete');

        // Stage 6: Polish (widgets, final adjustments)
        updateAIStage('polish', 'processing');
        await applyFinalPolish(analysis, strategy);
        updateAIStage('polish', 'complete');

        // Update UI
        syncUIWithState();
        updateCanvas();
        saveState();

        // Show strategy report
        setTimeout(() => {
            hideAIProgressModal();
            showStrategyReport(analysis, strategy);
        }, 500);

    } catch (error) {
        console.error('Magic Design error:', error);
        hideAIProgressModal();

        if (error.message === 'AI_UNAVAILABLE') {
            showAppAlert('AI service unavailable. Please check your API key.', 'error');
        } else {
            showAppAlert(`Error: ${error.message}`, 'error');
        }
    } finally {
        aiEngineState.isProcessing = false;
    }
}

/**
 * Analyze app screenshots using vision API
 * Returns comprehensive analysis of app type, features, and design recommendations
 */
async function analyzeAppScreenshots(categoryOverride = null) {
    const screenshots = state.screenshots;
    const images = [];

    // Collect images
    for (const screenshot of screenshots) {
        const dataUrl = getScreenshotDataUrl(screenshot, state.currentLanguage);
        if (dataUrl) {
            const parsed = parseDataUrl(dataUrl);
            if (parsed) images.push(parsed);
        }
    }

    if (images.length === 0) {
        throw new Error('No screenshot images found');
    }

    const prompt = `You are an expert App Store designer and ASO specialist analyzing app screenshots.

Study these ${images.length} app screenshots carefully and provide a comprehensive analysis.

ANALYZE AND RETURN:

1. APP IDENTITY
   - primaryFunction: What does this app do? (one sentence)
   - category: Main category (fitness, finance, productivity, social, food, travel, education, entertainment, health, shopping, developer, gaming, weather, news, photo, video, utilities, lifestyle, kids, sports, navigation, business, music, medical)
   - subcategory: More specific type (e.g., "teleprompter" for productivity, "crypto" for finance)
   - targetAudience: Who uses this app? (e.g., "content creators", "busy professionals")
   - vibe: Overall feel (professional, playful, premium, minimal, energetic, calm, bold, elegant)
   - valueProp: Core value proposition in 5-10 words

2. PER-SCREENSHOT ANALYSIS (0-indexed)
   For each screenshot provide:
   - feature: What specific feature/screen is shown
   - keyElements: Notable UI elements visible (list)
   - userBenefit: What benefit does this screen demonstrate
   - visualWeight: Where is the content concentrated? (top, center, bottom, left, right, full)
   - hasCriticalEdgeContent: Is there important content at screen edges that shouldn't be cropped? (boolean)

3. DESIGN RECOMMENDATIONS
   - suggestedColors: Array of 3 hex colors that match the app (primary, secondary, accent)
   - backgroundTone: "dark" or "light" (based on app UI)
   - typography: Recommended font style (bold-modern, elegant-serif, playful-rounded, minimal-clean, tech-mono)
   - backgroundStyle: Recommended style (gradient, solid, mesh, abstract, minimal)

4. SCREENSHOT FLOW
   - tellsStory: Do the screenshots tell a progression/story? (boolean)
   - suggestedNarrative: Brief description of the story arc
   - usePanoramicFlow: Should devices flow between frames? (boolean)

Return ONLY valid JSON (no markdown, no explanation):
{
    "app": {
        "primaryFunction": "...",
        "category": "...",
        "subcategory": "...",
        "targetAudience": "...",
        "vibe": "...",
        "valueProp": "..."
    },
    "screenshots": [
        {
            "index": 0,
            "feature": "...",
            "keyElements": ["...", "..."],
            "userBenefit": "...",
            "visualWeight": "...",
            "hasCriticalEdgeContent": false
        }
    ],
    "design": {
        "suggestedColors": ["#hex1", "#hex2", "#hex3"],
        "backgroundTone": "dark",
        "typography": "...",
        "backgroundStyle": "..."
    },
    "flow": {
        "tellsStory": true,
        "suggestedNarrative": "...",
        "usePanoramicFlow": false
    }
}`;

    updateAIProgress('Sending screenshots to AI for analysis...');
    const responseText = await callVisionAPI(images, prompt);
    const analysis = parseJSONResponse(responseText);

    // Override category if specified
    if (categoryOverride && categoryOverride !== 'auto') {
        analysis.app.category = categoryOverride;
    }

    return analysis;
}

/**
 * Plan design strategy based on analysis
 */
async function planDesignStrategy(analysis, options = {}) {
    const screenshotCount = state.screenshots.length;
    const category = analysis.app.category;

    // Determine theme
    let theme = options.theme || 'auto';
    if (theme === 'auto') {
        theme = selectThemeForApp(analysis);
    }

    // Get theme configuration
    const themeConfig = window.DesignThemes?.getTheme(theme) || getDefaultTheme();

    // Select layout sequence
    const layoutSequence = selectLayoutSequence(analysis, screenshotCount);

    // Select background preset
    const backgroundPreset = selectBackgroundPreset(analysis);

    // Determine headline style
    const headlineStyle = options.headlineStyle || determineHeadlineStyle(analysis);

    // Build strategy
    const strategy = {
        theme: theme,
        themeConfig: themeConfig,
        layoutSequence: layoutSequence,
        backgroundPreset: backgroundPreset,
        backgroundTone: analysis.design.backgroundTone,
        colorPalette: {
            primary: analysis.design.suggestedColors[0] || themeConfig.colors?.primary || '#6366F1',
            secondary: analysis.design.suggestedColors[1] || themeConfig.colors?.secondary || '#8B5CF6',
            accent: analysis.design.suggestedColors[2] || themeConfig.colors?.accent || '#EC4899',
            background: analysis.design.backgroundTone === 'dark' ? '#0F0F1A' : '#F8F9FA',
            text: analysis.design.backgroundTone === 'dark' ? '#FFFFFF' : '#1A1A1A',
            textSecondary: analysis.design.backgroundTone === 'dark' ? '#CCCCCC' : '#6B6B6B'
        },
        typography: analysis.design.typography,
        headlineStyle: headlineStyle,
        usePanoramicFlow: analysis.flow.usePanoramicFlow && screenshotCount >= 4,
        widgets: suggestWidgets(analysis)
    };

    return strategy;
}

/**
 * Select appropriate theme based on app analysis
 */
function selectThemeForApp(analysis) {
    const category = analysis.app.category;
    const vibe = analysis.app.vibe;
    const backgroundTone = analysis.design.backgroundTone;

    // Category-based theme mapping
    const categoryThemes = {
        'developer': 'neon_cyber',
        'gaming': 'neon_cyber',
        'finance': backgroundTone === 'dark' ? 'clean_pro' : 'modern_minimal',
        'fitness': 'swiss_brutalism',
        'health': 'soft_luxury',
        'wellness': 'soft_luxury',
        'social': 'glass_morphism',
        'lifestyle': 'soft_luxury',
        'shopping': backgroundTone === 'dark' ? 'neon_cyber' : 'modern_minimal',
        'entertainment': 'glass_morphism',
        'productivity': 'modern_minimal',
        'business': 'clean_pro',
        'education': 'modern_minimal',
        'food': backgroundTone === 'dark' ? 'soft_luxury' : 'modern_minimal'
    };

    // Vibe-based adjustments
    if (vibe === 'premium' || vibe === 'elegant') return 'soft_luxury';
    if (vibe === 'bold' || vibe === 'energetic') return 'swiss_brutalism';
    if (vibe === 'playful') return 'glass_morphism';
    if (vibe === 'minimal') return 'modern_minimal';

    return categoryThemes[category] || 'modern_minimal';
}

/**
 * Select layout sequence for screenshots
 */
function selectLayoutSequence(analysis, screenshotCount) {
    const category = analysis.app.category;
    const usePanoramic = analysis.flow.usePanoramicFlow && screenshotCount >= 4;

    // Use SmartLayout if available
    if (window.SmartLayout) {
        const sequence = window.SmartLayout.generateSmartLayoutSequence(
            category,
            screenshotCount,
            usePanoramic
        );
        return sequence.map(s => s.layout);
    }

    // Fallback layout selection
    const layouts = [];
    for (let i = 0; i < screenshotCount; i++) {
        if (i === 0) {
            layouts.push('hero_large');
        } else if (i === screenshotCount - 1) {
            layouts.push('hero_large');
        } else if (usePanoramic && i % 2 === 1) {
            layouts.push('panoramic_right');
        } else if (usePanoramic && i % 2 === 0) {
            layouts.push('panoramic_left');
        } else {
            layouts.push(i % 2 === 0 ? 'offset_right' : 'offset_left');
        }
    }

    return layouts;
}

/**
 * Select background preset based on analysis
 */
function selectBackgroundPreset(analysis) {
    const category = analysis.app.category;

    if (window.BackgroundPresets) {
        return window.BackgroundPresets.getBestPresetForCategory(category);
    }

    // Default preset
    return {
        id: 'universal-dark',
        colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            background: '#0F0F1A'
        }
    };
}

/**
 * Determine headline style based on analysis
 */
function determineHeadlineStyle(analysis) {
    const vibe = analysis.app.vibe;
    const category = analysis.app.category;

    if (vibe === 'bold' || vibe === 'energetic') return 'command';
    if (vibe === 'playful') return 'question';
    if (category === 'fitness' || category === 'gaming') return 'command';
    if (category === 'health' || category === 'wellness') return 'benefit_focused';

    return 'short_punchy';
}

/**
 * Apply smart backgrounds to all screenshots
 */
async function applySmartBackgrounds(analysis, strategy, generateImages = false) {
    const screenshots = state.screenshots;
    const adjustColor = window.Utils?.adjustColorBrightness || adjustColorBrightness;

    for (let i = 0; i < screenshots.length; i++) {
        updateAIProgress(`Applying background ${i + 1}/${screenshots.length}...`);

        const screenshot = screenshots[i];

        // Use consistent angle for professional look, vary colors subtly instead
        const gradientAngle = 135; // Consistent across all slides
        const colorVariation = i * 3; // Subtle color shift per slide
        const positionShift = i * 2; // Subtle gradient position shift

        // Apply background settings
        screenshot.background = screenshot.background || (window.Utils?.deepClone(state.defaults.background) || {});
        screenshot.background.type = 'gradient';
        screenshot.background.gradient = {
            angle: gradientAngle,
            stops: [
                { color: strategy.colorPalette.background, position: 0 + positionShift },
                { color: adjustColor(strategy.colorPalette.primary, colorVariation), position: 45 + positionShift },
                { color: adjustColor(strategy.colorPalette.secondary, -colorVariation), position: 100 }
            ]
        };

        // Apply noise based on theme
        screenshot.background.noise = strategy.themeConfig?.useNoise || false;
        screenshot.background.noiseIntensity = strategy.themeConfig?.noiseIntensity || 8;

        // If user wants AI-generated background images
        if (generateImages && i === 0) {
            // Only generate for first screenshot to save API calls
            try {
                const bgImage = await generateBackgroundImage(analysis, strategy);
                if (bgImage) {
                    screenshot.background.type = 'image';
                    screenshot.background.image = bgImage;
                    screenshot.background.imageFit = 'cover';
                    screenshot.background.imageBlur = 0;
                }
            } catch (e) {
                if (window.Utils?.DEBUG) console.warn('Background image generation failed, using gradient', e);
            }
        }
    }
}

/**
 * Generate AI background image
 */
async function generateBackgroundImage(analysis, strategy) {
    // This would integrate with image generation APIs
    // For now, return null to use gradient fallback
    // Could be extended to use DALL-E, Midjourney API, or Gemini Imagen

    const prompt = buildBackgroundImagePrompt(analysis, strategy);
    console.log('Background image prompt:', prompt);

    // Placeholder for actual image generation
    // const imageUrl = await callImageGenerationAPI(prompt);
    // return imageUrl;

    return null;
}

/**
 * Build prompt for background image generation
 */
function buildBackgroundImagePrompt(analysis, strategy) {
    const category = analysis.app.category;
    const vibe = analysis.app.vibe;
    const colors = strategy.colorPalette;

    return `Abstract background for ${category} mobile app, ${vibe} aesthetic,
colors: ${colors.primary}, ${colors.secondary}, ${colors.accent},
smooth gradients, no text, no objects, professional app store screenshot background,
high resolution, clean, modern`;
}

/**
 * Apply smart layouts to all screenshots
 */
async function applySmartLayouts(analysis, strategy) {
    const screenshots = state.screenshots;
    const layouts = strategy.layoutSequence;

    for (let i = 0; i < screenshots.length; i++) {
        updateAIProgress(`Applying layout ${i + 1}/${screenshots.length}...`);

        const screenshot = screenshots[i];
        const layoutId = layouts[i] || 'classic';

        // Get layout config
        const layoutConfig = window.LayoutEngine?.getLayoutConfig(layoutId) || getDefaultLayoutConfig(layoutId);

        // Apply layout settings to screenshot - initialize with defaults if needed
        screenshot.screenshot = screenshot.screenshot || (window.Utils?.deepClone(state.defaults.screenshot) || {});

        // Convert layout coordinates (offset from center) to screenshot coordinates (0-100%)
        const position = window.Utils?.convertLayoutToScreenshotPosition(layoutConfig) || {
            scale: (layoutConfig.device.scale || 0.65) * 100,
            x: 50 + (layoutConfig.device.x || 0),
            y: 50 + (layoutConfig.device.y || 20),
            rotation: layoutConfig.device.rotation || 0
        };

        screenshot.screenshot.scale = position.scale;
        screenshot.screenshot.x = position.x;
        screenshot.screenshot.y = position.y;
        screenshot.screenshot.rotation = position.rotation;

        // Store layout info
        screenshot.layout = layoutId;
        screenshot.layoutConfig = layoutConfig;

        // Apply text positioning from layout
        if (layoutConfig.text) {
            screenshot.text = screenshot.text || {};
            screenshot.text.offsetY = layoutConfig.text.offsetY || 6;
            screenshot.text.position = layoutConfig.text.position || 'top';

            // Adjust text alignment based on layout
            if (layoutConfig.text.align === 'left') {
                screenshot.text.stackedText = true;
            }
        }

        // Initialize shadow if needed and apply settings
        screenshot.screenshot.shadow = screenshot.screenshot.shadow || {
            enabled: true,
            blur: 50,
            opacity: 30,
            x: 0,
            y: 20,
            color: '#000000'
        };

        // Apply enhanced shadow for floating layouts
        if (layoutConfig.device.floatingShadow) {
            screenshot.screenshot.shadow.blur = 60;
            screenshot.screenshot.shadow.opacity = 40;
            screenshot.screenshot.shadow.y = 30;
        }
    }
}

/**
 * Get default layout config fallback
 */
function getDefaultLayoutConfig(layoutId) {
    // Better positioning - device pushed down to avoid text overlap
    const configs = {
        'hero_large': { device: { scale: 0.72, x: 0, y: 25, rotation: 0 }, text: { offsetY: 8 } },
        'classic': { device: { scale: 0.65, x: 0, y: 22, rotation: 0 }, text: { offsetY: 6 } },
        'offset_right': { device: { scale: 0.68, x: 12, y: 20, rotation: -5 }, text: { offsetY: 8 } },
        'offset_left': { device: { scale: 0.68, x: -12, y: 20, rotation: 5 }, text: { offsetY: 8 } },
        'panoramic_right': { device: { scale: 0.75, x: 30, y: 18, rotation: -3 }, text: { offsetY: 6 } },
        'panoramic_left': { device: { scale: 0.75, x: -30, y: 18, rotation: 3 }, text: { offsetY: 6 } },
        'zoom_top': { device: { scale: 1.0, x: 0, y: 40, rotation: 0 }, text: { offsetY: 5 } },
        'zoom_bottom': { device: { scale: 1.0, x: 0, y: -15, rotation: 0 }, text: { offsetY: 8 } },
        'tilted_dynamic': { device: { scale: 0.7, x: 0, y: 22, rotation: -12 }, text: { offsetY: 6 } },
        'minimal_type': { device: { scale: 0.5, x: 0, y: 30, rotation: 0 }, text: { offsetY: 5 } }
    };

    return configs[layoutId] || configs['classic'];
}

/**
 * Generate smart headlines for all screenshots
 */
async function generateSmartHeadlines(analysis, strategy, headlineStyle = 'short_punchy') {
    const screenshots = state.screenshots;
    const images = [];

    // Collect images
    for (const screenshot of screenshots) {
        const dataUrl = getScreenshotDataUrl(screenshot, state.currentLanguage);
        if (dataUrl) {
            const parsed = parseDataUrl(dataUrl);
            if (parsed) images.push(parsed);
        }
    }

    const styleInstructions = {
        'short_punchy': 'headline: 2-4 words, punchy and memorable. subheadline: 4-8 words expanding on headline.',
        'benefit_focused': 'headline: 3-5 words focusing on user benefit. subheadline: 5-10 words explaining the value.',
        'question': 'headline: 3-6 words as a question. subheadline: 4-8 words answering it.',
        'command': 'headline: 2-4 words as a command/action. subheadline: 4-8 words supporting the action.'
    };

    const prompt = `You are an expert App Store copywriter. Generate compelling marketing titles.

APP CONTEXT:
- Category: ${analysis.app.category}
- Function: ${analysis.app.primaryFunction}
- Value Prop: ${analysis.app.valueProp}
- Target: ${analysis.app.targetAudience}
- Vibe: ${analysis.app.vibe}

SCREENSHOT FEATURES:
${analysis.screenshots.map((s, i) => `${i}: ${s.feature} - ${s.userBenefit}`).join('\n')}

STYLE: ${styleInstructions[headlineStyle]}

CRITICAL RULES:
1. Screenshot 0's headline MUST focus on the MAIN VALUE PROPOSITION
2. Each headline MUST be UNIQUE - no similar titles
3. Each headline highlights a DIFFERENT feature/benefit
4. Use power words that resonate with ${analysis.app.targetAudience}
5. Match the ${analysis.app.vibe} vibe

Return ONLY valid JSON:
{
    "0": { "headline": "...", "subheadline": "..." },
    "1": { "headline": "...", "subheadline": "..." }
}`;

    updateAIProgress('Generating marketing headlines...');
    const responseText = await callVisionAPI(images, prompt);
    const headlines = parseJSONResponse(responseText);

    // Apply headlines to screenshots
    const sourceLang = state.currentLanguage || 'en';

    for (let i = 0; i < screenshots.length; i++) {
        const headlineData = headlines[String(i)];
        if (headlineData) {
            const screenshot = screenshots[i];

            // Ensure text object exists
            screenshot.text = screenshot.text || JSON.parse(JSON.stringify(state.defaults.text));
            screenshot.text.headlines = screenshot.text.headlines || {};
            screenshot.text.subheadlines = screenshot.text.subheadlines || {};

            // Set headlines
            screenshot.text.headlines[sourceLang] = headlineData.headline;
            screenshot.text.subheadlines[sourceLang] = headlineData.subheadline;

            // Enable both headline and subheadline
            screenshot.text.headlineEnabled = true;
            screenshot.text.subheadlineEnabled = true;

            // Apply text colors based on background tone
            screenshot.text.headlineColor = strategy.colorPalette.text;
            screenshot.text.subheadlineColor = strategy.colorPalette.textSecondary;

            // Apply typography
            applyTypographyStyle(screenshot, strategy.typography);
        }
    }
}

/**
 * Apply typography style to screenshot
 */
function applyTypographyStyle(screenshot, typographyStyle) {
    // Premium fonts that work great for App Store screenshots
    const styles = {
        'bold-modern': { font: 'Poppins', weight: '700', size: 80 },
        'elegant-serif': { font: 'Playfair Display', weight: '700', size: 75 },
        'playful-rounded': { font: 'Quicksand', weight: '700', size: 78 },
        'minimal-clean': { font: 'DM Sans', weight: '600', size: 76 },
        'tech-mono': { font: 'Space Grotesk', weight: '700', size: 74 },
        'premium-sans': { font: 'Montserrat', weight: '800', size: 72 },
        'apple-style': { font: 'SF Pro Display', weight: '700', size: 78 }
    };

    const style = styles[typographyStyle] || styles['bold-modern'];

    screenshot.text.headlineFont = style.font;
    screenshot.text.headlineWeight = style.weight;
    screenshot.text.headlineSize = style.size;

    screenshot.text.subheadlineFont = style.font;
    screenshot.text.subheadlineWeight = '400';
    screenshot.text.subheadlineSize = Math.round(style.size * 0.55);
}

/**
 * Suggest widgets based on analysis
 */
function suggestWidgets(analysis) {
    const widgets = [];
    const category = analysis.app.category;

    // Consumer apps get ratings
    if (['social', 'entertainment', 'shopping', 'food', 'travel', 'lifestyle'].includes(category)) {
        widgets.push({
            type: 'rating',
            content: '4.9★ • 50K+ Reviews',
            position: { x: 15, y: 8 },
            onSlide: 0
        });
    }

    // Productivity/business apps get achievement badges
    if (['productivity', 'business', 'finance', 'education'].includes(category)) {
        widgets.push({
            type: 'badge',
            content: `#1 in ${capitalizeFirst(category)}`,
            position: { x: 85, y: 8 },
            onSlide: 0
        });
    }

    // Security-sensitive apps
    if (['finance', 'health', 'business', 'medical'].includes(category)) {
        widgets.push({
            type: 'security',
            content: 'Bank-Level Security',
            position: { x: 50, y: 92 },
            onSlide: state.screenshots.length - 1
        });
    }

    return widgets;
}

/**
 * Apply final polish (widgets, final adjustments)
 */
async function applyFinalPolish(analysis, strategy) {
    updateAIProgress('Adding finishing touches...');

    // Apply widgets if WidgetEngine is available
    if (window.WidgetEngine && strategy.widgets.length > 0) {
        for (const widget of strategy.widgets) {
            if (widget.onSlide < state.screenshots.length) {
                const screenshot = state.screenshots[widget.onSlide];
                screenshot.widgets = screenshot.widgets || [];
                screenshot.widgets.push(widget);
            }
        }
    }

    // Ensure visual variety
    ensureVisualVariety();

    // Apply theme-specific polish
    applyThemePolish(strategy);
}

/**
 * Ensure visual variety across screenshots
 */
function ensureVisualVariety() {
    const screenshots = state.screenshots;
    const usedLayouts = [];

    for (let i = 0; i < screenshots.length; i++) {
        const layout = screenshots[i].layout;

        // Check for consecutive repeats
        if (i > 0 && screenshots[i - 1].layout === layout) {
            // Swap to alternative layout
            const alternatives = ['offset_right', 'offset_left', 'classic', 'tilted_dynamic'];
            const newLayout = alternatives.find(l => !usedLayouts.includes(l)) || 'classic';

            const layoutConfig = window.LayoutEngine?.getLayoutConfig(newLayout) || getDefaultLayoutConfig(newLayout);
            screenshots[i].screenshot.scale = layoutConfig.device.scale * 100;
            screenshots[i].screenshot.x = 50 + layoutConfig.device.x;
            screenshots[i].screenshot.y = 50 + layoutConfig.device.y;
            screenshots[i].screenshot.rotation = layoutConfig.device.rotation || 0;
            screenshots[i].layout = newLayout;
        }

        usedLayouts.push(screenshots[i].layout);
    }
}

/**
 * Apply theme-specific polish
 */
function applyThemePolish(strategy) {
    const theme = strategy.theme;

    // Theme-specific adjustments
    const themePolish = {
        'neon_cyber': () => {
            // Add glow effects
            state.screenshots.forEach(s => {
                s.screenshot.shadow.color = strategy.colorPalette.accent;
                s.screenshot.shadow.opacity = 50;
            });
        },
        'glass_morphism': () => {
            // Add subtle blur and transparency effects
            state.screenshots.forEach(s => {
                s.background.overlayOpacity = 10;
                s.background.overlayColor = '#FFFFFF';
            });
        },
        'soft_luxury': () => {
            // Softer shadows
            state.screenshots.forEach(s => {
                s.screenshot.shadow.blur = 50;
                s.screenshot.shadow.opacity = 25;
            });
        }
    };

    if (themePolish[theme]) {
        themePolish[theme]();
    }
}

/**
 * Call vision API with images and prompt
 */
async function callVisionAPI(images, prompt) {
    const provider = getSelectedProvider();
    const apiKey = getApiKey();

    if (provider === 'google') {
        return await generateTitlesWithGoogle(apiKey, images, prompt);
    } else if (provider === 'anthropic') {
        return await generateTitlesWithAnthropic(apiKey, images, prompt);
    } else if (provider === 'openai') {
        return await generateTitlesWithOpenAI(apiKey, images, prompt);
    }

    throw new Error(`Unknown provider: ${provider}`);
}

/**
 * Parse JSON from AI response
 * Uses Utils.parseJSONFromAIResponse if available
 */
function parseJSONResponse(responseText) {
    if (window.Utils?.parseJSONFromAIResponse) {
        return window.Utils.parseJSONFromAIResponse(responseText);
    }
    // Fallback implementation
    let cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }
    return JSON.parse(cleaned);
}

/**
 * Adjust color brightness
 * Uses Utils.adjustColorBrightness if available
 */
function adjustColorBrightness(hex, percent) {
    if (window.Utils?.adjustColorBrightness) {
        return window.Utils.adjustColorBrightness(hex, percent);
    }
    // Fallback implementation
    if (!hex) return '#000000';
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Capitalize first letter
 * Uses Utils.capitalizeFirst if available
 */
function capitalizeFirst(str) {
    if (window.Utils?.capitalizeFirst) {
        return window.Utils.capitalizeFirst(str);
    }
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get default theme config
 */
function getDefaultTheme() {
    return {
        id: 'modern_minimal',
        name: 'Modern Minimal',
        colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#EC4899'
        },
        useNoise: false
    };
}

// ============================================
// UI Functions for Progress and Reports
// ============================================

/**
 * Reset AI stage states
 */
function resetAIStages() {
    aiEngineState.stages.forEach(stage => {
        stage.status = 'pending';
    });
    aiEngineState.currentStage = null;
}

/**
 * Update AI stage status
 */
function updateAIStage(stageId, status) {
    const stage = aiEngineState.stages.find(s => s.id === stageId);
    if (stage) {
        stage.status = status;
        aiEngineState.currentStage = stageId;
        renderAIProgress();
    }
}

/**
 * Update AI progress text
 */
function updateAIProgress(text) {
    const detailEl = document.getElementById('ai-progress-detail');
    if (detailEl) {
        detailEl.textContent = text;
    }
}

/**
 * Show AI progress modal
 */
function showAIProgressModal() {
    let modal = document.getElementById('ai-progress-modal');
    if (!modal) {
        modal = createAIProgressModal();
    }
    modal.classList.add('visible');
    renderAIProgress();
}

/**
 * Hide AI progress modal
 */
function hideAIProgressModal() {
    const modal = document.getElementById('ai-progress-modal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

/**
 * Create AI progress modal
 */
function createAIProgressModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-progress-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal ai-progress-modal">
            <div class="modal-icon" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #8B5CF6; animation: spin 2s linear infinite;">
                    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z"/>
                </svg>
            </div>
            <h3 class="modal-title">Creating Your Screenshots</h3>
            <div id="ai-progress-stages" class="ai-progress-stages"></div>
            <div class="progress-bar-container">
                <div id="ai-progress-bar" class="progress-bar-fill"></div>
            </div>
            <p id="ai-progress-detail" class="ai-progress-detail">Initializing AI...</p>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

/**
 * Render AI progress stages
 */
function renderAIProgress() {
    const container = document.getElementById('ai-progress-stages');
    if (!container) return;

    const completedCount = aiEngineState.stages.filter(s => s.status === 'complete').length;
    const progress = (completedCount / aiEngineState.stages.length) * 100;

    container.innerHTML = aiEngineState.stages.map(stage => `
        <div class="ai-progress-stage ${stage.status}">
            <span class="stage-icon">${stage.icon}</span>
            <span class="stage-text">${stage.name}</span>
            <span class="stage-status">
                ${stage.status === 'complete' ? '✓' : stage.status === 'processing' ? '...' : '○'}
            </span>
        </div>
    `).join('');

    const progressBar = document.getElementById('ai-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Show strategy report modal
 */
function showStrategyReport(analysis, strategy) {
    let modal = document.getElementById('strategy-report-modal');
    if (!modal) {
        modal = createStrategyReportModal();
    }

    // Populate report data
    document.getElementById('report-category').textContent =
        `${capitalizeFirst(analysis.app.category)} → ${analysis.app.subcategory || 'General'}`;
    document.getElementById('report-audience').textContent = analysis.app.targetAudience;
    document.getElementById('report-vibe').textContent = `${capitalizeFirst(analysis.app.vibe)}, ${strategy.theme.replace(/_/g, ' ')}`;
    document.getElementById('report-value-prop').textContent = analysis.app.valueProp;

    // Render color palette
    const colorsContainer = document.getElementById('report-colors');
    colorsContainer.innerHTML = `
        <div class="color-swatch" style="background: ${strategy.colorPalette.primary}" title="Primary"></div>
        <div class="color-swatch" style="background: ${strategy.colorPalette.secondary}" title="Secondary"></div>
        <div class="color-swatch" style="background: ${strategy.colorPalette.accent}" title="Accent"></div>
        <div class="color-swatch" style="background: ${strategy.colorPalette.background}" title="Background"></div>
    `;

    // Layout sequence
    document.getElementById('report-layouts').textContent =
        strategy.layoutSequence.map(l => l.replace(/_/g, ' ')).join(' → ');

    modal.classList.add('visible');
}

/**
 * Hide strategy report modal
 */
function hideStrategyReport() {
    const modal = document.getElementById('strategy-report-modal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

/**
 * Create strategy report modal
 */
function createStrategyReportModal() {
    const modal = document.createElement('div');
    modal.id = 'strategy-report-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal strategy-report-modal">
            <div class="modal-icon" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10B981;">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            </div>
            <h3 class="modal-title">Design Complete!</h3>

            <div class="report-section">
                <h4>App Analysis</h4>
                <div class="report-grid">
                    <div class="report-item">
                        <span class="report-label">Category</span>
                        <span class="report-value" id="report-category">—</span>
                    </div>
                    <div class="report-item">
                        <span class="report-label">Target Audience</span>
                        <span class="report-value" id="report-audience">—</span>
                    </div>
                    <div class="report-item">
                        <span class="report-label">Design Vibe</span>
                        <span class="report-value" id="report-vibe">—</span>
                    </div>
                    <div class="report-item">
                        <span class="report-label">Value Prop</span>
                        <span class="report-value" id="report-value-prop">—</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h4>Design Choices</h4>
                <div class="report-item">
                    <span class="report-label">Color Palette</span>
                    <div class="color-palette" id="report-colors"></div>
                </div>
                <div class="report-item">
                    <span class="report-label">Layout Flow</span>
                    <span class="report-value" id="report-layouts">—</span>
                </div>
            </div>

            <div class="modal-actions">
                <button onclick="magicDesign()" class="btn-secondary">
                    <span>🔄</span> Regenerate
                </button>
                <button onclick="hideStrategyReport()" class="btn-primary">
                    <span>✓</span> Looks Great!
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// ============================================
// Individual AI Actions (for manual control)
// ============================================

/**
 * Apply AI layouts only
 */
async function applyAILayouts() {
    if (!state.screenshots || state.screenshots.length === 0) {
        showAppAlert('Please add some screenshots first.', 'info');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        showAppAlert('Please configure your AI API key in Settings.', 'error');
        return;
    }

    showAIProgressModal();
    resetAIStages();

    try {
        updateAIStage('analyze', 'processing');
        const analysis = await analyzeAppScreenshots();
        updateAIStage('analyze', 'complete');

        updateAIStage('layouts', 'processing');
        const strategy = await planDesignStrategy(analysis, {});
        await applySmartLayouts(analysis, strategy);
        updateAIStage('layouts', 'complete');

        syncUIWithState();
        updateCanvas();
        saveState();

        hideAIProgressModal();
        showAppAlert('AI layouts applied!', 'success');
    } catch (error) {
        hideAIProgressModal();
        showAppAlert(`Error: ${error.message}`, 'error');
    }
}

/**
 * Apply AI backgrounds only
 */
async function applyAIBackgrounds() {
    if (!state.screenshots || state.screenshots.length === 0) {
        showAppAlert('Please add some screenshots first.', 'info');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        showAppAlert('Please configure your AI API key in Settings.', 'error');
        return;
    }

    showAIProgressModal();
    resetAIStages();

    try {
        updateAIStage('analyze', 'processing');
        const analysis = await analyzeAppScreenshots();
        updateAIStage('analyze', 'complete');

        updateAIStage('backgrounds', 'processing');
        const strategy = await planDesignStrategy(analysis, {});
        await applySmartBackgrounds(analysis, strategy, false);
        updateAIStage('backgrounds', 'complete');

        syncUIWithState();
        updateCanvas();
        saveState();

        hideAIProgressModal();
        showAppAlert('AI backgrounds applied!', 'success');
    } catch (error) {
        hideAIProgressModal();
        showAppAlert(`Error: ${error.message}`, 'error');
    }
}

/**
 * Apply AI headlines only (enhanced version of magical titles)
 */
async function applyAIHeadlines(style = 'short_punchy') {
    if (!state.screenshots || state.screenshots.length === 0) {
        showAppAlert('Please add some screenshots first.', 'info');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        showAppAlert('Please configure your AI API key in Settings.', 'error');
        return;
    }

    showAIProgressModal();
    resetAIStages();

    try {
        updateAIStage('analyze', 'processing');
        const analysis = await analyzeAppScreenshots();
        updateAIStage('analyze', 'complete');

        updateAIStage('headlines', 'processing');
        const strategy = await planDesignStrategy(analysis, { headlineStyle: style });
        await generateSmartHeadlines(analysis, strategy, style);
        updateAIStage('headlines', 'complete');

        syncUIWithState();
        updateCanvas();
        saveState();

        hideAIProgressModal();
        showAppAlert('AI headlines generated!', 'success');
    } catch (error) {
        hideAIProgressModal();
        showAppAlert(`Error: ${error.message}`, 'error');
    }
}

// ============================================
// Story Flow Generator
// Creates a cohesive narrative across screenshots
// ============================================

const STORY_FLOWS = {
    'journey': {
        name: 'User Journey',
        description: 'Take users through the app experience step by step',
        sequence: ['welcome', 'discover', 'action', 'result', 'bonus'],
        headlinePatterns: [
            'Meet your new [benefit]',
            'Discover [feature]',
            '[Action verb] in seconds',
            'See your [result]',
            'Plus [bonus feature]'
        ]
    },
    'problem-solution': {
        name: 'Problem → Solution',
        description: 'Show the problem your app solves',
        sequence: ['problem', 'frustration', 'solution', 'transformation', 'proof'],
        headlinePatterns: [
            'Tired of [problem]?',
            'No more [frustration]',
            '[App name] makes it easy',
            'From [before] to [after]',
            'Join [number]+ happy users'
        ]
    },
    'feature-showcase': {
        name: 'Feature Showcase',
        description: 'Highlight your best features one by one',
        sequence: ['hero', 'feature1', 'feature2', 'feature3', 'cta'],
        headlinePatterns: [
            'The [category] app you need',
            'Powerful [feature 1]',
            'Smart [feature 2]',
            'Easy [feature 3]',
            'Start free today'
        ]
    },
    'transformation': {
        name: 'Before/After',
        description: 'Show the transformation your app enables',
        sequence: ['before', 'discovery', 'process', 'after', 'future'],
        headlinePatterns: [
            'Your [area] before',
            'Then you found us',
            'The magic happens',
            'Your [area] now',
            'Imagine tomorrow'
        ]
    },
    'emotional': {
        name: 'Emotional Appeal',
        description: 'Connect with users on an emotional level',
        sequence: ['desire', 'dream', 'capability', 'reality', 'belonging'],
        headlinePatterns: [
            'You deserve [benefit]',
            'Imagine if you could...',
            'Now you can',
            'This is your life now',
            'Join the [community]'
        ]
    }
};

/**
 * Generate story flow for screenshots
 * Creates a cohesive narrative across all screenshots
 */
async function generateStoryFlow(flowType = 'journey', options = {}) {
    if (!state.screenshots || state.screenshots.length === 0) {
        showAppAlert('Please add some screenshots first.', 'info');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        showAppAlert('Please configure your AI API key in Settings.', 'error');
        return;
    }

    const flow = STORY_FLOWS[flowType];
    if (!flow) {
        showAppAlert('Invalid story flow type.', 'error');
        return;
    }

    showAIProgressModal();
    resetAIStages();

    try {
        // Stage 1: Analyze app context
        updateAIStage('analyze', 'processing');
        const analysis = await analyzeAppScreenshots();
        updateAIStage('analyze', 'complete');

        // Stage 2: Generate story-driven headlines
        updateAIStage('headlines', 'processing');
        await generateStoryHeadlines(analysis, flow, options);
        updateAIStage('headlines', 'complete');

        // Stage 3: Apply visual flow (color progression)
        updateAIStage('backgrounds', 'processing');
        await applyVisualFlow(flow, analysis);
        updateAIStage('backgrounds', 'complete');

        // Stage 4: Apply coordinated layouts
        updateAIStage('layouts', 'processing');
        await applyFlowLayouts(flow);
        updateAIStage('layouts', 'complete');

        syncUIWithState();
        updateCanvas();
        saveState();

        hideAIProgressModal();
        showAppAlert(`Story flow "${flow.name}" applied!`, 'success');

    } catch (error) {
        hideAIProgressModal();
        showAppAlert(`Error: ${error.message}`, 'error');
    }
}

/**
 * Generate story-driven headlines using AI
 */
async function generateStoryHeadlines(analysis, flow, options = {}) {
    const screenshots = state.screenshots;
    const numScreenshots = screenshots.length;
    const sequence = flow.sequence.slice(0, numScreenshots);
    const patterns = flow.headlinePatterns.slice(0, numScreenshots);

    // Extract features from screenshot analysis (analysis.screenshots[].feature)
    const features = analysis.screenshots
        ? analysis.screenshots.map(s => s.feature).filter(Boolean)
        : [];

    // Get app name from primary function or use generic
    const appName = analysis.app?.primaryFunction?.split(' ')[0] || 'App';
    const category = analysis.app?.category || 'generic';
    const vibe = analysis.app?.vibe || 'professional';

    const prompt = `You are creating App Store screenshot headlines for a ${category} app.

Story Flow: ${flow.name}
Description: ${flow.description}

App Function: ${analysis.app?.primaryFunction || 'mobile application'}
App Features: ${features.length > 0 ? features.join(', ') : 'various features'}
App Vibe: ${vibe}

Generate ${numScreenshots} headlines that follow this story sequence:
${sequence.map((step, i) => `${i + 1}. ${step.toUpperCase()}: (example pattern: "${patterns[i]}")`).join('\n')}

Requirements:
- Each headline should be 2-6 words
- Headlines should flow naturally from one to the next
- Tell a compelling story that makes users want to download
- Match the ${vibe} tone
- Be creative but clear

Return ONLY a JSON array of strings, no markdown:
["headline1", "headline2", ...]`;

    try {
        const response = await window.AIAgents.callAI(prompt);
        const headlines = parseAIResponse(response);

        if (!Array.isArray(headlines)) {
            throw new Error('Invalid AI response format');
        }

        // Apply headlines to screenshots
        const currentLang = state.currentLanguage || state.selectedLanguage || 'en';
        headlines.forEach((headline, index) => {
            if (screenshots[index]) {
                screenshots[index].text = screenshots[index].text || {};
                screenshots[index].text.headlines = screenshots[index].text.headlines || {};
                screenshots[index].text.headlines[currentLang] = headline;
            }
        });

        return headlines;

    } catch (error) {
        if (window.Utils?.DEBUG) console.warn('Story headline generation failed, using fallback', error);

        // Apply fallback headlines based on patterns
        const currentLang = state.currentLanguage || state.selectedLanguage || 'en';
        patterns.forEach((pattern, index) => {
            if (screenshots[index]) {
                const featureForIndex = features[Math.min(index, features.length - 1)] || 'feature';
                const headline = pattern
                    .replace('[benefit]', features[0] || 'solution')
                    .replace('[feature]', featureForIndex)
                    .replace('[Action verb]', 'Get started')
                    .replace('[result]', 'results')
                    .replace('[problem]', 'the old way')
                    .replace('[category]', category)
                    .replace(/\[.*?\]/g, 'more');

                screenshots[index].text = screenshots[index].text || {};
                screenshots[index].text.headlines = screenshots[index].text.headlines || {};
                screenshots[index].text.headlines[currentLang] = headline;
            }
        });
    }
}

/**
 * Apply visual flow - coordinated color progression
 */
async function applyVisualFlow(flow, analysis) {
    const screenshots = state.screenshots;

    // Define color progressions for different flows
    const colorProgressions = {
        'journey': [
            { primary: '#667eea', secondary: '#764ba2' },
            { primary: '#764ba2', secondary: '#f093fb' },
            { primary: '#f093fb', secondary: '#f5576c' },
            { primary: '#f5576c', secondary: '#ff9966' },
            { primary: '#ff9966', secondary: '#ff5e62' }
        ],
        'problem-solution': [
            { primary: '#2d3436', secondary: '#636e72' },
            { primary: '#636e72', secondary: '#b2bec3' },
            { primary: '#0984e3', secondary: '#74b9ff' },
            { primary: '#00b894', secondary: '#55efc4' },
            { primary: '#00cec9', secondary: '#81ecec' }
        ],
        'feature-showcase': [
            { primary: '#1a1a2e', secondary: '#16213e' },
            { primary: '#16213e', secondary: '#0f3460' },
            { primary: '#0f3460', secondary: '#e94560' },
            { primary: '#e94560', secondary: '#f39c12' },
            { primary: '#f39c12', secondary: '#1a1a2e' }
        ],
        'transformation': [
            { primary: '#434343', secondary: '#000000' },
            { primary: '#000000', secondary: '#333333' },
            { primary: '#333333', secondary: '#667eea' },
            { primary: '#667eea', secondary: '#764ba2' },
            { primary: '#764ba2', secondary: '#f093fb' }
        ],
        'emotional': [
            { primary: '#ff6b6b', secondary: '#feca57' },
            { primary: '#feca57', secondary: '#48dbfb' },
            { primary: '#48dbfb', secondary: '#ff9ff3' },
            { primary: '#ff9ff3', secondary: '#54a0ff' },
            { primary: '#54a0ff', secondary: '#5f27cd' }
        ]
    };

    const flowType = Object.keys(STORY_FLOWS).find(key => STORY_FLOWS[key] === flow) || 'journey';
    const colors = colorProgressions[flowType] || colorProgressions['journey'];

    screenshots.forEach((screenshot, index) => {
        const colorPair = colors[index % colors.length];

        screenshot.background = {
            type: 'gradient',
            stops: [
                { color: colorPair.primary, position: 0 },
                { color: colorPair.secondary, position: 100 }
            ],
            angle: 135,
            gradient: `linear-gradient(135deg, ${colorPair.primary} 0%, ${colorPair.secondary} 100%)`
        };
    });
}

/**
 * Apply flow-coordinated layouts
 */
async function applyFlowLayouts(flow) {
    const screenshots = state.screenshots;

    // Layout sequences that work well for storytelling
    const layoutSequences = {
        'journey': ['hero_large', 'classic', 'classic', 'classic', 'feature_focus'],
        'problem-solution': ['classic', 'classic', 'hero_large', 'feature_focus', 'classic'],
        'feature-showcase': ['hero_large', 'feature_focus', 'feature_focus', 'feature_focus', 'classic'],
        'transformation': ['classic', 'classic', 'hero_large', 'feature_focus', 'hero_large'],
        'emotional': ['hero_large', 'classic', 'classic', 'feature_focus', 'hero_large']
    };

    const flowType = Object.keys(STORY_FLOWS).find(key => STORY_FLOWS[key] === flow) || 'journey';
    const layouts = layoutSequences[flowType] || layoutSequences['journey'];

    screenshots.forEach((screenshot, index) => {
        const layoutId = layouts[index % layouts.length];
        const layoutConfig = getDefaultLayoutConfig(layoutId);

        screenshot.screenshot = screenshot.screenshot || {};
        screenshot.screenshot.scale = layoutConfig.device.scale * 100;
        screenshot.screenshot.x = 50 + layoutConfig.device.x;
        screenshot.screenshot.y = 50 + (layoutConfig.device.y || 20);
        screenshot.screenshot.rotation = layoutConfig.device.rotation || 0;

        // Text positioning
        screenshot.text = screenshot.text || {};
        screenshot.text.offsetY = layoutConfig.text?.offsetY || 6;
        screenshot.text.position = layoutConfig.text?.position || 'top';
    });
}

/**
 * Get available story flows for UI
 */
function getStoryFlows() {
    return Object.entries(STORY_FLOWS).map(([id, flow]) => ({
        id,
        name: flow.name,
        description: flow.description
    }));
}

// Export for use in app.js
window.AIEngine = {
    magicDesign,
    applyAILayouts,
    applyAIBackgrounds,
    applyAIHeadlines,
    analyzeAppScreenshots,
    planDesignStrategy,
    showStrategyReport,
    hideStrategyReport,
    aiEngineState,
    // Story Flow
    generateStoryFlow,
    getStoryFlows,
    STORY_FLOWS
};
