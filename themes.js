/**
 * Design Themes for App Store Screenshots
 * 6 distinct visual design systems based on professional templates
 */

const DESIGN_THEMES = {
    MODERN_MINIMAL: {
        id: 'MODERN_MINIMAL',
        name: 'Modern Minimal',
        description: 'Clean gradients, soft shadows, Apple-inspired aesthetic',
        colors: {
            light: {
                background: ['#FFFFFF', '#F5F5F7'],
                text: '#1D1D1F',
                subtext: '#86868B',
                accent: '#007AFF'
            },
            dark: {
                background: ['#000000', '#1D1D1F'],
                text: '#F5F5F7',
                subtext: '#A1A1A6',
                accent: '#0A84FF'
            }
        },
        fontStyle: 'MODERN_CLEAN',
        frameStyle: 'FRAMELESS',
        deviceColor: '#1c1c1e',
        shadowIntensity: 0.15,
        borderRadius: 40,
        recommendedFor: ['productivity', 'finance', 'business']
    },

    SWISS_BRUTALISM: {
        id: 'SWISS_BRUTALISM',
        name: 'Swiss Brutalism',
        description: 'Bold typography, solid colors, geometric precision',
        colors: {
            light: {
                background: ['#FFFFFF', '#F0F0F0'],
                text: '#000000',
                subtext: '#333333',
                accent: '#FF0000'
            },
            dark: {
                background: ['#0A0A0A', '#1A1A1A'],
                text: '#FFFFFF',
                subtext: '#CCCCCC',
                accent: '#FF3333'
            }
        },
        fontStyle: 'BOLD_IMPACT',
        frameStyle: 'FLAT',
        deviceColor: '#000000',
        shadowIntensity: 0,
        borderRadius: 0,
        recommendedFor: ['developer', 'tech', 'creative']
    },

    NEON_CYBER: {
        id: 'NEON_CYBER',
        name: 'Neon Cyber',
        description: 'Dark backgrounds, neon glows, futuristic vibes',
        colors: {
            light: {
                background: ['#1A1A2E', '#16213E'],
                text: '#FFFFFF',
                subtext: '#B8B8D1',
                accent: '#00F5FF'
            },
            dark: {
                background: ['#0A0A0F', '#0F0F1A'],
                text: '#FFFFFF',
                subtext: '#8888AA',
                accent: '#00F5FF'
            }
        },
        fontStyle: 'MINIMAL_TECH',
        frameStyle: 'GLOW',
        deviceColor: '#0A0A0F',
        shadowIntensity: 0,
        glowColor: '#00F5FF',
        glowIntensity: 0.6,
        borderRadius: 20,
        recommendedFor: ['gaming', 'entertainment', 'fitness']
    },

    SOFT_LUXURY: {
        id: 'SOFT_LUXURY',
        name: 'Soft Luxury',
        description: 'Elegant beige tones, serif typography, premium feel',
        colors: {
            light: {
                background: ['#FAF7F2', '#F5EDE4'],
                text: '#2C2C2C',
                subtext: '#6B6B6B',
                accent: '#B8860B'
            },
            dark: {
                background: ['#1A1815', '#252220'],
                text: '#FAF7F2',
                subtext: '#A0A0A0',
                accent: '#D4AF37'
            }
        },
        fontStyle: 'EDITORIAL_SERIF',
        frameStyle: 'CERAMIC',
        deviceColor: '#FAE7CF',
        shadowIntensity: 0.1,
        borderRadius: 30,
        noiseOverlay: true,
        recommendedFor: ['lifestyle', 'fashion', 'wellness']
    },

    GLASS_MORPHISM: {
        id: 'GLASS_MORPHISM',
        name: 'Glass Morphism',
        description: 'Frosted glass effects, translucent layers, airy feel',
        colors: {
            light: {
                background: ['#E8F4F8', '#D4E8ED'],
                text: '#1A1A1A',
                subtext: '#4A4A4A',
                accent: '#007AFF'
            },
            dark: {
                background: ['#1A1A2E', '#2D2D44'],
                text: '#FFFFFF',
                subtext: '#B8B8D1',
                accent: '#00D4FF'
            }
        },
        fontStyle: 'MODERN_CLEAN',
        frameStyle: 'GLASS_FROST',
        deviceColor: '#E3E3E3',
        shadowIntensity: 0.2,
        glassBlur: 20,
        borderRadius: 35,
        recommendedFor: ['social', 'communication', 'weather']
    },

    CLEAN_PRO: {
        id: 'CLEAN_PRO',
        name: 'Clean Pro',
        description: 'Professional white/gray, matte clay devices, crisp typography',
        colors: {
            light: {
                background: ['#FFFFFF', '#F8F9FA'],
                text: '#212529',
                subtext: '#6C757D',
                accent: '#0D6EFD'
            },
            dark: {
                background: ['#111111', '#1A1A1A'],
                text: '#F8F9FA',
                subtext: '#ADB5BD',
                accent: '#0D6EFD'
            }
        },
        fontStyle: 'GEOMETRIC_SANS',
        frameStyle: 'MATTE',
        deviceColor: '#F5F5F7',
        shadowIntensity: 0.12,
        borderRadius: 28,
        recommendedFor: ['productivity', 'business', 'saas']
    }
};

const FONT_STYLES = {
    MODERN_CLEAN: {
        id: 'MODERN_CLEAN',
        name: 'Modern Clean',
        headline: 'Inter',
        subheadline: 'Inter',
        headlineWeight: 700,
        subheadlineWeight: 400,
        headlineSize: 1.0,
        subheadlineSize: 0.45,
        letterSpacing: '-0.02em'
    },
    EDITORIAL_SERIF: {
        id: 'EDITORIAL_SERIF',
        name: 'Editorial Serif',
        headline: 'Playfair Display',
        subheadline: 'Inter',
        headlineWeight: 700,
        subheadlineWeight: 400,
        headlineSize: 1.1,
        subheadlineSize: 0.42,
        letterSpacing: '-0.01em'
    },
    BOLD_IMPACT: {
        id: 'BOLD_IMPACT',
        name: 'Bold Impact',
        headline: 'Anton',
        subheadline: 'Inter',
        headlineWeight: 400,
        subheadlineWeight: 500,
        headlineSize: 1.2,
        subheadlineSize: 0.4,
        letterSpacing: '0.02em',
        uppercase: true
    },
    MINIMAL_TECH: {
        id: 'MINIMAL_TECH',
        name: 'Minimal Tech',
        headline: 'Space Grotesk',
        subheadline: 'Space Grotesk',
        headlineWeight: 600,
        subheadlineWeight: 400,
        headlineSize: 0.95,
        subheadlineSize: 0.4,
        letterSpacing: '-0.01em'
    },
    GEOMETRIC_SANS: {
        id: 'GEOMETRIC_SANS',
        name: 'Geometric Sans',
        headline: 'Poppins',
        subheadline: 'Poppins',
        headlineWeight: 700,
        subheadlineWeight: 400,
        headlineSize: 1.0,
        subheadlineSize: 0.42,
        letterSpacing: '-0.01em'
    },
    CLASSIC_SERIF: {
        id: 'CLASSIC_SERIF',
        name: 'Classic Serif',
        headline: 'Merriweather',
        subheadline: 'Open Sans',
        headlineWeight: 700,
        subheadlineWeight: 400,
        headlineSize: 0.95,
        subheadlineSize: 0.4,
        letterSpacing: '0'
    }
};

const FRAME_STYLES = {
    FRAMELESS: { id: 'FRAMELESS', name: 'Frameless', borderWidth: 0, borderColor: 'transparent' },
    GLOW: { id: 'GLOW', name: 'Glow', borderWidth: 2, glow: true },
    GLASS_FROST: { id: 'GLASS_FROST', name: 'Glass Frost', borderWidth: 1, frost: true },
    CERAMIC: { id: 'CERAMIC', name: 'Ceramic', borderWidth: 8, borderColor: '#FAE7CF' },
    TITANIUM: { id: 'TITANIUM', name: 'Titanium', borderWidth: 4, borderColor: '#BEBDB8' },
    FLAT: { id: 'FLAT', name: 'Flat', borderWidth: 0, flat: true },
    OUTLINE: { id: 'OUTLINE', name: 'Outline', borderWidth: 2, borderColor: '#FFFFFF' },
    MATTE: { id: 'MATTE', name: 'Matte', borderWidth: 6, borderColor: '#F5F5F7', matte: true },
    PREMIUM_GLASS: { id: 'PREMIUM_GLASS', name: 'Premium Glass', borderWidth: 1, premiumGlass: true }
};

const DEVICE_COLORS = {
    MIDNIGHT: '#1c1c1e',
    SILVER: '#e3e3e3',
    DEEP_PURPLE: '#483D58',
    GOLD: '#fae7cf',
    NEON_BLUE: '#00f2ff',
    NEON_PINK: '#ff0099',
    TITANIUM_NATURAL: '#bebdb8',
    OFF_WHITE: '#f5f5f7',
    MATTE_BLACK: '#111111'
};

const STORY_ARCHETYPES = {
    PROBLEM_SOLUTION: {
        id: 'PROBLEM_SOLUTION',
        name: 'Problem → Solution',
        description: 'Show the problem, then how your app solves it',
        slideStructure: ['problem', 'solution', 'features', 'result', 'cta']
    },
    FEATURE_BLITZ: {
        id: 'FEATURE_BLITZ',
        name: 'Feature Blitz',
        description: 'Fast-paced showcase of key features',
        slideStructure: ['hero', 'feature1', 'feature2', 'feature3', 'cta']
    },
    LIFESTYLE_VIBE: {
        id: 'LIFESTYLE_VIBE',
        name: 'Lifestyle Vibe',
        description: 'Focus on feelings and lifestyle benefits',
        slideStructure: ['emotion', 'lifestyle', 'feature', 'benefit', 'community']
    },
    USER_JOURNEY: {
        id: 'USER_JOURNEY',
        name: 'User Journey',
        description: 'Step-by-step walkthrough',
        slideStructure: ['start', 'step1', 'step2', 'step3', 'result']
    }
};

/**
 * Get theme configuration
 */
function getTheme(themeId) {
    return DESIGN_THEMES[themeId] || DESIGN_THEMES.MODERN_MINIMAL;
}

/**
 * Get all themes
 */
function getAllThemes() {
    return Object.values(DESIGN_THEMES);
}

/**
 * Get font style configuration
 */
function getFontStyle(fontStyleId) {
    return FONT_STYLES[fontStyleId] || FONT_STYLES.MODERN_CLEAN;
}

/**
 * Get theme colors for mode (light/dark)
 */
function getThemeColors(themeId, mode = 'dark') {
    const theme = getTheme(themeId);
    return theme.colors[mode] || theme.colors.dark;
}

/**
 * Apply theme to state
 */
function applyTheme(themeId, mode, currentState) {
    console.log('[ThemeEngine] Applying theme:', themeId, mode);

    if (!currentState) {
        console.error('[ThemeEngine] No state provided');
        return currentState;
    }

    const theme = getTheme(themeId);
    if (!theme) {
        console.error('[ThemeEngine] Theme not found:', themeId);
        return currentState;
    }

    const colors = getThemeColors(themeId, mode);
    const fontStyle = getFontStyle(theme.fontStyle);

    // Update background colors (with safety checks)
    if (currentState.background && currentState.background.type === 'gradient' && currentState.background.gradient) {
        currentState.background.gradient.stops = [
            { color: colors.background[0], position: 0 },
            { color: colors.background[1] || colors.background[0], position: 100 }
        ];
    }

    // Update text colors (with safety checks)
    if (currentState.text) {
        currentState.text.headlineColor = colors.text;
        currentState.text.subheadlineColor = colors.subtext;

        // Update fonts
        if (fontStyle) {
            currentState.text.headlineFont = fontStyle.headline;
            currentState.text.subheadlineFont = fontStyle.subheadline;
        }
    }

    // Store theme info
    currentState.designTheme = themeId;
    currentState.themeMode = mode;

    console.log('[ThemeEngine] Theme applied successfully');
    return currentState;
}

/**
 * Get recommended theme for app category
 */
function getRecommendedTheme(category) {
    const lowerCategory = category.toLowerCase();

    for (const [themeId, theme] of Object.entries(DESIGN_THEMES)) {
        if (theme.recommendedFor.some(cat => lowerCategory.includes(cat))) {
            return themeId;
        }
    }

    return 'MODERN_MINIMAL';
}

/**
 * Apply theme to a single screenshot
 */
function applyThemeToScreenshot(screenshot, themeId, mode = 'dark') {
    const theme = getTheme(themeId);
    if (!theme) return screenshot;

    const colors = getThemeColors(themeId, mode);
    const fontStyle = getFontStyle(theme.fontStyle);

    // Apply text settings
    screenshot.text = screenshot.text || {};
    screenshot.text.headlineFont = fontStyle.headline;
    screenshot.text.headlineWeight = String(fontStyle.headlineWeight);
    screenshot.text.headlineSize = Math.round(100 * fontStyle.headlineSize);
    screenshot.text.headlineColor = colors.text;
    screenshot.text.subheadlineFont = fontStyle.subheadline;
    screenshot.text.subheadlineWeight = String(fontStyle.subheadlineWeight);
    screenshot.text.subheadlineSize = Math.round(100 * fontStyle.subheadlineSize);
    screenshot.text.subheadlineColor = colors.subtext;

    // Apply device settings
    screenshot.screenshot = screenshot.screenshot || {};
    screenshot.screenshot.cornerRadius = theme.borderRadius;

    // Apply shadow
    screenshot.screenshot.shadow = screenshot.screenshot.shadow || {};
    screenshot.screenshot.shadow.opacity = Math.round(theme.shadowIntensity * 100);
    screenshot.screenshot.shadow.blur = 40;
    screenshot.screenshot.shadow.y = 20;

    // Apply glow for neon theme
    if (theme.glowColor) {
        screenshot.screenshot.shadow.color = theme.glowColor;
        screenshot.screenshot.shadow.blur = 60;
        screenshot.screenshot.shadow.opacity = Math.round(theme.glowIntensity * 100);
    }

    // Apply frame
    const frameStyle = FRAME_STYLES[theme.frameStyle];
    screenshot.screenshot.frame = screenshot.screenshot.frame || {};
    screenshot.screenshot.frame.enabled = frameStyle && frameStyle.borderWidth > 0;
    if (screenshot.screenshot.frame.enabled) {
        screenshot.screenshot.frame.width = frameStyle.borderWidth;
        screenshot.screenshot.frame.color = frameStyle.borderColor || theme.deviceColor;
    }

    // Apply background
    screenshot.background = screenshot.background || {};
    if (theme.noiseOverlay) {
        screenshot.background.noise = true;
        screenshot.background.noiseIntensity = 8;
    }

    return screenshot;
}

/**
 * Get best theme for a category (alias for AI engine compatibility)
 */
function getBestThemeForCategory(category) {
    return getRecommendedTheme(category);
}

// Export for use in app.js
window.ThemeEngine = {
    DESIGN_THEMES,
    FONT_STYLES,
    FRAME_STYLES,
    DEVICE_COLORS,
    STORY_ARCHETYPES,
    getTheme,
    getAllThemes,
    getFontStyle,
    getThemeColors,
    applyTheme,
    applyThemeToScreenshot,
    getRecommendedTheme,
    getBestThemeForCategory
};

// Alias for AI Engine compatibility
window.DesignThemes = {
    getTheme: (id) => {
        // Convert lowercase ID to uppercase for compatibility
        const upperID = id.toUpperCase().replace(/-/g, '_');
        return getTheme(upperID) || getTheme(id);
    },
    getAllThemes,
    getBestThemeForCategory,
    applyThemeToScreenshot,
    getThemeColors
};
