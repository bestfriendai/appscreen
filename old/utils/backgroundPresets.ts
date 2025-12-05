/**
 * Professional Background Presets
 * Based on high-quality App Store screenshot templates
 * Each preset is designed to match specific app categories
 */

export interface BackgroundPreset {
  id: string;
  name: string;
  category: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  style: 'organic' | 'gradient' | 'bold' | 'minimal' | 'neon' | 'aurora';
  variant?: string;
  themeMode: 'light' | 'dark';
}

/**
 * Curated presets inspired by professional App Store templates
 */
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // FOOD & RESTAURANT APPS
  {
    id: 'food-sage',
    name: 'Fresh Sage',
    category: ['food', 'restaurant', 'recipe', 'cooking', 'delivery'],
    colors: {
      primary: '#4A7C59',
      secondary: '#8FBC8F', 
      accent: '#D4A574',
      background: '#0A0A0A'
    },
    style: 'organic',
    variant: 'flowing',
    themeMode: 'dark'
  },
  {
    id: 'food-warm',
    name: 'Warm Kitchen',
    category: ['food', 'restaurant', 'recipe'],
    colors: {
      primary: '#E07B4C',
      secondary: '#C4A77D',
      accent: '#8B7355',
      background: '#FDF5E6'
    },
    style: 'organic',
    variant: 'circles',
    themeMode: 'light'
  },
  {
    id: 'food-fresh',
    name: 'Garden Fresh',
    category: ['food', 'health', 'wellness'],
    colors: {
      primary: '#6B8E23',
      secondary: '#9ACD32',
      accent: '#228B22',
      background: '#F5FFF5'
    },
    style: 'minimal',
    themeMode: 'light'
  },

  // FINANCE & TRADING APPS
  {
    id: 'finance-navy',
    name: 'Premium Navy',
    category: ['finance', 'trading', 'crypto', 'banking', 'investment'],
    colors: {
      primary: '#0A1628',
      secondary: '#1E3A5F',
      accent: '#D4AF37',
      background: '#050B14'
    },
    style: 'gradient',
    themeMode: 'dark'
  },
  {
    id: 'finance-trust',
    name: 'Trust Blue',
    category: ['finance', 'banking', 'payment'],
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#10B981',
      background: '#0F172A'
    },
    style: 'gradient',
    themeMode: 'dark'
  },
  {
    id: 'finance-clean',
    name: 'Clean Finance',
    category: ['finance', 'productivity'],
    colors: {
      primary: '#4A90D9',
      secondary: '#6BB3F0',
      accent: '#7CB342',
      background: '#F5F5F7'
    },
    style: 'minimal',
    themeMode: 'light'
  },

  // FITNESS & WORKOUT APPS
  {
    id: 'fitness-neon',
    name: 'Neon Energy',
    category: ['fitness', 'workout', 'gym', 'exercise', 'training'],
    colors: {
      primary: '#00F5FF',
      secondary: '#39FF14',
      accent: '#FF073A',
      background: '#0A0A0A'
    },
    style: 'neon',
    themeMode: 'dark'
  },
  {
    id: 'fitness-power',
    name: 'Power Purple',
    category: ['fitness', 'sports'],
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#FF4500',
      background: '#0A0A12'
    },
    style: 'bold',
    themeMode: 'dark'
  },

  // SHOPPING & E-COMMERCE APPS
  {
    id: 'shopping-coral',
    name: 'Trendy Coral',
    category: ['shopping', 'fashion', 'ecommerce', 'retail'],
    colors: {
      primary: '#FF6B6B',
      secondary: '#FF8E8E',
      accent: '#FFD700',
      background: '#FFF0F0'
    },
    style: 'bold',
    themeMode: 'light'
  },
  {
    id: 'shopping-pink',
    name: 'Hot Pink',
    category: ['shopping', 'fashion', 'beauty'],
    colors: {
      primary: '#FF1493',
      secondary: '#FF69B4',
      accent: '#40E0D0',
      background: '#0A0A0A'
    },
    style: 'bold',
    themeMode: 'dark'
  },

  // ENTERTAINMENT & STREAMING APPS
  {
    id: 'entertainment-purple',
    name: 'Cinematic Purple',
    category: ['entertainment', 'streaming', 'video', 'movie', 'music'],
    colors: {
      primary: '#9D4EDD',
      secondary: '#7B2CBF',
      accent: '#FF006E',
      background: '#0A0A12'
    },
    style: 'gradient',
    themeMode: 'dark'
  },
  {
    id: 'entertainment-dark',
    name: 'Dark Cinema',
    category: ['entertainment', 'streaming', 'movie'],
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#EF4444',
      background: '#000000'
    },
    style: 'minimal',
    themeMode: 'dark'
  },

  // SOCIAL & DATING APPS
  {
    id: 'social-sunset',
    name: 'Sunset Glow',
    category: ['social', 'dating', 'chat', 'community'],
    colors: {
      primary: '#FF6B6B',
      secondary: '#FFA07A',
      accent: '#FFB6C1',
      background: '#0A0A0A'
    },
    style: 'gradient',
    themeMode: 'dark'
  },
  {
    id: 'social-warm',
    name: 'Warm Connect',
    category: ['social', 'dating'],
    colors: {
      primary: '#EC4899',
      secondary: '#F43F5E',
      accent: '#FBBF24',
      background: '#FFF5F5'
    },
    style: 'organic',
    variant: 'blobs',
    themeMode: 'light'
  },

  // HEALTH & WELLNESS APPS
  {
    id: 'wellness-calm',
    name: 'Calm Sage',
    category: ['health', 'wellness', 'meditation', 'mental', 'sleep'],
    colors: {
      primary: '#9DC88D',
      secondary: '#95D5B2',
      accent: '#E6E6FA',
      background: '#F8F8FF'
    },
    style: 'minimal',
    themeMode: 'light'
  },
  {
    id: 'wellness-zen',
    name: 'Zen Garden',
    category: ['wellness', 'meditation', 'mindfulness'],
    colors: {
      primary: '#74C69D',
      secondary: '#87CEEB',
      accent: '#FFB5C5',
      background: '#F0FFF0'
    },
    style: 'organic',
    variant: 'minimal',
    themeMode: 'light'
  },

  // TRAVEL & ADVENTURE APPS
  {
    id: 'travel-ocean',
    name: 'Ocean Blue',
    category: ['travel', 'adventure', 'vacation', 'booking', 'flight'],
    colors: {
      primary: '#0077B6',
      secondary: '#00B4D8',
      accent: '#FF6B35',
      background: '#0A1628'
    },
    style: 'gradient',
    themeMode: 'dark'
  },
  {
    id: 'travel-sunset',
    name: 'Wanderlust Sunset',
    category: ['travel', 'adventure'],
    colors: {
      primary: '#FF6B35',
      secondary: '#F4A261',
      accent: '#0077B6',
      background: '#FDF5E6'
    },
    style: 'organic',
    variant: 'waves',
    themeMode: 'light'
  },

  // EDUCATION & LEARNING APPS
  {
    id: 'education-bright',
    name: 'Bright Learning',
    category: ['education', 'learning', 'course', 'study', 'kids'],
    colors: {
      primary: '#00B4D8',
      secondary: '#48CAE4',
      accent: '#FFD60A',
      background: '#F0F9FF'
    },
    style: 'organic',
    variant: 'circles',
    themeMode: 'light'
  },
  {
    id: 'education-focus',
    name: 'Focus Blue',
    category: ['education', 'productivity'],
    colors: {
      primary: '#4A90D9',
      secondary: '#60A5FA',
      accent: '#F59E0B',
      background: '#0F172A'
    },
    style: 'gradient',
    themeMode: 'dark'
  },

  // PRODUCTIVITY APPS
  {
    id: 'productivity-clean',
    name: 'Clean Minimal',
    category: ['productivity', 'business', 'task', 'calendar', 'notes'],
    colors: {
      primary: '#4A90D9',
      secondary: '#6BB3F0',
      accent: '#7CB342',
      background: '#FFFFFF'
    },
    style: 'minimal',
    themeMode: 'light'
  },
  {
    id: 'productivity-dark',
    name: 'Focus Dark',
    category: ['productivity', 'developer'],
    colors: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#22D3EE',
      background: '#0F0F23'
    },
    style: 'gradient',
    themeMode: 'dark'
  },

  // DEVELOPER & TECH APPS
  {
    id: 'developer-matrix',
    name: 'Matrix Green',
    category: ['developer', 'coding', 'programming', 'tech', 'terminal'],
    colors: {
      primary: '#00FF41',
      secondary: '#39FF14',
      accent: '#00FFFF',
      background: '#0D0D0D'
    },
    style: 'neon',
    themeMode: 'dark'
  },
  {
    id: 'developer-cyber',
    name: 'Cyber Dark',
    category: ['developer', 'tech'],
    colors: {
      primary: '#0066FF',
      secondary: '#00D4FF',
      accent: '#C678DD',
      background: '#0A0A12'
    },
    style: 'gradient',
    themeMode: 'dark'
  }
];

/**
 * Get the best matching preset for a category
 */
export function getPresetForCategory(category: string): BackgroundPreset {
  const lowerCategory = category.toLowerCase();
  
  // Find preset with matching category
  const match = BACKGROUND_PRESETS.find(preset => 
    preset.category.some(cat => lowerCategory.includes(cat) || cat.includes(lowerCategory))
  );
  
  return match || BACKGROUND_PRESETS[0]; // Default to first preset
}

/**
 * Get all presets for a category
 */
export function getAllPresetsForCategory(category: string): BackgroundPreset[] {
  const lowerCategory = category.toLowerCase();
  
  return BACKGROUND_PRESETS.filter(preset => 
    preset.category.some(cat => lowerCategory.includes(cat) || cat.includes(lowerCategory))
  );
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): BackgroundPreset | undefined {
  return BACKGROUND_PRESETS.find(preset => preset.id === id);
}

/**
 * Get random preset for category
 */
export function getRandomPresetForCategory(category: string): BackgroundPreset {
  const presets = getAllPresetsForCategory(category);
  if (presets.length === 0) {
    return BACKGROUND_PRESETS[Math.floor(Math.random() * BACKGROUND_PRESETS.length)];
  }
  return presets[Math.floor(Math.random() * presets.length)];
}
