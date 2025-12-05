/**
 * Studio Background System
 * Professional background generation with category-aware prompts
 * UPDATED: Ultra-High Quality Prompts & Lighting Engines
 */

import { logger } from './logger';
import { getProfessionalPalette, ColorPalette } from './professionalColors';

export enum StudioBackgroundType {
  SOLID_COLOR = 'solid_color',
  SUBTLE_GRADIENT = 'subtle_gradient',
  LIFESTYLE_PORTRAIT = 'lifestyle_portrait',
  BOLD_COLOR_BLOCK = 'bold_color_block',
  MESH_GRADIENT = 'mesh_gradient',
  DARK_CINEMATIC = 'dark_cinematic',
  ABSTRACT_3D = 'abstract_3d',
  MINIMAL_STUDIO = 'minimal_studio',
  MODERN_ILLUSTRATION = 'modern_illustration',
  // Category-specific types
  FOOD_CULINARY = 'food_culinary',
  TRAVEL_ADVENTURE = 'travel_adventure',
  FITNESS_ENERGY = 'fitness_energy',
  FINANCE_PREMIUM = 'finance_premium',
  SOCIAL_WARM = 'social_warm',
  EDUCATION_BRIGHT = 'education_bright',
  ENTERTAINMENT_VIBRANT = 'entertainment_vibrant',
  HEALTH_CALM = 'health_calm',
  SHOPPING_BOLD = 'shopping_bold',
  DEVELOPER_TECH = 'developer_tech',
  PRODUCTIVITY_CLEAN = 'productivity_clean'
}

export interface StudioBackgroundConfig {
  type: StudioBackgroundType;
  category: string;
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

/**
 * Get recommended background type for a category
 */
export function getRecommendedBackgroundType(category: string): StudioBackgroundType {
  const lowerCategory = category.toLowerCase();

  // Food & Culinary - Warm appetizing colors
  if (lowerCategory.includes('food') || lowerCategory.includes('restaurant') || lowerCategory.includes('recipe') ||
      lowerCategory.includes('cooking') || lowerCategory.includes('eat') || lowerCategory.includes('culinary') ||
      lowerCategory.includes('dining') || lowerCategory.includes('delivery') || lowerCategory.includes('meal')) {
    return StudioBackgroundType.FOOD_CULINARY;
  }

  // Fitness & Workout - Dynamic energy
  if (lowerCategory.includes('fitness') || lowerCategory.includes('workout') || lowerCategory.includes('gym') ||
      lowerCategory.includes('exercise') || lowerCategory.includes('training') || lowerCategory.includes('sport')) {
    return StudioBackgroundType.FITNESS_ENERGY;
  }

  // Finance & Money - Premium professional
  if (lowerCategory.includes('finance') || lowerCategory.includes('trading') || lowerCategory.includes('crypto') ||
      lowerCategory.includes('bank') || lowerCategory.includes('invest') || lowerCategory.includes('money') ||
      lowerCategory.includes('payment') || lowerCategory.includes('wallet')) {
    return StudioBackgroundType.FINANCE_PREMIUM;
  }

  // Social & Communication - Warm friendly
  if (lowerCategory.includes('social') || lowerCategory.includes('dating') || lowerCategory.includes('chat') ||
      lowerCategory.includes('message') || lowerCategory.includes('community') || lowerCategory.includes('network')) {
    return StudioBackgroundType.SOCIAL_WARM;
  }

  // Travel & Adventure - Expansive inspiring
  if (lowerCategory.includes('travel') || lowerCategory.includes('trip') || lowerCategory.includes('vacation') ||
      lowerCategory.includes('destination') || lowerCategory.includes('flight') || lowerCategory.includes('hotel') ||
      lowerCategory.includes('booking') || lowerCategory.includes('map')) {
    return StudioBackgroundType.TRAVEL_ADVENTURE;
  }

  // Education & Learning - Bright optimistic
  if (lowerCategory.includes('education') || lowerCategory.includes('learning') || lowerCategory.includes('course') ||
      lowerCategory.includes('study') || lowerCategory.includes('school') || lowerCategory.includes('kids') ||
      lowerCategory.includes('quiz') || lowerCategory.includes('lesson')) {
    return StudioBackgroundType.EDUCATION_BRIGHT;
  }

  // Entertainment & Media - Vibrant exciting
  if (lowerCategory.includes('entertainment') || lowerCategory.includes('streaming') || lowerCategory.includes('game') ||
      lowerCategory.includes('music') || lowerCategory.includes('video') || lowerCategory.includes('movie') ||
      lowerCategory.includes('podcast') || lowerCategory.includes('media')) {
    return StudioBackgroundType.ENTERTAINMENT_VIBRANT;
  }

  // Health & Wellness - Calm soothing
  if (lowerCategory.includes('health') || lowerCategory.includes('wellness') || lowerCategory.includes('meditation') ||
      lowerCategory.includes('mental') || lowerCategory.includes('sleep') || lowerCategory.includes('therapy') ||
      lowerCategory.includes('mindful') || lowerCategory.includes('calm')) {
    return StudioBackgroundType.HEALTH_CALM;
  }

  // Shopping & E-commerce - Bold exciting
  if (lowerCategory.includes('shopping') || lowerCategory.includes('ecommerce') || lowerCategory.includes('fashion') ||
      lowerCategory.includes('store') || lowerCategory.includes('retail') || lowerCategory.includes('buy') ||
      lowerCategory.includes('shop') || lowerCategory.includes('market')) {
    return StudioBackgroundType.SHOPPING_BOLD;
  }

  // Developer & Tech - Matrix/cyber
  if (lowerCategory.includes('developer') || lowerCategory.includes('coding') || lowerCategory.includes('programming') ||
      lowerCategory.includes('tech') || lowerCategory.includes('api') || lowerCategory.includes('code') ||
      lowerCategory.includes('terminal') || lowerCategory.includes('git')) {
    return StudioBackgroundType.DEVELOPER_TECH;
  }

  // Productivity & Business - Clean minimal
  if (lowerCategory.includes('productivity') || lowerCategory.includes('business') || lowerCategory.includes('utility') ||
      lowerCategory.includes('task') || lowerCategory.includes('todo') || lowerCategory.includes('calendar') ||
      lowerCategory.includes('note') || lowerCategory.includes('work') || lowerCategory.includes('office')) {
    return StudioBackgroundType.PRODUCTIVITY_CLEAN;
  }

  // Default Fallback - use abstract 3D for modern look
  return StudioBackgroundType.ABSTRACT_3D;
}

/**
 * Build professional background generation prompt
 */
export function buildBackgroundPrompt(config: StudioBackgroundConfig): string {
  switch (config.type) {
    // Generic background types
    case StudioBackgroundType.ABSTRACT_3D:
      return buildAbstract3DPrompt(config);
    case StudioBackgroundType.MINIMAL_STUDIO:
      return buildMinimalStudioPrompt(config);
    case StudioBackgroundType.MODERN_ILLUSTRATION:
      return buildModernIllustrationPrompt(config);
    case StudioBackgroundType.SOLID_COLOR:
      return buildSolidColorPrompt(config);
    case StudioBackgroundType.LIFESTYLE_PORTRAIT:
      return buildLifestylePortraitPrompt(config);
    case StudioBackgroundType.MESH_GRADIENT:
      return buildMeshGradientPrompt(config);
    case StudioBackgroundType.BOLD_COLOR_BLOCK:
      return buildBoldColorBlockPrompt(config);
    case StudioBackgroundType.DARK_CINEMATIC:
      return buildDarkCinematicPrompt(config);
    case StudioBackgroundType.SUBTLE_GRADIENT:
      return buildSubtleGradientPrompt(config);

    // Category-specific background types
    case StudioBackgroundType.FOOD_CULINARY:
      return buildFoodCulinaryPrompt(config);
    case StudioBackgroundType.TRAVEL_ADVENTURE:
      return buildTravelAdventurePrompt(config);
    case StudioBackgroundType.FITNESS_ENERGY:
      return buildFitnessEnergyPrompt(config);
    case StudioBackgroundType.FINANCE_PREMIUM:
      return buildFinancePremiumPrompt(config);
    case StudioBackgroundType.SOCIAL_WARM:
      return buildSocialWarmPrompt(config);
    case StudioBackgroundType.EDUCATION_BRIGHT:
      return buildEducationBrightPrompt(config);
    case StudioBackgroundType.ENTERTAINMENT_VIBRANT:
      return buildEntertainmentVibrantPrompt(config);
    case StudioBackgroundType.HEALTH_CALM:
      return buildHealthCalmPrompt(config);
    case StudioBackgroundType.SHOPPING_BOLD:
      return buildShoppingBoldPrompt(config);
    case StudioBackgroundType.DEVELOPER_TECH:
      return buildDeveloperTechPrompt(config);
    case StudioBackgroundType.PRODUCTIVITY_CLEAN:
      return buildProductivityCleanPrompt(config);

    default:
      return buildAbstract3DPrompt(config);
  }
}

/**
 * NEW: Abstract 3D Background (Octane Render Style) - CLEAN AND PREMIUM
 */
function buildAbstract3DPrompt(config: StudioBackgroundConfig): string {
  return `
PREMIUM abstract background for ${config.category} app. Apple-level design quality.

=== STYLE ===
Ultra-modern 3D abstract art. References: Apple keynotes, Stripe, Linear, Vercel websites.
Render quality: Octane, Redshift, Cinema 4D, Blender Cycles.

=== COLORS ===
Base: Soft gradient using ${config.colors.primary}
Accents: ${config.colors.accent || 'white'} highlights with subtle iridescence
Overall: BRIGHT, clean, professional color palette

=== VISUAL ELEMENTS ===
Choose ONE style:
- Smooth gradient mesh (iOS style)
- Soft 3D glass ribbons or waves
- Minimal geometric shapes with soft blur
- Abstract light caustics on clean surface

=== CRITICAL COMPOSITION RULES ===
1. CENTER: 80% clean/empty for text overlay - THIS IS MANDATORY
2. EDGES: All visual interest at corners and borders only
3. BLUR: Heavy depth-of-field on all decorative elements
4. BALANCE: Asymmetric but visually balanced

=== LIGHTING ===
- HIGH-KEY bright studio lighting
- Soft, even illumination
- NO dark shadows or muddy areas
- Professional product photography lighting

=== TECHNICAL ===
- 8K resolution, crystal clear
- Smooth color gradients, no banding
- Clean, sharp where needed, soft blur elsewhere

=== ABSOLUTE RESTRICTIONS ===
🚫 NO objects, products, or recognizable items
🚫 NO people, hands, faces
🚫 NO text, logos, UI elements
🚫 NO dark, moody, or low-contrast areas
🚫 NO busy or cluttered compositions
🚫 NO cheap-looking gradients

OUTPUT: Premium abstract background suitable for Fortune 500 app marketing. 8K.
  `.trim();
}

/**
 * NEW: Minimal Studio Background (Product Photography)
 */
function buildMinimalStudioPrompt(config: StudioBackgroundConfig): string {
  return `
Minimalist product photography studio background for ${config.category} app.
STYLE: High-key Apple-style product photography, Architectural Digest.
COLORS: Very soft pastel version of ${config.colors.primary} or clean white/gray.

VISUALS:
- A smooth, curved "infinity wall" (cyclorama) background.
- Soft, architectural shadows cast by invisible objects (blinds, plants) to create depth.
- Perhaps a single, simple geometric prop (cube, sphere, arch) in the corner, out of focus.
- **CRITICAL**: Large empty negative space in center/top for text.
- Texture: High-quality paper grain, matte wall paint, smooth concrete.

LIGHTING:
- Large softbox lighting (diffused).
- Window light simulation with soft shadows.
- Clean, airy, spacious feel.

MOOD: Organized, clean, productive, efficient, zen.
OUTPUT: Ultra-clean studio backdrop, wallpaper quality.
  `.trim();
}

/**
 * Modern Illustration Background (Notion/Corporate Memphis Style)
 */
function buildModernIllustrationPrompt(config: StudioBackgroundConfig): string {
  return `
Modern flat vector illustration background for ${config.category} app.
STYLE: Corporate Memphis, Notion-style, Linear, Minimalist Vector.
COLORS: ${config.colors.primary} and ${config.colors.secondary || 'white'} with high contrast.

VISUALS:
- Flat, 2D vector shapes.
- Abstract representation of ${config.category} concepts (e.g. floating coins for finance, leaves for health).
- "Squiggly lines" and organic blobs for decoration.
- NO shading, NO gradients (or very subtle), NO 3D.
- **CRITICAL**: Massive negative space. The illustration should frame the content, not compete with it.

MOOD: Friendly, approachable, smart, tech-savvy.
OUTPUT: High-quality vector art style background.
  `.trim();
}

/**
 * Solid color background prompt
 */
function buildSolidColorPrompt(config: StudioBackgroundConfig): string {
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

/**
 * Lifestyle portrait background prompt
 */
function buildLifestylePortraitPrompt(config: StudioBackgroundConfig): string {
  // REFINED: Focus on ATMOSPHERE over specific people to avoid uncanny valley
  return `
Atmospheric lifestyle photography background for ${config.category} app.
SETTING: Modern, high-end environment related to ${config.category}.
COLORS: ${config.colors.primary} tones integrated into the environment.

VISUALS:
- Blurred background (Bokeh) of a specific location (Gym, Office, Cafe, Living Room).
- NO PEOPLE IN FOCUS. Focus on the *feeling* of the space.
- Props: Coffee cup, laptop, yoga mat, notebook (depending on category) - strictly out of focus in background.
- **CRITICAL**: Ensure the background brightness is relatively uniform to allow for readable text overlay.
- Lighting: Golden hour or soft window light.

COMPOSITION:
- Macro photography or wide aperture (f/1.4).
- Abstract representation of the lifestyle.
- Clean negative space for text.

STYLE:
- Shot on Sony A7R IV.
- Cinematic color grading.
- Authentic, lived-in feel but clean.

MOOD: ${config.mood}, authentic, raw, emotional.
OUTPUT: Cinematic lifestyle background texture.
  `.trim();
}

/**
 * Mesh gradient background prompt
 */
function buildMeshGradientPrompt(config: StudioBackgroundConfig): string {
  return `
Modern mesh gradient background for ${config.category} app screenshot
STYLE: Soft, organic mesh gradient (Apple iOS 18 style)
COLORS: Bright, vibrant ${config.colors.primary}, ${config.colors.secondary || config.colors.primary}, ${config.colors.accent || 'white'}

CHARACTERISTICS:
- 4-5 color stops blending smoothly
- Organic, irregular shapes (not geometric)
- Soft blur between colors (Gaussian blur 100px+)
- Subtle, not overwhelming
- Premium, sophisticated feel
- **BRIGHTNESS**: Overall bright and airy, good contrast for text
- **CLARITY**: Clean, professional, high-quality gradient

TECHNICAL:
- SVG mesh quality
- Smooth color interpolation
- No hard edges or banding
- sRGB color space
- 4K resolution
- High-key lighting (bright overall tone)

COMPOSITION:
- Asymmetric color distribution
- Depth and dimension through layering
- Lighter areas for text placement
- Visual interest without distraction
- **BACKGROUND**: Should be bright enough to support both dark and light text

MOOD: ${config.mood}, modern, premium, BRIGHT, clean, professional
INSPIRATION: iOS 18, macOS Sequoia, modern Apple aesthetic

AVOID:
- Hard geometric shapes
- Harsh color transitions
- Oversaturation
- Busy patterns
- Color banding
- Dark, muddy tones
- Low contrast areas

OUTPUT: Premium mesh gradient background, modern, sophisticated, and BRIGHT
  `.trim();
}

/**
 * Bold color block background prompt
 */
function buildBoldColorBlockPrompt(config: StudioBackgroundConfig): string {
  return `
Bold, vibrant color block background for ${config.category} app screenshot
STYLE: Bauhaus or Swiss Design, geometric, modern.
COLORS: ${config.colors.primary} and ${config.colors.accent || 'white'} and Black.

COMPOSITION:
- Large, bold geometric shapes (circles, archways, diagonals).
- Flat design but with subtle paper texture or noise.
- Sharp, crisp edges.
- High contrast.

MOOD: Energetic, loud, confident, Gen-Z.
INSPIRATION: Spotify Wrapped, Nike, Urban Outfitters.

TECHNICAL: Vector-crisp edges, no aliasing, 4K resolution.

AVOID:
- Gradients.
- 3D effects.
- Blur.

OUTPUT: Bold, energetic color block background.
  `.trim();
}

/**
 * Dark cinematic background prompt
 */
function buildDarkCinematicPrompt(config: StudioBackgroundConfig): string {
  return `
Dark, cinematic abstract background for ${config.category} app.
STYLE: Cyberpunk, Sci-Fi, or Noir.
BASE COLOR: Deep Black/Charcoal with neon ${config.colors.primary} accents.

VISUALS:
- Abstract light trails or data streams (long exposure).
- Dark metal textures (brushed aluminum, carbon fiber).
- Smoke or fog atmosphere (volumetric).
- Low key lighting.

MOOD: Mysterious, powerful, fast, secure.
INSPIRATION: Tron, Blade Runner, Dark Mode UI.

TECHNICAL:
- High contrast (Chiaroscuro).
- 4K resolution.
- OLED Black levels.

OUTPUT: Dark, cinematic background.
  `.trim();
}

/**
 * Subtle gradient background prompt
 */
function buildSubtleGradientPrompt(config: StudioBackgroundConfig): string {
  return `
Elegant, subtle gradient background for ${config.category} app screenshot
COLORS: Bright ${config.colors.primary} to ${config.colors.secondary || 'lighter shade of ' + config.colors.primary}
STYLE: Smooth, subtle, professional, BRIGHT

CHARACTERISTICS:
- Gentle gradient transition
- Direction: 135 degrees (diagonal)
- Smooth interpolation
- No hard stops
- Subtle texture overlay (3% opacity)
- **BRIGHTNESS**: Overall bright and airy tone
- **CLARITY**: Crystal clear, professional quality

TECHNICAL:
- Premium gradient quality
- No color banding
- sRGB color space
- 4K resolution
- High-key lighting approach
- Optimized for text overlay

MOOD: ${config.mood}, modern, premium, BRIGHT, clean
EFFECT: Sophisticated, professional, timeless, fresh

AVOID:
- Harsh transitions
- Oversaturation
- Busy patterns
- Distracting elements
- Dark, muddy tones
- Low contrast

OUTPUT: Clean, professional gradient background that is BRIGHT and supports text
  `.trim();
}

/**
 * Food & Culinary Background - Warm, appetizing colors - ABSTRACT ONLY
 */
function buildFoodCulinaryPrompt(config: StudioBackgroundConfig): string {
  return `
PREMIUM ABSTRACT background for a food/restaurant app. PURE ABSTRACT ART - NO FOOD.

=== STYLE ===
Ultra-modern 3D abstract art. Think: Apple keynote backgrounds, Stripe's website gradients.
Render engine: Octane, Cinema 4D, Blender Cycles quality.

=== COLOR PALETTE (STRICT) ===
PRIMARY: Warm sunset gradient - coral (#FF6B50) to peach (#FFAB91) to soft cream
ACCENT: Golden amber highlights (#FFD54F)
DEPTH: Soft burgundy undertones for dimension

=== VISUAL ELEMENTS (ABSTRACT ONLY) ===
- Smooth, flowing 3D glass ribbons or silk-like waves
- Soft gradient mesh with warm color transitions
- Subtle caustic light patterns (like sunlight through glass)
- Blurred spheres or orbs in warm tones (bokeh effect)
- Clean geometric shapes with soft edges

=== COMPOSITION ===
- CLEAN CENTER: 80% of center must be uncluttered for text overlay
- Visual elements at EDGES and CORNERS only
- Soft depth-of-field blur (f/1.4 aesthetic)
- Diagonal flow from bottom-left to top-right

=== LIGHTING ===
- BRIGHT high-key lighting (NOT dark or moody)
- Soft studio lighting with warm color temperature
- Subtle rim lighting on glass elements
- Even illumination for text readability

=== MOOD ===
Premium • Modern • Warm • Inviting • Clean • Sophisticated

=== ABSOLUTE RESTRICTIONS ===
🚫 NO food, ingredients, vegetables, fruits, dishes, plates, utensils
🚫 NO kitchens, restaurants, tables, people, hands
🚫 NO green, blue, purple, or cool colors
🚫 NO text, logos, watermarks
🚫 NO dark shadows or low-contrast areas
🚫 NO cluttered or busy compositions

OUTPUT: Clean, premium abstract gradient background. 8K quality, Apple-level design.
  `.trim();
}

/**
 * Travel & Adventure Background - Expansive, wanderlust-inspiring
 */
function buildTravelAdventurePrompt(config: StudioBackgroundConfig): string {
  return `
INSPIRING travel and adventure themed background for a travel/booking app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Ocean blues (#0077B6, #00B4D8, #90E0EF)
- SECONDARY: Sunset oranges and corals (#FF6B35, #F4A261)
- ACCENT: Sandy beige (#DDA15E), sky white (#CAF0F8)
- DEPTH: Deep navy (#03045E), mountain purple (#7B2CBF)

VISUAL ELEMENTS (Abstract, NOT literal landmarks):
- Flowing gradient layers suggesting horizon lines
- Soft cloud-like wisps and atmospheric haze
- Abstract map contour lines or topographic patterns
- Gentle wave or dune curve formations
- Particle effects suggesting sand, stars, or sea spray

LIGHTING:
- Golden hour or blue hour atmosphere
- Soft, dreamy, aspirational lighting
- Bright and optimistic overall tone
- Subtle lens flare or sun ray effects

COMPOSITION:
- Expansive, open feel suggesting vast landscapes
- Clear central area for text
- Layered depth creating sense of distance
- Diagonal flow suggesting journey/movement

MOOD: Wanderlust, freedom, adventure, discovery, escape, aspirational
STYLE: National Geographic aesthetic, luxury travel magazine, airline premium branding

ABSOLUTELY AVOID:
- Specific landmarks or locations
- Airplanes, cars, or vehicles
- Text or logos
- People or crowds
- Dark, cramped compositions

OUTPUT: Expansive, inspiring abstract background that evokes wanderlust, 8K quality
  `.trim();
}

/**
 * Fitness & Energy Background - Dynamic, powerful, motivating
 */
function buildFitnessEnergyPrompt(config: StudioBackgroundConfig): string {
  return `
POWERFUL fitness and energy themed background for a workout/gym app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Electric neon (#00F5FF, #39FF14, #FF073A)
- SECONDARY: Deep black/charcoal (#0A0A0A, #1A1A2E)
- ACCENT: Hot pink (#FF1493), electric orange (#FF4500)
- ENERGY: Pulse red (#E63946), power blue (#00B4D8)

VISUAL ELEMENTS:
- Dynamic motion blur streaks suggesting speed and movement
- Abstract energy waves and pulse lines
- Glowing particle trails like sweat droplets or energy sparks
- Geometric angular shapes suggesting strength and power
- Light trails and neon glow effects

LIGHTING:
- High contrast dramatic lighting
- Neon rim lighting effects
- Dark background with vibrant accent lights
- Volumetric light beams

COMPOSITION:
- Dynamic diagonal lines suggesting motion
- Energy flowing from corners to center
- Dark base with bright energy accents
- Clean center area for text overlay

MOOD: Powerful, energetic, motivating, intense, athletic, transformative
STYLE: Nike/Adidas campaign aesthetic, sports broadcast graphics, gym motivation

ABSOLUTELY AVOID:
- Soft pastel colors
- Static, boring compositions
- People or body parts
- Gym equipment literally shown
- Weak, passive imagery

OUTPUT: Dynamic, high-energy abstract background that motivates action, 8K quality
  `.trim();
}

/**
 * Finance & Premium Background - Sophisticated, trustworthy, professional
 */
function buildFinancePremiumPrompt(config: StudioBackgroundConfig): string {
  return `
PREMIUM finance and banking themed background for a fintech/investment app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Deep navy (#0A1628), royal blue (#1E3A5F)
- SECONDARY: Metallic gold (#D4AF37, #FFD700), champagne (#F7E7CE)
- ACCENT: Trust green (#2E8B57), platinum silver (#E5E4E2)
- DEPTH: Rich burgundy (#722F37), black (#000000)

VISUAL ELEMENTS:
- Abstract ascending geometric planes suggesting growth
- Precision-cut crystal or glass prism shapes
- Subtle data flow streams or chart line abstractions
- Metallic textures (brushed gold, platinum, titanium)
- Clean grid lines suggesting structure and precision

LIGHTING:
- Sophisticated studio lighting
- Subtle gold rim highlights
- Professional, even illumination
- Soft reflections on metallic surfaces

COMPOSITION:
- Upward diagonal movement suggesting growth
- Structured, organized layout
- Premium negative space
- Balance of dark and light for contrast

MOOD: Trustworthy, premium, sophisticated, secure, professional, prosperous
STYLE: Private banking aesthetic, Bloomberg terminal elegance, Swiss precision

ABSOLUTELY AVOID:
- Cheap, casual appearance
- Literal money or coins
- Green only (too cliché)
- Busy, cluttered designs
- Playful or childish elements

OUTPUT: Premium, sophisticated abstract background conveying financial trust, 8K quality
  `.trim();
}

/**
 * Social & Communication Background - Warm, friendly, connected
 */
function buildSocialWarmPrompt(config: StudioBackgroundConfig): string {
  return `
WARM social and communication themed background for a social/dating/chat app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Warm sunset (#FF6B6B, #FFA07A, #FFB6C1)
- SECONDARY: Soft lavender (#E6E6FA), sky pink (#FFB5E8)
- ACCENT: Coral (#FF7F7F), peach (#FFCBA4)
- WARMTH: Golden hour (#FFD93D), blush (#FFDAB9)

VISUAL ELEMENTS:
- Soft organic blob shapes suggesting connection
- Gentle gradient waves like warm embraces
- Abstract heart or circular forms (subtle, not literal)
- Flowing silk or ribbon-like curves
- Soft bokeh circles suggesting togetherness

LIGHTING:
- Golden hour warmth
- Soft, flattering, glowing
- Diffused romantic lighting
- Warm color temperature throughout

COMPOSITION:
- Organic, flowing layout
- Welcoming open spaces
- Soft edges, no harsh lines
- Centered composition for approachability

MOOD: Warm, friendly, inviting, connected, romantic, approachable, human
STYLE: Instagram aesthetic, dating app warmth, friendship vibes

ABSOLUTELY AVOID:
- Cold blues or grays
- Corporate stiffness
- Literal people or faces
- Hard geometric shapes
- Dark or moody tones

OUTPUT: Warm, inviting abstract background that feels like connection, 8K quality
  `.trim();
}

/**
 * Education & Learning Background - Bright, optimistic, inspiring
 */
function buildEducationBrightPrompt(config: StudioBackgroundConfig): string {
  return `
BRIGHT education and learning themed background for a study/course/kids app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Bright sky blue (#00B4D8, #48CAE4)
- SECONDARY: Sunny yellow (#FFD60A, #FFC300)
- ACCENT: Fresh green (#70C1B3), coral (#FF6B6B)
- ENERGY: Purple wisdom (#7B68EE), orange creativity (#FF8C42)

VISUAL ELEMENTS:
- Abstract book pages or knowledge streams
- Lightbulb-inspired glow effects (idea metaphor)
- Playful geometric shapes (for kids) or clean lines (for adults)
- Rising particles suggesting growth and achievement
- Subtle graduation cap or star sparkle effects

LIGHTING:
- Bright, optimistic, high-key
- Morning light freshness
- Cheerful and energizing
- Clear and crisp

COMPOSITION:
- Upward movement suggesting growth
- Open, airy, spacious
- Balanced playfulness and professionalism
- Room for achievement badges/text

MOOD: Inspiring, optimistic, achievable, bright, encouraging, growth-oriented
STYLE: Duolingo cheerfulness, Khan Academy clarity, modern EdTech

ABSOLUTELY AVOID:
- Dark, serious, intimidating
- Boring textbook vibes
- Cluttered or overwhelming
- Dull, muted colors
- Stressful imagery

OUTPUT: Bright, inspiring abstract background that motivates learning, 8K quality
  `.trim();
}

/**
 * Entertainment & Media Background - Vibrant, exciting, immersive
 */
function buildEntertainmentVibrantPrompt(config: StudioBackgroundConfig): string {
  return `
VIBRANT entertainment and media themed background for a streaming/gaming/music app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Electric purple (#9D4EDD, #7B2CBF)
- SECONDARY: Hot magenta (#FF006E), cyan (#00F5FF)
- ACCENT: Neon green (#39FF14), gold (#FFD700)
- DEPTH: Deep black (#0A0A0A), midnight blue (#191970)

VISUAL ELEMENTS:
- Dynamic light rays and lens flares
- Abstract sound wave or equalizer patterns
- Glowing particle effects and sparkles
- Gradient mesh with vibrant color transitions
- Cinematic light leaks and bokeh

LIGHTING:
- Concert/stage lighting effects
- Dramatic color washes
- Neon glow and rim lighting
- Theatrical spotlight effects

COMPOSITION:
- Dynamic, energetic layout
- Depth with foreground/background elements
- Central focus area for content
- Movement and rhythm in design

MOOD: Exciting, immersive, entertaining, fun, vibrant, escapist
STYLE: Spotify Wrapped, Netflix cinematic, gaming aesthetics, concert visuals

ABSOLUTELY AVOID:
- Boring, static designs
- Corporate or professional look
- Muted, dull colors
- Simple flat backgrounds
- Literal media icons

OUTPUT: Vibrant, exciting abstract background that feels like entertainment, 8K quality
  `.trim();
}

/**
 * Health & Wellness Background - Calm, soothing, healing
 */
function buildHealthCalmPrompt(config: StudioBackgroundConfig): string {
  return `
CALMING health and wellness themed background for a meditation/therapy/health app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Sage green (#9DC88D, #95D5B2)
- SECONDARY: Soft lavender (#E6E6FA), sky blue (#87CEEB)
- ACCENT: Blush pink (#FFB5C5), cream (#FFFDD0)
- SERENITY: Mint (#98FF98), soft white (#F8F8FF)

VISUAL ELEMENTS:
- Soft, flowing organic curves like breathing
- Gentle gradient clouds or mist
- Abstract water ripple or zen circle patterns
- Soft leaf or natural element suggestions
- Peaceful aurora-like color flows

LIGHTING:
- Soft, diffused, gentle
- Morning spa lighting
- Warm but not hot
- Even, stress-free illumination

COMPOSITION:
- Balanced, centered, harmonious
- Plenty of breathing room
- Smooth, flowing transitions
- No sharp edges or angles

MOOD: Calm, peaceful, healing, serene, balanced, mindful, restorative
STYLE: Headspace/Calm app aesthetic, spa atmosphere, zen garden

ABSOLUTELY AVOID:
- Harsh, bright, stimulating colors
- Busy, chaotic patterns
- Dark, depressing tones
- Medical/clinical sterility
- Stressful or urgent imagery

OUTPUT: Calming, peaceful abstract background that promotes wellness, 8K quality
  `.trim();
}

/**
 * Shopping & E-commerce Background - Bold, exciting, desirable
 */
function buildShoppingBoldPrompt(config: StudioBackgroundConfig): string {
  return `
BOLD shopping and retail themed background for an e-commerce/fashion app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Bold coral (#FF6B6B), hot pink (#FF1493)
- SECONDARY: Electric yellow (#FFE135), turquoise (#40E0D0)
- ACCENT: Gold (#FFD700), black (#000000)
- POP: Neon orange (#FF4500), mint (#3EB489)

VISUAL ELEMENTS:
- Bold geometric shapes and color blocks
- Abstract shopping bag or tag silhouettes (subtle)
- Confetti or celebration particles
- Glossy, shiny surfaces suggesting luxury
- Dynamic diagonal lines suggesting excitement

LIGHTING:
- Bright, retail-style lighting
- Spotlight effects for product focus
- High-key, flattering illumination
- Subtle sparkle and shine

COMPOSITION:
- Bold, confident layout
- Dynamic angles and movement
- Clear product showcase area
- Exciting but not overwhelming

MOOD: Exciting, desirable, fun, trendy, must-have, sale energy
STYLE: ASOS/Zara campaign, fashion week, retail therapy vibes

ABSOLUTELY AVOID:
- Boring, corporate look
- Dull, muted colors
- Cheap or tacky appearance
- Cluttered mess
- Dark, uninviting tones

OUTPUT: Bold, exciting abstract background that makes shopping irresistible, 8K quality
  `.trim();
}

/**
 * Developer & Tech Background - Matrix, cyber, technical
 */
function buildDeveloperTechPrompt(config: StudioBackgroundConfig): string {
  return `
TECHNICAL developer and coding themed background for a programming/tech app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Matrix green (#00FF41, #39FF14)
- SECONDARY: Deep black (#0D0D0D), terminal dark (#1E1E1E)
- ACCENT: Cyan (#00FFFF), electric blue (#0066FF)
- CODE: Purple syntax (#C678DD), orange (#E5C07B)

VISUAL ELEMENTS:
- Abstract code rain or data stream patterns
- Circuit board or network node abstractions
- Geometric grid lines and connection paths
- Terminal cursor blink effects (subtle glow)
- Binary or hex pattern textures (very subtle)

LIGHTING:
- Monitor glow aesthetic
- Neon terminal lighting
- Dark mode with bright accents
- Subtle scan line effects

COMPOSITION:
- Structured, grid-based layout
- Technical precision
- Dark base with bright code highlights
- Clean center for content

MOOD: Technical, intelligent, powerful, precise, hacker-cool, innovative
STYLE: GitHub dark mode, VS Code aesthetic, cyberpunk terminals

ABSOLUTELY AVOID:
- Bright, cheerful colors
- Soft, organic shapes
- Unprofessional or messy
- Literal code text
- Outdated tech imagery

OUTPUT: Technical, sophisticated abstract background for developers, 8K quality
  `.trim();
}

/**
 * Productivity & Business Background - Clean, minimal, focused
 */
function buildProductivityCleanPrompt(config: StudioBackgroundConfig): string {
  return `
CLEAN productivity and business themed background for a task/work/office app.
APP CONTEXT: ${config.category}

COLOR PALETTE:
- PRIMARY: Clean white (#FFFFFF), soft gray (#F5F5F5)
- SECONDARY: Professional blue (#4A90D9), slate (#708090)
- ACCENT: Subtle green (#7CB342), focus orange (#FF9800)
- DEPTH: Charcoal (#36454F), paper cream (#FFFEF0)

VISUAL ELEMENTS:
- Clean geometric shapes suggesting organization
- Subtle grid or checklist pattern abstractions
- Smooth gradient transitions
- Minimal shadow and depth layers
- Paper or material texture (very subtle)

LIGHTING:
- Bright, clear, professional
- Office daylight aesthetic
- Even, distraction-free illumination
- Soft shadows for depth

COMPOSITION:
- Organized, structured layout
- Maximum negative space
- Clear hierarchy
- Professional and focused

MOOD: Focused, organized, productive, clean, professional, efficient
STYLE: Notion aesthetic, Apple productivity, Scandinavian minimal

ABSOLUTELY AVOID:
- Distracting patterns
- Loud, vibrant colors
- Cluttered or busy designs
- Dark or moody atmosphere
- Playful or casual elements

OUTPUT: Clean, minimal abstract background that enhances productivity, 8K quality
  `.trim();
}

/**
 * Build negative prompt to avoid unwanted elements
 */
export function buildNegativePrompt(config: StudioBackgroundConfig): string {
  const common = [
    'low quality',
    'blurry',
    'pixelated',
    'artifacts',
    'watermark',
    'text',
    'logo',
    'amateur',
    'stock photo look',
    'phones',
    'devices',
    'screens',
    'bezels',
    'hands',
    'people',
    'fingers',
    'ugly',
    'deformed',
    'dark',
    'muddy',
    'murky',
    'unclear',
    'dirty',
    'grungy',
    'noisy',
    'grainy',
    'oversaturated',
    'underexposed',
    'low contrast',
    'dull',
    'muted colors',
    'brown tones',
    'sepia',
    'vintage filter',
    'distorted',
    'warped',
    'cluttered',
    'busy',
    'chaotic',
    'messy'
  ];

  const categorySpecific: Record<string, string[]> = {
    finance: ['casual', 'playful', 'childish', 'messy', 'cheap looking', 'unprofessional'],
    fitness: ['weak', 'passive', 'sedentary', 'unhealthy', 'lazy', 'soft', 'static'],
    shopping: ['boring', 'corporate', 'dull', 'muted', 'cheap', 'tacky'],
    kids: ['adult', 'sophisticated', 'dark', 'scary', 'complex', 'intimidating'],
    wellness: ['harsh', 'stressful', 'busy', 'chaotic', 'clinical', 'sterile'],
    food: ['cold colors', 'blue tones', 'green background', 'clinical', 'sterile', 'unappetizing', 'raw meat', 'spoiled', 'insects'],
    travel: ['confined', 'claustrophobic', 'indoor', 'mundane', 'office', 'urban decay', 'cramped'],
    social: ['cold', 'corporate', 'sterile', 'lonely', 'isolated', 'harsh'],
    education: ['dark', 'intimidating', 'boring', 'complex', 'stressful', 'overwhelming'],
    entertainment: ['boring', 'corporate', 'static', 'muted', 'dull', 'professional'],
    health: ['harsh', 'stimulating', 'chaotic', 'stressful', 'clinical', 'medical'],
    developer: ['cheerful', 'colorful', 'soft', 'organic', 'playful', 'unprofessional'],
    productivity: ['distracting', 'loud', 'vibrant', 'cluttered', 'chaotic', 'playful']
  };

  // Find matching category-specific negatives
  const categoryNegatives: string[] = [];
  for (const [key, negatives] of Object.entries(categorySpecific)) {
    if (config.category.toLowerCase().includes(key)) {
      categoryNegatives.push(...negatives);
      break;
    }
  }

  return [...common, ...categoryNegatives].join(', ');
}

/**
 * Generate fallback SVG background
 */
export function generateFallbackBackground(color: string): string {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="1290" height="2796" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `)}`;
}

/**
 * Get category-specific photography specs
 */
export function getPhotographySpecs(category: string, mood: string): StudioBackgroundConfig['photography'] {
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes('finance') || lowerCategory.includes('trading')) {
    return {
      subject: 'Confident professional',
      age: 35,
      gender: 'diverse',
      pose: 'Holding iPhone naturally at mid-chest, screen visible',
      expression: 'Confident, trustworthy, competent (slight smile)',
      wardrobe: 'Business attire (suit or smart casual)',
      lighting: 'Soft professional studio lighting, no harsh shadows',
      environment: 'Neutral studio backdrop, professional setting'
    };
  }

  if (lowerCategory.includes('fitness') || lowerCategory.includes('health')) {
    return {
      subject: 'Athletic individual',
      age: 28,
      gender: 'diverse',
      pose: 'Dynamic, mid-movement, holding phone',
      expression: 'Energetic, focused, empowered',
      wardrobe: 'Athletic wear, activewear',
      lighting: 'High contrast, dramatic rim lighting',
      environment: 'Gym or outdoor fitness setting with solid backdrop'
    };
  }

  if (lowerCategory.includes('shopping') || lowerCategory.includes('fashion')) {
    return {
      subject: 'Stylish individual',
      age: 25,
      gender: 'diverse',
      pose: 'Casual, holding phone, shopping gesture',
      expression: 'Excited, happy, confident',
      wardrobe: 'Trendy, current fashion',
      lighting: 'Bright, even, flattering',
      environment: 'Minimal backdrop with bold color'
    };
  }

  // Default professional
  return {
    subject: 'Approachable professional',
    age: 30,
    gender: 'diverse',
    pose: 'Natural, holding phone casually',
    expression: 'Friendly, confident, approachable',
    wardrobe: 'Smart casual',
    lighting: 'Soft, even professional lighting',
    environment: 'Clean studio backdrop'
  };
}
