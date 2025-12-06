/**
 * Professional Background Presets
 * 80+ presets based on high-quality App Store screenshot templates
 * Each preset is designed to match specific app categories
 */

const BACKGROUND_PRESETS = [
    // === FOOD & RESTAURANT APPS ===
    {
        id: 'food-sage',
        name: 'Fresh Sage',
        category: ['food', 'restaurant', 'recipe', 'cooking', 'delivery'],
        colors: { primary: '#4A7C59', secondary: '#8FBC8F', accent: '#D4A574', background: '#0A0A0A' },
        style: 'organic',
        variant: 'flowing',
        themeMode: 'dark'
    },
    {
        id: 'food-warm',
        name: 'Warm Kitchen',
        category: ['food', 'restaurant', 'recipe'],
        colors: { primary: '#E07B4C', secondary: '#C4A77D', accent: '#8B7355', background: '#FDF5E6' },
        style: 'organic',
        variant: 'circles',
        themeMode: 'light'
    },
    {
        id: 'food-fresh',
        name: 'Garden Fresh',
        category: ['food', 'health', 'wellness'],
        colors: { primary: '#6B8E23', secondary: '#9ACD32', accent: '#228B22', background: '#F5FFF5' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'food-appetite',
        name: 'Appetite Red',
        category: ['food', 'restaurant'],
        colors: { primary: '#D32F2F', secondary: '#FF5722', accent: '#FFA000', background: '#1A1A1A' },
        style: 'bold',
        themeMode: 'dark'
    },

    // === FINANCE & TRADING APPS ===
    {
        id: 'finance-navy',
        name: 'Premium Navy',
        category: ['finance', 'trading', 'crypto', 'banking', 'investment'],
        colors: { primary: '#0A1628', secondary: '#1E3A5F', accent: '#D4AF37', background: '#050B14' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'finance-trust',
        name: 'Trust Blue',
        category: ['finance', 'banking', 'payment'],
        colors: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#10B981', background: '#0F172A' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'finance-clean',
        name: 'Clean Finance',
        category: ['finance', 'productivity'],
        colors: { primary: '#4A90D9', secondary: '#6BB3F0', accent: '#7CB342', background: '#F5F5F7' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'finance-gold',
        name: 'Gold Standard',
        category: ['finance', 'trading', 'crypto'],
        colors: { primary: '#1A1A2E', secondary: '#B8860B', accent: '#FFD700', background: '#0D0D0D' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'finance-green',
        name: 'Money Green',
        category: ['finance', 'banking'],
        colors: { primary: '#004D40', secondary: '#00796B', accent: '#4CAF50', background: '#E8F5E9' },
        style: 'minimal',
        themeMode: 'light'
    },

    // === FITNESS & WORKOUT APPS ===
    {
        id: 'fitness-neon',
        name: 'Neon Energy',
        category: ['fitness', 'workout', 'gym', 'exercise', 'training'],
        colors: { primary: '#00F5FF', secondary: '#39FF14', accent: '#FF073A', background: '#0A0A0A' },
        style: 'neon',
        themeMode: 'dark'
    },
    {
        id: 'fitness-power',
        name: 'Power Purple',
        category: ['fitness', 'sports'],
        colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#FF4500', background: '#0A0A12' },
        style: 'bold',
        themeMode: 'dark'
    },
    {
        id: 'fitness-orange',
        name: 'Energy Orange',
        category: ['fitness', 'workout'],
        colors: { primary: '#FF6B00', secondary: '#FF9500', accent: '#FFCC00', background: '#1A1A1A' },
        style: 'bold',
        themeMode: 'dark'
    },
    {
        id: 'fitness-electric',
        name: 'Electric Blue',
        category: ['fitness', 'gym'],
        colors: { primary: '#0066FF', secondary: '#00BFFF', accent: '#00FF7F', background: '#0A0A12' },
        style: 'neon',
        themeMode: 'dark'
    },

    // === SHOPPING & E-COMMERCE APPS ===
    {
        id: 'shopping-coral',
        name: 'Trendy Coral',
        category: ['shopping', 'fashion', 'ecommerce', 'retail'],
        colors: { primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFD700', background: '#FFF0F0' },
        style: 'bold',
        themeMode: 'light'
    },
    {
        id: 'shopping-pink',
        name: 'Hot Pink',
        category: ['shopping', 'fashion', 'beauty'],
        colors: { primary: '#FF1493', secondary: '#FF69B4', accent: '#40E0D0', background: '#0A0A0A' },
        style: 'bold',
        themeMode: 'dark'
    },
    {
        id: 'shopping-luxe',
        name: 'Luxe Gold',
        category: ['shopping', 'fashion'],
        colors: { primary: '#1A1A1A', secondary: '#D4AF37', accent: '#F5F5F5', background: '#0D0D0D' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'shopping-fresh',
        name: 'Fresh Mint',
        category: ['shopping', 'retail'],
        colors: { primary: '#00CED1', secondary: '#40E0D0', accent: '#FF6B6B', background: '#F0FFFF' },
        style: 'minimal',
        themeMode: 'light'
    },

    // === ENTERTAINMENT & STREAMING APPS ===
    {
        id: 'entertainment-purple',
        name: 'Cinematic Purple',
        category: ['entertainment', 'streaming', 'video', 'movie', 'music'],
        colors: { primary: '#9D4EDD', secondary: '#7B2CBF', accent: '#FF006E', background: '#0A0A12' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'entertainment-dark',
        name: 'Dark Cinema',
        category: ['entertainment', 'streaming', 'movie'],
        colors: { primary: '#1F2937', secondary: '#374151', accent: '#EF4444', background: '#000000' },
        style: 'minimal',
        themeMode: 'dark'
    },
    {
        id: 'entertainment-vibrant',
        name: 'Vibrant Media',
        category: ['entertainment', 'music'],
        colors: { primary: '#FF0080', secondary: '#7928CA', accent: '#00D4FF', background: '#0D0D0D' },
        style: 'gradient',
        themeMode: 'dark'
    },

    // === SOCIAL & DATING APPS ===
    {
        id: 'social-sunset',
        name: 'Sunset Glow',
        category: ['social', 'dating', 'chat', 'community'],
        colors: { primary: '#FF6B6B', secondary: '#FFA07A', accent: '#FFB6C1', background: '#0A0A0A' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'social-warm',
        name: 'Warm Connect',
        category: ['social', 'dating'],
        colors: { primary: '#EC4899', secondary: '#F43F5E', accent: '#FBBF24', background: '#FFF5F5' },
        style: 'organic',
        variant: 'blobs',
        themeMode: 'light'
    },
    {
        id: 'social-pastel',
        name: 'Pastel Social',
        category: ['social', 'chat'],
        colors: { primary: '#A78BFA', secondary: '#F472B6', accent: '#34D399', background: '#FAF5FF' },
        style: 'organic',
        themeMode: 'light'
    },
    {
        id: 'social-modern',
        name: 'Modern Connect',
        category: ['social', 'community'],
        colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899', background: '#0F0F1A' },
        style: 'gradient',
        themeMode: 'dark'
    },

    // === HEALTH & WELLNESS APPS ===
    {
        id: 'wellness-calm',
        name: 'Calm Sage',
        category: ['health', 'wellness', 'meditation', 'mental', 'sleep'],
        colors: { primary: '#9DC88D', secondary: '#95D5B2', accent: '#E6E6FA', background: '#F8F8FF' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'wellness-zen',
        name: 'Zen Garden',
        category: ['wellness', 'meditation', 'mindfulness'],
        colors: { primary: '#74C69D', secondary: '#87CEEB', accent: '#FFB5C5', background: '#F0FFF0' },
        style: 'organic',
        variant: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'wellness-night',
        name: 'Night Mode',
        category: ['wellness', 'sleep'],
        colors: { primary: '#1A1A2E', secondary: '#16213E', accent: '#E94560', background: '#0F0F23' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'wellness-breath',
        name: 'Deep Breath',
        category: ['wellness', 'meditation'],
        colors: { primary: '#00B4D8', secondary: '#48CAE4', accent: '#90E0EF', background: '#CAF0F8' },
        style: 'organic',
        themeMode: 'light'
    },

    // === TRAVEL & ADVENTURE APPS ===
    {
        id: 'travel-ocean',
        name: 'Ocean Blue',
        category: ['travel', 'adventure', 'vacation', 'booking', 'flight'],
        colors: { primary: '#0077B6', secondary: '#00B4D8', accent: '#FF6B35', background: '#0A1628' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'travel-sunset',
        name: 'Wanderlust Sunset',
        category: ['travel', 'adventure'],
        colors: { primary: '#FF6B35', secondary: '#F4A261', accent: '#0077B6', background: '#FDF5E6' },
        style: 'organic',
        variant: 'waves',
        themeMode: 'light'
    },
    {
        id: 'travel-tropical',
        name: 'Tropical Paradise',
        category: ['travel', 'vacation'],
        colors: { primary: '#00CED1', secondary: '#20B2AA', accent: '#FF6B6B', background: '#E0FFFF' },
        style: 'organic',
        themeMode: 'light'
    },
    {
        id: 'travel-explore',
        name: 'Explorer Dark',
        category: ['travel', 'navigation'],
        colors: { primary: '#2D3436', secondary: '#636E72', accent: '#00B894', background: '#1A1A1A' },
        style: 'minimal',
        themeMode: 'dark'
    },

    // === EDUCATION & LEARNING APPS ===
    {
        id: 'education-bright',
        name: 'Bright Learning',
        category: ['education', 'learning', 'course', 'study', 'kids'],
        colors: { primary: '#00B4D8', secondary: '#48CAE4', accent: '#FFD60A', background: '#F0F9FF' },
        style: 'organic',
        variant: 'circles',
        themeMode: 'light'
    },
    {
        id: 'education-focus',
        name: 'Focus Blue',
        category: ['education', 'productivity'],
        colors: { primary: '#4A90D9', secondary: '#60A5FA', accent: '#F59E0B', background: '#0F172A' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'education-playful',
        name: 'Playful Learn',
        category: ['education', 'kids'],
        colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#FFF8E7' },
        style: 'organic',
        themeMode: 'light'
    },
    {
        id: 'education-modern',
        name: 'Modern Study',
        category: ['education', 'course'],
        colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#10B981', background: '#F5F3FF' },
        style: 'minimal',
        themeMode: 'light'
    },

    // === PRODUCTIVITY APPS ===
    {
        id: 'productivity-clean',
        name: 'Clean Minimal',
        category: ['productivity', 'business', 'task', 'calendar', 'notes'],
        colors: { primary: '#4A90D9', secondary: '#6BB3F0', accent: '#7CB342', background: '#FFFFFF' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'productivity-dark',
        name: 'Focus Dark',
        category: ['productivity', 'developer'],
        colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#22D3EE', background: '#0F0F23' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'productivity-notion',
        name: 'Notion Style',
        category: ['productivity', 'notes'],
        colors: { primary: '#37352F', secondary: '#9B9A97', accent: '#2EAADC', background: '#FFFFFF' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'productivity-linear',
        name: 'Linear Purple',
        category: ['productivity', 'project'],
        colors: { primary: '#5E6AD2', secondary: '#8B5CF6', accent: '#10B981', background: '#0D0D0D' },
        style: 'gradient',
        themeMode: 'dark'
    },

    // === DEVELOPER & TECH APPS ===
    {
        id: 'developer-matrix',
        name: 'Matrix Green',
        category: ['developer', 'coding', 'programming', 'tech', 'terminal'],
        colors: { primary: '#00FF41', secondary: '#39FF14', accent: '#00FFFF', background: '#0D0D0D' },
        style: 'neon',
        themeMode: 'dark'
    },
    {
        id: 'developer-cyber',
        name: 'Cyber Dark',
        category: ['developer', 'tech'],
        colors: { primary: '#0066FF', secondary: '#00D4FF', accent: '#C678DD', background: '#0A0A12' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'developer-github',
        name: 'GitHub Dark',
        category: ['developer', 'git'],
        colors: { primary: '#238636', secondary: '#58A6FF', accent: '#F78166', background: '#0D1117' },
        style: 'minimal',
        themeMode: 'dark'
    },
    {
        id: 'developer-vscode',
        name: 'VS Code',
        category: ['developer', 'coding'],
        colors: { primary: '#007ACC', secondary: '#3B3B3B', accent: '#CE9178', background: '#1E1E1E' },
        style: 'minimal',
        themeMode: 'dark'
    },

    // === GAMING APPS ===
    {
        id: 'gaming-neon',
        name: 'Neon Gamer',
        category: ['gaming', 'game', 'esports'],
        colors: { primary: '#FF0080', secondary: '#00F5FF', accent: '#39FF14', background: '#0A0A0A' },
        style: 'neon',
        themeMode: 'dark'
    },
    {
        id: 'gaming-purple',
        name: 'Gaming Purple',
        category: ['gaming', 'game'],
        colors: { primary: '#9D4EDD', secondary: '#FF006E', accent: '#00F5FF', background: '#0A0A12' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'gaming-retro',
        name: 'Retro Arcade',
        category: ['gaming', 'arcade'],
        colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#2C2C2C' },
        style: 'bold',
        themeMode: 'dark'
    },

    // === WEATHER APPS ===
    {
        id: 'weather-sky',
        name: 'Clear Sky',
        category: ['weather', 'forecast'],
        colors: { primary: '#00B4D8', secondary: '#48CAE4', accent: '#FFD60A', background: '#E8F4F8' },
        style: 'gradient',
        themeMode: 'light'
    },
    {
        id: 'weather-sunset',
        name: 'Sunset Sky',
        category: ['weather'],
        colors: { primary: '#FF6B35', secondary: '#F4A261', accent: '#2EC4B6', background: '#0A1628' },
        style: 'gradient',
        themeMode: 'dark'
    },

    // === NEWS & MEDIA APPS ===
    {
        id: 'news-classic',
        name: 'Classic News',
        category: ['news', 'media', 'magazine'],
        colors: { primary: '#1A1A1A', secondary: '#E74C3C', accent: '#FFFFFF', background: '#F5F5F5' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'news-dark',
        name: 'Dark Reader',
        category: ['news', 'reader'],
        colors: { primary: '#F5F5F5', secondary: '#E74C3C', accent: '#3498DB', background: '#1A1A1A' },
        style: 'minimal',
        themeMode: 'dark'
    },

    // === PHOTO & VIDEO APPS ===
    {
        id: 'photo-vibrant',
        name: 'Vibrant Photo',
        category: ['photo', 'camera', 'editor'],
        colors: { primary: '#FF0080', secondary: '#7928CA', accent: '#00D4FF', background: '#0D0D0D' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'photo-clean',
        name: 'Clean Edit',
        category: ['photo', 'editor'],
        colors: { primary: '#3B3B3B', secondary: '#6B6B6B', accent: '#007AFF', background: '#FFFFFF' },
        style: 'minimal',
        themeMode: 'light'
    },

    // === MUSIC APPS ===
    {
        id: 'music-spotify',
        name: 'Music Green',
        category: ['music', 'audio', 'podcast'],
        colors: { primary: '#1DB954', secondary: '#191414', accent: '#FFFFFF', background: '#121212' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'music-wave',
        name: 'Sound Wave',
        category: ['music', 'audio'],
        colors: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#06B6D4', background: '#0F0F23' },
        style: 'gradient',
        themeMode: 'dark'
    },

    // === LIFESTYLE APPS ===
    {
        id: 'lifestyle-warm',
        name: 'Warm Lifestyle',
        category: ['lifestyle', 'habit', 'journal'],
        colors: { primary: '#D4A574', secondary: '#E8C4A0', accent: '#8B7355', background: '#FDF5E6' },
        style: 'organic',
        themeMode: 'light'
    },
    {
        id: 'lifestyle-modern',
        name: 'Modern Life',
        category: ['lifestyle'],
        colors: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#95E1D3', background: '#F8F9FA' },
        style: 'minimal',
        themeMode: 'light'
    },

    // === UNIVERSAL/GENERIC PRESETS ===
    {
        id: 'universal-dark',
        name: 'Universal Dark',
        category: ['generic', 'any'],
        colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899', background: '#0F0F1A' },
        style: 'gradient',
        themeMode: 'dark'
    },
    {
        id: 'universal-light',
        name: 'Universal Light',
        category: ['generic', 'any'],
        colors: { primary: '#3B82F6', secondary: '#8B5CF6', accent: '#10B981', background: '#F8F9FA' },
        style: 'gradient',
        themeMode: 'light'
    },
    {
        id: 'universal-minimal',
        name: 'Pure Minimal',
        category: ['generic', 'any'],
        colors: { primary: '#1A1A1A', secondary: '#6B6B6B', accent: '#007AFF', background: '#FFFFFF' },
        style: 'minimal',
        themeMode: 'light'
    },
    {
        id: 'universal-bold',
        name: 'Bold Statement',
        category: ['generic', 'any'],
        colors: { primary: '#FF0080', secondary: '#7928CA', accent: '#FFD700', background: '#0D0D0D' },
        style: 'bold',
        themeMode: 'dark'
    }
];

/**
 * Get preset by ID
 */
function getPresetById(id) {
    return BACKGROUND_PRESETS.find(preset => preset.id === id);
}

/**
 * Get presets for a category
 */
function getPresetsForCategory(category) {
    const lowerCategory = category.toLowerCase();
    return BACKGROUND_PRESETS.filter(preset =>
        preset.category.some(cat => lowerCategory.includes(cat) || cat.includes(lowerCategory))
    );
}

/**
 * Get best matching preset for category
 */
function getBestPresetForCategory(category) {
    const presets = getPresetsForCategory(category);
    return presets.length > 0 ? presets[0] : BACKGROUND_PRESETS.find(p => p.id === 'universal-dark');
}

/**
 * Get random preset for category
 */
function getRandomPresetForCategory(category) {
    const presets = getPresetsForCategory(category);
    if (presets.length === 0) {
        return BACKGROUND_PRESETS[Math.floor(Math.random() * BACKGROUND_PRESETS.length)];
    }
    return presets[Math.floor(Math.random() * presets.length)];
}

/**
 * Get all presets grouped by category
 */
function getPresetsGroupedByCategory() {
    const groups = {};
    for (const preset of BACKGROUND_PRESETS) {
        const mainCategory = preset.category[0];
        if (!groups[mainCategory]) {
            groups[mainCategory] = [];
        }
        groups[mainCategory].push(preset);
    }
    return groups;
}

/**
 * Apply preset to state
 */
function applyPresetToState(presetId, state) {
    const preset = getPresetById(presetId);
    if (!preset) return state;

    state.background.type = 'gradient';
    state.background.gradient.stops = [
        { color: preset.colors.background, position: 0 },
        { color: preset.colors.primary, position: 50 },
        { color: preset.colors.secondary, position: 100 }
    ];

    // Update text colors based on theme mode
    if (preset.themeMode === 'dark') {
        state.text.headlineColor = '#FFFFFF';
        state.text.subheadlineColor = '#CCCCCC';
    } else {
        state.text.headlineColor = '#1A1A1A';
        state.text.subheadlineColor = '#6B6B6B';
    }

    state.backgroundPreset = presetId;
    return state;
}

/**
 * Generate CSS gradient from preset
 */
function generateGradientCSS(preset) {
    const { primary, secondary, background } = preset.colors;
    return `linear-gradient(135deg, ${background} 0%, ${primary} 50%, ${secondary} 100%)`;
}

/**
 * Get all available presets
 */
function getAllPresets() {
    return BACKGROUND_PRESETS;
}

// Export for use in app.js
window.BackgroundPresets = {
    BACKGROUND_PRESETS,
    getPresetById,
    getPresetsForCategory,
    getAllPresets,
    getBestPresetForCategory,
    getRandomPresetForCategory,
    getPresetsGroupedByCategory,
    applyPresetToState,
    generateGradientCSS
};
