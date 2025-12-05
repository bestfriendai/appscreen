/**
 * Professional Headline & Caption Templates
 * Based on 2025 ASO research and high-converting App Store screenshots
 * 
 * Key principles from research:
 * 1. First 3 screenshots are CRITICAL - they show in search results
 * 2. Headlines should be short, punchy, and benefit-focused
 * 3. Each screenshot should highlight ONE key feature/benefit
 * 4. Use action verbs and emotional triggers
 * 5. Avoid generic phrases like "best app" or "download now"
 */

export interface HeadlineTemplate {
  headline: string;
  subtitle?: string;
  style: 'punchy' | 'benefit' | 'action' | 'emotional' | 'feature';
  slidePosition: 'first' | 'middle' | 'last' | 'any';
}

/**
 * Category-specific headline templates
 * These are proven patterns from top-performing apps
 */
export const HEADLINE_TEMPLATES: Record<string, HeadlineTemplate[]> = {
  // FOOD & DELIVERY APPS
  food: [
    { headline: 'Crave. Discover.', subtitle: 'Your next meal awaits', style: 'punchy', slidePosition: 'first' },
    { headline: 'Taste Smarter', subtitle: 'Personalized just for you', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Explore Nearby', subtitle: 'Every bite, everywhere', style: 'action', slidePosition: 'middle' },
    { headline: 'Order. Enjoy. Repeat.', subtitle: 'Delivery made simple', style: 'punchy', slidePosition: 'last' },
    { headline: 'Fresh Picks Daily', subtitle: 'Curated for your taste', style: 'benefit', slidePosition: 'any' },
    { headline: 'Your Table Awaits', subtitle: 'Reserve in seconds', style: 'emotional', slidePosition: 'any' },
  ],

  // FINANCE & TRADING APPS
  finance: [
    { headline: 'Invest Smarter', subtitle: 'Not harder', style: 'punchy', slidePosition: 'first' },
    { headline: 'Track Everything', subtitle: 'One dashboard, zero hassle', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Grow Wealth', subtitle: 'Start with $1', style: 'action', slidePosition: 'middle' },
    { headline: 'Real-Time Insights', subtitle: 'Never miss a moment', style: 'feature', slidePosition: 'any' },
    { headline: 'Secure. Simple.', subtitle: 'Banking reimagined', style: 'punchy', slidePosition: 'first' },
    { headline: 'Your Money, Your Way', subtitle: 'Take control today', style: 'emotional', slidePosition: 'last' },
  ],

  // FITNESS & HEALTH APPS
  fitness: [
    { headline: 'Transform Today', subtitle: 'Your journey starts here', style: 'emotional', slidePosition: 'first' },
    { headline: 'Track Progress', subtitle: 'Every rep counts', style: 'feature', slidePosition: 'middle' },
    { headline: 'Workouts That Work', subtitle: 'Personalized for you', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Push Limits', subtitle: 'Break through barriers', style: 'action', slidePosition: 'any' },
    { headline: 'Results. Real.', subtitle: 'See the difference', style: 'punchy', slidePosition: 'last' },
    { headline: 'Train Anywhere', subtitle: 'No gym required', style: 'benefit', slidePosition: 'any' },
  ],

  // SHOPPING & E-COMMERCE APPS
  shopping: [
    { headline: 'Shop Smarter', subtitle: 'Find what you love', style: 'benefit', slidePosition: 'first' },
    { headline: 'Discover Deals', subtitle: 'Savings every day', style: 'action', slidePosition: 'middle' },
    { headline: 'Style Your Way', subtitle: 'Curated just for you', style: 'emotional', slidePosition: 'middle' },
    { headline: 'Buy. Love. Repeat.', subtitle: 'Your favorites, faster', style: 'punchy', slidePosition: 'last' },
    { headline: 'Trending Now', subtitle: "What's hot this week", style: 'feature', slidePosition: 'any' },
    { headline: 'One Tap Away', subtitle: 'Checkout in seconds', style: 'benefit', slidePosition: 'any' },
  ],

  // PRODUCTIVITY APPS
  productivity: [
    { headline: 'Get More Done', subtitle: 'Less stress, more success', style: 'benefit', slidePosition: 'first' },
    { headline: 'Organize Everything', subtitle: 'One place for it all', style: 'feature', slidePosition: 'middle' },
    { headline: 'Focus. Flow.', subtitle: 'Unlock your potential', style: 'punchy', slidePosition: 'middle' },
    { headline: 'Work Smarter', subtitle: 'Not harder', style: 'action', slidePosition: 'any' },
    { headline: 'Stay on Track', subtitle: 'Never miss a deadline', style: 'benefit', slidePosition: 'last' },
    { headline: 'Simplify Your Day', subtitle: 'Start now', style: 'emotional', slidePosition: 'first' },
  ],

  // SOCIAL & DATING APPS
  social: [
    { headline: 'Connect. Share.', subtitle: 'Your world, your way', style: 'punchy', slidePosition: 'first' },
    { headline: 'Find Your People', subtitle: 'Real connections await', style: 'emotional', slidePosition: 'first' },
    { headline: 'Share Moments', subtitle: 'That matter most', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Stay Close', subtitle: 'No matter the distance', style: 'emotional', slidePosition: 'middle' },
    { headline: 'Match. Meet.', subtitle: 'Your story starts here', style: 'punchy', slidePosition: 'first' },
    { headline: 'Be Yourself', subtitle: 'Authentic connections only', style: 'emotional', slidePosition: 'last' },
  ],

  // ENTERTAINMENT & STREAMING APPS
  entertainment: [
    { headline: 'Watch Anywhere', subtitle: 'Entertainment on demand', style: 'benefit', slidePosition: 'first' },
    { headline: 'Stream. Binge. Enjoy.', subtitle: 'Unlimited content', style: 'punchy', slidePosition: 'first' },
    { headline: 'Discover More', subtitle: 'Curated for you', style: 'action', slidePosition: 'middle' },
    { headline: 'Never Miss Out', subtitle: 'New releases daily', style: 'feature', slidePosition: 'middle' },
    { headline: 'Your Entertainment', subtitle: 'Your rules', style: 'emotional', slidePosition: 'last' },
    { headline: 'Play. Pause. Resume.', subtitle: 'Pick up where you left off', style: 'benefit', slidePosition: 'any' },
  ],

  // HEALTH & WELLNESS APPS
  health: [
    { headline: 'Breathe Easy', subtitle: 'Find your calm', style: 'emotional', slidePosition: 'first' },
    { headline: 'Sleep Better', subtitle: 'Wake up refreshed', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Mind. Body. Balance.', subtitle: 'Your wellness journey', style: 'punchy', slidePosition: 'first' },
    { headline: 'Feel Better', subtitle: 'One day at a time', style: 'emotional', slidePosition: 'any' },
    { headline: 'Track Your Health', subtitle: 'Insights that matter', style: 'feature', slidePosition: 'middle' },
    { headline: 'Be Present', subtitle: 'Mindfulness made simple', style: 'action', slidePosition: 'last' },
  ],

  // TRAVEL APPS
  travel: [
    { headline: 'Explore More', subtitle: 'Adventure awaits', style: 'action', slidePosition: 'first' },
    { headline: 'Book Instantly', subtitle: 'Best prices guaranteed', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Wander Free', subtitle: 'Your next trip starts here', style: 'emotional', slidePosition: 'first' },
    { headline: 'Plan. Pack. Go.', subtitle: 'Travel made simple', style: 'punchy', slidePosition: 'last' },
    { headline: 'Discover Hidden Gems', subtitle: 'Local favorites revealed', style: 'feature', slidePosition: 'middle' },
    { headline: 'Your Journey', subtitle: 'Starts with one tap', style: 'emotional', slidePosition: 'any' },
  ],

  // EDUCATION APPS
  education: [
    { headline: 'Learn Anything', subtitle: 'Anytime, anywhere', style: 'benefit', slidePosition: 'first' },
    { headline: 'Level Up', subtitle: 'Your skills, your pace', style: 'action', slidePosition: 'middle' },
    { headline: 'Study Smarter', subtitle: 'Not harder', style: 'punchy', slidePosition: 'first' },
    { headline: 'Track Progress', subtitle: 'Celebrate every win', style: 'feature', slidePosition: 'middle' },
    { headline: 'Knowledge Unlocked', subtitle: 'Start your journey', style: 'emotional', slidePosition: 'last' },
    { headline: 'Master New Skills', subtitle: 'One lesson at a time', style: 'benefit', slidePosition: 'any' },
  ],

  // DEVELOPER & TECH APPS
  developer: [
    { headline: 'Code Faster', subtitle: 'Build better', style: 'punchy', slidePosition: 'first' },
    { headline: 'Debug Instantly', subtitle: 'Find issues in seconds', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Ship It', subtitle: 'From idea to production', style: 'action', slidePosition: 'last' },
    { headline: 'Your IDE, Anywhere', subtitle: 'Code on the go', style: 'feature', slidePosition: 'first' },
    { headline: 'Build. Test. Deploy.', subtitle: 'All in one place', style: 'punchy', slidePosition: 'any' },
    { headline: 'Power Tools', subtitle: 'For power users', style: 'benefit', slidePosition: 'middle' },
  ],

  // GENERIC/FALLBACK
  generic: [
    { headline: 'Simple. Powerful.', subtitle: 'The app you need', style: 'punchy', slidePosition: 'first' },
    { headline: 'Start Today', subtitle: 'See the difference', style: 'action', slidePosition: 'first' },
    { headline: 'Everything You Need', subtitle: 'In one place', style: 'benefit', slidePosition: 'middle' },
    { headline: 'Made for You', subtitle: 'Personalized experience', style: 'emotional', slidePosition: 'any' },
    { headline: 'Better. Faster. Easier.', subtitle: 'Upgrade your life', style: 'punchy', slidePosition: 'last' },
    { headline: 'Get Started', subtitle: 'Your journey begins', style: 'action', slidePosition: 'first' },
  ],
};

/**
 * Get headline templates for a category
 */
export function getHeadlinesForCategory(category: string): HeadlineTemplate[] {
  const lowerCategory = category.toLowerCase();
  
  // Try to find matching category
  for (const [key, templates] of Object.entries(HEADLINE_TEMPLATES)) {
    if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
      return templates;
    }
  }
  
  return HEADLINE_TEMPLATES.generic;
}

/**
 * Get headline for specific slide position
 */
export function getHeadlineForPosition(
  category: string,
  position: 'first' | 'middle' | 'last',
  usedHeadlines: string[] = []
): HeadlineTemplate {
  const templates = getHeadlinesForCategory(category);
  
  // Filter by position and unused headlines
  const available = templates.filter(t => 
    (t.slidePosition === position || t.slidePosition === 'any') &&
    !usedHeadlines.includes(t.headline)
  );
  
  if (available.length === 0) {
    // Fallback to any unused headline
    const fallback = templates.filter(t => !usedHeadlines.includes(t.headline));
    return fallback[0] || templates[0];
  }
  
  return available[0];
}

/**
 * Generate a complete set of headlines for all screenshots
 * This ensures variety and proper sequencing
 */
export function generateHeadlineSequence(
  category: string,
  screenshotCount: number
): HeadlineTemplate[] {
  const sequence: HeadlineTemplate[] = [];
  const usedHeadlines: string[] = [];
  
  for (let i = 0; i < screenshotCount; i++) {
    let position: 'first' | 'middle' | 'last';
    
    if (i === 0) {
      position = 'first';
    } else if (i === screenshotCount - 1) {
      position = 'last';
    } else {
      position = 'middle';
    }
    
    const headline = getHeadlineForPosition(category, position, usedHeadlines);
    sequence.push(headline);
    usedHeadlines.push(headline.headline);
  }
  
  return sequence;
}

/**
 * Social proof badge templates
 * These work great as widgets/floating elements
 */
export const SOCIAL_PROOF_BADGES = {
  ratings: [
    { text: '4.9 Rating', icon: 'star' },
    { text: '5M+ Downloads', icon: 'download' },
    { text: '#1 in Category', icon: 'award' },
    { text: "Editor's Choice", icon: 'award' },
    { text: 'App of the Day', icon: 'star' },
  ],
  trust: [
    { text: '256-bit Encryption', icon: 'shield' },
    { text: 'Bank-Level Security', icon: 'lock' },
    { text: 'GDPR Compliant', icon: 'shield' },
    { text: 'SOC 2 Certified', icon: 'check' },
  ],
  performance: [
    { text: 'Lightning Fast', icon: 'zap' },
    { text: 'Offline Mode', icon: 'download' },
    { text: '99.9% Uptime', icon: 'activity' },
    { text: 'Real-Time Sync', icon: 'refresh' },
  ],
};

/**
 * Get appropriate social proof badges for a category
 */
export function getSocialProofForCategory(category: string): typeof SOCIAL_PROOF_BADGES.ratings {
  const lowerCategory = category.toLowerCase();
  
  if (['finance', 'banking', 'payment'].some(k => lowerCategory.includes(k))) {
    return [...SOCIAL_PROOF_BADGES.ratings.slice(0, 2), ...SOCIAL_PROOF_BADGES.trust.slice(0, 2)];
  }
  
  if (['fitness', 'health', 'productivity'].some(k => lowerCategory.includes(k))) {
    return [...SOCIAL_PROOF_BADGES.ratings.slice(0, 2), ...SOCIAL_PROOF_BADGES.performance.slice(0, 2)];
  }
  
  return SOCIAL_PROOF_BADGES.ratings;
}
