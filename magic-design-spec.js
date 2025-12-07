/**
 * Magic Design AI System - Technical Specification
 * Complete AI-powered App Store screenshot generation using Gemini 3 Pro
 * 
 * Models:
 * - gemini-3-pro-preview: Vision/text analysis and generation
 * - gemini-3-pro-image-preview: Image generation for backgrounds
 */

// =============================================================================
// 1. AI ANALYSIS PIPELINE - Screenshot Analysis with Gemini Vision
// =============================================================================

const AI_ANALYSIS_PIPELINE = {
    // Stage 1: Vision-based app analysis
    stage1_vision: {
        model: "gemini-3-pro-preview",
        prompts: {
            // Comprehensive app analysis prompt
            appAnalysis: `You are an expert App Store designer and ASO specialist. Analyze these app screenshots comprehensively.

ANALYZE AND RETURN:

1. APP IDENTITY
   - primaryFunction: What does this app do? (one clear sentence)
   - category: Main category from: fitness, finance, productivity, social, food, travel, education, entertainment, health, shopping, developer, gaming, weather, news, photo, video, utilities, lifestyle, kids, sports, navigation, business, music, medical
   - subcategory: More specific type (e.g., "teleprompter" for productivity, "crypto" for finance)
   - targetAudience: Primary user demographic (e.g., "content creators", "busy professionals", "fitness enthusiasts")
   - vibe: Overall personality - one of: professional, playful, premium, minimal, energetic, calm, bold, elegant, techy, friendly
   - valueProp: Core value proposition in 5-10 words
   - appName: If visible in screenshots, the app name

2. PER-SCREENSHOT ANALYSIS (0-indexed array)
   For each screenshot provide:
   - feature: What specific feature/screen is shown (be specific)
   - keyElements: Notable UI elements visible (array of 3-5 items)
   - userBenefit: What benefit does this screen demonstrate to users
   - visualWeight: Where content is concentrated - top, center, bottom, left, right, or full
   - hasCriticalEdgeContent: Is there important content at edges that shouldn't be cropped? (boolean)
   - suggestedHeadline: A punchy 2-4 word marketing headline for this screen
   - suggestedSubheadline: A 4-8 word benefit statement

3. COLOR ANALYSIS
   - dominantColors: Array of 3-5 hex colors extracted from the app UI
   - suggestedPrimary: Best primary brand color (hex)
   - suggestedSecondary: Complementary secondary color (hex)
   - suggestedAccent: Accent color for highlights (hex)
   - backgroundTone: "dark" or "light" recommendation based on app UI

4. TYPOGRAPHY RECOMMENDATION
   - style: One of: bold-modern, elegant-serif, playful-rounded, minimal-clean, tech-mono
   - reasoning: Why this typography suits the app

5. DESIGN RECOMMENDATIONS
   - backgroundStyle: gradient, solid, mesh, abstract, or minimal
   - useNoise: Should subtle noise texture be added? (boolean)
   - shadowStyle: soft, dramatic, minimal, or glow
   - suggestedTheme: MODERN_MINIMAL, SWISS_BRUTALISM, NEON_CYBER, SOFT_LUXURY, GLASS_MORPHISM, or CLEAN_PRO

6. SCREENSHOT FLOW
   - tellsStory: Do screenshots tell a progression/story? (boolean)
   - suggestedNarrative: Brief description of the story arc if applicable
   - usePanoramicFlow: Should devices span between frames? (boolean)
   - recommendedSequence: Array of suggested layout names for optimal impact

Return ONLY valid JSON with this structure:
{
    "app": {
        "primaryFunction": "...",
        "category": "...",
        "subcategory": "...",
        "targetAudience": "...",
        "vibe": "...",
        "valueProp": "...",
        "appName": "..."
    },
    "screenshots": [
        {
            "index": 0,
            "feature": "...",
            "keyElements": ["...", "..."],
            "userBenefit": "...",
            "visualWeight": "...",
            "hasCriticalEdgeContent": false,
            "suggestedHeadline": "...",
            "suggestedSubheadline": "..."
        }
    ],
    "colors": {
        "dominantColors": ["#hex1", "#hex2"],
        "suggestedPrimary": "#hex",
        "suggestedSecondary": "#hex",
        "suggestedAccent": "#hex",
        "backgroundTone": "dark"
    },
    "typography": {
        "style": "...",
        "reasoning": "..."
    },
    "design": {
        "backgroundStyle": "...",
        "useNoise": false,
        "shadowStyle": "...",
        "suggestedTheme": "..."
    },
    "flow": {
        "tellsStory": true,
        "suggestedNarrative": "...",
        "usePanoramicFlow": false,
        "recommendedSequence": ["hero_large", "offset_right", "classic"]
    }
}`,

            // Color extraction focused prompt (for faster/simpler analysis)
            colorExtraction: `Analyze these app screenshots and extract the color palette.

Return ONLY valid JSON:
{
    "dominantColors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "primaryBrand": "#hex",
    "secondaryBrand": "#hex", 
    "accentColor": "#hex",
    "backgroundSuggestion": "dark" or "light",
    "colorMood": "vibrant" or "muted" or "professional" or "playful"
}`,

            // Feature detection prompt
            featureDetection: `Identify the key features shown in each app screenshot.

For each screenshot (0-indexed), identify:
1. The main feature or screen type
2. Key UI elements visible
3. The user action or benefit being demonstrated

Return ONLY valid JSON array:
[
    {
        "index": 0,
        "screenType": "onboarding" or "dashboard" or "detail" or "settings" or "list" or "profile" or "other",
        "mainFeature": "specific feature name",
        "uiElements": ["element1", "element2"],
        "userAction": "what user does here",
        "marketingAngle": "best way to market this screen"
    }
]`
        },
        outputSchema: {
            app: {
                primaryFunction: "string",
                category: "string",
                subcategory: "string",
                targetAudience: "string",
                vibe: "string",
                valueProp: "string",
                appName: "string|null"
            },
            screenshots: [{
                index: "number",
                feature: "string",
                keyElements: ["string"],
                userBenefit: "string",
                visualWeight: "string",
                hasCriticalEdgeContent: "boolean",
                suggestedHeadline: "string",
                suggestedSubheadline: "string"
            }],
            colors: {
                dominantColors: ["string"],
                suggestedPrimary: "string",
                suggestedSecondary: "string",
                suggestedAccent: "string",
                backgroundTone: "string"
            },
            typography: {
                style: "string",
                reasoning: "string"
            },
            design: {
                backgroundStyle: "string",
                useNoise: "boolean",
                shadowStyle: "string",
                suggestedTheme: "string"
            },
            flow: {
                tellsStory: "boolean",
                suggestedNarrative: "string",
                usePanoramicFlow: "boolean",
                recommendedSequence: ["string"]
            }
        }
    },

    // Stage 2: Strategy planning (text-only, uses analysis results)
    stage2_strategy: {
        model: "gemini-3-pro-preview",
        prompts: {
            designStrategy: (analysis, screenshotCount) => `You are an App Store Optimization expert. Create a design strategy based on this analysis.

APP ANALYSIS:
${JSON.stringify(analysis, null, 2)}

SCREENSHOT COUNT: ${screenshotCount}

Create a complete design strategy including:
1. Overall theme and mood
2. Color palette with specific hex codes
3. Layout sequence for maximum conversion
4. Headline style and examples
5. Visual consistency rules

Return ONLY valid JSON:
{
    "theme": "MODERN_MINIMAL" | "SWISS_BRUTALISM" | "NEON_CYBER" | "SOFT_LUXURY" | "GLASS_MORPHISM" | "CLEAN_PRO",
    "themeMode": "dark" | "light",
    "colorPalette": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex",
        "text": "#hex",
        "textSecondary": "#hex"
    },
    "layoutSequence": ["layout_id", "layout_id"],
    "headlineStyle": "short_punchy" | "benefit_focused" | "question" | "command",
    "typography": {
        "headlineFont": "font name",
        "headlineWeight": "600" | "700" | "800",
        "subheadlineFont": "font name",
        "subheadlineWeight": "400" | "500"
    },
    "consistencyRules": {
        "useNoise": boolean,
        "noiseIntensity": 5-15,
        "shadowBlur": 40-80,
        "shadowOpacity": 20-40,
        "gradientAngle": 135
    },
    "backgroundImagePrompt": "detailed prompt for generating matching backgrounds"
}`
        }
    }
};


// =============================================================================
// 2. BACKGROUND GENERATION SYSTEM - AI Image Generation with Gemini
// =============================================================================

const BACKGROUND_GENERATION = {
    model: "gemini-3-pro-image-preview",
    
    // API endpoint for image generation
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
    
    // Aspect ratios for different device types
    aspectRatios: {
        'iphone-6.9': { width: 1320, height: 2868, ratio: "9:19.5" },
        'iphone-6.7': { width: 1290, height: 2796, ratio: "9:19.5" },
        'iphone-6.5': { width: 1284, height: 2778, ratio: "9:19.5" },
        'ipad-12.9': { width: 2048, height: 2732, ratio: "3:4" },
        'android-phone': { width: 1080, height: 1920, ratio: "9:16" }
    },

    // Background style definitions
    styles: {
        gradient: {
            description: "Smooth color transitions",
            promptModifiers: "smooth gradient background, seamless color transition, professional finish"
        },
        abstract: {
            description: "Abstract shapes and patterns",
            promptModifiers: "abstract geometric shapes, flowing organic forms, artistic composition"
        },
        mesh: {
            description: "Mesh gradient with multiple color points",
            promptModifiers: "mesh gradient background, multiple color focal points, soft blending"
        },
        minimal: {
            description: "Clean minimal backgrounds",
            promptModifiers: "minimal clean background, subtle texture, professional simplicity"
        },
        organic: {
            description: "Organic flowing shapes",
            promptModifiers: "organic flowing shapes, natural curves, soft shadows"
        },
        neon: {
            description: "Neon glow effects",
            promptModifiers: "neon glow effects, cyberpunk aesthetic, vibrant light trails"
        },
        glassmorphism: {
            description: "Frosted glass effects",
            promptModifiers: "frosted glass layers, translucent surfaces, depth blur, airy feel"
        }
    },

    // Category-specific background templates
    categoryTemplates: {
        fitness: [
            "Abstract flowing energy ribbons in dynamic motion, {colors}, motion blur streaks, matte black void background, high contrast, intense energy",
            "Geometric ascending progress visualization, {colors}, clean athletic aesthetic, volumetric lighting"
        ],
        finance: [
            "Ascending crystalline geometric planes, {colors}, precision-cut glass prisms, corporate sophistication, metallic accents",
            "Abstract financial growth metaphor with smooth upward curves, {colors}, liquid gold surfaces, professional clean"
        ],
        social: [
            "Soft organic gradient blobs, {colors}, flowing silk ribbon connections, warm diffused lighting, friendly approachable",
            "Abstract connection visualization, {colors}, rounded friendly shapes, gentle gradients, contemporary social aesthetic"
        ],
        productivity: [
            "Clean geometric grid systems, {colors}, organized minimal layers, sharp precision, architectural clarity",
            "Abstract timeline ribbons, {colors}, organized flowing pathways, professional productivity aesthetic"
        ],
        food: [
            "Organic liquid splash forms, {colors}, steam curves, glossy ceramic surfaces, appetizing warm lighting",
            "Abstract culinary textures, {colors}, fresh ingredient-inspired shapes, inviting atmosphere"
        ],
        health: [
            "Soft healing gradients, {colors}, organic calming waves, wellness-inspired curves, gentle diffused light",
            "Abstract breathing rhythm visualization, {colors}, medical precision meets warmth, trustworthy design"
        ],
        entertainment: [
            "Vibrant energetic gradients, {colors}, dynamic particle systems, fun composition, exciting glow",
            "Abstract media waveforms, {colors}, rhythm visualization, celebratory energy"
        ],
        developer: [
            "Matrix-inspired code rain abstraction, {colors}, geometric logic patterns, cyberpunk tech aesthetic",
            "Abstract syntax visualization, {colors}, clean monospace grid, professional coder aesthetic"
        ],
        gaming: [
            "Neon cyber aesthetics, {colors}, geometric HUD elements, immersive game world vibes",
            "Abstract power-up effects, {colors}, competitive energy, dynamic action composition"
        ],
        shopping: [
            "Bold product spotlight aesthetics, {colors}, abstract shopping elements, retail energy",
            "Luxurious gradient surfaces, {colors}, premium product showcase, attractive polish"
        ],
        travel: [
            "Abstract map contours and flowing paths, {colors}, adventure-inspired depth, wanderlust aesthetic",
            "Geographic abstraction, {colors}, journey visualization, expansive open composition"
        ],
        generic: [
            "Abstract modern gradient, {colors}, smooth professional transitions, versatile design",
            "Minimal geometric composition, {colors}, contemporary universal style, clean aesthetic"
        ]
    },

    // Prompt templates for different generation modes
    prompts: {
        // Generate abstract gradient background
        abstractGradient: (colors, category, vibe) => `Create an abstract gradient background for a ${category} mobile app screenshot.

STYLE: ${vibe} aesthetic
PRIMARY COLOR: ${colors.primary}
SECONDARY COLOR: ${colors.secondary}
ACCENT COLOR: ${colors.accent}

Requirements:
- Vertical format optimized for mobile (9:19.5 aspect ratio)
- Smooth gradient transitions between the specified colors
- Abstract flowing shapes or subtle geometric elements
- NO text, NO logos, NO device mockups, NO UI elements
- Professional App Store screenshot background quality
- High resolution, clean edges, no artifacts
- Colors should flow naturally from top to bottom or diagonally
- Leave center-bottom area relatively simple for device placement
- Subtle depth through layered elements

Output: A beautiful abstract background ready for App Store screenshots`,

        // Generate themed background matching app category
        themeBackground: (colors, category, theme, description) => `Create a professional background for a ${category} app with ${theme} design theme.

APP DESCRIPTION: ${description}
COLOR PALETTE:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}  
- Background base: ${colors.background}

Design Requirements:
- ${theme === 'NEON_CYBER' ? 'Dark background with neon glow accents' : ''}
- ${theme === 'SOFT_LUXURY' ? 'Elegant muted tones with subtle texture' : ''}
- ${theme === 'GLASS_MORPHISM' ? 'Frosted glass layers with depth blur' : ''}
- ${theme === 'MODERN_MINIMAL' ? 'Clean gradients with minimal elements' : ''}
- ${theme === 'SWISS_BRUTALISM' ? 'Bold solid colors with geometric precision' : ''}
- ${theme === 'CLEAN_PRO' ? 'Professional matte finish with subtle gradients' : ''}

Absolute Requirements:
- Vertical mobile format (9:19.5 aspect ratio)
- NO text, NO icons, NO UI elements
- Professional quality suitable for App Store
- Harmonious with the provided color palette`,

        // Generate decorative elements (blurs, shapes, glows)
        decorativeElements: (colors, style) => `Create decorative abstract elements for app screenshot enhancement.

STYLE: ${style}
COLORS: ${colors.primary}, ${colors.secondary}, ${colors.accent}

Generate:
- Soft gradient blur orbs
- Subtle light leak effects
- Abstract geometric shapes
- Gentle glow elements

Requirements:
- Transparent background (PNG with alpha)
- High quality, no pixelation
- Suitable for overlay composition
- Elements should enhance without overwhelming`,

        // Generate matching set of backgrounds
        matchingBackgroundSet: (colors, category, count) => `Create ${count} coordinated abstract backgrounds for a ${category} app screenshot set.

COLOR PALETTE:
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}

Requirements:
- All backgrounds share the same visual language
- Subtle variation in color emphasis per background
- Consistent gradient direction (135 degrees)
- Professional cohesive set
- Each optimized for vertical mobile format

Generate ${count} variations that work together as a screenshot gallery.`
    },

    // Quality and generation settings
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        candidateCount: 1,
        // Image generation specific
        imageSize: "1024x1024", // Will be scaled to device dimensions
        quality: "high",
        style: "vivid"
    }
};


// =============================================================================
// 3. LAYOUT ENGINE CONFIGURATION - Smart Layout Selection
// =============================================================================

const SMART_LAYOUT_ENGINE = {
    // Story flow templates for screenshot sequences
    storyFlows: {
        'hero-features': {
            name: 'Hero + Features',
            description: 'Strong opening with feature showcase',
            sequence: ['hero_large', 'offset_right', 'offset_left', 'classic', 'duo_overlap'],
            headlinePattern: ['value_prop', 'feature', 'feature', 'feature', 'social_proof']
        },
        'journey': {
            name: 'User Journey',
            description: 'Step-by-step app experience',
            sequence: ['hero_large', 'classic', 'zoom_top', 'offset_right', 'classic'],
            headlinePattern: ['welcome', 'step1', 'step2', 'step3', 'result']
        },
        'problem-solution': {
            name: 'Problem → Solution',
            description: 'Show problem then solution',
            sequence: ['minimal_type', 'classic', 'hero_large', 'offset_right', 'duo_side_by_side'],
            headlinePattern: ['problem', 'frustration', 'solution', 'benefit', 'proof']
        },
        'panoramic': {
            name: 'Panoramic Flow',
            description: 'Devices span between frames',
            sequence: ['panoramic_right', 'panoramic_left', 'panoramic_right', 'panoramic_left', 'classic'],
            headlinePattern: ['feature', 'feature', 'feature', 'feature', 'cta']
        },
        'feature-blitz': {
            name: 'Feature Blitz',
            description: 'Rapid feature showcase',
            sequence: ['hero_large', 'tilted_dynamic', 'zoom_top', 'bento_grid', 'poster_hero'],
            headlinePattern: ['main', 'feature', 'detail', 'overview', 'cta']
        }
    },

    // Position presets with precise coordinates
    positionPresets: {
        'hero_large': { scale: 72, x: 50, y: 75, rotation: 0 },
        'classic': { scale: 65, x: 50, y: 72, rotation: 0 },
        'offset_right': { scale: 68, x: 62, y: 70, rotation: -5 },
        'offset_left': { scale: 68, x: 38, y: 70, rotation: 5 },
        'panoramic_right': { scale: 82, x: 85, y: 58, rotation: -3 },
        'panoramic_left': { scale: 82, x: 15, y: 58, rotation: 3 },
        'zoom_top': { scale: 110, x: 50, y: 95, rotation: 0 },
        'zoom_bottom': { scale: 110, x: 50, y: 25, rotation: 0 },
        'tilted_dynamic': { scale: 78, x: 50, y: 62, rotation: -12 },
        'minimal_type': { scale: 50, x: 50, y: 85, rotation: 0 },
        'duo_overlap': { scale: 55, x: 40, y: 68, rotation: -8 },
        'duo_side_by_side': { scale: 48, x: 32, y: 65, rotation: 0 },
        'magazine_cover': { scale: 80, x: 50, y: 70, rotation: 0 },
        'bento_grid': { scale: 65, x: 50, y: 70, rotation: 0 },
        'poster_hero': { scale: 72, x: 50, y: 68, rotation: 0 }
    },

    // Consistency rules for professional results
    consistencyRules: {
        // Text should never overlap device
        minTextDeviceGap: 50, // pixels
        
        // Device should be visible enough
        minDeviceVisibility: 60, // percentage of device visible
        
        // Shadow consistency
        shadowDefaults: {
            blur: 60,
            opacity: 35,
            y: 25
        },
        
        // Gradient consistency
        gradientDefaults: {
            angle: 135,
            colorVariationPerSlide: 3 // degrees of hue shift
        },
        
        // Typography hierarchy
        typographyRatio: {
            headlineToSubheadline: 2.8, // headline size / subheadline size
            minHeadlineSize: 64,
            maxHeadlineSize: 96
        }
    },

    // Category-specific layout preferences
    categoryLayoutMap: {
        fitness: ['panoramic_right', 'tilted_dynamic', 'hero_large', 'zoom_top'],
        finance: ['hero_large', 'classic', 'offset_right', 'duo_side_by_side'],
        social: ['offset_right', 'panoramic_right', 'classic', 'duo_overlap'],
        productivity: ['classic', 'hero_large', 'zoom_top', 'offset_right'],
        food: ['panoramic_right', 'offset_right', 'magazine_cover', 'classic'],
        health: ['panoramic_right', 'classic', 'minimal_type', 'offset_right'],
        entertainment: ['tilted_dynamic', 'magazine_cover', 'hero_large', 'duo_overlap'],
        developer: ['minimal_type', 'classic', 'hero_large', 'zoom_top'],
        gaming: ['tilted_dynamic', 'panoramic_right', 'hero_large', 'magazine_cover'],
        shopping: ['magazine_cover', 'panoramic_right', 'duo_overlap', 'hero_large'],
        travel: ['panoramic_right', 'magazine_cover', 'hero_large', 'offset_right'],
        generic: ['hero_large', 'classic', 'offset_right', 'panoramic_right']
    }
};


// =============================================================================
// 4. HEADLINE GENERATION SYSTEM
// =============================================================================

const HEADLINE_GENERATION = {
    model: "gemini-3-pro-preview",
    
    styles: {
        'short_punchy': {
            description: '2-4 words, memorable and impactful',
            examples: ['Track. Thrive.', 'Money Moves', 'Push Further'],
            rules: 'headline: 2-4 words. subheadline: 4-8 words.'
        },
        'benefit_focused': {
            description: 'Focus on user benefit',
            examples: ['Sleep Better Tonight', 'Save Hours Daily', 'Earn More'],
            rules: 'headline: 3-5 words focusing on benefit. subheadline: 5-10 words explaining value.'
        },
        'question': {
            description: 'Engage with a question',
            examples: ['Ready to Grow?', 'Why Wait?', 'What If...?'],
            rules: 'headline: 3-6 words as question. subheadline: 4-8 words answering it.'
        },
        'command': {
            description: 'Action-oriented command',
            examples: ['Start Today', 'Take Control', 'Build More'],
            rules: 'headline: 2-4 words as command. subheadline: 4-8 words supporting action.'
        }
    },

    prompt: (analysis, style, screenshotFeatures) => `You are an elite App Store copywriter. Generate compelling headlines.

APP CONTEXT:
- Category: ${analysis.app.category}
- Function: ${analysis.app.primaryFunction}
- Value Prop: ${analysis.app.valueProp}
- Target: ${analysis.app.targetAudience}
- Vibe: ${analysis.app.vibe}

SCREENSHOT FEATURES:
${screenshotFeatures.map((f, i) => `${i}: ${f.feature} - ${f.userBenefit}`).join('\n')}

STYLE: ${HEADLINE_GENERATION.styles[style].rules}

CRITICAL RULES:
1. Screenshot 0 headline MUST focus on MAIN VALUE PROPOSITION
2. Each headline MUST be UNIQUE - no repetition
3. Each highlights a DIFFERENT feature/benefit
4. Use power words for ${analysis.app.targetAudience}
5. Match the ${analysis.app.vibe} vibe
6. NO generic phrases like "Get Started" or "Learn More"

Return ONLY valid JSON:
{
    "0": { "headline": "...", "subheadline": "..." },
    "1": { "headline": "...", "subheadline": "..." }
}`
};


// =============================================================================
// 5. COMPLETE MAGIC DESIGN FLOW
// =============================================================================

/**
 * Main Magic Design orchestration function
 * @param {Array} screenshots - Array of screenshot objects with image data
 * @param {Object} options - Configuration options
 * @returns {Object} Complete design plan with all generated assets
 */
async function magicDesign(screenshots, options = {}) {
    const {
        category: categoryOverride = null,
        theme: themeOverride = null,
        headlineStyle = 'short_punchy',
        generateBackgroundImages = false,
        storyFlow = 'hero-features',
        onProgress = () => {}
    } = options;

    // Validate prerequisites
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('API_KEY_MISSING: Please configure your Gemini API key in Settings.');
    }

    if (!screenshots || screenshots.length === 0) {
        throw new Error('NO_SCREENSHOTS: Please add screenshots before using Magic Design.');
    }

    const results = {
        analysis: null,
        strategy: null,
        backgrounds: [],
        layouts: [],
        headlines: [],
        errors: []
    };

    try {
        // =====================================================================
        // STAGE 1: Analyze Screenshots with Vision API
        // =====================================================================
        onProgress({ stage: 'analyze', progress: 0, message: 'Analyzing your screenshots...' });
        
        const images = await prepareImagesForAPI(screenshots);
        
        const analysisResponse = await callGeminiVision(
            apiKey,
            images,
            AI_ANALYSIS_PIPELINE.stage1_vision.prompts.appAnalysis
        );
        
        results.analysis = parseJSONResponse(analysisResponse);
        
        // Apply category override if specified
        if (categoryOverride && categoryOverride !== 'auto') {
            results.analysis.app.category = categoryOverride;
        }

        onProgress({ stage: 'analyze', progress: 100, message: 'Analysis complete!' });

        // =====================================================================
        // STAGE 2: Plan Design Strategy
        // =====================================================================
        onProgress({ stage: 'strategy', progress: 0, message: 'Planning design strategy...' });

        results.strategy = await planDesignStrategy(results.analysis, {
            screenshotCount: screenshots.length,
            themeOverride,
            storyFlow,
            headlineStyle
        });

        onProgress({ stage: 'strategy', progress: 100, message: 'Strategy planned!' });

        // =====================================================================
        // STAGE 3: Generate Backgrounds
        // =====================================================================
        onProgress({ stage: 'backgrounds', progress: 0, message: 'Creating backgrounds...' });

        if (generateBackgroundImages) {
            // Generate AI backgrounds using Gemini Image
            results.backgrounds = await generateAIBackgrounds(
                results.analysis,
                results.strategy,
                screenshots.length,
                (progress) => onProgress({ stage: 'backgrounds', progress, message: `Generating background ${progress}%` })
            );
        } else {
            // Generate gradient-based backgrounds
            results.backgrounds = generateGradientBackgrounds(
                results.strategy.colorPalette,
                screenshots.length
            );
        }

        onProgress({ stage: 'backgrounds', progress: 100, message: 'Backgrounds ready!' });

        // =====================================================================
        // STAGE 4: Select and Apply Layouts
        // =====================================================================
        onProgress({ stage: 'layouts', progress: 0, message: 'Selecting optimal layouts...' });

        results.layouts = selectSmartLayouts(
            results.analysis,
            results.strategy,
            screenshots.length
        );

        onProgress({ stage: 'layouts', progress: 100, message: 'Layouts selected!' });

        // =====================================================================
        // STAGE 5: Generate Headlines
        // =====================================================================
        onProgress({ stage: 'headlines', progress: 0, message: 'Writing marketing copy...' });

        results.headlines = await generateHeadlines(
            apiKey,
            images,
            results.analysis,
            results.strategy,
            headlineStyle
        );

        onProgress({ stage: 'headlines', progress: 100, message: 'Headlines generated!' });

        // =====================================================================
        // STAGE 6: Final Assembly
        // =====================================================================
        onProgress({ stage: 'polish', progress: 0, message: 'Applying final polish...' });

        const finalPlan = assembleFinalDesignPlan(
            results.analysis,
            results.strategy,
            results.backgrounds,
            results.layouts,
            results.headlines
        );

        onProgress({ stage: 'polish', progress: 100, message: 'Design complete!' });

        return finalPlan;

    } catch (error) {
        console.error('Magic Design error:', error);
        results.errors.push(error.message);
        throw error;
    }
}


// =============================================================================
// 6. SUPPORTING FUNCTIONS
// =============================================================================

/**
 * Prepare screenshot images for API submission
 */
async function prepareImagesForAPI(screenshots, maxImages = 5) {
    const images = [];
    const limit = Math.min(screenshots.length, maxImages);

    for (let i = 0; i < limit; i++) {
        const screenshot = screenshots[i];
        const dataUrl = getScreenshotDataUrl(screenshot);
        
        if (dataUrl) {
            const parsed = parseDataUrl(dataUrl);
            if (parsed) {
                images.push({
                    mimeType: parsed.mimeType || 'image/jpeg',
                    base64: parsed.base64
                });
            }
        }
    }

    return images;
}

/**
 * Call Gemini Vision API with images
 */
async function callGeminiVision(apiKey, images, prompt, options = {}) {
    const model = 'gemini-3-pro-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [{
        parts: [
            { text: prompt },
            ...images.map(img => ({
                inline_data: {
                    mime_type: img.mimeType,
                    data: img.base64.replace(/^data:image\/\w+;base64,/, '')
                }
            }))
        ]
    }];

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents,
            generationConfig: {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxTokens || 8192
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Call Gemini Image Generation API
 */
async function callGeminiImageGeneration(apiKey, prompt, options = {}) {
    const model = 'gemini-3-pro-image-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.8,
                candidateCount: 1,
                // Image generation specific parameters
                responseModalities: ['IMAGE'],
                imageDimensions: options.dimensions || { width: 1024, height: 1024 }
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Image generation error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract generated image
    const imageData = data.candidates?.[0]?.content?.parts?.find(p => p.inline_data);
    if (imageData) {
        return `data:${imageData.inline_data.mime_type};base64,${imageData.inline_data.data}`;
    }
    
    return null;
}

/**
 * Plan design strategy based on analysis
 */
async function planDesignStrategy(analysis, options) {
    const { screenshotCount, themeOverride, storyFlow, headlineStyle } = options;
    
    // Select theme
    let theme = themeOverride || 'auto';
    if (theme === 'auto') {
        theme = selectThemeForApp(analysis);
    }

    // Get theme configuration
    const themeConfig = window.DesignThemes?.getTheme(theme) || getDefaultTheme();
    
    // Select story flow and layout sequence
    const flow = SMART_LAYOUT_ENGINE.storyFlows[storyFlow] || SMART_LAYOUT_ENGINE.storyFlows['hero-features'];
    const layoutSequence = flow.sequence.slice(0, screenshotCount);
    
    // Build color palette
    const backgroundTone = analysis.colors?.backgroundTone || 'dark';
    const colorPalette = {
        primary: analysis.colors?.suggestedPrimary || themeConfig.colors?.[backgroundTone]?.accent || '#6366F1',
        secondary: analysis.colors?.suggestedSecondary || '#8B5CF6',
        accent: analysis.colors?.suggestedAccent || '#EC4899',
        background: backgroundTone === 'dark' ? '#0F0F1A' : '#F8F9FA',
        text: backgroundTone === 'dark' ? '#FFFFFF' : '#1A1A1A',
        textSecondary: backgroundTone === 'dark' ? '#CCCCCC' : '#6B6B6B'
    };

    return {
        theme,
        themeConfig,
        themeMode: backgroundTone,
        layoutSequence,
        colorPalette,
        typography: analysis.typography || { style: 'bold-modern' },
        headlineStyle,
        storyFlow: flow,
        useNoise: analysis.design?.useNoise || false,
        noiseIntensity: 8,
        shadowStyle: analysis.design?.shadowStyle || 'soft'
    };
}

/**
 * Select theme based on app analysis
 */
function selectThemeForApp(analysis) {
    const category = analysis.app?.category || 'generic';
    const vibe = analysis.app?.vibe || 'professional';
    const backgroundTone = analysis.colors?.backgroundTone || 'dark';

    // Category-based theme mapping
    const categoryThemes = {
        'developer': 'NEON_CYBER',
        'gaming': 'NEON_CYBER',
        'finance': backgroundTone === 'dark' ? 'CLEAN_PRO' : 'MODERN_MINIMAL',
        'fitness': 'SWISS_BRUTALISM',
        'health': 'SOFT_LUXURY',
        'wellness': 'SOFT_LUXURY',
        'social': 'GLASS_MORPHISM',
        'lifestyle': 'SOFT_LUXURY',
        'shopping': backgroundTone === 'dark' ? 'NEON_CYBER' : 'MODERN_MINIMAL',
        'entertainment': 'GLASS_MORPHISM',
        'productivity': 'MODERN_MINIMAL',
        'business': 'CLEAN_PRO',
        'education': 'MODERN_MINIMAL',
        'food': backgroundTone === 'dark' ? 'SOFT_LUXURY' : 'MODERN_MINIMAL'
    };

    // Vibe-based adjustments
    if (vibe === 'premium' || vibe === 'elegant') return 'SOFT_LUXURY';
    if (vibe === 'bold' || vibe === 'energetic') return 'SWISS_BRUTALISM';
    if (vibe === 'playful') return 'GLASS_MORPHISM';
    if (vibe === 'techy') return 'NEON_CYBER';
    if (vibe === 'minimal') return 'MODERN_MINIMAL';

    return categoryThemes[category] || 'MODERN_MINIMAL';
}

/**
 * Generate AI backgrounds using Gemini Image
 */
async function generateAIBackgrounds(analysis, _strategy, count, onProgress) {
    const apiKey = getApiKey();
    const backgrounds = [];
    const category = analysis.app?.category || 'generic';
    const templates = BACKGROUND_GENERATION.categoryTemplates[category] || BACKGROUND_GENERATION.categoryTemplates.generic;
    
    for (let i = 0; i < count; i++) {
        try {
            onProgress(Math.round((i / count) * 100));
            
            // Build color string for template
            const colorString = `${strategy.colorPalette.primary}, ${strategy.colorPalette.secondary}, ${strategy.colorPalette.accent}`;
            
            // Select template and replace colors
            const template = templates[i % templates.length];
            const prompt = template.replace('{colors}', colorString);
            
            // Generate background
            const imageUrl = await callGeminiImageGeneration(apiKey, prompt, {
                temperature: 0.8,
                dimensions: { width: 1024, height: 2048 }
            });
            
            if (imageUrl) {
                backgrounds.push({
                    index: i,
                    type: 'ai-generated',
                    imageUrl,
                    prompt
                });
            } else {
                // Fallback to gradient
                backgrounds.push(generateGradientBackground(strategy.colorPalette, i, count));
            }
        } catch (error) {
            console.warn(`Background generation failed for index ${i}:`, error);
            backgrounds.push(generateGradientBackground(strategy.colorPalette, i, count));
        }
    }
    
    return backgrounds;
}

/**
 * Generate gradient-based backgrounds (fallback)
 */
function generateGradientBackgrounds(colorPalette, count) {
    return Array.from({ length: count }, (_, i) => 
        generateGradientBackground(colorPalette, i, count)
    );
}

function generateGradientBackground(colorPalette, index, _total) {
    const hueShift = index * 3; // Subtle variation per slide
    const positionShift = index * 2;
    
    return {
        index,
        type: 'gradient',
        gradient: {
            angle: 135,
            stops: [
                { color: colorPalette.background, position: 0 + positionShift },
                { color: adjustColorHue(colorPalette.primary, hueShift), position: 45 + positionShift },
                { color: adjustColorHue(colorPalette.secondary, -hueShift), position: 100 }
            ]
        }
    };
}

/**
 * Select smart layouts based on analysis
 */
function selectSmartLayouts(analysis, strategy, count) {
    const category = analysis.app?.category || 'generic';
    const layouts = [];
    const usedLayouts = [];
    
    for (let i = 0; i < count; i++) {
        const position = i === 0 ? 'first' : (i === count - 1 ? 'last' : 'middle');
        const screenshotAnalysis = analysis.screenshots?.[i];
        
        // Get category preferences
        const categoryLayouts = SMART_LAYOUT_ENGINE.categoryLayoutMap[category] || 
                                SMART_LAYOUT_ENGINE.categoryLayoutMap.generic;
        
        // Score each layout
        let bestLayout = strategy.layoutSequence[i] || 'classic';
        let bestScore = 0;
        
        for (const layoutId of categoryLayouts) {
            let score = 0.5;
            
            // Position bonus
            if (position === 'first' && ['hero_large', 'magazine_cover', 'panoramic_right'].includes(layoutId)) {
                score += 0.3;
            }
            if (position === 'last' && ['duo_overlap', 'duo_side_by_side', 'poster_hero'].includes(layoutId)) {
                score += 0.3;
            }
            
            // Variety penalty
            if (usedLayouts.includes(layoutId)) {
                score -= 0.4;
            }
            
            // Edge content consideration
            if (screenshotAnalysis?.hasCriticalEdgeContent && !['zoom_top', 'zoom_bottom'].includes(layoutId)) {
                score += 0.1;
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestLayout = layoutId;
            }
        }
        
        usedLayouts.push(bestLayout);
        
        const preset = SMART_LAYOUT_ENGINE.positionPresets[bestLayout] || 
                       SMART_LAYOUT_ENGINE.positionPresets.classic;
        
        layouts.push({
            index: i,
            layoutId: bestLayout,
            position: preset,
            confidence: bestScore
        });
    }
    
    return layouts;
}

/**
 * Generate marketing headlines using AI
 */
async function generateHeadlines(apiKey, images, analysis, _strategy, style) {
    const screenshotFeatures = analysis.screenshots || [];
    
    const prompt = HEADLINE_GENERATION.prompt(analysis, style, screenshotFeatures);
    
    const response = await callGeminiVision(apiKey, images, prompt, { temperature: 0.8 });
    const headlines = parseJSONResponse(response);
    
    return Object.entries(headlines).map(([index, data]) => ({
        index: parseInt(index),
        headline: data.headline,
        subheadline: data.subheadline
    }));
}

/**
 * Assemble final design plan
 */
function assembleFinalDesignPlan(analysis, strategy, backgrounds, layouts, headlines) {
    return {
        // Metadata
        appAnalysis: analysis.app,
        
        // Design system
        theme: strategy.theme,
        themeMode: strategy.themeMode,
        colorPalette: strategy.colorPalette,
        typography: strategy.typography,
        
        // Per-screenshot configuration
        slides: layouts.map((layout, i) => ({
            index: i,
            // Layout
            layout: layout.layoutId,
            position: layout.position,
            // Background
            background: backgrounds[i],
            // Text
            headline: headlines[i]?.headline || '',
            subheadline: headlines[i]?.subheadline || '',
            headlineColor: strategy.colorPalette.text,
            subheadlineColor: strategy.colorPalette.textSecondary,
            // Styling
            shadowBlur: SMART_LAYOUT_ENGINE.consistencyRules.shadowDefaults.blur,
            shadowOpacity: SMART_LAYOUT_ENGINE.consistencyRules.shadowDefaults.opacity,
            shadowY: SMART_LAYOUT_ENGINE.consistencyRules.shadowDefaults.y,
            useNoise: strategy.useNoise,
            noiseIntensity: strategy.noiseIntensity
        })),
        
        // Global settings
        globalSettings: {
            headlineFont: strategy.typography?.style === 'elegant-serif' ? 'Playfair Display' : 'Poppins',
            headlineWeight: '700',
            subheadlineFont: 'Inter',
            subheadlineWeight: '400'
        },
        
        // Flow metadata
        storyFlow: strategy.storyFlow?.name || 'Custom',
        
        // Generation timestamp
        generatedAt: new Date().toISOString()
    };
}


// =============================================================================
// 7. UTILITY FUNCTIONS
// =============================================================================

function parseJSONResponse(responseText) {
    if (!responseText) throw new Error('Empty response');
    
    let cleaned = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleaned = jsonMatch[0];
    }
    
    return JSON.parse(cleaned);
}

function parseDataUrl(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    
    if (dataUrl.startsWith('data:')) {
        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
            return { mimeType: match[1], base64: match[2] };
        }
    }
    
    return { mimeType: 'image/jpeg', base64: dataUrl };
}

function adjustColorHue(hex, degrees) {
    if (!hex) return '#000000';
    // Simple brightness adjustment as hue shift approximation
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * degrees);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function getDefaultTheme() {
    return {
        id: 'MODERN_MINIMAL',
        name: 'Modern Minimal',
        colors: {
            dark: {
                background: ['#000000', '#1D1D1F'],
                text: '#F5F5F7',
                subtext: '#A1A1A6',
                accent: '#0A84FF'
            },
            light: {
                background: ['#FFFFFF', '#F5F5F7'],
                text: '#1D1D1F',
                subtext: '#86868B',
                accent: '#007AFF'
            }
        }
    };
}

// Helper to get screenshot data URL from various formats
function getScreenshotDataUrl(screenshot, language = 'en') {
    // Check localizedImages first
    if (screenshot.localizedImages) {
        const langData = screenshot.localizedImages[language] || 
                         screenshot.localizedImages['en'] ||
                         Object.values(screenshot.localizedImages)[0];
        if (langData?.src) return langData.src;
    }
    
    // Fall back to direct dataUrl
    if (screenshot.dataUrl) return screenshot.dataUrl;
    
    // Fall back to image src
    if (screenshot.image?.src) return screenshot.image.src;
    
    return null;
}


// =============================================================================
// 8. EXPORT FOR USE IN APP
// =============================================================================

window.MagicDesignSpec = {
    // Configuration objects
    AI_ANALYSIS_PIPELINE,
    BACKGROUND_GENERATION,
    SMART_LAYOUT_ENGINE,
    HEADLINE_GENERATION,
    
    // Main function
    magicDesign,
    
    // API functions
    callGeminiVision,
    callGeminiImageGeneration,
    
    // Helper functions
    prepareImagesForAPI,
    planDesignStrategy,
    selectThemeForApp,
    generateAIBackgrounds,
    generateGradientBackgrounds,
    selectSmartLayouts,
    generateHeadlines,
    assembleFinalDesignPlan,
    
    // Utilities
    parseJSONResponse,
    parseDataUrl,
    adjustColorHue,
    getScreenshotDataUrl
};

console.log('[MagicDesignSpec] Module loaded - Complete AI-powered screenshot generation system');
