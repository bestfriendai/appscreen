/**
 * Smart Layout Selection Engine
 * Analyzes screenshot content and app category to recommend optimal layouts
 * Based on 2025 ASO research and high-converting App Store templates
 */

import { LayoutType } from '../types';
import { AppCategory } from './categoryDetection';

export interface LayoutRecommendation {
  layout: LayoutType;
  confidence: number; // 0-1
  reason: string;
}

/**
 * Category-to-Layout mapping based on what converts best
 */
const CATEGORY_LAYOUT_PREFERENCES: Record<string, LayoutType[]> = {
  finance: ['hero_large', 'classic', 'offset_right', 'duo_side_by_side', 'isometric_stack'],
  fitness: ['panoramic_right', 'tilted_dynamic', 'hero_large', 'zoom_top', 'duo_overlap'],
  food: ['panoramic_right', 'offset_right', 'magazine_cover', 'classic', 'bento_grid'],
  shopping: ['magazine_cover', 'panoramic_center_right', 'duo_overlap', 'hero_large', 'bento_grid'],
  social: ['offset_right', 'panoramic_right', 'classic', 'duo_overlap', 'magazine_cover'],
  productivity: ['classic', 'hero_large', 'zoom_top', 'isometric_stack', 'offset_right'],
  health: ['panoramic_right', 'classic', 'minimal_type', 'offset_right', 'hero_large'],
  entertainment: ['panoramic_center_right', 'tilted_dynamic', 'magazine_cover', 'hero_large', 'duo_overlap'],
  travel: ['panoramic_right', 'magazine_cover', 'hero_large', 'offset_right', 'classic'],
  education: ['classic', 'hero_large', 'zoom_top', 'offset_right', 'isometric_stack'],
  developer: ['minimal_type', 'classic', 'hero_large', 'zoom_top', 'offset_right'],
  generic: ['hero_large', 'classic', 'offset_right', 'panoramic_right', 'duo_overlap'],
};

/**
 * Slide position preferences (what works best in each position)
 */
const POSITION_LAYOUT_WEIGHTS: Record<string, Record<LayoutType, number>> = {
  first: {
    'hero_large': 1.0,
    'panoramic_right': 0.95,
    'magazine_cover': 0.9,
    'minimal_type': 0.85,
    'offset_right': 0.8,
    'classic': 0.7,
    'panoramic_center_right': 0.75,
  } as Record<LayoutType, number>,
  middle: {
    'offset_right': 0.95,
    'offset_left': 0.9,
    'panoramic_left': 0.85,
    'zoom_top': 0.9,
    'zoom_bottom': 0.85,
    'tilted_dynamic': 0.8,
    'classic': 0.75,
    'bento_grid': 0.7,
    'duo_overlap': 0.8,
  } as Record<LayoutType, number>,
  last: {
    'duo_side_by_side': 0.95,
    'duo_overlap': 0.9,
    'isometric_stack': 0.85,
    'classic': 0.8,
    'poster_hero': 0.75,
    'minimal_type': 0.7,
    'hero_large': 0.7,
  } as Record<LayoutType, number>,
};

/**
 * Get the optimal layout for a specific slide
 */
export function getSmartLayoutForSlide(
  category: AppCategory | string,
  slideIndex: number,
  totalSlides: number,
  usedLayouts: LayoutType[] = [],
  isPanoramic: boolean = false
): LayoutRecommendation {
  // Determine position type
  let position: 'first' | 'middle' | 'last' = 'middle';
  if (slideIndex === 0) position = 'first';
  else if (slideIndex === totalSlides - 1) position = 'last';
  
  // Get category preferences
  const categoryKey = category.toLowerCase();
  const categoryPrefs = CATEGORY_LAYOUT_PREFERENCES[categoryKey] || CATEGORY_LAYOUT_PREFERENCES.generic;
  
  // Get position weights
  const positionWeights = POSITION_LAYOUT_WEIGHTS[position];
  
  // Score each layout
  const layoutScores: { layout: LayoutType; score: number; reason: string }[] = [];
  
  for (const layout of categoryPrefs) {
    let score = 0.5; // Base score for being in category preferences
    let reason = `Recommended for ${category} apps`;
    
    // Add position weight
    if (positionWeights[layout]) {
      score += positionWeights[layout] * 0.3;
      reason = `${position === 'first' ? 'Strong opener' : position === 'last' ? 'Effective closer' : 'Great feature showcase'} for ${category}`;
    }
    
    // Penalty for already used layouts (variety is key)
    if (usedLayouts.includes(layout)) {
      score -= 0.4;
      reason += ' (but already used)';
    }
    
    // Boost panoramic layouts if panoramic mode is enabled
    if (isPanoramic && layout.startsWith('panoramic')) {
      score += 0.15;
      reason = 'Creates professional continuous flow effect';
    }
    
    // First slide boost for hero layouts
    if (position === 'first' && ['hero_large', 'magazine_cover', 'minimal_type'].includes(layout)) {
      score += 0.1;
      reason = 'Maximum visual impact for search results';
    }
    
    // Last slide boost for duo layouts
    if (position === 'last' && layout.startsWith('duo')) {
      score += 0.1;
      reason = 'Shows app depth as final impression';
    }
    
    // Alternate panoramic sides for visual flow
    if (isPanoramic && slideIndex > 0) {
      const prevLayout = usedLayouts[usedLayouts.length - 1];
      if (prevLayout === 'panoramic_right' && layout === 'panoramic_left') {
        score += 0.2;
        reason = 'Creates seamless panoramic continuation';
      }
    }
    
    layoutScores.push({ layout, score, reason });
  }
  
  // Add some variety by considering layouts not in category preferences
  const allLayouts: LayoutType[] = [
    'classic', 'offset_right', 'offset_left', 'hero_large', 'minimal_type',
    'zoom_top', 'zoom_bottom', 'tilted_dynamic', 'bento_grid', 'magazine_cover',
    'duo_overlap', 'duo_side_by_side', 'isometric_stack',
    'panoramic_right', 'panoramic_left', 'panoramic_center_right'
  ];
  
  for (const layout of allLayouts) {
    if (!categoryPrefs.includes(layout) && !usedLayouts.includes(layout)) {
      let score = 0.3;
      let reason = 'Alternative option for variety';
      
      if (positionWeights[layout]) {
        score += positionWeights[layout] * 0.2;
      }
      
      // Only add if we don't already have this layout scored
      if (!layoutScores.find(l => l.layout === layout)) {
        layoutScores.push({ layout, score, reason });
      }
    }
  }
  
  // Sort by score and return the best
  layoutScores.sort((a, b) => b.score - a.score);
  
  const best = layoutScores[0];
  return {
    layout: best.layout,
    confidence: Math.min(1, Math.max(0, best.score)),
    reason: best.reason
  };
}

/**
 * Generate an optimal layout sequence for all screenshots
 */
export function generateSmartLayoutSequence(
  category: AppCategory | string,
  screenshotCount: number,
  isPanoramic: boolean = false
): LayoutRecommendation[] {
  const sequence: LayoutRecommendation[] = [];
  const usedLayouts: LayoutType[] = [];
  
  for (let i = 0; i < screenshotCount; i++) {
    const recommendation = getSmartLayoutForSlide(
      category,
      i,
      screenshotCount,
      usedLayouts,
      isPanoramic
    );
    
    sequence.push(recommendation);
    usedLayouts.push(recommendation.layout);
  }
  
  return sequence;
}

/**
 * Determine if a layout shows the full device or crops it
 */
export function isFullDeviceLayout(layout: LayoutType): boolean {
  const cropLayouts: LayoutType[] = ['zoom_top', 'zoom_bottom', 'magazine_cover'];
  return !cropLayouts.includes(layout);
}

/**
 * Determine if a layout requires a secondary screenshot
 */
export function needsSecondaryScreenshot(layout: LayoutType): boolean {
  const dualLayouts: LayoutType[] = [
    'duo_overlap', 'duo_side_by_side', 'double_phones', 'isometric_stack'
  ];
  return dualLayouts.includes(layout);
}

/**
 * Get complementary layout for the next slide (for panoramic sequences)
 */
export function getComplementaryLayout(currentLayout: LayoutType): LayoutType | null {
  const complements: Record<string, LayoutType> = {
    'panoramic_right': 'panoramic_left',
    'panoramic_center_right': 'offset_left',
    'offset_right': 'offset_left',
  };
  
  return complements[currentLayout] || null;
}
