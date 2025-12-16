import type { BackgroundSettings, ScreenshotSettings } from '../types';

export interface Template {
  id: string;
  name: string;
  category: 'minimal' | 'gradient' | 'dynamic' | 'neon' | 'soft' | 'bold' | 'nature' | 'glass' | '3d';
  preview: string; // CSS gradient for preview
  tags: string[];
  background: Partial<BackgroundSettings>;
  screenshot?: Partial<ScreenshotSettings>;
  text?: {
    headline?: {
      fontFamily?: string;
      fontWeight?: number;
      fontSize?: number;
      color?: string;
    };
    subheadline?: {
      fontFamily?: string;
      fontWeight?: number;
      fontSize?: number;
      color?: string;
    };
  };
}

export const TEMPLATES: Template[] = [
  // MINIMAL CATEGORY
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    category: 'minimal',
    preview: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
    tags: ['minimal', 'dark', 'clean', 'professional'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 180,
        stops: [
          { id: '1', color: '#0a0a0a', position: 0 },
          { id: '2', color: '#1a1a1a', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'SF Pro Display', fontWeight: 600, color: '#ffffff' },
      subheadline: { color: 'rgba(255,255,255,0.7)' },
    },
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    category: 'minimal',
    preview: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
    tags: ['minimal', 'light', 'clean', 'professional'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 180,
        stops: [
          { id: '1', color: '#ffffff', position: 0 },
          { id: '2', color: '#f5f5f7', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'SF Pro Display', fontWeight: 600, color: '#1d1d1f' },
      subheadline: { color: 'rgba(0,0,0,0.6)' },
    },
  },

  // GRADIENT CATEGORY
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    category: 'gradient',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['gradient', 'purple', 'vibrant', 'creative'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#667eea', position: 0 },
          { id: '2', color: '#764ba2', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Poppins', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'gradient',
    preview: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    tags: ['gradient', 'blue', 'cyan', 'fresh', 'calm'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#0093E9', position: 0 },
          { id: '2', color: '#80D0C7', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Inter', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    category: 'gradient',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['gradient', 'pink', 'red', 'warm', 'vibrant'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#f093fb', position: 0 },
          { id: '2', color: '#f5576c', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Poppins', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'midnight-city',
    name: 'Midnight City',
    category: 'gradient',
    preview: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    tags: ['gradient', 'dark', 'gray', 'professional', 'sleek'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#232526', position: 0 },
          { id: '2', color: '#414345', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'SF Pro Display', fontWeight: 600, color: '#ffffff' },
    },
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    category: 'gradient',
    preview: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
    tags: ['gradient', 'blue', 'purple', 'tech', 'vibrant'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#4776E6', position: 0 },
          { id: '2', color: '#8E54E9', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Inter', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'peach-sunset',
    name: 'Peach Sunset',
    category: 'gradient',
    preview: 'linear-gradient(135deg, #FFE5B4 0%, #FF6B6B 100%)',
    tags: ['gradient', 'peach', 'warm', 'soft', 'friendly'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#FFE5B4', position: 0 },
          { id: '2', color: '#FF6B6B', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Poppins', fontWeight: 600, color: '#1a1a1a' },
    },
  },

  // DYNAMIC CATEGORY
  {
    id: 'tilted-modern',
    name: 'Tilted Modern',
    category: 'dynamic',
    preview: 'linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    tags: ['dynamic', 'dark', 'modern', '3d-effect'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 160,
        stops: [
          { id: '1', color: '#0f0c29', position: 0 },
          { id: '2', color: '#302b63', position: 50 },
          { id: '3', color: '#24243e', position: 100 },
        ],
      },
    },
    screenshot: {
      rotation: -8,
      scale: 0.65,
    },
    text: {
      headline: { fontFamily: 'Montserrat', fontWeight: 800, color: '#ffffff' },
    },
  },
  {
    id: 'floating-card',
    name: 'Floating Card',
    category: 'dynamic',
    preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    tags: ['dynamic', 'green', 'fresh', 'floating'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#11998e', position: 0 },
          { id: '2', color: '#38ef7d', position: 100 },
        ],
      },
    },
    screenshot: {
      rotation: 5,
      scale: 0.6,
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.4)',
        blur: 60,
        offsetX: 0,
        offsetY: 30,
        spread: 0,
      },
    },
    text: {
      headline: { fontFamily: 'Poppins', fontWeight: 700, color: '#ffffff' },
    },
  },

  // NEON CATEGORY
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    category: 'neon',
    preview: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a2e 50%, #16213e 100%)',
    tags: ['neon', 'dark', 'cyberpunk', 'tech', 'glow'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#0f0f0f', position: 0 },
          { id: '2', color: '#1a0a2e', position: 50 },
          { id: '3', color: '#16213e', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Orbitron', fontWeight: 700, color: '#00f5ff' },
    },
  },
  {
    id: 'cyber-punk',
    name: 'Cyber Punk',
    category: 'neon',
    preview: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1a 100%)',
    tags: ['neon', 'cyberpunk', 'dark', 'futuristic'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#0a0a0a', position: 0 },
          { id: '2', color: '#1a1a2e', position: 50 },
          { id: '3', color: '#0f0f1a', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Rajdhani', fontWeight: 700, color: '#ff00ff' },
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    category: 'neon',
    preview: 'linear-gradient(180deg, #2b1055 0%, #7597de 50%, #ff6b6b 100%)',
    tags: ['neon', 'retro', 'synthwave', '80s', 'vibrant'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 180,
        stops: [
          { id: '1', color: '#2b1055', position: 0 },
          { id: '2', color: '#7597de', position: 50 },
          { id: '3', color: '#ff6b6b', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Audiowide', fontWeight: 400, color: '#ffffff' },
    },
  },

  // SOFT CATEGORY
  {
    id: 'velvet-nights',
    name: 'Velvet Nights',
    category: 'soft',
    preview: 'linear-gradient(135deg, #2c3e50 0%, #4a3f55 50%, #2c3e50 100%)',
    tags: ['soft', 'elegant', 'dark', 'premium'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#2c3e50', position: 0 },
          { id: '2', color: '#4a3f55', position: 50 },
          { id: '3', color: '#2c3e50', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Playfair Display', fontWeight: 600, color: '#f5f5f5' },
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    category: 'soft',
    preview: 'linear-gradient(135deg, #f4e2d8 0%, #ba8b7a 50%, #e8c4b8 100%)',
    tags: ['soft', 'rose', 'gold', 'elegant', 'feminine'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#f4e2d8', position: 0 },
          { id: '2', color: '#ba8b7a', position: 50 },
          { id: '3', color: '#e8c4b8', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Cormorant Garamond', fontWeight: 600, color: '#4a3728' },
    },
  },
  {
    id: 'pearl-essence',
    name: 'Pearl Essence',
    category: 'soft',
    preview: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 50%, #fdfbfb 100%)',
    tags: ['soft', 'light', 'pearl', 'elegant', 'clean'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#fdfbfb', position: 0 },
          { id: '2', color: '#ebedee', position: 50 },
          { id: '3', color: '#fdfbfb', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Lora', fontWeight: 600, color: '#2c3e50' },
    },
  },

  // BOLD CATEGORY
  {
    id: 'hot-lava',
    name: 'Hot Lava',
    category: 'bold',
    preview: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    tags: ['bold', 'red', 'orange', 'hot', 'energetic'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#f12711', position: 0 },
          { id: '2', color: '#f5af19', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Bebas Neue', fontWeight: 400, color: '#ffffff' },
    },
  },
  {
    id: 'electric-energy',
    name: 'Electric Energy',
    category: 'bold',
    preview: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)',
    tags: ['bold', 'blue', 'electric', 'energetic', 'tech'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#00d2ff', position: 0 },
          { id: '2', color: '#3a47d5', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Oswald', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'tropical-paradise',
    name: 'Tropical Paradise',
    category: 'bold',
    preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #ffd700 100%)',
    tags: ['bold', 'tropical', 'green', 'yellow', 'vibrant'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#11998e', position: 0 },
          { id: '2', color: '#38ef7d', position: 50 },
          { id: '3', color: '#ffd700', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Raleway', fontWeight: 800, color: '#ffffff' },
    },
  },

  // NATURE CATEGORY
  {
    id: 'forest-vibes',
    name: 'Forest Vibes',
    category: 'nature',
    preview: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    tags: ['nature', 'green', 'forest', 'calm', 'organic'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#134e5e', position: 0 },
          { id: '2', color: '#71b280', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Nunito', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'desert-sand',
    name: 'Desert Sand',
    category: 'nature',
    preview: 'linear-gradient(135deg, #c9b18c 0%, #e8d5b7 50%, #f5e6d3 100%)',
    tags: ['nature', 'desert', 'sand', 'warm', 'earthy'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#c9b18c', position: 0 },
          { id: '2', color: '#e8d5b7', position: 50 },
          { id: '3', color: '#f5e6d3', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Josefin Sans', fontWeight: 600, color: '#5a4a3a' },
    },
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    category: 'nature',
    preview: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    tags: ['nature', 'ocean', 'blue', 'water', 'calm'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#1a2980', position: 0 },
          { id: '2', color: '#26d0ce', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Quicksand', fontWeight: 700, color: '#ffffff' },
    },
  },

  // GLASS CATEGORY
  {
    id: 'frosted-glass',
    name: 'Frosted Glass',
    category: 'glass',
    preview: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
    tags: ['glass', 'frosted', 'blur', 'modern', 'ios'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#e0e5ec', position: 0 },
          { id: '2', color: '#f5f7fa', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'SF Pro Display', fontWeight: 600, color: '#1d1d1f' },
    },
  },
  {
    id: 'crystal-clear',
    name: 'Crystal Clear',
    category: 'glass',
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    tags: ['glass', 'crystal', 'pastel', 'soft', 'modern'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#a8edea', position: 0 },
          { id: '2', color: '#fed6e3', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Inter', fontWeight: 600, color: '#2d3436' },
    },
  },
  {
    id: 'prismatic',
    name: 'Prismatic',
    category: 'glass',
    preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    tags: ['glass', 'prismatic', 'pink', 'soft', 'dreamy'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 135,
        stops: [
          { id: '1', color: '#ff9a9e', position: 0 },
          { id: '2', color: '#fecfef', position: 50 },
          { id: '3', color: '#fecfef', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Poppins', fontWeight: 600, color: '#4a4a4a' },
    },
  },

  // 3D CATEGORY
  {
    id: 'layered-depth',
    name: 'Layered Depth',
    category: '3d',
    preview: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    tags: ['3d', 'depth', 'layers', 'dark', 'professional'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 180,
        stops: [
          { id: '1', color: '#1a1a2e', position: 0 },
          { id: '2', color: '#16213e', position: 50 },
          { id: '3', color: '#0f3460', position: 100 },
        ],
      },
    },
    screenshot: {
      rotation: -5,
      shadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.5)',
        blur: 80,
        offsetX: 0,
        offsetY: 40,
        spread: 0,
      },
    },
    text: {
      headline: { fontFamily: 'Montserrat', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'dimensional-space',
    name: 'Dimensional Space',
    category: '3d',
    preview: 'radial-gradient(ellipse at center, #2c3e50 0%, #1a1a2e 50%, #0a0a0f 100%)',
    tags: ['3d', 'space', 'dimensional', 'dark', 'futuristic'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'radial',
        angle: 0,
        stops: [
          { id: '1', color: '#2c3e50', position: 0 },
          { id: '2', color: '#1a1a2e', position: 50 },
          { id: '3', color: '#0a0a0f', position: 100 },
        ],
      },
    },
    text: {
      headline: { fontFamily: 'Space Grotesk', fontWeight: 700, color: '#ffffff' },
    },
  },
  {
    id: 'floating-layers',
    name: 'Floating Layers',
    category: '3d',
    preview: 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    tags: ['3d', 'floating', 'layers', 'vibrant', 'modern'],
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        angle: 145,
        stops: [
          { id: '1', color: '#667eea', position: 0 },
          { id: '2', color: '#764ba2', position: 50 },
          { id: '3', color: '#f093fb', position: 100 },
        ],
      },
    },
    screenshot: {
      rotation: 8,
      scale: 0.6,
      shadow: {
        enabled: true,
        color: 'rgba(102,126,234,0.4)',
        blur: 60,
        offsetX: 0,
        offsetY: 30,
        spread: 0,
      },
    },
    text: {
      headline: { fontFamily: 'Poppins', fontWeight: 700, color: '#ffffff' },
    },
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', count: TEMPLATES.length },
  { id: 'minimal', name: 'Minimal', count: TEMPLATES.filter(t => t.category === 'minimal').length },
  { id: 'gradient', name: 'Gradients', count: TEMPLATES.filter(t => t.category === 'gradient').length },
  { id: 'dynamic', name: 'Dynamic', count: TEMPLATES.filter(t => t.category === 'dynamic').length },
  { id: 'neon', name: 'Neon & Cyber', count: TEMPLATES.filter(t => t.category === 'neon').length },
  { id: 'soft', name: 'Soft & Elegant', count: TEMPLATES.filter(t => t.category === 'soft').length },
  { id: 'bold', name: 'Bold & Vibrant', count: TEMPLATES.filter(t => t.category === 'bold').length },
  { id: 'nature', name: 'Nature', count: TEMPLATES.filter(t => t.category === 'nature').length },
  { id: 'glass', name: 'Glass', count: TEMPLATES.filter(t => t.category === 'glass').length },
  { id: '3d', name: '3D Depth', count: TEMPLATES.filter(t => t.category === '3d').length },
];

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'all') return TEMPLATES;
  return TEMPLATES.filter(t => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id);
}

// Alias for convenience
export const templates = TEMPLATES;
