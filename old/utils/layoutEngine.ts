/**
 * Professional Layout Engine for App Store Screenshots
 * Based on 2025 ASO best practices and high-converting template designs
 */

import { LayoutType } from '../types';

export interface DevicePosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform: string;
  scale: number;
  zIndex: number;
  opacity?: number;
  filter?: string;
}

export interface TextPosition {
  top: string;
  textAlign: 'left' | 'center' | 'right';
  maxWidth: string;
  padding: string;
}

export interface LayoutConfig {
  id: LayoutType;
  name: string;
  description: string;
  category: string[]; // Which app categories this layout works best for
  devicePositions: DevicePosition[]; // Support for multiple devices
  textPosition: TextPosition;
  isPanoramic: boolean; // Whether device spans multiple frames
  panoramicOffset?: number; // Percentage offset for panoramic layouts (0-100)
  showSecondaryDevice: boolean;
  recommendedFor: string[]; // Best for first slide, feature slides, etc.
}

/**
 * Professional layout configurations
 * These are based on analysis of top-performing App Store screenshots
 */
export const LAYOUT_CONFIGS: Record<string, LayoutConfig> = {
  // === HERO LAYOUTS (Best for first screenshot) ===
  
  'hero_centered': {
    id: 'classic',
    name: 'Hero Centered',
    description: 'Classic centered device with headline above',
    category: ['all'],
    devicePositions: [{
      top: '900px',
      left: '50%',
      transform: 'translateX(-50%)',
      scale: 1.0,
      zIndex: 20
    }],
    textPosition: {
      top: '120px',
      textAlign: 'center',
      maxWidth: '90%',
      padding: '0 60px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['first_slide', 'feature_highlight']
  },

  'hero_offset_right': {
    id: 'off_axis_left',
    name: 'Hero Offset Right',
    description: 'Device positioned to the right, text on left - creates visual flow',
    category: ['all'],
    devicePositions: [{
      top: '850px',
      left: '55%',
      transform: 'translateX(-30%) rotate(-5deg)',
      scale: 0.95,
      zIndex: 20
    }],
    textPosition: {
      top: '140px',
      textAlign: 'left',
      maxWidth: '70%',
      padding: '0 80px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['first_slide', 'storytelling']
  },

  'hero_offset_left': {
    id: 'off_axis_left',
    name: 'Hero Offset Left',
    description: 'Device positioned to the left, text on right',
    category: ['all'],
    devicePositions: [{
      top: '850px',
      left: '45%',
      transform: 'translateX(-70%) rotate(5deg)',
      scale: 0.95,
      zIndex: 20
    }],
    textPosition: {
      top: '140px',
      textAlign: 'right',
      maxWidth: '70%',
      padding: '0 80px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['feature_highlight']
  },

  // === PANORAMIC LAYOUTS (Device spans between frames) ===

  'panoramic_right_edge': {
    id: 'classic',
    name: 'Panoramic Right Edge',
    description: 'Device positioned at right edge, continues into next frame',
    category: ['all'],
    devicePositions: [{
      top: '800px',
      right: '-400px',
      left: 'auto',
      transform: 'rotate(-3deg)',
      scale: 1.0,
      zIndex: 20
    }],
    textPosition: {
      top: '140px',
      textAlign: 'left',
      maxWidth: '65%',
      padding: '0 80px 0 80px'
    },
    isPanoramic: true,
    panoramicOffset: 70, // 70% visible on current slide
    showSecondaryDevice: false,
    recommendedFor: ['storytelling', 'feature_sequence']
  },

  'panoramic_left_edge': {
    id: 'classic',
    name: 'Panoramic Left Edge',
    description: 'Device positioned at left edge, continues from previous frame',
    category: ['all'],
    devicePositions: [{
      top: '800px',
      left: '-400px',
      transform: 'rotate(3deg)',
      scale: 1.0,
      zIndex: 20
    }],
    textPosition: {
      top: '140px',
      textAlign: 'right',
      maxWidth: '65%',
      padding: '0 80px'
    },
    isPanoramic: true,
    panoramicOffset: 30, // 30% visible (continues from previous)
    showSecondaryDevice: false,
    recommendedFor: ['storytelling', 'feature_sequence']
  },

  'panoramic_center_split': {
    id: 'classic',
    name: 'Panoramic Center Split',
    description: 'Device centered at frame edge, split between two frames',
    category: ['all'],
    devicePositions: [{
      top: '750px',
      right: '-540px',
      left: 'auto',
      transform: 'rotate(0deg)',
      scale: 1.05,
      zIndex: 20
    }],
    textPosition: {
      top: '120px',
      textAlign: 'left',
      maxWidth: '55%',
      padding: '0 80px'
    },
    isPanoramic: true,
    panoramicOffset: 50, // 50% on each side
    showSecondaryDevice: false,
    recommendedFor: ['first_slide', 'feature_highlight']
  },

  // === DUAL DEVICE LAYOUTS ===

  'dual_overlap': {
    id: 'double_phones',
    name: 'Dual Overlap',
    description: 'Two devices overlapping, showing multiple features',
    category: ['all'],
    devicePositions: [
      {
        top: '950px',
        left: '50%',
        transform: 'translateX(-85%) rotate(-8deg)',
        scale: 0.88,
        zIndex: 19
      },
      {
        top: '1100px',
        left: '50%',
        transform: 'translateX(-15%) rotate(6deg)',
        scale: 0.92,
        zIndex: 20
      }
    ],
    textPosition: {
      top: '130px',
      textAlign: 'center',
      maxWidth: '90%',
      padding: '0 60px'
    },
    isPanoramic: false,
    showSecondaryDevice: true,
    recommendedFor: ['feature_comparison', 'before_after']
  },

  'dual_side_by_side': {
    id: 'double_phones',
    name: 'Dual Side by Side',
    description: 'Two devices side by side, great for comparisons',
    category: ['all'],
    devicePositions: [
      {
        top: '900px',
        left: '50%',
        transform: 'translateX(-100%)',
        scale: 0.82,
        zIndex: 20
      },
      {
        top: '900px',
        left: '50%',
        transform: 'translateX(0%)',
        scale: 0.82,
        zIndex: 20
      }
    ],
    textPosition: {
      top: '120px',
      textAlign: 'center',
      maxWidth: '95%',
      padding: '0 40px'
    },
    isPanoramic: false,
    showSecondaryDevice: true,
    recommendedFor: ['feature_comparison']
  },

  // === ZOOM LAYOUTS (Show app detail) ===

  'zoom_top_focus': {
    id: 'zoom_top',
    name: 'Zoom Top Focus',
    description: 'Zoomed device showing top of screen, text at bottom',
    category: ['all'],
    devicePositions: [{
      bottom: '-1200px',
      left: '50%',
      transform: 'translateX(-50%)',
      scale: 1.15,
      zIndex: 20
    }],
    textPosition: {
      top: '100px',
      textAlign: 'center',
      maxWidth: '90%',
      padding: '0 60px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['feature_detail', 'ui_showcase']
  },

  'zoom_bottom_focus': {
    id: 'zoom_bottom',
    name: 'Zoom Bottom Focus',
    description: 'Zoomed device showing bottom of screen, text at top',
    category: ['all'],
    devicePositions: [{
      top: '-1000px',
      left: '50%',
      transform: 'translateX(-50%)',
      scale: 1.15,
      zIndex: 20
    }],
    textPosition: {
      top: '120px',
      textAlign: 'center',
      maxWidth: '90%',
      padding: '0 60px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['feature_detail', 'navigation_showcase']
  },

  // === 3D/PERSPECTIVE LAYOUTS ===

  'tilted_showcase': {
    id: 'tilted_dynamic',
    name: 'Tilted Showcase',
    description: '3D tilted perspective for dramatic effect',
    category: ['entertainment', 'gaming', 'fitness'],
    devicePositions: [{
      top: '900px',
      left: '50%',
      transform: 'translateX(-50%) perspective(2000px) rotateY(-12deg) rotateX(5deg)',
      scale: 0.95,
      zIndex: 20
    }],
    textPosition: {
      top: '130px',
      textAlign: 'center',
      maxWidth: '85%',
      padding: '0 70px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['feature_highlight', 'premium_apps']
  },

  'isometric_stack': {
    id: 'isometric_stack',
    name: 'Isometric Stack',
    description: 'Stacked 3D devices showing depth and features',
    category: ['productivity', 'finance'],
    devicePositions: [
      {
        top: '850px',
        left: '50%',
        transform: 'translateX(-65%) perspective(3000px) rotateX(20deg) rotateY(15deg) rotateZ(-10deg)',
        scale: 0.85,
        zIndex: 18,
        opacity: 0.4,
        filter: 'blur(12px)'
      },
      {
        top: '900px',
        left: '50%',
        transform: 'translateX(-58%) perspective(3000px) rotateX(20deg) rotateY(15deg) rotateZ(-10deg)',
        scale: 0.9,
        zIndex: 19,
        opacity: 0.7,
        filter: 'blur(6px)'
      },
      {
        top: '950px',
        left: '50%',
        transform: 'translateX(-50%) perspective(3000px) rotateX(20deg) rotateY(15deg) rotateZ(-10deg)',
        scale: 0.95,
        zIndex: 20
      }
    ],
    textPosition: {
      top: '120px',
      textAlign: 'center',
      maxWidth: '90%',
      padding: '0 60px'
    },
    isPanoramic: false,
    showSecondaryDevice: true,
    recommendedFor: ['feature_stack', 'premium_apps']
  },

  // === MINIMAL/TEXT-FOCUSED LAYOUTS ===

  'minimal_text_hero': {
    id: 'minimal_type',
    name: 'Minimal Text Hero',
    description: 'Large text with small or no device - high impact',
    category: ['all'],
    devicePositions: [{
      top: '1400px',
      left: '50%',
      transform: 'translateX(-50%)',
      scale: 0.7,
      zIndex: 20
    }],
    textPosition: {
      top: '200px',
      textAlign: 'center',
      maxWidth: '95%',
      padding: '0 50px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['first_slide', 'brand_statement']
  },

  'editorial_magazine': {
    id: 'magazine_cover',
    name: 'Editorial Magazine',
    description: 'Magazine-style layout with large typography overlapping device',
    category: ['lifestyle', 'social', 'fashion'],
    devicePositions: [{
      bottom: '-400px',
      left: '50%',
      transform: 'translateX(-50%)',
      scale: 1.0,
      zIndex: 15 // Behind text
    }],
    textPosition: {
      top: '80px',
      textAlign: 'center',
      maxWidth: '100%',
      padding: '0 40px'
    },
    isPanoramic: false,
    showSecondaryDevice: false,
    recommendedFor: ['first_slide', 'lifestyle_apps']
  }
};

/**
 * Get recommended layouts for a specific app category
 */
export function getLayoutsForCategory(category: string): LayoutConfig[] {
  const lowerCategory = category.toLowerCase();
  
  return Object.values(LAYOUT_CONFIGS).filter(layout => 
    layout.category.includes('all') || 
    layout.category.some(cat => lowerCategory.includes(cat) || cat.includes(lowerCategory))
  );
}

/**
 * Get recommended layouts for a specific slide position
 */
export function getLayoutsForPosition(position: 'first' | 'middle' | 'last'): LayoutConfig[] {
  const recommendations: Record<string, string[]> = {
    first: ['first_slide', 'brand_statement', 'hero'],
    middle: ['feature_highlight', 'feature_detail', 'storytelling'],
    last: ['feature_stack', 'premium_apps', 'storytelling']
  };

  return Object.values(LAYOUT_CONFIGS).filter(layout =>
    layout.recommendedFor.some(rec => recommendations[position]?.includes(rec))
  );
}

/**
 * Get optimal layout sequence for a set of screenshots
 * This creates a visually appealing flow across all slides
 */
export function getOptimalLayoutSequence(
  screenshotCount: number,
  category: string,
  usePanoramic: boolean = true
): LayoutConfig[] {
  const categoryLayouts = getLayoutsForCategory(category);
  const sequence: LayoutConfig[] = [];

  // First slide - always hero or high-impact
  const heroLayouts = categoryLayouts.filter(l => 
    l.recommendedFor.includes('first_slide') || l.name.includes('Hero')
  );
  sequence.push(heroLayouts[0] || LAYOUT_CONFIGS['hero_centered']);

  // Middle slides - mix of layouts for visual interest
  const middleLayouts = categoryLayouts.filter(l => 
    !l.recommendedFor.includes('first_slide') && !l.isPanoramic
  );

  for (let i = 1; i < screenshotCount - 1; i++) {
    // Alternate between different layout styles
    if (usePanoramic && i % 3 === 1) {
      // Use panoramic for every 3rd middle slide
      const panoramicLayouts = categoryLayouts.filter(l => l.isPanoramic);
      if (panoramicLayouts.length > 0) {
        sequence.push(panoramicLayouts[i % panoramicLayouts.length]);
        continue;
      }
    }
    
    // Regular rotation through middle layouts
    sequence.push(middleLayouts[i % middleLayouts.length] || LAYOUT_CONFIGS['hero_centered']);
  }

  // Last slide - impactful closing
  if (screenshotCount > 1) {
    const closingLayouts = categoryLayouts.filter(l => 
      l.recommendedFor.includes('feature_stack') || l.name.includes('Dual')
    );
    sequence.push(closingLayouts[0] || LAYOUT_CONFIGS['tilted_showcase']);
  }

  return sequence;
}

/**
 * Calculate actual device CSS based on layout config and slide index
 */
export function calculateDeviceStyle(
  layout: LayoutConfig,
  slideIndex: number,
  deviceIndex: number = 0
): Record<string, string | number> {
  const position = layout.devicePositions[deviceIndex] || layout.devicePositions[0];
  
  const style: Record<string, string | number> = {
    position: 'absolute',
    width: '1080px',
    height: '2340px',
    transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    zIndex: position.zIndex,
    transform: `${position.transform} scale(${position.scale})`,
  };

  if (position.top) style.top = position.top;
  if (position.bottom) style.bottom = position.bottom;
  if (position.left) style.left = position.left;
  if (position.right) style.right = position.right;
  if (position.opacity) style.opacity = position.opacity;
  if (position.filter) style.filter = position.filter;

  // Handle panoramic offset based on slide position
  if (layout.isPanoramic && layout.panoramicOffset !== undefined) {
    // Adjust position based on which slide we're on
    // This creates the continuous flow effect
    const offset = layout.panoramicOffset;
    if (slideIndex === 0 && position.right) {
      // First slide - device exits right
      style.right = `${-((100 - offset) / 100) * 1080}px`;
    }
  }

  // Add premium shadow
  style.boxShadow = '0 50px 100px -20px rgba(0,0,0,0.4), 0 30px 60px -30px rgba(0,0,0,0.35)';

  return style;
}

/**
 * Determine if layout should show text on left, right, or center
 */
export function getTextAlignment(layout: LayoutConfig): 'left' | 'center' | 'right' {
  return layout.textPosition.textAlign;
}
