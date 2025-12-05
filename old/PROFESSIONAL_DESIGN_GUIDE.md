# ScreenGenius AI - Professional Design Excellence Guide

## Table of Contents
1. [Studio Background System](#studio-background-system)
2. [Professional Photography Integration](#professional-photography)
3. [Category-Specific Design Patterns](#category-patterns)
4. [Typography Mastery](#typography-mastery)
5. [Advanced Color Theory](#advanced-color-theory)
6. [Composition Excellence](#composition-excellence)
7. [AI Prompt Engineering (Deep Dive)](#ai-prompts-deep-dive)
8. [Production Quality Standards](#quality-standards)
9. [Real-World Examples Analysis](#examples-analysis)
10. [Implementation Code](#implementation-code)

---

# Studio Background System

## Philosophy: The Background IS the Brand

The most successful App Store screenshots use backgrounds as a branding and storytelling device, not just decoration.

### Background Categories (Based on Real Apps)

#### 1. **SOLID COLOR BLOCKS** (Most Professional)
Used by: Finance apps, Trading apps, Productivity apps

**Why it works**:
- Maximum text legibility
- Clean, professional appearance
- Fast to generate, zero AI failures
- Forces focus on app screenshots
- Premium, high-end aesthetic

**Implementation**:
```typescript
const solidColorBackgrounds = {
  // Single solid color
  'SOLID_PREMIUM': {
    type: 'solid',
    generate: (accentColor: string) => `
      background: ${accentColor};
      // Optional: subtle noise texture
      background-image:
        url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      background-blend-mode: overlay;
      opacity: 0.03;
    `,
    examples: ['Blue for finance', 'Orange for sports', 'Purple for social']
  },

  // Dual-color split
  'SPLIT_DIAGONAL': {
    type: 'dual-color',
    generate: (color1: string, color2: string) => `
      background: linear-gradient(
        135deg,
        ${color1} 0%,
        ${color1} 48%,
        ${color2} 52%,
        ${color2} 100%
      );
    `,
    useCases: 'Contrasting features, before/after'
  },

  // Color blocking (geometric)
  'GEOMETRIC_BLOCKS': {
    type: 'shapes',
    generate: (colors: string[]) => `
      // SVG with geometric colored shapes
      // Inspired by: Apple Fitness+, Nike SNKRS
    `
  }
};
```

**Color Strategy by Category**:
```typescript
const professionalColors = {
  'finance_trading': {
    primary: ['#3B82F6', '#1E40AF', '#0EA5E9'], // Blues for trust
    accent: ['#10B981', '#EF4444'], // Green profit, red loss
    mood: 'professional, trustworthy, data-driven'
  },
  'health_fitness': {
    primary: ['#8B5CF6', '#EC4899', '#F97316'], // Energetic purples/oranges
    accent: ['#10B981', '#FBBF24'],
    mood: 'energetic, motivating, vibrant'
  },
  'shopping_ecommerce': {
    primary: ['#EC4899', '#F97316', '#FBBF24'], // Vibrant, attention-grabbing
    accent: ['#8B5CF6', '#3B82F6'],
    mood: 'exciting, trendy, youthful'
  },
  'productivity': {
    primary: ['#3B82F6', '#8B5CF6', '#06B6D4'], // Calm, focused
    accent: ['#10B981', '#F59E0B'],
    mood: 'calm, focused, professional'
  },
  'entertainment_streaming': {
    primary: ['#1F2937', '#111827', '#000000'], // Dark, cinematic
    accent: ['#EF4444', '#F59E0B', '#8B5CF6'],
    mood: 'cinematic, immersive, premium'
  },
  'kids_education': {
    primary: ['#10B981', '#FBBF24', '#3B82F6'], // Playful, bright
    accent: ['#EC4899', '#F97316'],
    mood: 'playful, safe, educational'
  },
  'social_dating': {
    primary: ['#EC4899', '#F43F5E', '#8B5CF6'], // Romantic, exciting
    accent: ['#F97316', '#FBBF24'],
    mood: 'romantic, exciting, youthful'
  }
};
```

#### 2. **SUBTLE GRADIENTS** (Modern Premium)
Used by: Apple, Calm, Headspace, modern SaaS apps

**Types**:
```typescript
const gradientStyles = {
  // Mesh gradients (trending 2024-2025)
  'MESH_MODERN': {
    prompt: `
      Modern mesh gradient with 4-5 color stops
      Colors: ${color1}, ${color2}, ${color3}
      Style: Soft, blurred, organic shapes
      Inspiration: Apple iOS 18, macOS Sequoia
      Technical: SVG mesh, smooth interpolation
      Mood: Premium, modern, sophisticated
    `,
    cssImplementation: `
      background:
        radial-gradient(at 20% 30%, ${color1}40 0px, transparent 50%),
        radial-gradient(at 80% 60%, ${color2}40 0px, transparent 50%),
        radial-gradient(at 40% 80%, ${color3}40 0px, transparent 50%),
        linear-gradient(135deg, ${color1}20, ${color2}20);
    `
  },

  // Glass morphism
  'FROSTED_GLASS': {
    prompt: `
      Frosted glass effect with soft bokeh background
      Base color: ${primaryColor}
      Style: Blurred circular shapes, depth, layers
      Technical: Gaussian blur, transparency, light refraction
      Mood: Premium, clean, Apple-like
    `,
    implementation: 'Use backdrop-filter: blur() with layered semi-transparent shapes'
  },

  // Subtle two-tone
  'ELEGANT_FADE': {
    prompt: `
      Elegant two-tone gradient from ${color1} to ${color2}
      Direction: ${angle}deg
      Style: Smooth, subtle, no hard stops
      Add: Subtle grain texture (3% opacity)
      Mood: Sophisticated, professional, timeless
    `
  }
};
```

#### 3. **LIFESTYLE PHOTOGRAPHY** (Aspirational)
Used by: Shopping apps, Dating apps, Fitness apps

**Critical Success Factors**:
- **Professional model**: Well-lit, high production value
- **Neutral background**: Doesn't compete with phone UI
- **Confident pose**: Person holding phone naturally
- **Eye contact**: Direct gaze builds trust
- **Proper lighting**: Studio quality, no harsh shadows

**Gemini Prompt Template**:
```typescript
const lifestylePhotoPrompt = `
STYLE: Professional commercial photography, shot on Canon EOS R5, 85mm f/1.4

SUBJECT:
- ${demographicDescription} (age ${age}, ${gender}, ${ethnicity})
- Dressed in ${clothingStyle}
- Holding iPhone 16 Pro naturally at ${angle}
- Expression: ${emotion} (confident, happy, focused, etc.)
- Looking ${direction} (at camera, at phone, off-camera)

SETTING:
- Location: ${environment} (studio with ${backgroundColor} backdrop, modern office, outdoor park, etc.)
- Lighting: Professional studio lighting, ${lightingStyle}
- Depth of field: f/1.8, subject sharp, background ${blurLevel}% blur
- Camera angle: ${cameraAngle} (straight on, slight up-angle for confidence, slight down-angle for approachability)

COMPOSITION:
- Rule of thirds: Subject positioned at ${position}
- Negative space: ${spacing}% for text overlay at ${textPosition}
- Phone screen visible: ${screenVisibility}%
- Headroom: Adequate space above subject
- Background: ${backgroundColor} solid color, clean, minimal

MOOD: ${mood} (professional, aspirational, relatable, energetic, calm)

QUALITY:
- Resolution: 4K minimum
- Commercial use: Yes
- Retouch: Natural, minimal
- Color grading: ${colorGrading} (warm, cool, neutral, cinematic)

TECHNICAL SPECS:
- Aspect ratio: 9:16 (portrait)
- Format: PNG with transparency if possible
- Lighting setup: 3-point lighting (key, fill, rim)
- No harsh shadows on face
- Even skin tone
- Professional makeup and styling

AVOID:
- Stock photo look (too posed, fake smile)
- Harsh overhead lighting
- Busy backgrounds that compete
- Unflattering angles
- Low resolution
- Dated fashion/hairstyles
- Generic office settings
`;
```

**When to Use Each Type**:
```typescript
const backgroundSelection = {
  'finance': 'SOLID_PREMIUM or LIFESTYLE_PROFESSIONAL',
  'fitness': 'LIFESTYLE_ENERGETIC or GRADIENT_VIBRANT',
  'dating': 'LIFESTYLE_APPROACHABLE with warm tones',
  'productivity': 'SOLID_CALM or MINIMAL_GRADIENT',
  'shopping': 'LIFESTYLE_STYLISH or VIBRANT_BLOCKS',
  'entertainment': 'DARK_CINEMATIC or CONTENT_FOCUSED',
  'kids': 'ILLUSTRATED_PLAYFUL or BRIGHT_GRADIENTS',
  'health': 'CALM_GRADIENTS or NATURE_INSPIRED'
};
```

---

# Professional Photography Integration

## Human Models in App Screenshots

### Why Top Apps Use People

**Psychology**:
- Builds trust and relatability
- Shows real-world usage context
- Creates emotional connection
- Demonstrates target demographic
- Higher engagement and conversion

### Model Selection Guidelines

```typescript
interface ModelSpecifications {
  demographics: {
    age: string; // "25-35" for tech-savvy demographic
    gender: string; // Match target audience or use diverse representation
    ethnicity: string; // Diverse and inclusive
    bodyType: string; // Realistic, not just fashion models
  };

  styling: {
    clothing: string; // "Business casual", "Athleisure", "Streetwear", etc.
    grooming: string; // "Well-groomed, professional" or "Casual, approachable"
    accessories: string; // Minimal, don't distract from app
  };

  pose: {
    phonePosition: string; // "Mid-chest height, screen visible to camera"
    bodyAngle: string; // "Slight 3/4 turn" or "Direct frontal"
    gaze: string; // "Camera", "Phone screen", "Off-camera (aspirational)"
    expression: string; // "Confident smile", "Focused", "Joyful"
    hands: string; // "Natural phone grip", "Gesture explaining feature"
  };

  setting: {
    location: string;
    backgroundTreatment: string; // "Solid color backdrop" or "Blurred environment"
    props: string[]; // Minimal, relevant only
  };
}
```

### Lighting Setups for Different Moods

```typescript
const lightingSetups = {
  'CORPORATE_PROFESSIONAL': {
    description: 'Finance, B2B, Productivity apps',
    setup: `
      - Key light: Soft, 45° angle, creates subtle shadow for dimension
      - Fill light: Low power, fills shadows without flattening
      - Rim light: Separates subject from background
      - Background light: Even, no hot spots
    `,
    mood: 'Trustworthy, competent, professional',
    colorTemp: '5500K (neutral daylight)'
  },

  'LIFESTYLE_WARM': {
    description: 'Social, Dating, Lifestyle apps',
    setup: `
      - Key light: Soft, slightly overhead (beauty lighting)
      - Warm gel: 3200K for golden-hour feel
      - Fill: Bounce card, natural
      - Background: Gradient from warm to cool
    `,
    mood: 'Approachable, friendly, inviting',
    colorTemp: '3200-4000K (warm)'
  },

  'ENERGETIC_DYNAMIC': {
    description: 'Fitness, Sports, Gaming apps',
    setup: `
      - Key light: Harder, more contrast
      - Color gels: Blue or purple accents
      - Rim light: Strong, creates edge definition
      - Background: Bold color, high saturation
    `,
    mood: 'Energetic, exciting, powerful',
    colorTemp: '6500K+ (cool, energetic)'
  },

  'CALM_SERENE': {
    description: 'Meditation, Health, Wellness apps',
    setup: `
      - Key light: Very soft, diffused
      - Even lighting: Minimal shadows
      - Pastel backdrop: Soft colors
      - Natural: Mimics soft window light
    `,
    mood: 'Calm, peaceful, trustworthy',
    colorTemp: '5000K (neutral to slightly warm)'
  }
};
```

---

# Category-Specific Design Patterns

## Analyzed Patterns from Top Apps

### 1. Finance & Trading Apps

**Visual Pattern**:
```typescript
const financePattern = {
  background: {
    type: 'SOLID_COLOR or PROFESSIONAL_PORTRAIT',
    colors: ['Deep Blue #1E40AF', 'Professional Navy #1E3A8A', 'Trust Blue #3B82F6'],
    style: 'Clean, minimal, no distractions'
  },

  typography: {
    headline: {
      size: 'LARGE (72-96px)',
      weight: 900,
      style: 'Bold, confident, clear',
      color: 'White or high contrast',
      font: 'Sans-serif (Inter, SF Pro, Neue Montreal)'
    },
    subheading: {
      size: 'MEDIUM (24-32px)',
      weight: 400,
      style: 'Clear, explanatory',
      maxWords: 8
    }
  },

  layout: {
    phonePosition: 'Center or slight offset',
    phoneSize: 'Large (60-70% of frame height)',
    textPlacement: 'Top or left',
    floatingElements: 'Data cards, stock tickers, charts',
    whitespace: 'Generous, professional'
  },

  mood: 'Trustworthy, data-driven, professional, confident',

  examples: [
    'Robinhood: Clean blue backgrounds, bold white text, clear charts',
    'Coinbase: Minimal, data-focused, blue accent',
    'Webull: Dark theme, trading data, professional'
  ]
};
```

**Gemini Prompt for Finance**:
```text
Create a professional App Store screenshot background for a ${financeAppType} app

BACKGROUND STYLE:
- Solid color: Deep professional blue (#1E40AF)
- OR: Professional studio portrait
  - Subject: Confident professional (30-40 years old)
  - Dressed in: Business attire (suit or smart casual)
  - Setting: Neutral studio backdrop, professional lighting
  - Holding: iPhone naturally at mid-chest level
  - Expression: Confident, trustworthy, competent
  - Lighting: Soft professional studio lighting, no harsh shadows

LAYOUT ZONES:
- Top 30%: Bold headline text placement
- Center 50%: Phone screenshot (visible trading/finance UI)
- Bottom 20%: Subheading or data visualization

MOOD: Trustworthy, professional, data-driven, premium
COLOR PALETTE: Blues, whites, subtle greens (profit), minimal reds
AVOID: Playful elements, casual aesthetics, busy patterns

OUTPUT: Clean, professional, conversion-optimized App Store screenshot background
```

### 2. Shopping & E-Commerce Apps

**Visual Pattern**:
```typescript
const shoppingPattern = {
  background: {
    type: 'VIBRANT_COLOR_BLOCKS or LIFESTYLE_MODEL',
    colors: [
      'Hot Pink #EC4899',
      'Electric Orange #F97316',
      'Bold Yellow #FBBF24',
      'Purple #8B5CF6'
    ],
    style: 'Bold, energetic, eye-catching'
  },

  typography: {
    headline: {
      style: 'BOLD, ALL CAPS, ITALIC (dynamic)',
      size: 'EXTRA LARGE (80-120px)',
      treatment: 'Outlined text, shadows, 3D effects',
      personality: 'Energetic, urgent, exciting'
    }
  },

  layout: {
    phonePosition: 'Tilted, dynamic angles',
    multiplePhones: 'Often shows 2-3 phones for feature comparison',
    decorativeElements: 'Stars, badges, sale tags, sparkles',
    peopleInShots: '50% use lifestyle photography of models shopping'
  },

  mood: 'Exciting, trendy, FOMO-inducing, youthful',

  examples: [
    'ASOS: Bold text, vibrant colors, model holding phone',
    'Depop: Playful, colorful, lifestyle imagery',
    'Poshmark: Clean product focus with accent colors'
  ]
};
```

### 3. Fitness & Health Apps

**Visual Pattern**:
```typescript
const fitnessPattern = {
  background: {
    type: 'GRADIENT_ENERGETIC or LIFESTYLE_ACTION',
    gradients: [
      'Purple to Pink (#8B5CF6 → #EC4899)',
      'Orange to Red (#F97316 → #EF4444)',
      'Blue to Purple (#3B82F6 → #8B5CF6)'
    ],
    or: 'Athletic person in action, gym environment, outdoor fitness'
  },

  typography: {
    headline: {
      style: 'BOLD, motivational language',
      examples: [
        'CRUSH YOUR GOALS',
        'TRANSFORM YOUR BODY',
        'GET STRONGER DAILY'
      ],
      size: 'Large, impactful',
      color: 'High contrast white'
    }
  },

  layout: {
    phonePosition: 'Often at angle showing workout data',
    wearables: 'Include Apple Watch for ecosystem',
    dataVisualization: 'Charts, progress rings, stats',
    people: 'Active, in workout clothes, energetic poses'
  },

  mood: 'Motivating, energetic, transformative, empowering',

  examples: [
    'Nike Training: Bold gradients, athletic models, empowering text',
    'Strava: Data-focused with outdoor imagery',
    'Peloton: High-energy, community-focused'
  ]
};
```

### 4. Entertainment & Streaming Apps

**Visual Pattern**:
```typescript
const streamingPattern = {
  background: {
    type: 'DARK_CINEMATIC or CONTENT_SHOWCASE',
    colors: ['#111827', '#1F2937', '#000000'],
    accent: ['#EF4444', '#F59E0B', '#8B5CF6'],
    style: 'Dark, immersive, content is the hero'
  },

  typography: {
    headline: {
      style: 'BOLD, attention-grabbing',
      size: 'HUGE (100-140px)',
      examples: [
        'WATCH',
        'STREAM',
        'BINGE',
        'LIVE'
      ],
      treatment: 'Often yellow/gold, high contrast on dark'
    }
  },

  layout: {
    phonePosition: 'Center, straight-on (like a TV screen)',
    contentShowcase: 'Movie posters, show thumbnails visible in UI',
    floating Elements: 'Play buttons, watch icons, star ratings',
    multipleScreens: 'Sometimes 2-3 phones showing different content'
  },

  mood: 'Cinematic, immersive, entertainment-focused, binge-worthy',

  examples: [
    'Netflix: Dark backgrounds, content thumbnails, red accents',
    'Disney+: Blue brand color, magical feel, content showcase',
    'Hulu: Green accent, bold typography, dark theme'
  ]
};
```

### 5. Social & Messaging Apps

**Visual Pattern**:
```typescript
const socialPattern = {
  background: {
    type: 'VIBRANT_GRADIENTS or LIFESTYLE_CONNECTION',
    colors: 'Brand colors (varies widely)',
    style: 'Youthful, playful, connected'
  },

  typography: {
    headline: {
      style: 'Friendly, conversational',
      examples: [
        'Connect',
        'Share',
        'Chat',
        'Meet'
      ],
      personality: 'Approachable, not corporate'
    }
  },

  layout: {
    phonePosition: 'Often showing messaging UI clearly',
    people: 'Friend groups, diverse representation, casual settings',
    uiElements: 'Chat bubbles, profile pics, reaction emojis',
    multiplePhones: 'Show conversation across devices'
  },

  mood: 'Connected, friendly, FOMO-driven, social',

  examples: [
    'WhatsApp: Green brand color, clean, messaging-focused',
    'Discord: Purple, gaming-adjacent, community feel',
    'Telegram: Blue, clean, security-focused'
  ]
};
```

### 6. Kids & Education Apps

**Visual Pattern**:
```typescript
const kidsPattern = {
  background: {
    type: 'ILLUSTRATED or BRIGHT_GRADIENTS',
    colors: [
      'Bright Green #10B981',
      'Sunny Yellow #FBBF24',
      'Sky Blue #3B82F6',
      'Playful Purple #8B5CF6'
    ],
    illustrations: 'Friendly characters, educational themes, playful elements'
  },

  typography: {
    headline: {
      style: 'Rounded, friendly fonts',
      examples: [
        'Learn & Play',
        'Discover',
        'Explore'
      ],
      treatment: 'Colorful, outlined, bubbly'
    }
  },

  layout: {
    phonePosition: 'Central, often straight-on',
    decorative: 'Characters, stars, educational icons',
    safety: 'Parent-approved messaging, safe design',
    simplicity: 'Not cluttered, clear value proposition'
  },

  mood: 'Playful, safe, educational, engaging',

  examples: [
    'ABCmouse: Bright, character-driven, educational',
    'Khan Academy Kids: Friendly, illustrated, approachable',
    'Duolingo: Bright green, mascot-driven, gamified'
  ]
};
```

---

# Typography Mastery

## Text Hierarchy System

```typescript
interface TypographySystem {
  headline: {
    // Main message - the "hook"
    fontSize: '72-120px', // Varies by message length
    fontWeight: 900, // Extra bold
    lineHeight: 0.9, // Tight for impact
    letterSpacing: '-0.02em', // Slight negative tracking
    textTransform: 'varies', // ALL CAPS for urgency, Title Case for sophistication
    maxCharacters: 25, // Keep it punchy
    treatment: {
      shadow: 'Subtle depth shadow',
      stroke: 'Optional outline for contrast',
      gradient: 'Premium apps use gradient fills'
    }
  },

  subheadline: {
    // Supporting message - the "explanation"
    fontSize: '24-36px',
    fontWeight: 400, // Regular or medium
    lineHeight: 1.2,
    letterSpacing: '0',
    maxCharacters: 60,
    color: 'Often 70-80% opacity of headline',
    treatment: 'Minimal, focuses on clarity'
  },

  accentText: {
    // Call-to-action or badge
    fontSize: '14-18px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    treatment: 'Often in a pill/badge shape'
  }
}
```

## Font Pairing Guidelines

```typescript
const fontPairings = {
  'MODERN_CLEAN': {
    headline: 'Inter, SF Pro Display, Neue Montreal',
    body: 'Inter, SF Pro Text',
    mood: 'Modern, tech-forward, clean',
    usedBy: 'SaaS, productivity, finance apps'
  },

  'BOLD_IMPACT': {
    headline: 'Druk, Oswald, Bebas Neue, Impact',
    body: 'Inter, Helvetica',
    mood: 'Strong, confident, attention-grabbing',
    usedBy: 'Fitness, sports, gaming apps'
  },

  'EDITORIAL_SERIF': {
    headline: 'Playfair Display, Merriweather, Lora',
    body: 'Lato, Open Sans',
    mood: 'Sophisticated, premium, editorial',
    usedBy: 'Luxury, lifestyle, publishing apps'
  },

  'ROUNDED_FRIENDLY': {
    headline: 'Montserrat, Nunito, Quicksand',
    body: 'Nunito, Quicksand',
    mood: 'Friendly, approachable, warm',
    usedBy: 'Kids, health, social apps'
  },

  'GEOMETRIC_MODERN': {
    headline: 'Futura, Avenir Next, Gotham',
    body: 'Avenir, Gotham',
    mood: 'Geometric, modern, premium',
    usedBy: 'Design, fashion, architecture apps'
  }
};
```

## Text Treatment Effects

```typescript
const textEffects = {
  // Shadow for depth and legibility
  'SOFT_DEPTH': `
    text-shadow:
      0 2px 4px rgba(0,0,0,0.1),
      0 4px 12px rgba(0,0,0,0.08);
  `,

  // Strong shadow for impact on busy backgrounds
  'STRONG_CONTRAST': `
    text-shadow:
      0 0 20px rgba(0,0,0,0.8),
      0 4px 8px rgba(0,0,0,0.6),
      0 2px 4px rgba(0,0,0,0.5);
  `,

  // Glow effect for dark backgrounds
  'GLOW': `
    text-shadow:
      0 0 40px rgba(255,255,255,0.4),
      0 0 20px rgba(255,255,255,0.3),
      0 2px 4px rgba(0,0,0,0.5);
  `,

  // Outline/stroke for maximum contrast
  'OUTLINE': `
    -webkit-text-stroke: 2px #000;
    text-stroke: 2px #000;
    // With paint-order for better rendering
    paint-order: stroke fill;
  `,

  // Gradient fill (premium effect)
  'GRADIENT_FILL': `
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,

  // Frosted glass background for text
  'GLASS_MORPHISM': `
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 24px 32px;
  `
};
```

## Dynamic Text Sizing

```typescript
function calculateOptimalTextSize(
  text: string,
  containerWidth: number,
  containerHeight: number
): { fontSize: number, lineHeight: number } {
  const charCount = text.length;
  const wordCount = text.split(' ').length;

  // Shorter = bigger
  if (charCount <= 15) {
    return { fontSize: 120, lineHeight: 0.9 };
  } else if (charCount <= 25) {
    return { fontSize: 96, lineHeight: 0.95 };
  } else if (charCount <= 40) {
    return { fontSize: 72, lineHeight: 1.0 };
  } else {
    return { fontSize: 56, lineHeight: 1.1 };
  }
}

function optimizeTextForReadability(
  text: string,
  backgroundColor: string
): TextStyle {
  const bgLuminance = calculateLuminance(backgroundColor);

  return {
    color: bgLuminance > 0.5 ? '#000000' : '#FFFFFF',
    shadow: bgLuminance > 0.5
      ? '0 1px 2px rgba(255,255,255,0.8)' // Light bg - light shadow
      : '0 2px 8px rgba(0,0,0,0.6)', // Dark bg - dark shadow
    stroke: bgLuminance > 0.3 && bgLuminance < 0.7
      ? '1px rgba(0,0,0,0.3)' // Mid-tone bg needs stroke
      : 'none'
  };
}
```

---

# Advanced Color Theory

## Color Psychology by App Category

```typescript
const colorPsychology = {
  'finance_trust': {
    primary: 'Blue',
    psychology: 'Trust, stability, professionalism',
    saturation: 'Medium (50-70%)',
    lightness: 'Medium to dark (30-50%)',
    accents: 'Green (growth), Gold (premium)',
    avoid: 'Bright reds (anxiety), pastels (unprofessional)'
  },

  'health_wellness': {
    primary: 'Green, Blue, Purple',
    psychology: 'Health, calm, growth, spirituality',
    saturation: 'Low to medium (30-60%)',
    lightness: 'Light to medium (50-70%)',
    accents: 'Teal, lavender',
    avoid: 'Harsh reds, neon colors'
  },

  'shopping_excitement': {
    primary: 'Pink, Orange, Yellow',
    psychology: 'Excitement, energy, urgency, youth',
    saturation: 'High (70-95%)',
    lightness: 'Medium to bright (50-80%)',
    accents: 'Purple, magenta, lime',
    avoid: 'Dull grays, muted tones'
  },

  'productivity_focus': {
    primary: 'Blue, Gray, Teal',
    psychology: 'Focus, calm, efficiency, clarity',
    saturation: 'Low to medium (30-60%)',
    lightness: 'Any',
    accents: 'Orange (action), green (completion)',
    avoid: 'Hot pinks, harsh contrasts'
  },

  'entertainment_immersive': {
    primary: 'Dark backgrounds (black, deep blue, purple)',
    psychology: 'Immersion, premium, cinematic',
    saturation: 'Varies',
    lightness: 'Dark (10-30%) for backgrounds',
    accents: 'Bright accent colors for CTAs',
    avoid: 'Bright backgrounds (reduces immersion)'
  },

  'kids_playful': {
    primary: 'Bright primary colors (RGB)',
    psychology: 'Playful, energetic, educational, safe',
    saturation: 'High (80-100%)',
    lightness: 'Bright (60-80%)',
    accents: 'All rainbow colors',
    avoid: 'Dark, muted, sophisticated palettes'
  },

  'luxury_premium': {
    primary: 'Black, Gold, Deep Purple, Burgundy',
    psychology: 'Exclusivity, luxury, sophistication',
    saturation: 'Low (10-30%) or metallic',
    lightness: 'Dark (10-30%) or metallic',
    accents: 'Gold, rose gold, silver',
    avoid: 'Bright primaries, pastels'
  }
};
```

## Color Harmony Systems

```typescript
const colorHarmony = {
  // Single color with tints/shades
  'MONOCHROMATIC': {
    base: '#3B82F6', // Blue
    generate: () => [
      '#1E40AF', // Darker
      '#3B82F6', // Base
      '#60A5FA', // Lighter
      '#DBEAFE'  // Very light
    ],
    usedFor: 'Professional, focused, cohesive',
    example: 'Finance apps, productivity tools'
  },

  // Opposite on color wheel
  'COMPLEMENTARY': {
    base: '#3B82F6', // Blue
    complement: '#F97316', // Orange
    usedFor: 'High contrast, energetic, attention-grabbing',
    example: 'Sports apps, CTAs, sale promotions'
  },

  // Three colors evenly spaced
  'TRIADIC': {
    colors: ['#3B82F6', '#F97316', '#8B5CF6'], // Blue, Orange, Purple
    usedFor: 'Vibrant, playful, balanced variety',
    example: 'Kids apps, creative tools, social apps'
  },

  // Two pairs of complements
  'TETRADIC': {
    colors: ['#3B82F6', '#F97316', '#10B981', '#EF4444'],
    usedFor: 'Maximum variety, feature differentiation',
    example: 'Dashboard apps, data visualization'
  },

  // Adjacent colors on wheel
  'ANALOGOUS': {
    base: '#3B82F6', // Blue
    generate: () => ['#8B5CF6', '#3B82F6', '#06B6D4'], // Purple-Blue-Cyan
    usedFor: 'Harmonious, calming, cohesive',
    example: 'Wellness apps, meditation, reading'
  }
};
```

## Accessibility Considerations

```typescript
function ensureContrast(
  textColor: string,
  backgroundColor: string,
  level: 'AA' | 'AAA' = 'AA'
): { passes: boolean, ratio: number, suggestion?: string } {
  const ratio = calculateContrastRatio(textColor, backgroundColor);
  const requiredRatio = level === 'AAA' ? 7 : 4.5;

  if (ratio >= requiredRatio) {
    return { passes: true, ratio };
  }

  // Auto-adjust
  const adjustedColor = adjustForContrast(textColor, backgroundColor, requiredRatio);
  return {
    passes: false,
    ratio,
    suggestion: adjustedColor
  };
}

// Example usage in text generation
function generateTextWithContrast(
  text: string,
  backgroundColor: string
): { color: string, shadow: string } {
  const bgLuminance = calculateLuminance(backgroundColor);
  let textColor = bgLuminance > 0.5 ? '#000000' : '#FFFFFF';

  const { passes, suggestion } = ensureContrast(textColor, backgroundColor, 'AA');
  if (!passes && suggestion) {
    textColor = suggestion;
  }

  return {
    color: textColor,
    shadow: bgLuminance > 0.5
      ? '0 1px 2px rgba(255,255,255,0.8)'
      : '0 2px 4px rgba(0,0,0,0.5)'
  };
}
```

---

# Composition Excellence

## Layout Principles from Real Apps

### The "Golden Section" Layout
```typescript
const goldenRatioLayout = {
  description: 'Based on Fibonacci sequence (1:1.618)',
  phonePosition: {
    x: '38.2%', // Golden ratio point
    y: '50%',
    size: '61.8%' // Of container height
  },
  textZone: {
    x: '0-35%', // Left third
    y: '20-80%',
    alignment: 'left'
  },
  visualFlow: 'Left (text) → Right (phone) → Natural reading pattern',
  usedBy: 'Premium apps, design-focused brands'
};
```

### The "Z-Pattern" Layout
```typescript
const zPatternLayout = {
  description: 'Guides eye in Z shape - optimal for western readers',
  flow: [
    '1. Headline (top left)',
    '2. Phone visual (top right)',
    '3. Supporting text (middle left)',
    '4. CTA or badge (bottom right)'
  ],
  phonePosition: {
    x: '60-70%',
    y: '30-40%',
    rotation: '-5 to -8 degrees' // Adds dynamism
  },
  effectiveness: 'Highest conversion rates according to eye-tracking studies'
};
```

### The "Centered Hero" Layout
```typescript
const centeredHeroLayout = {
  description: 'Phone as the absolute hero, minimal text',
  phonePosition: {
    x: '50%',
    y: '50%',
    size: '75%', // Massive
    rotation: '0deg' // Straight, like a TV screen
  },
  textPlacement: 'Top 10% or bottom 10%',
  whitespace: 'Maximum',
  usedBy: 'Streaming apps, content-first apps',
  mood: 'Cinematic, immersive, content-is-everything'
};
```

### The "Multi-Device Showcase"
```typescript
const multiDeviceLayout = {
  description: 'Shows ecosystem across iPhone + iPad/Watch',
  arrangement: {
    primary: {
      device: 'iPhone',
      position: { x: '40%', y: '50%' },
      size: 'Large',
      zIndex: 2
    },
    secondary: {
      device: 'iPad or Apple Watch',
      position: { x: '70%', y: '60%' },
      size: 'Smaller (60% of primary)',
      zIndex: 1,
      rotation: '-10deg' // Adds depth
    }
  },
  shadows: 'Layered shadows to show depth',
  usedBy: 'Apps with ecosystem (fitness, productivity)'
};
```

## Visual Hierarchy Techniques

```typescript
const hierarchyTechniques = {
  '1_SIZE': {
    rule: 'Bigger = more important',
    implementation: {
      headline: '100px',
      subheadline: '32px',
      body: '18px'
    },
    ratio: '1 : 0.32 : 0.18' // Dramatic scale difference
  },

  '2_COLOR': {
    rule: 'High contrast = high importance',
    implementation: {
      primary: 'Full opacity #FFFFFF',
      secondary: '70% opacity rgba(255,255,255,0.7)',
      tertiary: '50% opacity rgba(255,255,255,0.5)'
    }
  },

  '3_POSITION': {
    rule: 'Top-left = first seen (western culture)',
    order: ['Top-left', 'Top-right', 'Center', 'Bottom-left', 'Bottom-right']
  },

  '4_WEIGHT': {
    rule: 'Heavier weight = more authority',
    implementation: {
      headline: 900, // Black
      subheadline: 500, // Medium
      body: 400 // Regular
    }
  },

  '5_WHITESPACE': {
    rule: 'More space around = more important',
    implementation: {
      headline: '60px margin on all sides',
      subheadline: '24px margin',
      body: '12px margin'
    }
  }
};
```

## Focal Point Engineering

```typescript
function createFocalPoint(
  elements: Element[]
): { focalPoint: Point, visualPath: Point[] } {
  // Calculate visual center using Gestalt principles
  const focalPoint = calculateVisualCenter(elements);

  // Create eye movement path
  const visualPath = [
    elements.find(e => e.type === 'headline').position, // Start
    focalPoint, // Main focus
    elements.find(e => e.type === 'phone').position, // Product
    elements.find(e => e.type === 'cta').position // Action
  ];

  return { focalPoint, visualPath };
}

// Visual weight calculation
function calculateVisualWeight(element: Element): number {
  let weight = 0;

  // Size contributes most
  weight += element.size * 0.4;

  // Contrast
  weight += element.contrast * 0.3;

  // Color saturation (bright = heavier)
  weight += element.saturation * 0.2;

  // Position (top/left = heavier)
  weight += (1 - (element.y / containerHeight)) * 0.1;

  return weight;
}
```

---

# AI Prompt Engineering (Deep Dive)

## Master Prompt Framework

```typescript
const masterPromptFramework = `
# ROLE & EXPERTISE
You are an award-winning App Store creative director with 15+ years experience.
Your work has achieved:
- 300%+ improvement in app store conversion rates
- Featured in Apple's "Apps We Love"
- 50+ industry awards for visual design
- Expertise in ${appCategory} category specifically

# CURRENT PROJECT CONTEXT
App Name: "${appName}"
Category: ${appCategory}
Target Audience: ${targetDemographic}
Core Value: ${uniqueValueProposition}
Competitor Analysis: ${topCompetitors}
Brand Personality: ${brandPersonality}

# DESIGN BRIEF FOR SCREENSHOT ${slideNumber}/${totalSlides}
Primary Goal: ${slideGoal}
Key Feature: ${featureToHighlight}
Target Emotion: ${emotionalTrigger}
User Pain Point: ${problemSolved}

# VISUAL SPECIFICATIONS

## Background
Type: ${backgroundType}
${backgroundType === 'SOLID_COLOR' ? `
  Color: ${primaryColor}
  Treatment: Professional solid color with subtle ${texture}
  Mood: ${mood}
` : backgroundType === 'LIFESTYLE_PHOTO' ? `
  Subject: ${subjectDescription}
  Setting: ${environment}
  Lighting: Professional studio, ${lightingStyle}
  Pose: ${poseDescription}
  Expression: ${emotion}
  Wardrobe: ${clothing}
  Props: ${props}
  Camera: Shot on ${camera}, ${lens}, f/${aperture}
  Color Grading: ${colorGrading}
` : backgroundType === 'GRADIENT' ? `
  Colors: ${color1} → ${color2}
  Direction: ${gradientAngle}
  Style: ${gradientStyle}
  Effects: ${additionalEffects}
` : ''}

## Typography
Headline: "${headlineText}"
- Font: ${headlineFont}
- Size: ${headlineSize}px
- Weight: ${headlineWeight}
- Color: ${headlineColor}
- Effects: ${textEffects}
- Position: ${textPosition}

Subheadline: "${subheadlineText}"
- Font: ${subheadFont}
- Size: ${subheadSize}px
- Weight: ${subheadWeight}
- Color: ${subheadColor} (${subheadOpacity}% opacity)

## Layout
Phone Position: ${phonePosition}
Phone Angle: ${phoneRotation}°
Phone Size: ${phoneSize}% of frame
Layout System: ${layoutSystem}
White Space: ${whitespaceAmount}

## Floating Elements
${floatingElements.map(elem => `
- ${elem.type}: "${elem.content}"
  Position: (${elem.x}%, ${elem.y}%)
  Style: ${elem.style}
  Shadow: ${elem.shadow}
`).join('\n')}

# QUALITY STANDARDS
Resolution: 4K (3840 x 2160px minimum)
File Format: PNG with transparency support
Color Profile: sRGB
Text Legibility: Must be readable at 476x847px (App Store thumbnail)
Contrast Ratio: Minimum WCAG AA (4.5:1)
Brand Consistency: Must align with ${brandGuidelines}

# STYLE REFERENCES
Visual Mood: ${moodBoard}
Similar Successful Apps: ${successfulExamples}
Design System: ${designSystem}
Avoid: ${avoidanceList}

# PSYCHOLOGICAL TRIGGERS
Desired User Reaction: "${userReaction}"
Trust Signals: ${trustElements}
FOMO Elements: ${urgencyElements}
Social Proof: ${socialProofElements}

# TECHNICAL CONSTRAINTS
Apple Guidelines: Compliant
App Store Category: ${appStoreCategory}
Age Rating: ${ageRating}
Localization: ${supportedLanguages}

# OUTPUT REQUIREMENTS
Generate a professional App Store screenshot background that:

1. VISUAL IMPACT
   - Immediately communicates "${coreMessage}"
   - Evokes ${targetEmotion}
   - Stands out in App Store grid view
   - Professional, premium quality

2. BRAND ALIGNMENT
   - Matches brand personality: ${brandTraits}
   - Uses brand colors effectively
   - Consistent with app identity
   - Target demographic appeal

3. CONVERSION OPTIMIZATION
   - Clear value proposition visible in <3 seconds
   - High contrast for text legibility
   - Strategic use of whitespace
   - Guides eye to key information

4. TECHNICAL EXCELLENCE
   - Print-quality resolution
   - Proper color management
   - Optimized file size
   - Platform-appropriate format

# FINAL CHECK
Before generating, ensure:
✓ Message is crystal clear
✓ Target audience will relate
✓ Stands out from competitors
✓ Professional execution
✓ Conversion-optimized
✓ Brand-aligned
✓ Technically perfect

Now, generate the background with these exact specifications.
`;
```

## Category-Specific Prompt Templates

### Finance App Prompt
```typescript
const financeAppPrompt = `
Generate a professional App Store screenshot background for a ${financeSubCategory} app.

BACKGROUND STYLE:
${userSelectedStyle === 'professional_portrait' ? `
Professional studio portrait photography:
- Subject: Confident ${age} year old ${gender} professional
- Wardrobe: ${businessAttire}
- Setting: Neutral ${backgroundColor} studio backdrop
- Lighting: Soft 3-point studio lighting (no harsh shadows)
- Pose: Holding iPhone at mid-chest, screen visible
- Expression: Confident, trustworthy, competent (slight smile)
- Gaze: ${gazeDirection}
- Camera: Shot on Canon EOS R5, 85mm f/1.4, depth of field
- Color grading: Professional, slightly cool tone
- Retouching: Natural, minimal, professional
` : `
Solid professional color background:
- Color: ${trustBlue} (professional trust blue)
- Treatment: Ultra-clean, minimal
- Texture: Subtle noise overlay (2% opacity) for premium feel
- Optional: Minimal geometric pattern (10% opacity)
`}

MOOD: Trustworthy, professional, data-driven, confident, premium
TEXT AREAS: Reserve ${textReserveAreas}
LIGHTING: Even, professional, no harsh shadows
QUALITY: Commercial photography quality, 4K resolution

AVOID:
- Casual or playful aesthetics
- Busy patterns that compete with data
- Warm/cozy tones (use professional cool tones)
- Stock photo look (too generic, fake)
- Harsh shadows or unflattering lighting

OUTPUT: Professional, conversion-optimized background that builds trust and communicates competence.
`;
```

### Fitness App Prompt
```typescript
const fitnessAppPrompt = `
Generate an energetic App Store screenshot background for a ${fitnessType} app.

BACKGROUND STYLE:
${userSelectedStyle === 'lifestyle_action' ? `
High-energy lifestyle photography:
- Subject: Athletic ${age} year old in ${activewear}
- Activity: ${workoutType} (in motion, dynamic)
- Setting: ${location} (gym, outdoor, studio)
- Lighting: Dramatic, high contrast, rim lighting
- Mood: Powerful, energetic, inspiring, transformative
- Sweat level: Realistic but not excessive
- Body language: Strong, confident, mid-movement
- Camera: Sony A7R IV, 35mm f/1.4, fast shutter for freeze
- Color grading: High contrast, saturated, ${colorTreatment}
` : `
Energetic gradient background:
- Colors: ${energyColor1} → ${energyColor2}
- Direction: ${gradientAngle}° diagonal
- Style: Bold, vibrant, high saturation (80%+)
- Effects: Subtle motion blur, energy lines
- Mood: Motivating, powerful, transformative
`}

TYPOGRAPHY TREATMENT: Bold, all-caps, motivational language
MOOD: ENERGETIC, EMPOWERING, TRANSFORMATIVE, ACTION-ORIENTED
VISUAL ELEMENTS: Motion, power, achievement, progress

AVOID:
- Passive or relaxed poses
- Dim or flat lighting
- Muted colors (use bold, saturated)
- Wimpy or uncertain expressions

OUTPUT: High-energy background that motivates action and conveys transformation.
`;
```

### Shopping App Prompt
```typescript
const shoppingAppPrompt = `
Generate a vibrant, conversion-focused App Store screenshot for a ${shoppingCategory} e-commerce app.

BACKGROUND STYLE:
${userSelectedStyle === 'bold_color_block' ? `
Bold solid color:
- Color: ${vibrantColor} (high saturation, attention-grabbing)
- Treatment: Clean, flat, modern
- Saturation: 85-95% (bold but not garish)
- Brightness: 60-75% (energetic but readable)
` : userSelectedStyle === 'lifestyle_shopping' ? `
Lifestyle shopping photography:
- Subject: Stylish ${age} year old ${gender}
- Activity: ${shoppingActivity}
- Wardrobe: Trendy, current fashion, ${style}
- Setting: ${location} with ${backgroundColor} backdrop
- Props: Shopping bags, phone, products (minimal, not distracting)
- Expression: Excited, happy, confident
- Pose: Natural, relatable, mid-activity
- Lighting: Bright, even, flattering
- Color: Vibrant, saturated, youthful
` : `
Multi-color blocks:
- Colors: ${color1}, ${color2}, ${color3}
- Pattern: Geometric, modern, energetic
- Style: Bold, playful, youth-oriented
`}

DECORATIVE ELEMENTS:
- Sale badges (stars, sparkles, accent shapes)
- Urgency indicators (subtle, not overwhelming)
- Trendy graphics (${currentTrends})

TYPOGRAPHY: BOLD, ITALIC, ENERGETIC, ALL CAPS
MOOD: EXCITING, URGENT, TRENDY, YOUTHFUL, FOMO-INDUCING
COLOR PALETTE: Vibrant, high saturation, youth-appealing

AVOID:
- Boring or corporate aesthetics
- Muted or professional color palettes
- Static or lifeless compositions
- Dated fashion or styling

OUTPUT: Vibrant, exciting background that drives urgency and appeals to trend-conscious shoppers.
`;
```

---

# Production Quality Standards

## Resolution & Format Specifications

```typescript
const technicalSpecs = {
  resolution: {
    minimum: '3840 x 2160px', // 4K
    recommended: '5760 x 3240px', // 6K for maximum quality
    appStoreDisplay: '1242 x 2688px', // iPhone 16 Pro Max
    thumbnail: '476 x 847px', // App Store listing preview
    aspectRatio: '9:16' // Portrait
  },

  fileFormat: {
    export: 'PNG',
    compression: 'Lossless',
    colorDepth: '24-bit RGB',
    colorProfile: 'sRGB',
    dpi: '300' // For any potential print use
  },

  qualityChecks: [
    'No compression artifacts',
    'Sharp text at all zoom levels',
    'Proper anti-aliasing on edges',
    'No color banding in gradients',
    'Consistent lighting across composition',
    'Professional retouching (if using photos)',
    'WCAG AA contrast compliance'
  ]
};
```

## Pre-Flight Checklist

```typescript
interface QualityChecklist {
  visual: {
    resolution: '✓ Minimum 4K (3840x2160)',
    sharpness: '✓ Crisp text, no blur',
    colors: '✓ sRGB, no banding',
    composition: '✓ Follows design principles',
    brandAlignment: '✓ Matches brand guidelines'
  };

  readability: {
    textContrast: '✓ WCAG AA minimum (4.5:1)',
    fontSize: '✓ Readable at thumbnail size',
    hierarchy: '✓ Clear visual hierarchy',
    whitespace: '✓ Adequate breathing room'
  };

  technical: {
    fileSize: '✓ Under 8MB (App Store limit)',
    format: '✓ PNG 24-bit',
    naming: '✓ Proper convention (screenshot_1.png)',
    dimensions: '✓ Exact pixel requirements'
  };

  conversion: {
    messaging: '✓ Clear value prop in <3 sec',
    emotion: '✓ Evokes target emotion',
    trustSignals: '✓ Includes credibility markers',
    cta: '✓ Obvious next step/benefit'
  };

  compliance: {
    appleGuidelines: '✓ No violations',
    truthInAdvertising: '✓ Accurate representation',
    ageAppropriate: '✓ Matches app rating',
    accessibility: '✓ WCAG compliant'
  };
}
```

## A/B Testing Framework

```typescript
interface VariantTesting {
  testCases: {
    'Background Style': [
      'Solid Color',
      'Gradient',
      'Lifestyle Photo',
      'Illustration'
    ],

    'Text Treatment': [
      'Bold All Caps',
      'Sentence Case',
      'Mixed Weights',
      'Minimal Text'
    ],

    'Layout': [
      'Phone Left',
      'Phone Center',
      'Phone Right',
      'Angled Dynamic'
    ],

    'Color Palette': [
      'Brand Colors',
      'High Contrast',
      'Monochromatic',
      'Analogous Harmony'
    ]
  };

  metrics: {
    impressions: number;
    clickThroughRate: number;
    conversionRate: number;
    installRate: number;
    bounceRate: number;
  };

  winner: {
    determinedBy: 'Statistical significance (95% confidence)',
    minimumSampleSize: 1000,
    testDuration: '7-14 days'
  };
}
```

---

# Real-World Examples Analysis

## What Makes Great Screenshots (Analyzed)

### Example 1: Robinhood (Finance)
```typescript
const robinhoodAnalysis = {
  background: 'Solid deep blue (#1E3A8A)',
  typography: {
    headline: 'BOLD, white, huge (100px+)',
    message: 'Clear value prop: "Invest commission-free"'
  },
  layout: 'Phone centered, 65% of frame height',
  floating: 'Stock ticker cards, clean data viz',
  mood: 'Professional, trustworthy, modern',
  whyItWorks: [
    'Immediate clarity (what app does)',
    'Professional color builds trust',
    'Clean design = simple to use',
    'Data visualization shows capability',
    'High contrast = easy to scan'
  ],
  conversionRate: 'Industry-leading (estimated 15-20%)'
};
```

### Example 2: Nike Training Club (Fitness)
```typescript
const nikeAnalysis = {
  background: 'Bold gradient (orange → red)',
  typography: {
    headline: 'HUGE, BOLD, EMPOWERING',
    message: 'Motivational: "GET STRONG"'
  },
  people: 'Athletic model in action, mid-workout',
  layout: 'Dynamic angle, movement implied',
  mood: 'ENERGETIC, POWERFUL, TRANSFORMATIVE',
  whyItWorks: [
    'Emotional trigger (aspiration)',
    'High energy creates motivation',
    'Shows results (fit model)',
    'Bold colors grab attention',
    'Movement implies action'
  ],
  targetDemographic: '18-45, fitness-conscious'
};
```

### Example 3: Calm (Wellness)
```typescript
const calmAnalysis = {
  background: 'Serene nature scene (sunset, water)',
  typography: {
    headline: 'Minimal, soft, peaceful',
    message: 'Benefit-focused: "Sleep better"'
  },
  layout: 'Phone blends into background',
  mood: 'CALM, PEACEFUL, RESTORATIVE',
  whyItWorks: [
    'Evokes target emotion immediately',
    'Nature = wellness in user\'s mind',
    'Soft colors reduce anxiety',
    'Minimal text = not overwhelming',
    'Shows desired outcome (peace)'
  ],
  colorPalette: 'Soft blues, purples, pastels'
};
```

---

# Implementation Code

## Enhanced Background Generation System

```typescript
// studio-backgrounds.ts

export enum StudioBackgroundType {
  SOLID_COLOR = 'solid_color',
  SUBTLE_GRADIENT = 'subtle_gradient',
  LIFESTYLE_PORTRAIT = 'lifestyle_portrait',
  BOLD_COLOR_BLOCK = 'bold_color_block',
  MESH_GRADIENT = 'mesh_gradient',
  DARK_CINEMATIC = 'dark_cinematic'
}

interface StudioBackgroundConfig {
  type: StudioBackgroundType;
  category: AppCategory;
  mood: string;
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  style?: {
    saturation: number; // 0-100
    brightness: number; // 0-100
    contrast: number; // 0-100
  };
  photography?: {
    subject: string;
    age: number;
    gender: string;
    pose: string;
    expression: string;
    wardrobe: string;
    lighting: string;
    environment: string;
  };
}

export class StudioBackgroundGenerator {
  constructor(private geminiAPI: GeminiAPI) {}

  async generate(config: StudioBackgroundConfig): Promise<string> {
    const prompt = this.buildPrompt(config);

    try {
      const imageData = await this.geminiAPI.generateImage({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        aspectRatio: '9:16',
        numberOfImages: 1,
        negativePrompt: this.buildNegativePrompt(config),
        stylePreset: this.getStylePreset(config.category),
        qualityLevel: 'high'
      });

      return imageData;
    } catch (error) {
      logger.error('Background generation failed:', error);
      // Fallback to solid color
      return this.generateFallbackBackground(config.colors.primary);
    }
  }

  private buildPrompt(config: StudioBackgroundConfig): string {
    switch (config.type) {
      case StudioBackgroundType.SOLID_COLOR:
        return this.solidColorPrompt(config);

      case StudioBackgroundType.LIFESTYLE_PORTRAIT:
        return this.lifestylePortraitPrompt(config);

      case StudioBackgroundType.MESH_GRADIENT:
        return this.meshGradientPrompt(config);

      case StudioBackgroundType.BOLD_COLOR_BLOCK:
        return this.boldColorBlockPrompt(config);

      default:
        return this.solidColorPrompt(config);
    }
  }

  private solidColorPrompt(config: StudioBackgroundConfig): string {
    return `
      Professional solid color background for ${config.category} app screenshot

      COLOR: ${config.colors.primary}
      STYLE: Ultra-clean, premium, minimal
      TEXTURE: Subtle film grain (2% opacity) for premium feel
      QUALITY: Commercial quality, 4K resolution
      MOOD: ${config.mood}

      TECHNICAL:
      - Perfectly even color distribution
      - No gradients or variations
      - Professional color accuracy
      - sRGB color space

      AVOID:
      - Any patterns or shapes
      - Gradients or color variations
      - Textures that distract
      - Noise or artifacts

      OUTPUT: Clean, professional solid color background optimized for App Store screenshot
    `.trim();
  }

  private lifestylePortraitPrompt(config: StudioBackgroundConfig): string {
    if (!config.photography) {
      throw new Error('Photography config required for lifestyle portrait');
    }

    const p = config.photography;

    return `
      Professional commercial photography for ${config.category} app screenshot

      SUBJECT:
      - ${p.age} year old ${p.gender}
      - ${p.subject}
      - Dressed in: ${p.wardrobe}
      - Expression: ${p.expression}
      - Pose: ${p.pose}
      - Holding iPhone 16 Pro naturally at mid-chest level
      - Screen partially visible to camera

      SETTING:
      - Environment: ${p.environment}
      - Background: ${config.colors.primary} solid color backdrop
      - Professional studio setup

      LIGHTING:
      - Setup: ${p.lighting}
      - Professional 3-point lighting (key, fill, rim)
      - Soft, even illumination on face
      - No harsh shadows
      - Rim light separates subject from background

      CAMERA:
      - Equipment: Canon EOS R5, 85mm f/1.4 lens
      - Aperture: f/1.8 for subject separation
      - Depth of field: Subject sharp, background slightly soft
      - Angle: Straight-on or slight upward tilt (confident)
      - Framing: Portrait, rule of thirds

      COMPOSITION:
      - Subject positioned at right third (leave left for text)
      - Headroom: 15-20% above head
      - Phone screen visible: 40-60%
      - Negative space on left for headline text
      - Professional commercial photography composition

      COLOR & STYLE:
      - Color grading: ${config.mood}
      - Skin tone: Natural, professional retouching
      - Background: Clean ${config.colors.primary}, no distractions
      - Overall: Premium, aspirational, relatable

      MOOD: ${config.mood}
      QUALITY: Commercial advertising quality, 4K resolution

      AVOID:
      - Stock photo look (fake smile, overly posed)
      - Harsh lighting or unflattering shadows
      - Busy or distracting backgrounds
      - Low quality or amateur feel
      - Dated styling or fashion

      OUTPUT: Professional lifestyle portrait for App Store screenshot, commercial quality
    `.trim();
  }

  private meshGradientPrompt(config: StudioBackgroundConfig): string {
    return `
      Modern mesh gradient background for ${config.category} app screenshot

      STYLE: Soft, organic mesh gradient (Apple style)
      COLORS: ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.accent}

      CHARACTERISTICS:
      - 4-5 color stops blending smoothly
      - Organic, irregular shapes (not geometric)
      - Soft blur between colors (Gaussian blur 100px+)
      - Subtle, not overwhelming
      - Premium, sophisticated feel

      TECHNICAL:
      - SVG mesh quality
      - Smooth color interpolation
      - No hard edges or banding
      - sRGB color space
      - 4K resolution

      COMPOSITION:
      - Asymmetric color distribution
      - Depth and dimension through layering
      - Lighter areas for text placement
      - Visual interest without distraction

      MOOD: ${config.mood}
      INSPIRATION: iOS 18, macOS Sequoia, modern Apple aesthetic

      AVOID:
      - Hard geometric shapes
      - Harsh color transitions
      - Oversaturation
      - Busy patterns
      - Color banding

      OUTPUT: Premium mesh gradient background, modern and sophisticated
    `.trim();
  }

  private boldColorBlockPrompt(config: StudioBackgroundConfig): string {
    return `
      Bold, vibrant color block background for ${config.category} app screenshot

      STYLE: Geometric color blocks, modern, energetic
      COLORS: ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.accent}

      COMPOSITION:
      - 2-3 solid color blocks
      - Clean geometric divisions (diagonal, vertical, or horizontal)
      - Sharp, crisp edges
      - Bold, high saturation (${config.style?.saturation || 85}%)
      - High contrast between blocks

      LAYOUT:
      - Asymmetric but balanced
      - Leaves clear space for phone and text
      - Creates energy and movement
      - Modern, youth-oriented aesthetic

      MOOD: ${config.mood}
      TECHNICAL: Vector-crisp edges, no aliasing, 4K resolution

      INSPIRATION: Nike, Urban Outfitters, bold e-commerce brands

      AVOID:
      - Soft edges or gradients
      - Too many colors (max 3)
      - Symmetrical boring layouts
      - Muted or pastel colors

      OUTPUT: Bold, energetic color block background for e-commerce/youth apps
    `.trim();
  }

  private buildNegativePrompt(config: StudioBackgroundConfig): string {
    const common = [
      'low quality',
      'blurry',
      'pixelated',
      'artifacts',
      'watermark',
      'text',
      'logo',
      'amateur',
      'stock photo look'
    ];

    const categorySpecific = {
      [AppCategory.FINANCE]: ['casual', 'playful', 'childish', 'messy'],
      [AppCategory.FITNESS]: ['weak', 'passive', 'sedentary', 'unhealthy'],
      [AppCategory.SHOPPING]: ['boring', 'corporate', 'dull', 'muted'],
      [AppCategory.KIDS]: ['adult', 'sophisticated', 'dark', 'scary'],
      [AppCategory.WELLNESS]: ['harsh', 'stressful', 'busy', 'chaotic']
    };

    return [
      ...common,
      ...(categorySpecific[config.category] || [])
    ].join(', ');
  }

  private getStylePreset(category: AppCategory): string {
    const presets = {
      [AppCategory.FINANCE]: 'professional_photography',
      [AppCategory.FITNESS]: 'dynamic_action',
      [AppCategory.SHOPPING]: 'vibrant_commercial',
      [AppCategory.WELLNESS]: 'calm_natural',
      [AppCategory.KIDS]: 'bright_illustrated',
      [AppCategory.SOCIAL]: 'lifestyle_candid'
    };

    return presets[category] || 'professional_photography';
  }

  private generateFallbackBackground(color: string): string {
    // Generate a simple solid color SVG as fallback
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="1242" height="2688" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
      </svg>
    `)}`;
  }
}
```

## Typography Enhancement System

```typescript
// typography-engine.ts

export class TypographyEngine {
  calculateOptimalSizing(
    text: string,
    containerWidth: number,
    containerHeight: number,
    fontFamily: string
  ): TextSizing {
    const charCount = text.length;
    const words = text.split(' ');
    const wordCount = words.length;

    // Base size on character count
    let baseFontSize: number;
    if (charCount <= 12) {
      baseFontSize = 120;
    } else if (charCount <= 20) {
      baseFontSize = 96;
    } else if (charCount <= 30) {
      baseFontSize = 72;
    } else if (charCount <= 45) {
      baseFontSize = 56;
    } else {
      baseFontSize = 42;
    }

    // Adjust for container size
    const maxWidth = containerWidth * 0.9; // 90% of container
    const fontSize = this.fitTextToWidth(
      text,
      fontFamily,
      baseFontSize,
      maxWidth
    );

    // Line height based on font size and word count
    const lineHeight = wordCount <= 3 ? 0.9 : 1.0;

    // Letter spacing for readability
    const letterSpacing = fontSize > 80 ? '-0.02em' : '0';

    return {
      fontSize,
      lineHeight,
      letterSpacing,
      textTransform: this.determineTextTransform(text, charCount)
    };
  }

  private fitTextToWidth(
    text: string,
    fontFamily: string,
    initialSize: number,
    maxWidth: number
  ): number {
    let size = initialSize;
    while (this.measureTextWidth(text, fontFamily, size) > maxWidth && size > 24) {
      size -= 2;
    }
    return size;
  }

  private measureTextWidth(text: string, fontFamily: string, fontSize: number): number {
    // Use canvas to measure text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }

  private determineTextTransform(text: string, charCount: number): string {
    // Short, punchy text → ALL CAPS
    if (charCount <= 15) {
      return 'uppercase';
    }

    // Check if already all caps
    if (text === text.toUpperCase()) {
      return 'uppercase';
    }

    // Default to title case
    return 'none';
  }

  generateTextEffects(
    textColor: string,
    backgroundColor: string,
    effectStrength: 'subtle' | 'medium' | 'strong' = 'medium'
  ): TextEffects {
    const bgLuminance = this.calculateLuminance(backgroundColor);
    const contrastRatio = this.calculateContrastRatio(textColor, backgroundColor);

    let shadow: string;
    let stroke: string | null = null;

    if (bgLuminance > 0.5) {
      // Light background - dark shadow
      shadow = effectStrength === 'strong'
        ? '0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)'
        : effectStrength === 'medium'
          ? '0 2px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)'
          : '0 1px 3px rgba(0,0,0,0.1)';
    } else {
      // Dark background - light glow + dark shadow
      shadow = effectStrength === 'strong'
        ? '0 0 30px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.8)'
        : effectStrength === 'medium'
          ? '0 0 20px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.6)'
          : '0 2px 4px rgba(0,0,0,0.5)';
    }

    // Add stroke if contrast is borderline
    if (contrastRatio < 5 && contrastRatio > 3) {
      stroke = bgLuminance > 0.5
        ? '1px rgba(255,255,255,0.8)'
        : '1px rgba(0,0,0,0.5)';
    }

    return { shadow, stroke };
  }

  private calculateLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      const v = val / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const l1 = this.calculateLuminance(color1);
    const l2 = this.calculateLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}
```

---

# Conclusion: Path to Professional Excellence

## Immediate Actions (Week 1)

1. **Implement Studio Background System**
   - Add solid color option (highest quality, lowest failure rate)
   - Use professional color palettes per category
   - Ensure text always has sufficient contrast

2. **Enhance Gemini Prompts**
   - Use category-specific master templates
   - Include negative prompts to avoid bad outputs
   - Add quality specifications (4K, commercial, professional)

3. **Typography Improvements**
   - Auto-calculate optimal text sizing
   - Add shadow/stroke based on background
   - Ensure WCAG AA compliance

4. **Fix Technical Issues**
   - Migrate from localStorage to IndexedDB
   - Implement background caching
   - Compress auto-save data

## Medium-term Goals (Weeks 2-4)

1. **Lifestyle Photography Integration**
   - Professional model photography via Gemini
   - Category-specific poses and styling
   - Studio lighting specifications

2. **Advanced Layouts**
   - Golden ratio compositions
   - Multi-device showcases
   - Dynamic Z-pattern layouts

3. **Quality Assurance**
   - Pre-flight checklist automation
   - Contrast ratio validation
   - Resolution verification

## Long-term Vision (Months 2-3)

1. **A/B Testing Framework**
   - Generate multiple variations
   - Track performance metrics
   - Learn from successful patterns

2. **Category Excellence**
   - Deep optimization per category
   - Reference library of top performers
   - Continuous improvement based on data

3. **Professional Templates**
   - Pre-designed layouts per category
   - One-click professional quality
   - Customizable but consistently excellent

---

**The Goal**: Generate App Store screenshots that are indistinguishable from (or better than) professionally designed alternatives, requiring zero user editing, and driving measurable conversion improvements.

**Success Metric**: 90%+ of generations require no editing and achieve professional quality standards.
