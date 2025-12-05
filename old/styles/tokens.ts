// Design Tokens System
// Centralized design values for consistency across the app

export const designTokens = {
  colors: {
    // Backgrounds
    bg: {
      primary: '#020202',
      secondary: '#080808',
      tertiary: '#121212',
      card: '#0a0a0a',
    },
    // Borders
    border: {
      subtle: 'rgba(255, 255, 255, 0.05)',
      default: 'rgba(255, 255, 255, 0.10)',
      strong: 'rgba(255, 255, 255, 0.20)',
    },
    // Text
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.75)',
      tertiary: 'rgba(255, 255, 255, 0.50)',
      disabled: 'rgba(255, 255, 255, 0.30)',
    },
    // Semantic
    semantic: {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
    // Brand
    brand: {
      primary: '#4F46E5',
      primaryHover: '#4338CA',
      secondary: '#7C3AED',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.5)',
    '2xl': '0 30px 80px rgba(0, 0, 0, 0.7)',
  },
  transitions: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
  },
};

export type DesignTokens = typeof designTokens;
