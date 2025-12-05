/**
 * Professional Color Palettes by App Category
 * Based on color psychology and successful App Store examples
 * Updated with high-quality template-inspired palettes
 */

export interface ColorPalette {
  primary: string[];
  accent: string[];
  background: string[]; // Background gradient colors
  mood: string;
  saturation: number; // 0-100
  lightness: number; // 0-100
  style: 'organic' | 'gradient' | 'minimal' | 'bold'; // Recommended background style
}

export const professionalColors: Record<string, ColorPalette> = {
  // Food apps - Warm sage greens and earth tones (like the food app examples)
  food_delivery: {
    primary: ['#4A7C59', '#8FBC8F', '#2F4F2F'], // Sage greens
    accent: ['#D4A574', '#E8C4A0', '#8B7355'], // Warm browns/tans
    background: ['#4A7C59', '#8FBC8F', '#F5F5DC', '#2F4F2F'],
    mood: 'fresh, appetizing, natural, organic',
    saturation: 45,
    lightness: 55,
    style: 'organic'
  },
  
  // Finance apps - Deep navy with gold accents
  finance_trading: {
    primary: ['#0A1628', '#1E3A5F', '#2C5282'], // Deep navy blues
    accent: ['#FFD700', '#00E5FF', '#FFA500'], // Bright Gold & Electric Cyan
    background: ['#050B14', '#0F2942', '#1A365D', '#000000'],
    mood: 'trustworthy, premium, sophisticated',
    saturation: 60,
    lightness: 25,
    style: 'gradient'
  },
  
  // Fitness apps - Electric neon with dark base
  health_fitness: {
    primary: ['#00F5FF', '#39FF14', '#FF073A'], // Electric neons
    accent: ['#FF1493', '#FAFF00', '#00E5FF'], // Hot Pink & Acid Yellow
    background: ['#050505', '#121212', '#1F1F33', '#000000'],
    mood: 'energetic, powerful, motivating',
    saturation: 95,
    lightness: 55,
    style: 'bold'
  },
  
  // Shopping apps - Bold coral and pink
  shopping_ecommerce: {
    primary: ['#FF3366', '#FF0055', '#7000FF'], // Vibrant Pinks & Purples
    accent: ['#00FF99', '#FFD700', '#FFFFFF'], // Mint & Gold pop
    background: ['#FF3366', '#FF6B6B', '#FF9999', '#FFF0F5'],
    mood: 'exciting, trendy, desirable',
    saturation: 90,
    lightness: 60,
    style: 'bold'
  },
  
  // Productivity apps - Clean blues and whites
  productivity: {
    primary: ['#007AFF', '#5856D6', '#00C7BE'], // Apple-style vibrant blues/purples
    accent: ['#FF9500', '#FF2D55', '#FFCC00'], // Orange/Pink pop
    background: ['#FFFFFF', '#F2F2F7', '#E5E5EA', '#D1D1D6'],
    mood: 'focused, clean, professional',
    saturation: 80, // Increased saturation
    lightness: 60,
    style: 'minimal'
  },
  
  // Entertainment apps - Vibrant purples
  entertainment_streaming: {
    primary: ['#9D4EDD', '#7B2CBF', '#5A189A'], // Rich purples
    accent: ['#FF006E', '#00F5FF', '#FFD700'],
    background: ['#0A0A0A', '#1A0A2E', '#2D1B4E', '#0F0518'],
    mood: 'immersive, exciting, premium',
    saturation: 80,
    lightness: 40,
    style: 'gradient'
  },
  
  // Education apps - Bright friendly colors
  kids_education: {
    primary: ['#00B4D8', '#48CAE4', '#90E0EF'], // Sky blues
    accent: ['#FFD60A', '#FF6B6B', '#70C1B3'],
    background: ['#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'],
    mood: 'friendly, encouraging, bright',
    saturation: 75,
    lightness: 65,
    style: 'organic'
  },
  
  // Social/Dating apps - Warm sunset colors
  social_dating: {
    primary: ['#FF6B6B', '#FFA07A', '#FFB6C1'], // Warm sunset pinks
    accent: ['#E6E6FA', '#FFB5E8', '#FFCBA4'],
    background: ['#FF6B6B', '#FF8E72', '#FFB088', '#FFD4B8'],
    mood: 'warm, friendly, romantic',
    saturation: 70,
    lightness: 70,
    style: 'gradient'
  },
  
  // Health/Wellness apps - Calm sage greens
  wellness_meditation: {
    primary: ['#9DC88D', '#95D5B2', '#74C69D'], // Soft greens
    accent: ['#E6E6FA', '#87CEEB', '#FFB5C5'],
    background: ['#F8F8FF', '#F0FFF0', '#E8F5E9', '#FFFFFF'],
    mood: 'calm, peaceful, healing',
    saturation: 40,
    lightness: 75,
    style: 'minimal'
  },
  
  // Travel apps - Ocean and sky blues
  travel_adventure: {
    primary: ['#0077B6', '#00B4D8', '#90E0EF'], // Ocean blues
    accent: ['#FF6B35', '#F4A261', '#DDA15E'],
    background: ['#0077B6', '#00B4D8', '#48CAE4', '#90E0EF'],
    mood: 'adventurous, inspiring, free',
    saturation: 70,
    lightness: 55,
    style: 'gradient'
  },
  
  // Developer/Tech apps - Matrix greens
  developer_tech: {
    primary: ['#00FF41', '#39FF14', '#00D26A'], // Matrix greens
    accent: ['#00FFFF', '#0066FF', '#C678DD'],
    background: ['#0D0D0D', '#1E1E1E', '#0A0A0A', '#151515'],
    mood: 'technical, powerful, innovative',
    saturation: 90,
    lightness: 50,
    style: 'bold'
  },
  
  // Gaming apps - Neon cyber
  gaming: {
    primary: ['#9D4EDD', '#FF006E', '#00F5FF'], // Cyber neons
    accent: ['#39FF14', '#FFD700', '#FF4500'],
    background: ['#0A0A0A', '#1A0A2E', '#0F0518', '#150A20'],
    mood: 'exciting, immersive, intense',
    saturation: 95,
    lightness: 55,
    style: 'bold'
  }
};

/**
 * Get professional color palette for a category
 */
export function getProfessionalPalette(category: string): ColorPalette {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_');

  // Try exact match first
  if (professionalColors[normalizedCategory]) {
    return professionalColors[normalizedCategory];
  }

  // Try partial matches with expanded keywords
  const categoryKeywords: Record<string, string[]> = {
    food_delivery: ['food', 'restaurant', 'recipe', 'cooking', 'eat', 'meal', 'delivery', 'culinary', 'dining'],
    finance_trading: ['finance', 'trading', 'crypto', 'bank', 'invest', 'money', 'payment', 'wallet', 'stock'],
    health_fitness: ['fitness', 'workout', 'gym', 'exercise', 'training', 'sport', 'run', 'athletic'],
    shopping_ecommerce: ['shopping', 'ecommerce', 'fashion', 'store', 'retail', 'buy', 'shop', 'market', 'beauty'],
    productivity: ['productivity', 'business', 'task', 'todo', 'calendar', 'note', 'work', 'office', 'utility'],
    entertainment_streaming: ['entertainment', 'streaming', 'video', 'movie', 'podcast', 'media', 'tv', 'watch'],
    kids_education: ['education', 'learning', 'course', 'study', 'school', 'kids', 'quiz', 'lesson', 'child'],
    social_dating: ['social', 'dating', 'chat', 'message', 'community', 'network', 'friend', 'meet'],
    wellness_meditation: ['wellness', 'meditation', 'mental', 'sleep', 'therapy', 'mindful', 'calm', 'relax', 'health'],
    travel_adventure: ['travel', 'trip', 'vacation', 'destination', 'flight', 'hotel', 'booking', 'map', 'adventure'],
    developer_tech: ['developer', 'coding', 'programming', 'tech', 'api', 'code', 'terminal', 'git'],
    gaming: ['gaming', 'game', 'play', 'esport', 'arcade']
  };

  for (const [key, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => normalizedCategory.includes(kw))) {
      return professionalColors[key];
    }
  }

  // Try simple partial match as fallback
  for (const [key, palette] of Object.entries(professionalColors)) {
    if (key.includes(normalizedCategory) || normalizedCategory.includes(key.split('_')[0])) {
      return palette;
    }
  }

  // Default to productivity colors
  return professionalColors.productivity;
}

/**
 * Get a random primary color from a palette
 */
export function getRandomPrimaryColor(palette: ColorPalette): string {
  return palette.primary[Math.floor(Math.random() * palette.primary.length)];
}

/**
 * Get a random accent color from a palette
 */
export function getRandomAccentColor(palette: ColorPalette): string {
  return palette.accent[Math.floor(Math.random() * palette.accent.length)];
}
