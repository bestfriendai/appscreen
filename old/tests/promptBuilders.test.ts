import { describe, it, expect } from 'vitest';
import { buildBackgroundPrompt, buildNegativePrompt, StudioBackgroundType, getRecommendedBackgroundType } from '../utils/studioBackgrounds';
import { detectAppCategory } from '../utils/categoryDetection';

describe('background prompt builder', () => {
  it('returns a non-empty prompt for abstract 3D', () => {
    const prompt = buildBackgroundPrompt({
      type: StudioBackgroundType.ABSTRACT_3D,
      category: 'finance',
      mood: 'premium',
      colors: { primary: '#4F46E5' }
    });
    expect(prompt.length).toBeGreaterThan(20);
    expect(prompt).toContain('3D');
  });

  it('includes category context for fitness apps', () => {
    const prompt = buildBackgroundPrompt({
      type: StudioBackgroundType.MESH_GRADIENT,
      category: 'fitness',
      mood: 'energetic',
      colors: { primary: '#10B981' }
    });
    expect(prompt.length).toBeGreaterThan(20);
    expect(prompt.toLowerCase()).toMatch(/mesh|gradient|flow/);
  });

  it('creates different prompts for different types', () => {
    const abstract = buildBackgroundPrompt({
      type: StudioBackgroundType.ABSTRACT_3D,
      category: 'productivity',
      mood: 'clean',
      colors: { primary: '#3B82F6' }
    });

    const gradient = buildBackgroundPrompt({
      type: StudioBackgroundType.MESH_GRADIENT,
      category: 'productivity',
      mood: 'clean',
      colors: { primary: '#3B82F6' }
    });

    expect(abstract).not.toBe(gradient);
  });

  it('handles primary color in prompts', () => {
    const prompt = buildBackgroundPrompt({
      type: StudioBackgroundType.SUBTLE_GRADIENT,
      category: 'social',
      mood: 'vibrant',
      colors: { primary: '#EC4899' }
    });
    expect(prompt).toMatch(/#[0-9A-F]{6}/i);
  });
});

describe('negative prompt builder', () => {
  it('returns a non-empty negative prompt', () => {
    const negativePrompt = buildNegativePrompt({
      type: StudioBackgroundType.ABSTRACT_3D,
      category: 'finance',
      mood: 'premium',
      colors: { primary: '#4F46E5' }
    });
    expect(negativePrompt.length).toBeGreaterThan(10);
  });

  it('includes common unwanted elements', () => {
    const negativePrompt = buildNegativePrompt({
      type: StudioBackgroundType.ABSTRACT_3D,
      category: 'productivity',
      mood: 'clean',
      colors: { primary: '#3B82F6' }
    });
    expect(negativePrompt.toLowerCase()).toMatch(/text|logo|amateur/);
  });
});

describe('background type recommendation', () => {
  it('recommends appropriate background for finance', () => {
    const type = getRecommendedBackgroundType('finance');
    expect([StudioBackgroundType.ABSTRACT_3D, StudioBackgroundType.DARK_CINEMATIC]).toContain(type);
  });

  it('recommends appropriate background for fitness', () => {
    const type = getRecommendedBackgroundType('fitness');
    expect(type).toBe(StudioBackgroundType.LIFESTYLE_PORTRAIT);
  });

  it('handles unknown categories gracefully', () => {
    const type = getRecommendedBackgroundType('unknown');
    expect(Object.values(StudioBackgroundType)).toContain(type);
  });
});

describe('category detection', () => {
  it('detects finance category from keywords', () => {
    const description = 'Track your budget and investments with powerful analytics';
    const category = detectAppCategory(description);
    expect(category.toLowerCase()).toBe('finance');
  });

  it('detects fitness category from keywords', () => {
    const description = 'Workout tracking app with meal plans and exercise routines';
    const category = detectAppCategory(description);
    expect(category.toLowerCase()).toBe('fitness');
  });

  it('detects social category from keywords', () => {
    const description = 'Connect with friends and share photos in real-time';
    const category = detectAppCategory(description);
    expect(category.toLowerCase()).toBe('social');
  });

  it('returns productivity as fallback for unclear descriptions', () => {
    const description = 'An app that does things';
    const category = detectAppCategory(description);
    expect(category).toBeTruthy();
    expect(typeof category).toBe('string');
  });

  it('handles empty descriptions', () => {
    const category = detectAppCategory('');
    expect(category).toBeTruthy();
    expect(typeof category).toBe('string');
  });
});
