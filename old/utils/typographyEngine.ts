/**
 * Advanced Typography Engine
 * Calculates optimal text sizing, contrast, and effects
 */

export interface TextSizing {
  fontSize: number;
  lineHeight: number;
  letterSpacing: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface TextEffects {
  shadow: string;
  stroke: string | null;
  color: string;
}

export class TypographyEngine {
  /**
   * Calculate optimal text sizing based on content and container
   */
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
      baseFontSize = 150; // Was 120 - Huge impact for short words
    } else if (charCount <= 20) {
      baseFontSize = 110; // Was 96
    } else if (charCount <= 30) {
      baseFontSize = 90; // Was 72
    } else if (charCount <= 45) {
      baseFontSize = 64; // Was 56
    } else {
      baseFontSize = 48; // Was 42
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

  /**
   * Fit text to a specific width
   */
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

  /**
   * Measure text width using canvas
   */
  private measureTextWidth(text: string, fontFamily: string, fontSize: number): number {
    if (typeof document === 'undefined') return fontSize * text.length * 0.6; // Rough estimate for SSR

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return fontSize * text.length * 0.6;

    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  }

  /**
   * Determine text transform based on content
   */
  private determineTextTransform(text: string, charCount: number): TextSizing['textTransform'] {
    // Short, punchy text → ALL CAPS
    if (charCount <= 15) {
      return 'uppercase';
    }

    // Check if already all caps
    if (text === text.toUpperCase() && /[A-Z]/.test(text)) {
      return 'uppercase';
    }

    // Default to none (preserve original)
    return 'none';
  }

  /**
   * Generate text effects based on background
   */
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

    // Determine optimal text color
    const optimalTextColor = this.getOptimalTextColor(backgroundColor);

    return { shadow, stroke, color: optimalTextColor };
  }

  /**
   * Get optimal text color based on background luminance
   */
  getOptimalTextColor(backgroundColor: string): string {
    const luminance = this.calculateLuminance(backgroundColor);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  /**
   * Calculate luminance of a color
   */
  private calculateLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      const v = val / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  calculateContrastRatio(color1: string, color2: string): number {
    const l1 = this.calculateLuminance(color1);
    const l2 = this.calculateLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Ensure contrast meets WCAG standards
   */
  ensureContrast(
    textColor: string,
    backgroundColor: string,
    level: 'AA' | 'AAA' = 'AA'
  ): { passes: boolean; ratio: number; suggestion?: string } {
    const ratio = this.calculateContrastRatio(textColor, backgroundColor);
    const requiredRatio = level === 'AAA' ? 7 : 4.5;

    if (ratio >= requiredRatio) {
      return { passes: true, ratio };
    }

    // Auto-adjust
    const adjustedColor = this.adjustForContrast(textColor, backgroundColor, requiredRatio);
    return {
      passes: false,
      ratio,
      suggestion: adjustedColor
    };
  }

  /**
   * Adjust color to meet contrast requirements
   */
  private adjustForContrast(
    textColor: string,
    backgroundColor: string,
    targetRatio: number
  ): string {
    const bgLuminance = this.calculateLuminance(backgroundColor);

    // If background is light, make text darker
    // If background is dark, make text lighter
    if (bgLuminance > 0.5) {
      // Start with black and lighten if needed
      return '#000000';
    } else {
      // Start with white and darken if needed
      return '#FFFFFF';
    }
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Remove # if present
    hex = hex.replace('#', '');

    // Handle shorthand (e.g., #fff)
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}

// Export singleton instance
export const typographyEngine = new TypographyEngine();
