/**
 * App Category Detection
 * Automatically detects app category from description and screenshots
 * Used to recommend themes, layouts, colors, and copy
 */

const APP_CATEGORIES = [
    'fitness', 'finance', 'social', 'productivity', 'food',
    'travel', 'education', 'entertainment', 'health', 'shopping',
    'developer', 'gaming', 'weather', 'news', 'music',
    'photo', 'video', 'utilities', 'lifestyle', 'medical',
    'kids', 'sports', 'navigation', 'business', 'generic'
];

const CATEGORY_KEYWORDS = {
    fitness: ['workout', 'exercise', 'calories', 'steps', 'activity', 'gym', 'training', 'fitness', 'run', 'cardio', 'muscle', 'weight', 'yoga', 'stretching', 'hiit'],
    finance: ['budget', 'money', 'invest', 'savings', 'bank', 'payment', 'wallet', 'crypto', 'stock', 'finance', 'expense', 'trading', 'portfolio', 'bitcoin', 'transfer'],
    social: ['chat', 'message', 'friend', 'connect', 'share', 'post', 'social', 'community', 'profile', 'follow', 'dating', 'meet', 'network', 'stories'],
    productivity: ['task', 'todo', 'calendar', 'note', 'organize', 'project', 'reminder', 'schedule', 'plan', 'workflow', 'time', 'management', 'focus', 'pomodoro'],
    food: ['recipe', 'food', 'meal', 'restaurant', 'delivery', 'cooking', 'nutrition', 'diet', 'dining', 'eat', 'kitchen', 'chef', 'culinary', 'order', 'menu'],
    travel: ['travel', 'trip', 'flight', 'hotel', 'booking', 'destination', 'vacation', 'map', 'location', 'explore', 'adventure', 'tour', 'airbnb'],
    education: ['learn', 'course', 'study', 'education', 'lesson', 'school', 'university', 'training', 'quiz', 'language', 'tutor', 'class', 'exam'],
    entertainment: ['music', 'video', 'game', 'movie', 'play', 'stream', 'entertainment', 'media', 'podcast', 'tv', 'show', 'watch', 'listen'],
    health: ['health', 'medical', 'doctor', 'therapy', 'wellness', 'meditation', 'sleep', 'mental', 'mindful', 'relax', 'stress', 'breathing', 'calm'],
    shopping: ['shop', 'buy', 'cart', 'product', 'store', 'ecommerce', 'retail', 'purchase', 'deal', 'price', 'fashion', 'clothes', 'sale'],
    developer: ['code', 'developer', 'api', 'terminal', 'git', 'programming', 'debug', 'console', 'deploy', 'server', 'database', 'backend'],
    gaming: ['game', 'play', 'score', 'level', 'arcade', 'puzzle', 'strategy', 'multiplayer', 'battle', 'quest', 'rpg', 'esports'],
    weather: ['weather', 'forecast', 'temperature', 'rain', 'sunny', 'climate', 'storm', 'humidity', 'wind'],
    news: ['news', 'article', 'headline', 'breaking', 'reporter', 'journalism', 'press', 'media', 'current'],
    photo: ['photo', 'camera', 'filter', 'edit', 'image', 'picture', 'selfie', 'portrait', 'gallery', 'album'],
    video: ['video', 'record', 'edit', 'clip', 'movie', 'film', 'cinema', 'vlog', 'youtube', 'tiktok'],
    utilities: ['utility', 'tool', 'calculator', 'converter', 'scanner', 'flashlight', 'qr', 'vpn', 'cleaner'],
    lifestyle: ['lifestyle', 'habit', 'routine', 'journal', 'diary', 'mood', 'gratitude', 'self', 'personal'],
    kids: ['kids', 'children', 'child', 'parent', 'family', 'baby', 'toddler', 'educational', 'fun'],
    sports: ['sports', 'score', 'team', 'league', 'match', 'football', 'basketball', 'soccer', 'baseball', 'nfl', 'nba'],
    navigation: ['navigation', 'gps', 'direction', 'route', 'drive', 'commute', 'traffic', 'transit'],
    business: ['business', 'crm', 'sales', 'invoice', 'client', 'meeting', 'conference', 'enterprise', 'b2b']
};

const CATEGORY_VISUAL_TEMPLATES = {
    fitness: [
        'Abstract flowing energy ribbons in dynamic motion, neon electric blue and vibrant magenta, motion blur streaks, glossy liquid metal surfaces, matte black void background, volumetric rim lighting, high contrast, intense energy',
        'Geometric ascending progress bars and curves, clean athletic aesthetic, bold gradient from deep purple to cyan, minimal tech precision, soft volumetric lighting'
    ],
    finance: [
        'Ascending crystalline geometric planes representing growth, precision-cut glass prisms, data flow streams in electric blue, clean minimalist surfaces, corporate sophistication, volumetric lighting, metallic gold accents',
        'Abstract financial growth metaphor with smooth upward curves, liquid gold metallic surfaces, precision engineering aesthetic, frosted glass layers, professional clean look'
    ],
    social: [
        'Soft organic gradient blobs, pastel pink to lavender to sky blue, human connection metaphor with flowing silk ribbons, warm diffused lighting, airy negative space, friendly approachable design',
        'Chat bubble abstract forms in 3D, rounded friendly shapes, soft shadows, gentle gradients, contemporary social aesthetic'
    ],
    productivity: [
        'Clean geometric grid systems, organized minimal layers, professional navy to light blue gradient, sharp precision, structured composition, architectural clarity',
        'Abstract calendar and task visualization, flowing timeline ribbons, organized chaos becoming order, clean productivity aesthetic'
    ],
    food: [
        'Organic liquid splash forms, BRIGHT warm saturated colors (vibrant orange, fresh red, golden yellow), steam curves, glossy ceramic surfaces, appetizing visual language, BRIGHT soft natural lighting, high-key lighting, fresh and inviting',
        'Abstract culinary textures, heat waves, ingredient-inspired organic shapes, BRIGHT warm inviting atmosphere, fresh food photography lighting, clean and appetizing'
    ],
    travel: [
        'Abstract map contours and flowing paths, adventure-inspired gradients (ocean blue to sunset orange), sense of movement and distance, layered depth, wanderlust aesthetic',
        'Geographic abstraction with pin markers dissolving into particles, journey visualization, expansive open composition'
    ],
    education: [
        'Abstract knowledge visualization, book page curves transforming to digital particles, intelligent gradient (deep blue to bright cyan), clean academic aesthetic, enlightenment metaphor',
        'Geometric learning pathways, progressive step visualization, scholarly professional look'
    ],
    entertainment: [
        'Vibrant playful gradients (magenta, yellow, cyan), energetic particle systems, fun dynamic composition, entertainment glow, exciting visual rhythm',
        'Abstract media waveforms, rhythm visualization, celebratory energetic aesthetic'
    ],
    health: [
        'Soft healing gradients (mint green to soft blue), organic calming shapes, wellness-inspired smooth curves, tranquil professional aesthetic, gentle diffused lighting',
        'Abstract heartbeat rhythm visualization, medical precision meets human warmth, trustworthy clean design'
    ],
    shopping: [
        'Bold product spotlight aesthetics, vibrant gradients (coral to purple), shopping bag abstract forms, retail energy, exciting commercial look',
        'Abstract price tag and cart visualization, consumer delight metaphor, attractive polished aesthetic'
    ],
    developer: [
        'Matrix-inspired code rain abstraction, terminal green to electric blue, geometric logic patterns, tech precision, developer-focused cyberpunk aesthetic',
        'Abstract syntax highlighting visualization, clean monospace grid, professional coder aesthetic'
    ],
    gaming: [
        'Neon cyber aesthetics, dark backgrounds with electric purple and cyan, geometric HUD elements, immersive game world vibes, intense visual energy',
        'Abstract game controller forms, power-up particle effects, competitive energy, exciting dynamic composition'
    ],
    generic: [
        'Abstract modern gradient background, smooth color transition, professional clean aesthetic, versatile design language',
        'Minimal geometric composition, contemporary visual design, adaptable universal style'
    ]
};

/**
 * Detect app category from description
 */
function detectAppCategory(description) {
    if (!description) return 'generic';

    const lowerDesc = description.toLowerCase();
    let bestMatch = 'generic';
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const matches = keywords.filter(keyword => lowerDesc.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = category;
        }
    }

    return bestMatch;
}

/**
 * Get visual prompt template for category
 */
function getVisualPromptForCategory(category, brandColor = '#4F46E5') {
    const templates = CATEGORY_VISUAL_TEMPLATES[category] || CATEGORY_VISUAL_TEMPLATES.generic;
    const template = templates[0];
    return template.replace('${brandColor}', brandColor);
}

/**
 * Get all keywords for a category
 */
function getCategoryKeywords(category) {
    return CATEGORY_KEYWORDS[category] || [];
}

/**
 * Get confidence score for category detection
 */
function getCategoryConfidence(description, category) {
    if (!description) return 0;

    const lowerDesc = description.toLowerCase();
    const keywords = CATEGORY_KEYWORDS[category] || [];
    const matches = keywords.filter(keyword => lowerDesc.includes(keyword)).length;

    return Math.min(matches / 3, 1); // Normalize to 0-1
}

/**
 * Get top 3 likely categories
 */
function getTopCategories(description, count = 3) {
    if (!description) return [{ category: 'generic', confidence: 0 }];

    const lowerDesc = description.toLowerCase();
    const scores = [];

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const matches = keywords.filter(keyword => lowerDesc.includes(keyword)).length;
        if (matches > 0) {
            scores.push({
                category,
                confidence: Math.min(matches / 3, 1),
                matchCount: matches
            });
        }
    }

    scores.sort((a, b) => b.confidence - a.confidence);
    return scores.slice(0, count);
}

/**
 * Get recommended headline patterns for category
 */
function getHeadlinePatternsForCategory(category) {
    const patterns = {
        fitness: ['Push Further', 'Transform Now', 'Train Hard', 'Get Stronger', 'Level Up', 'Crush Goals'],
        finance: ['Grow Wealth', 'Invest Smart', 'Track. Thrive.', 'Money Moves', 'Earn More', 'Save Smart'],
        food: ['Crave. Discover.', 'Taste Smarter', 'Savor More', 'Order. Enjoy.', 'Fresh Finds', 'Eat Better'],
        social: ['Connect Now', 'Share More', 'Meet People', 'Stay Close', 'Be You', 'Find Friends'],
        productivity: ['Do More', 'Work Smart', 'Stay Focused', 'Get Done', 'Own Today', 'Plan Better'],
        travel: ['Go Further', 'Explore More', 'Wander Free', 'Book Easy', 'Adventure On', 'See More'],
        education: ['Learn Fast', 'Study Smart', 'Grow Daily', 'Master Skills', 'Level Up', 'Know More'],
        health: ['Feel Better', 'Sleep Well', 'Breathe Deep', 'Find Calm', 'Heal Now', 'Live Well'],
        shopping: ['Shop Smart', 'Find Deals', 'Save More', 'Style Easy', 'Buy Better', 'Score Big'],
        entertainment: ['Play Now', 'Watch More', 'Enjoy Life', 'Have Fun', 'Stream On', 'Discover'],
        developer: ['Code Fast', 'Build More', 'Ship Quick', 'Debug Easy', 'Deploy Now', 'Create'],
        gaming: ['Play Hard', 'Win Big', 'Level Up', 'Game On', 'Score High', 'Dominate'],
        generic: ['Try Now', 'Get Started', 'Discover', 'Experience', 'Begin Today', 'Start Free']
    };

    return patterns[category] || patterns.generic;
}

// Export for use in app.js
window.CategoryDetection = {
    APP_CATEGORIES,
    CATEGORY_KEYWORDS,
    CATEGORY_VISUAL_TEMPLATES,
    detectAppCategory,
    getVisualPromptForCategory,
    getCategoryKeywords,
    getCategoryConfidence,
    getTopCategories,
    getHeadlinePatternsForCategory
};
