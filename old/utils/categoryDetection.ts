// App category detection and visual prompt templates

export type AppCategory =
  | 'fitness'
  | 'finance'
  | 'social'
  | 'productivity'
  | 'food'
  | 'travel'
  | 'education'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'developer'
  | 'generic';

interface CategoryKeywords {
  [key: string]: string[];
}

const CATEGORY_KEYWORDS: CategoryKeywords = {
  fitness: ['workout', 'exercise', 'calories', 'steps', 'activity', 'gym', 'training', 'fitness', 'run', 'health', 'cardio'],
  finance: ['budget', 'money', 'invest', 'savings', 'bank', 'payment', 'wallet', 'crypto', 'stock', 'finance', 'expense'],
  social: ['chat', 'message', 'friend', 'connect', 'share', 'post', 'social', 'community', 'profile', 'follow'],
  productivity: ['task', 'todo', 'calendar', 'note', 'organize', 'project', 'reminder', 'schedule', 'plan'],
  food: ['recipe', 'food', 'meal', 'restaurant', 'delivery', 'cooking', 'nutrition', 'diet', 'dining', 'eat', 'kitchen', 'chef', 'culinary'],
  travel: ['travel', 'trip', 'flight', 'hotel', 'booking', 'destination', 'vacation', 'map', 'location'],
  education: ['learn', 'course', 'study', 'education', 'lesson', 'school', 'university', 'training', 'quiz'],
  entertainment: ['music', 'video', 'game', 'movie', 'play', 'stream', 'entertainment', 'media'],
  health: ['health', 'medical', 'doctor', 'therapy', 'wellness', 'meditation', 'sleep', 'mental'],
  shopping: ['shop', 'buy', 'cart', 'product', 'store', 'ecommerce', 'retail', 'purchase'],
  developer: ['code', 'developer', 'api', 'terminal', 'git', 'programming', 'debug', 'console'],
};

export const CATEGORY_VISUAL_TEMPLATES: Record<AppCategory, string[]> = {
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
  generic: [
    'Abstract modern gradient background, smooth color transition, professional clean aesthetic, versatile design language',
    'Minimal geometric composition, contemporary visual design, adaptable universal style'
  ],
};

export const detectAppCategory = (description: string): AppCategory => {
  const lowerDesc = description.toLowerCase();

  let bestMatch: AppCategory = 'generic';
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter(keyword => lowerDesc.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category as AppCategory;
    }
  }

  return bestMatch;
};

export const getVisualPromptForCategory = (
  category: AppCategory,
  brandColor: string = '#4F46E5'
): string => {
  const templates = CATEGORY_VISUAL_TEMPLATES[category] || CATEGORY_VISUAL_TEMPLATES.generic;
  // Pick first template for consistency (or could randomize)
  const template = templates[0];
  return template.replace('${brandColor}', brandColor);
};
